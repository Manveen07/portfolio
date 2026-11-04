// The site for AI agents: llms.txt, the markdown copies, the resume as data, robots and sitemap.
// Like tests/site.test.mjs it reads what `next build` writes into .next/, so build first, then:
//   node --experimental-strip-types --test tests/ai.test.mjs
//
// The point (Manveen, 22 Oct 2026): "anybody that gives my website to an AI agent should be easily able to
// extract my resume and all the contents on my website." So the tests check that nothing on the page is
// missing from the markdown, nothing in the markdown disagrees with the page, and the resume data holds
// every line of the PDF and nothing else.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { RESUME, PDF_OVERRIDES } from "../data/resume.ts";
import { LLMS_INTRO } from "../data/llms-intro.ts";
import { ME, HERO, JOBS, PILOT, FREELANCE } from "../data/portfolio.ts";
import { HOW, LIVE, CONTACT, SKILLS, VISUAL } from "../data/how.ts";
import { PROOF } from "../data/proof.ts";
import { pageHash, bodyFile } from "../lib/page-dates.ts";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFileSync(path.join(root, rel), "utf8");
const app = (rel) => read(`.next/server/app/${rel}`);
const SITE = "https://manveen.me";

/** A built route handler's body and its status and headers. */
const route = (name) => ({ body: app(`${name}.body`), meta: JSON.parse(app(`${name}.meta`)) });

const posts = [...read("data/posts.ts").matchAll(/slug: "([a-z0-9-]+)"/g)].map((m) => m[1]);

// ── Turning pages and markdown into comparable text ─────────────────────
const decode = (s) =>
  s
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&amp;/g, "&");

/** Markup to the words a reader sees. Inline tags and pen marks (an <svg> inside a line) leave no space. */
const plain = (html) =>
  decode(
    html
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<svg[\s\S]*?<\/svg>/g, "")
      .replace(/<\/?(?:a|b|strong|i|em|span|code|mark|small|sup|sub|time)\b[^>]*>/g, "")
      .replace(/<[^>]+>/g, " "),
  );

/** For comparing: no arrows (drawn glyphs, not words), curly quotes kept, spaces collapsed. */
const squash = (s) => s.replace(/[↑←→↗]/g, " ").replace(/\s+/g, " ").trim();

/** Markdown to plain text: links and images to their words, no emphasis, heading, quote or list markers. */
const unmark = (md) =>
  squash(
    md
      .replace(/!\[((?:\\.|[^\]])*)\]\([^)]*\)/g, "$1")
      .replace(/\[((?:\\.|[^\]])*)\]\([^)]*\)/g, "$1")
      .replace(/\\([[\]])/g, "$1")
      .replace(/^#+ |^> ?|^- |^\d+\. |^```\w*$/gm, "")
      .replace(/\*|`/g, ""),
  );

/** The text of every leaf block (no block inside it) in some markup, split at <br>. */
const BLOCKS = ["p", "h1", "h2", "h3", "li", "dt", "dd", "figcaption", "caption", "td", "th", "aside", "pre"];
const blocks = (html, { skipLinkOnly = false } = {}) => {
  const out = [];
  for (const tag of BLOCKS) {
    for (const m of html.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, "g"))) {
      const inner = m[1];
      if (new RegExp(`<(?:${BLOCKS.join("|")})\\b`).test(inner)) continue;
      if (skipLinkOnly && !plain(inner.replace(/<a\b[\s\S]*?<\/a>/g, "")).trim()) continue;
      for (const part of inner.split(/<br\s*\/?>/)) {
        const t = squash(plain(part));
        if (t) out.push(t);
      }
    }
  }
  return out;
};

/** Alt texts and aria-labels: the words a picture stands for. */
const pictureWords = (html) => [...html.matchAll(/\s(?:alt|aria-label)="([^"]*)"/g)].map((m) => squash(decode(m[1]))).filter(Boolean);

/** Numbers as written ("34,044", "1.7", "12/12", "1:1"), with links' addresses left out of markdown. */
const numbers = (s) => new Set(s.match(/\d+(?:[.,:/]\d+)*/g) ?? []);
const mdNumbers = (md) => numbers(md.replace(/\]\([^)]*\)/g, "]").replace(/https?:\/\/\S+|mailto:\S+/g, ""));

/** The home page from <main> to the end of the footer, scripts out. */
const homePage = () => {
  const html = app("index.html").replace(/<script[\s\S]*?<\/script>/g, "");
  return html.slice(html.indexOf("<main"), html.lastIndexOf("</footer>"));
};

// ── 1. Every file is built, says 200, and has the right type ────────────
test("every AI file is built and served with status 200 and its content type", () => {
  const files = [
    ["llms.txt", "text/plain"],
    ["llms-full.txt", "text/plain"],
    ["index.md", "text/markdown"],
    ["resume.md", "text/markdown"],
    ["resume.json", "application/json"],
    ["writing.md", "text/markdown"],
    ["working-with-me.md", "text/markdown"],
    ...posts.map((slug) => [`md/writing/${slug}`, "text/markdown"]),
    ["robots.txt", "text/plain"],
    ["sitemap.xml", "application/xml"],
  ];
  for (const [name, type] of files) {
    assert.ok(existsSync(path.join(root, `.next/server/app/${name}.body`)), `${name} was not prerendered`);
    const { body, meta } = route(name);
    assert.equal(meta.status ?? 200, 200, `${name} status`);
    assert.ok(meta.headers["content-type"].startsWith(type), `${name} is ${meta.headers["content-type"]}, not ${type}`);
    assert.ok(body.length > 50, `${name} is empty`);
  }
  assert.ok(existsSync(path.join(root, "public/resume.pdf")), "resume.pdf is missing");
});

test("each post's markdown is at its own address plus .md, and every response points to llms.txt", () => {
  const manifest = JSON.parse(read(".next/routes-manifest.json"));
  const rule = manifest.rewrites.beforeFiles.find((r) => r.destination === "/md/writing/:slug");
  assert.ok(rule, "no rewrite from /writing/<slug>.md");
  for (const slug of posts) assert.match(`/writing/${slug}.md`, new RegExp(rule.regex));
  assert.doesNotMatch(`/writing/${posts[0]}`, new RegExp(rule.regex), "the HTML post would be rewritten too");
  const link = manifest.headers.find((h) => h.source === "/:path*")?.headers.find((h) => h.key === "Link")?.value ?? "";
  assert.match(link, /<\/llms\.txt>; rel="describedby"/);
});

// ── 2. llms.txt has the shape llmstxt.org describes ─────────────────────
test("llms.txt: H1 first, a blockquote summary, plain paragraphs, then H2 sections of link lists", () => {
  const txt = route("llms.txt").body;
  const lines = txt.split("\n");
  assert.equal(lines[0], "# Manveen Singh", "the first line is not the H1 with his name");
  assert.equal(lines.filter((l) => /^# /.test(l)).length, 1, "more than one H1");
  const firstH2 = lines.findIndex((l) => /^## /.test(l));
  const top = lines.slice(1, firstH2).filter((l) => l.trim());
  assert.match(top[0], /^> \S/, "the summary blockquote does not come right after the H1");
  assert.ok(top.every((l) => !/^#/.test(l)), "a heading before the first H2 section");
  // Sections in order, Optional last; every line in them is a list item "- [title](url)" with optional ": notes".
  const sections = [...txt.matchAll(/^## (.+)$/gm)].map((m) => m[1]);
  // 3 Nov (the AI-friendly audit): Contact after Resume; LinkedIn and GitHub were under Optional, which llmstxt.org
  // defines as links an agent can skip.
  assert.deepEqual(sections, ["Resume", "Contact", "Pages", "Projects and work", "Writing", "Optional"]);
  for (const line of lines.slice(firstH2).filter((l) => l.trim() && !/^## /.test(l))) {
    assert.match(line, /^- \[[^\]]+\]\((?:https?|mailto):[^)\s]+\)(?:: .+)?$/, `not a file-list item: ${line}`);
  }
});

test("llms.txt opens with Manveen's own words from data/llms-intro.ts", () => {
  const txt = route("llms.txt").body;
  assert.ok(txt.includes(`\n> ${LLMS_INTRO.summary}\n`), "the summary is not the blockquote");
  for (const p of [...LLMS_INTRO.details, ...LLMS_INTRO.howToRead]) {
    assert.ok(txt.includes(`\n${p}\n`), `missing paragraph: ${p.slice(0, 50)}`);
    assert.doesNotMatch(p, /^#|\n/, "an intro paragraph has a heading or a line break");
  }
  assert.match(read("data/llms-intro.ts"), /Manveen's words; edit freely\./);
});

test("llms.txt links the resume three ways, every page's markdown, and every post", () => {
  const txt = route("llms.txt").body;
  for (const p of ["/resume.md", "/resume.json", "/resume.pdf", "/index.md", "/writing.md", "/working-with-me.md", "/llms-full.txt", ...posts.map((s) => `/writing/${s}.md`)]) {
    assert.ok(txt.includes(`](${SITE}${p})`), `llms.txt does not link ${p}`);
  }
  // Every link on this site points at something that exists.
  for (const [, url] of txt.matchAll(/\]\((https:\/\/manveen\.me[^)]*)\)/g)) {
    const p = url.slice(SITE.length);
    const ok = p === "/resume.pdf" || existsSync(path.join(root, `.next/server/app${p.replace(/^\/writing\/(.+)\.md$/, "/md/writing/$1")}.body`));
    assert.ok(ok, `llms.txt links ${url}, which was not built`);
  }
});

// ── 3. No drift: the markdown says everything the page says, and nothing else ──
test("index.md has every block of text on the home page, in the same words", () => {
  const md = unmark(route("index.md").body);
  const missing = blocks(homePage()).filter((b) => !md.includes(b));
  assert.deepEqual(missing, [], "on the page but not in index.md");
});

test("nothing that matters is only in a picture: every alt text, aria-label and drawn word is in index.md", () => {
  const page = homePage();
  const md = unmark(route("index.md").body);
  for (const img of page.match(/<img\b[^>]*>/g) ?? []) assert.match(img, /\salt="[^"]+"/, `an image without alt text: ${img.slice(0, 80)}`);
  for (const pic of page.match(/<[^>]*role="img"[^>]*>/g) ?? []) assert.match(pic, /aria-label="[^"]+"/, `a drawing without a label: ${pic.slice(0, 80)}`);
  const words = [...pictureWords(page), ...[...page.matchAll(/<text\b[^>]*>([^<]*)<\/text>/g)].map((m) => squash(decode(m[1])))];
  // 28 since round 3 (2 Nov): the week and pilot sketches moved to /working-with-me (tested there). Since round 6 (2 Nov)
  // the radar sketch is off the home page too, so what is left are alt texts and labels.
  assert.ok(words.length > 0, "no alt text or label found on the home page");
  const missing = words.filter((w) => w && !md.includes(w));
  assert.deepEqual(missing, [], "drawn or described on the page but not in index.md");
});

test("numbers: every number on the page is in index.md and llms-full.txt, and every number in index.md is on the page", () => {
  const page = homePage();
  const seen = numbers([plain(page), ...pictureWords(page)].join(" "));
  const md = route("index.md").body;
  const full = route("llms-full.txt").body;
  const inMd = mdNumbers(md);
  const inFull = mdNumbers(full);
  assert.deepEqual([...seen].filter((n) => !inMd.has(n)), [], "on the page, not in index.md");
  assert.deepEqual([...seen].filter((n) => !inFull.has(n)), [], "on the page, not in llms-full.txt");
  // The other way, the bars' hover titles count as the page too: index.md lists the days that failed.
  const withTitles = numbers([plain(page), ...pictureWords(page), ...[...page.matchAll(/\stitle="([^"]*)"/g)].map((m) => m[1])].join(" "));
  // Round 6 (2 Nov): an ordered list's own numbers ("1. ", "2. ") are markdown, not words: the proof cards' steps are a
  // numbered list in index.md and a drawn flow on the page.
  const inMdText = mdNumbers(md.replace(/^\d+\. /gm, ""));
  assert.deepEqual([...inMdText].filter((n) => !withTitles.has(n)), [], "in index.md, not on the page");
});

test("every project and job title on the page is in llms.txt, index.md and llms-full.txt", () => {
  // 2 Nov (verify loop round 2): the jobs in #work. Round 4 (2 Nov): #built (PresentAI) left the home page.
  const work = homePage().match(/<section[^>]*id="work"[\s\S]*?<\/section>/)?.[0] ?? "";
  const titles = [...work.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g)].map((m) => squash(plain(m[1])));
  assert.deepEqual(titles, ["Outbound pipeline", "Resume screening, automated"]);
  assert.ok(!homePage().includes('id="built"'), "Built on my own is back on the home page");
  for (const [name, body] of [["llms.txt", route("llms.txt").body], ["index.md", route("index.md").body], ["llms-full.txt", route("llms-full.txt").body]]) {
    for (const t of titles) assert.ok(unmark(body).includes(t), `${name} is missing "${t}"`);
  }
  // Round 6 (2 Nov): Tender Radar left the home page (its AI step had failed on every new notice since September), so
  // index.md no longer has it; llms.txt still lists its code. Since 3 Nov in /how-i-build's Check it yourself words,
  // last under Projects and work (it led the list, with an old "every morning" intro).
  assert.ok(!unmark(route("index.md").body).includes("Tender Radar"), "index.md still has Tender Radar");
  assert.match(route("llms.txt").body, /\[Tender Radar\]\(https:\/\/github\.com\/Manveen07\/tender-radar-showcase\): UK tenders; its AI step has been down since September/);
});

test("llms.txt lists every post under Writing, newest first, with the date its page shows; the moved blocks are posts, not projects", () => {
  // 22 Oct: drawing-proof and the confidently-wrong notes left the home page for the writing ("these are the blogs"),
  // so llms.txt lists them where they now live, with the numbers and dates they carried as projects.
  const txt = route("llms.txt").body;
  const part = (name) => txt.split(`\n## ${name}\n`)[1].split("\n## ")[0];
  const writing = [...part("Writing").matchAll(/^- \[[^\]]+\]\(https:\/\/manveen\.me\/writing\/([a-z0-9-]+)\.md\): (.+)$/gm)];
  // 3 Nov: the champion-move-checker post is the newest; its line carries the README gate's two runs, the dev cases'
  // caveat and the blind first runs (review, 3 Nov: 29/29 = 100% alone is what an agent would quote).
  assert.deepEqual(writing.map((m) => m[1]), ["a-champion-tracker-that-can-say-it-isnt-sure", "149-tests-for-a-few-slack-buttons", "marking-the-ais-homework", "things-ai-got-confidently-wrong", "schema-as-eval-spec"]);
  assert.match(writing[0][2], /Numbers: the naive version 8\/29 = 28%, BLOCKED; this one 29\/29 = 100%, PASS, on dev cases it passes by construction; blind first runs 23\/31, 25\/31 and 20\/31, all BLOCKED\. \(3 November 2026\)$/);
  assert.match(writing[1][2], /\(25 October 2026\)$/);
  assert.match(writing[2][2], /Numbers: 7 of 419 answers wrong \(1\.7%\)[^\n]*\(Marked 26 Sep 2026\)$/);
  assert.match(writing[3][2], /25 May 2026, 0\.95, fifty times; [^\n]*19 Sep 2026, POD matching, allegedly\. \(Last entry 19 Sep 2026\)$/);
  assert.match(writing[4][2], /\(14 June 2026\)$/);
  assert.doesNotMatch(part("Projects and work"), /drawing-proof|confidently wrong/i, "a moved block is still listed as a project on the home page");
});

test("numbers and pictures: every number and alt text on a writing page is in its markdown, and every number there is on the page", () => {
  // drawing-proof's scores and the notes' dates live on post pages now, so the home page's number check follows them.
  const pages = [["writing.html", "writing.md"], ...posts.map((s) => [`writing/${s}.html`, `md/writing/${s}`])];
  for (const [html, md] of pages) {
    const page = app(html).replace(/<script[\s\S]*?<\/script>/g, "");
    const main = page.slice(page.indexOf("<main"), page.indexOf("</main>"));
    const body = route(md).body;
    const seen = numbers([plain(main), ...pictureWords(main)].join(" "));
    const inMd = mdNumbers(body);
    assert.deepEqual([...seen].filter((n) => !inMd.has(n)), [], `${html}: on the page, not in ${md}`);
    assert.deepEqual([...inMd].filter((n) => !seen.has(n)), [], `${md}: not on ${html}`);
    const text = unmark(body);
    assert.deepEqual(pictureWords(main).filter((w) => !text.includes(w)), [], `${html}: an alt text or label not in ${md}`);
  }
  // The crop's alt text is a real check, not an empty one.
  assert.match(app("writing/marking-the-ais-homework.html"), /alt="The title block of the pinion lift rod drawing/);
});

test("llms-full.txt holds Manveen's intro, the resume, the home page and every post, whole", () => {
  const full = route("llms-full.txt").body;
  assert.ok(full.startsWith("# Manveen Singh"), "no H1 first");
  assert.ok(full.includes(`> ${LLMS_INTRO.summary}`));
  for (const name of ["resume.md", "index.md", ...posts.map((s) => `md/writing/${s}`)]) {
    assert.ok(full.includes(route(name).body.trim()), `${name} is not inside llms-full.txt whole`);
  }
  assert.match(read("lib/md/llms.ts"), /llms-full\.txt is not part of the llms\.txt spec/);
});

// Round 3 of the verify loop (2 Nov): the freelance pilot left the home page for /working-with-me, with its own copy.
test("/working-with-me.md has every block, drawn word and number of its page, and llms.txt and llms-full.txt carry it", () => {
  const html = app("working-with-me.html").replace(/<script[\s\S]*?<\/script>/g, "");
  const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
  const body = route("working-with-me.md").body;
  const md = unmark(body);
  assert.deepEqual(blocks(main).filter((b) => !md.includes(b)), [], "on the page but not in working-with-me.md");
  const drawn = [...pictureWords(main), ...[...main.matchAll(/<text\b[^>]*>([^<]*)<\/text>/g)].map((m) => squash(decode(m[1])))];
  assert.ok(drawn.length > 20, "no sketch text found: did the sketches move?");
  assert.deepEqual(drawn.filter((w) => w && !md.includes(w)), [], "drawn or described on the page but not in working-with-me.md");
  const seen = numbers([plain(main), ...pictureWords(main)].join(" "));
  // The drawings' write-ups count rows and number the steps the SVGs draw; list markers are the page's <ol>.
  const inMd = mdNumbers(body.split("\n\n").filter((p) => !p.startsWith("*Drawing:*")).join("\n\n").replace(/^\d+\. /gm, ""));
  assert.deepEqual([...seen].filter((n) => !inMd.has(n)), [], "on the page, not in working-with-me.md");
  assert.deepEqual([...inMd].filter((n) => !seen.has(n)), [], "in working-with-me.md, not on the page");
  assert.ok(route("llms.txt").body.includes(`](${SITE}/working-with-me.md)`), "llms.txt does not link the copy");
  assert.ok(route("llms-full.txt").body.includes(body.trim()), "llms-full.txt does not hold the copy whole");
});

test("each writing page's markdown has every block of the page", () => {
  const pages = [["writing.html", "writing.md"], ...posts.map((s) => [`writing/${s}.html`, `md/writing/${s}`])];
  for (const [html, md] of pages) {
    const page = app(html).replace(/<script[\s\S]*?<\/script>/g, "");
    const body = page.slice(page.indexOf("<main"), page.indexOf("</main>"));
    const text = unmark(route(md).body);
    const missing = blocks(body, { skipLinkOnly: true }).filter((b) => !text.includes(b));
    assert.deepEqual(missing, [], `${html}: on the page but not in ${md}`);
  }
});

// ── 4. The resume: every line of the PDF, and nothing else ──────────────
// CRLF on a Windows checkout (core.autocrlf), LF everywhere else.
const fixture = read("data/resume-pdf.txt").replace(/\r\n/g, "\n");
const section = (name) => fixture.split(`--- ${name}\n`)[1].split("\n--- ")[0].split("\n").filter((l) => l.trim());
const pdfLines = section("text").map((l) => PDF_OVERRIDES.reduce((x, o) => x.replace(o.pdf, o.data), l));
const pdfLinks = section("links").map((l) => PDF_OVERRIDES.reduce((x, o) => x.replace(o.pdf, o.data), l));
const unbullet = (s) => s.replace(/^[–•-]\s+/, "");
const low = (s) => squash(s).toLowerCase();

/** data/resume.ts in the PDF's own order and line shapes. */
const resumeFlat = () => {
  const r = RESUME;
  return [
    r.name,
    `${r.role} · ${r.focus}`,
    `${r.location} · ${r.phone}`,
    ...r.links.map((l) => l.label),
    r.headings.experience,
    // Dates, places and the GPA print inline after a " · " (the PDF since 1 Nov 2026, rendered from the 23 Oct source).
    ...r.experience.flatMap((j) => [`${j.org} · ${j.dates}`, `${j.title} · ${j.location}`, ...j.bullets]),
    r.headings.projects,
    ...r.projects.flatMap((p) => [`${p.name} | ${p.stack.join(", ")}${p.links.map((l) => ` · ${l.label}`).join("")} · ${p.date}`, ...p.bullets]),
    r.headings.education,
    ...r.education.flatMap((e) => [`${e.school} · ${e.gpa}`, `${e.degree} · ${e.dates}`]),
    r.headings.skills,
    ...r.skills.map((s) => `${s.name}: ${s.keywords.join(", ")}`),
  ].join("\n");
};

/** Every text value in data/resume.ts (not addresses or machine dates). */
const resumeStrings = (v = RESUME, key = "") =>
  typeof v === "string"
    ? ["href", "start", "end", "pdf", "updated"].includes(key)
      ? []
      : [v]
    : Array.isArray(v)
      ? v.flatMap((x) => resumeStrings(x, key))
      : Object.entries(v).flatMap(([k, x]) => resumeStrings(x, k));

test("data/resume-pdf.txt is the text of the current public/resume.pdf", () => {
  const hash = createHash("sha256").update(readFileSync(path.join(root, "public/resume.pdf"))).digest("hex");
  assert.equal(fixture.split("\n")[0], `sha256: ${hash}`, "resume.pdf changed: run scripts/resume-text.py, then update data/resume.ts");
  assert.ok(pdfLines.length > 40, "the PDF text is nearly empty");
});

test("every line of the PDF is in data/resume.ts", () => {
  const data = low(resumeFlat());
  const missing = pdfLines.filter((l) => !data.includes(low(unbullet(l))));
  assert.deepEqual(missing, [], "on the PDF but not in data/resume.ts");
});

test("nothing in data/resume.ts is missing from the PDF, and the links are the PDF's links", () => {
  const pdf = low(pdfLines.map(unbullet).join(" "));
  const invented = resumeStrings().filter((s) => !pdf.includes(low(s)));
  assert.deepEqual(invented, [], "in data/resume.ts but not on the PDF");
  const hrefs = [...RESUME.links, ...RESUME.projects.flatMap((p) => p.links)].map((l) => l.href);
  assert.deepEqual([...hrefs].sort(), [...pdfLinks].sort());
  assert.equal(RESUME.updated, /created: D:(\d{4})(\d{2})(\d{2})/.exec(fixture)?.slice(1).join("-"), "updated is not the PDF's date");
});

test("resume.md and resume.json carry every field of data/resume.ts", () => {
  const md = low(unmark(route("resume.md").body));
  const lost = resumeStrings().filter((s) => !md.includes(low(s)));
  assert.deepEqual(lost, [], "in data/resume.ts but not in resume.md");
  // resume.json keeps every fact, field for field (its dates are YYYY-MM, checked below).
  const strings = (v) => (typeof v === "string" ? [v] : v && typeof v === "object" ? Object.values(v).flatMap(strings) : []);
  const inJson = new Set(strings(JSON.parse(route("resume.json").body)));
  const r = RESUME;
  const want = [
    r.name, r.role, r.location, r.phone,
    ...r.experience.flatMap((j) => [j.org, j.title, j.location, ...j.bullets]),
    ...r.projects.flatMap((p) => [p.name, ...p.stack, ...p.bullets, ...p.links.map((l) => l.href)]),
    ...r.education.flatMap((e) => [e.school, e.studyType, e.area, e.score]),
    ...r.skills.flatMap((s) => [s.name, ...s.keywords]),
  ];
  assert.deepEqual(want.filter((s) => !inJson.has(s)), [], "in data/resume.ts but not in resume.json");
});

test("resume.json follows the JSON Resume schema's shape (jsonresume.org, v1.2.1)", () => {
  const j = JSON.parse(route("resume.json").body);
  assert.match(j.$schema, /jsonresume\/resume-schema\/v1\.2\.1\/schema\.json$/);
  const iso = /^([1-2][0-9]{3}-[0-1][0-9]-[0-3][0-9]|[1-2][0-9]{3}-[0-1][0-9]|[1-2][0-9]{3})$/; // the schema's own pattern
  assert.equal(j.basics.name, RESUME.name);
  assert.equal(j.basics.label, RESUME.role);
  assert.equal(j.basics.email, "manveen9650@gmail.com");
  assert.deepEqual(j.basics.profiles.map((p) => p.network), ["LinkedIn", "GitHub"]);
  assert.deepEqual(j.work.map((w) => [w.name, w.position]), RESUME.experience.map((e) => [e.org, e.title]));
  assert.equal(j.work[0].endDate, undefined, "the current job has an end date");
  for (const x of [...j.work, ...j.education, ...j.projects]) {
    for (const k of ["startDate", "endDate"]) if (x[k] !== undefined) assert.match(x[k], iso, `${k} ${x[k]}`);
  }
  assert.deepEqual(j.projects.map((p) => p.name), RESUME.projects.map((p) => p.name));
  assert.deepEqual(j.skills.map((s) => s.name), RESUME.skills.map((s) => s.name));
  assert.equal(j.education[0].institution, RESUME.education[0].school);
});

// ── 5. Head: markdown alternates, llms.txt, and who this is ─────────────
test("every page links its markdown copy and llms.txt in its head", () => {
  const pages = [["index.html", "/index.md"], ["writing.html", "/writing.md"], ["working-with-me.html", "/working-with-me.md"], ...posts.map((s) => [`writing/${s}.html`, `/writing/${s}.md`])];
  for (const [html, md] of pages) {
    const head = app(html).match(/<head[\s\S]*?<\/head>/)?.[0] ?? "";
    assert.ok(head.includes(`<link rel="alternate" type="text/markdown" href="${SITE}${md}"/>`), `${html} has no markdown alternate`);
    assert.ok(head.includes('<link rel="describedby" href="/llms.txt" type="text/plain"/>'), `${html} has no describedby link`);
  }
});

test("the home page says who this is in schema.org JSON-LD, from the site and the resume", () => {
  const html = app("index.html");
  const raw = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(raw, "no JSON-LD");
  // 28 Oct: one graph, a ProfilePage about the Person on the WebSite (Google's profile-page and site-name docs).
  const graph = JSON.parse(raw)["@graph"];
  const p = graph.find((n) => n["@type"] === "Person");
  assert.ok(p, "no Person in the graph");
  assert.equal(p["@id"], `${SITE}/#person`);
  const profile = graph.find((n) => n["@type"] === "ProfilePage");
  assert.equal(profile?.mainEntity["@id"], p["@id"], "the ProfilePage is not about the Person");
  const site = graph.find((n) => n["@type"] === "WebSite");
  assert.equal(site?.name, "Manveen Singh");
  assert.equal(site?.url, `${SITE}/`);
  // The description is the hero's h1 and the paragraph under it (the h1 since 3 Nov: it names outbound and the AI),
  // so it says what the page says.
  assert.equal(p.description, [HERO.headline, ...HERO.how].join(" "));
  for (const s of [HERO.headline, ...HERO.how]) assert.ok(squash(plain(html)).includes(s), `Person.description: not on the page: ${s}`);
  assert.equal(p.name, "Manveen Singh");
  // 3 Nov: the site's title, which the page shows (kicker, <title>), not the resume's headline, which it doesn't.
  assert.equal(p.jobTitle, ME.role);
  assert.ok(app("index.html").includes(`<title>Manveen Singh | ${ME.role}</title>`));
  assert.equal(p.url, `${SITE}/`);
  assert.equal(p.address.addressLocality, "Delhi");
  assert.equal(p.address.addressCountry, "IN", "schema.org recommends the ISO country code");
  // The current job, which the home page's Work section names.
  assert.equal(p.worksFor?.name, "Precise Leads");
  assert.ok(plain(html).includes(`At ${p.worksFor.name}`), "worksFor is not on the page");
  assert.deepEqual(site?.publisher, { "@id": p["@id"] });
  const foot = html.slice(html.lastIndexOf("<footer"));
  for (const href of p.sameAs) assert.ok(foot.includes(`href="${href}"`), `${href} is not the footer's link`);
  assert.equal(p.sameAs.length, 2);
  assert.deepEqual(p.knowsAbout, RESUME.skills.flatMap((s) => s.keywords));
  assert.deepEqual(p.alumniOf.map((a) => a.name), RESUME.education.map((e) => e.school));
});

// ── 6. robots.txt and the sitemap ───────────────────────────────────────
test("robots.txt lets every crawler in, AI ones included, and points to the sitemap", () => {
  const robots = route("robots.txt").body;
  assert.match(robots, /^User-Agent: \*\nAllow: \/\n/);
  assert.doesNotMatch(robots, /Disallow/i);
  assert.ok(robots.includes(`Sitemap: ${SITE}/sitemap.xml`));
});

test("the sitemap lists the pages and the resume PDF, not the copies (28 Oct: Google reads every sitemap URL as a canonical)", () => {
  const xml = route("sitemap.xml").body;
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const want = ["/", "/writing", "/how-i-build", "/working-with-me", "/resume.pdf", ...posts.map((s) => `/writing/${s}`)];
  assert.deepEqual([...urls].sort(), want.map((p) => `${SITE}${p}`).sort());
  // Google ignores changefreq and priority; lastmod only where it is a real content date.
  assert.doesNotMatch(xml, /<changefreq>|<priority>/);
  assert.doesNotMatch(app("index.html"), /<meta name="keywords"/, "meta keywords: no effect on Google, a spam hint on Bing");
});

// 28 Oct: a markdown copy names its page as canonical in its Link header, next to describedby (next.config.ts).
// Read from the built routes-manifest.json, the header rules as Vercel serves them.
test("each markdown copy points search engines to its page as canonical", () => {
  const rules = JSON.parse(read(".next/routes-manifest.json")).headers;
  /** The Link header a path gets: the last matching rule wins. */
  const linkFor = (path) => {
    let value;
    for (const r of rules) {
      const m = path.match(new RegExp(r.regex));
      const link = r.headers.find((h) => h.key === "Link");
      if (m && link) value = link.value.replace(":slug", m.groups?.slug ?? m[1] ?? "");
    }
    return value;
  };
  const pages = [["/index.md", "/"], ["/writing.md", "/writing"], ["/working-with-me.md", "/working-with-me"], ...posts.map((s) => [`/writing/${s}.md`, `/writing/${s}`])];
  for (const [md, page] of pages) {
    const link = linkFor(md);
    assert.ok(link.includes(`<${SITE}${page}>; rel="canonical"`), `${md}: ${link}`);
    assert.ok(link.includes('</llms.txt>; rel="describedby"'), `${md} lost describedby`);
  }
  assert.doesNotMatch(linkFor("/writing"), /canonical/, "the page itself gets no canonical header");
});

// ── 7. The AI-friendly audit (3 Nov 2026) ───────────────────────────────
// Manveen, 3 Nov: "make sure website is completly ai friednly". Four read-only audits (access, copies, structured data,
// current practice) and three blind AI readers; each test below pins one fix.

const DATES = JSON.parse(read("data/page-dates.json"));
const PAGES = ["/", "/writing", "/how-i-build", "/working-with-me", ...posts.map((s) => `/writing/${s}`)];
/** A built page's HTML file. */
const htmlOf = (p) => (p === "/" ? "index.html" : `${p.slice(1)}.html`);
/** The JSON-LD on a built page, parsed. */
const ldOf = (p) => JSON.parse(app(htmlOf(p)).match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] ?? "null");
/** One H2 section of llms.txt, its list only. */
const part = (txt, name) => txt.split(`\n## ${name}\n`)[1].split("\n## ")[0].trim();

test("each page's date is the day its words last changed: the saved hash matches the build, and the sitemap and JSON-LD use it", () => {
  // Was: two hand-set dates a day stale and a post edited on 31 Oct still on its June date (lib/page-dates.ts).
  assert.deepEqual(Object.keys(DATES).sort(), [...PAGES].sort(), "data/page-dates.json does not list exactly the pages");
  for (const p of PAGES) {
    const hash = pageHash(app(bodyFile(p)), SITE);
    assert.equal(hash, DATES[p].hash, `words changed on ${p}: run npm run page-dates after a build, then build again and commit data/page-dates.json`);
    assert.match(DATES[p].date, /^\d{4}-\d{2}-\d{2}$/);
  }
  const xml = route("sitemap.xml").body;
  const lastmod = Object.fromEntries([...xml.matchAll(/<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)].map((m) => [m[1], m[2]]));
  for (const p of PAGES) assert.equal(lastmod[`${SITE}${p === "/" ? "/" : p}`], DATES[p].date, `sitemap lastmod for ${p}`);
  assert.equal(lastmod[`${SITE}/resume.pdf`], RESUME.updated);
  // A post's date never comes before it was published, and the post edited on 31 Oct says so.
  for (const s of posts) assert.ok(DATES[`/writing/${s}`].date >= read("data/posts.ts").match(new RegExp(`slug: "${s}"[\\s\\S]*?date: "([^"]+)"`))[1], `${s} modified before published`);
  assert.equal(DATES["/writing/schema-as-eval-spec"].date, "2026-10-31");
  // The JSON-LD and the post's share tags carry the same day.
  const home = ldOf("/")["@graph"].find((n) => n["@type"] === "ProfilePage");
  assert.equal(home.dateModified, DATES["/"].date);
  for (const p of ["/writing", "/how-i-build", "/working-with-me"]) assert.equal(ldOf(p).dateModified, DATES[p].date, `${p} dateModified`);
  for (const s of posts) {
    const p = `/writing/${s}`;
    assert.equal(ldOf(p).dateModified, DATES[p].date, `${s}: BlogPosting dateModified`);
    assert.ok(app(htmlOf(p)).includes(`<meta property="article:modified_time" content="${DATES[p].date}"/>`), `${s}: no article:modified_time`);
  }
  // The hash ignores a post's "More writing" list (a new post is not an edit to the old ones) and the site's address.
  const md = route(`md/writing/${posts[0]}`).body;
  assert.equal(pageHash(md.replace(/## More writing[\s\S]*$/, "## More writing\n\n- something new\n"), SITE), pageHash(md, SITE));
  assert.equal(pageHash(md.split(SITE).join("http://localhost:3107"), "http://localhost:3107"), pageHash(md, SITE));
});

test("llms.txt and llms-full.txt say the same thing about what llms-full.txt holds", () => {
  // Was: "the resume, the home page and every post" (22 Oct), though /how-i-build and /working-with-me are inside it.
  const full = route("llms-full.txt").body;
  const holds = full.match(/\nWhat follows, in order: (.+), each with the address it comes from\./)?.[1];
  assert.ok(holds, "llms-full.txt does not say what it holds");
  assert.equal(holds, `the resume, the home page, ${HOW.title.charAt(0).toLowerCase()}${HOW.title.slice(1)}, ${PILOT.head.charAt(0).toLowerCase()}${PILOT.head.slice(1)} and every post`);
  const sources = [...full.matchAll(/^Source: (\S+)$/gm)].map((m) => m[1]);
  assert.deepEqual(sources.slice(0, 4), [`${SITE}/resume.md`, `${SITE}/index.md`, `${SITE}/how-i-build.md`, `${SITE}/working-with-me.md`], "llms-full.txt's order is not the one it states");
  assert.deepEqual(sources.slice(4).map((u) => u.match(/\/writing\/([a-z0-9-]+)\.md$/)?.[1]).sort(), [...posts].sort(), "the rest is not every post");
  const txt = route("llms.txt").body;
  assert.ok(LLMS_INTRO.howToRead.some((l) => l.includes(`/llms-full.txt has ${holds} in one file`)), "howToRead says something else");
  assert.ok(txt.includes(`[Everything in one file](${SITE}/llms-full.txt): ${holds}, inline`), "the Pages entry says something else");
  assert.doesNotMatch(txt, /the home page and every post/);
});

test("llms.txt says he is open to a GTM engineer role and gives contact links their own section", () => {
  const txt = route("llms.txt").body;
  // The ask both pages make, word for word.
  assert.ok(LLMS_INTRO.howToRead.includes(`${CONTACT.ask.replace(/\.$/, "")}: ${ME.email}.`), "the intro does not make the job ask");
  assert.equal(part(txt, "Contact").trim(), [
    `- [Email](mailto:${ME.email}): ${CONTACT.ask}`,
    `- [LinkedIn](${ME.linkedin}): Manveen's LinkedIn profile`,
    `- [GitHub](${ME.github}): Manveen's GitHub profile`,
  ].join("\n"));
  assert.doesNotMatch(part(txt, "Optional"), /linkedin\.com|github\.com\/Manveen07\)/, "a profile link is still in Optional");
});

test("llms.txt's /how-i-build line names its sections in page order, read off the copy", () => {
  // Was: a hand-written list from 2 Nov, before The inbox fleet and both 3 Nov clicks, in the wrong order.
  const txt = route("llms.txt").body;
  const line = part(txt, "Pages").split("\n").find((l) => l.startsWith(`- [${HOW.title}](${SITE}/how-i-build.md): `));
  assert.ok(line, "no /how-i-build line");
  const order = line.match(/In page order: (.+)\.$/)?.[1].replace(/ \([^)]*\)/g, "").split("; ").filter((s) => s !== "My corrections log");
  const h2s = [...app("how-i-build.md.body").matchAll(/^## (.+)$/gm)].map((m) => m[1]);
  assert.deepEqual(order, h2s);
  assert.deepEqual(h2s.slice(0, 3), [VISUAL.kickers.agents, VISUAL.kickers.skills, VISUAL.kickers.fleet]);
  // Every click on the page is named (the verifier, 3 Nov: the habit's and both failure stories' were missing); the
  // corrections log is named by its own summary.
  const summaries = [...app("how-i-build.html").matchAll(/<summary[^>]*>([\s\S]*?)<\/summary>/g)].map((m) => m[1].replace(/<[^>]+>/g, "").replace(/&#x27;/g, "'").trim());
  assert.ok(summaries.length >= 8, `only ${summaries.length} clicks found`);
  for (const s of summaries) assert.ok(line.toLowerCase().includes(s.toLowerCase()), `the llms.txt line misses the click "${s}"`);
  for (const click of ["on-its-own", "held-list", "identity", "claygent", "bounces"].map((k) => VISUAL.clicks[k])) assert.ok(line.toLowerCase().includes(click.toLowerCase()), `the line misses the click ${click}`);
  // Second in the list, after the home page: it is the page for hiring managers.
  assert.match(part(txt, "Pages"), /^- \[Home page\][^\n]*\n- \[How I build GTM systems\]/);
  // The home page's line names the strip that sits under its hero since 3 Nov.
  assert.match(part(txt, "Pages"), /what I build and what I measured, how I work on outbound, how I check my AI/);
});

test("llms.txt's Projects and work: the jobs whole, the held list with its caveat, then the repos in Check it yourself's words", () => {
  const txt = route("llms.txt").body;
  const items = part(txt, "Projects and work").trim().split("\n");
  // Every point of the job, and the reference line, as on the home page.
  for (const w of JOBS) for (const pt of w.points ?? []) assert.ok(items[0].includes(pt), `missing point: ${pt.slice(0, 50)}`);
  assert.ok(items.some((l) => l.includes("Zackary Beckham, COO of Caprae Capital Partners")), "no reference line");
  // The lead proof, its numbers and its caveat together.
  const card = PROOF["held-list"];
  const held = items.find((l) => l.startsWith(`- [${card.title}](${SITE}/how-i-build.md): `));
  assert.ok(held, "no held-list line");
  assert.ok(held.includes(SKILLS.find((s) => s.id === "skill-checking").line) && held.endsWith(card.limit), "the held list lost its numbers or its caveat");
  // The repos, after the jobs and the held list, in the page's words; Tender Radar last, with its own caveat.
  const repos = LIVE.items.filter((l) => l.code || l.text);
  assert.deepEqual(items.slice(-repos.length).map((l) => l.match(/^- \[([^\]]+)\]\(([^)]+)\)/).slice(1)), repos.map((l) => [l.label.replace(/\s*[↗→]$/, ""), l.href]));
  for (const l of repos) assert.ok(items.some((i) => i.includes(l.text)), `${l.id}: not in its page words`);
  assert.doesNotMatch(txt, /every morning|Tender Radar code\]/, "the old Tender Radar line is back");
});

test("llms.txt carries the corrections log's word on a post beside the post's numbers", () => {
  const txt = route("llms.txt").body;
  for (const e of LIVE.log.filter((x) => x.link?.href.startsWith("/writing/"))) {
    const slug = e.link.href.slice("/writing/".length);
    const line = part(txt, "Writing").split("\n").find((l) => l.includes(`/writing/${slug}.md)`));
    assert.ok(line.includes(e.text), `${slug}: the log's entry is not on its line`);
  }
  assert.match(txt, /it caught 9\. Corrections log, 31 Oct: A later audit found two more leaks in my leadlens test, so its 9 of 11 needs a re-run\./);
});

test("the markdown copies of /how-i-build and /working-with-me say whose they are and where the page lives", () => {
  // Was: how-i-build.md named him only inside github.com/Manveen07 links; working-with-me.md not at all.
  const how = app("how-i-build.md.body").split("\n\n").slice(0, 5).join("\n\n");
  assert.ok(how.startsWith(`![${ME.name}](${SITE}/me.jpg)`), "the photo does not open how-i-build.md, as it opens the page");
  assert.ok(how.includes(`*${HOW.title}*. By ${ME.name}. Web page: ${SITE}/how-i-build`));
  const working = route("working-with-me.md").body.split("\n\n").slice(0, 2).join("\n\n");
  assert.equal(working, `# ${PILOT.head}\n\nBy ${ME.name}. Web page: ${SITE}${FREELANCE.href}`);
});

test("no markdown link points at an HTML anchor, and resume.json gives real handles", () => {
  // #proof-cards and #held-list are HTML ids; the markdown copies don't have them.
  for (const name of ["llms.txt", "llms-full.txt", "index.md", "writing.md", "working-with-me.md", "resume.md", ...posts.map((s) => `md/writing/${s}`)]) {
    assert.doesNotMatch(route(name).body, /manveen\.me\/[^)\s]*\.md#/, `${name} links a markdown anchor`);
  }
  assert.doesNotMatch(app("how-i-build.md.body"), /manveen\.me\/[^)\s]*\.md#/);
  const profiles = JSON.parse(route("resume.json").body).basics.profiles;
  assert.deepEqual(profiles.map((p) => p.username), ["manveen-singh-b9b7672a0", "Manveen07"]);
});

test("every page has JSON-LD that ties it to the Person, and the two vague descriptions say whose page it is", () => {
  // Was: none on /how-i-build, /working-with-me and /writing.
  const person = `${SITE}/#person`;
  const how = ldOf("/how-i-build");
  assert.equal(how["@type"], "AboutPage");
  assert.equal(how.name, HOW.title);
  const working = ldOf("/working-with-me");
  assert.equal(working["@type"], "WebPage");
  for (const [p, ld] of [["/how-i-build", how], ["/working-with-me", working]]) {
    assert.equal(ld.url, `${SITE}${p}`);
    assert.equal(ld.about["@id"], person, `${p}: not about the Person`);
    assert.equal(ld.isPartOf["@id"], `${SITE}/#website`);
    const desc = decode(app(htmlOf(p)).match(/<meta name="description" content="([^"]*)"/)[1]);
    assert.equal(ld.description, desc, `${p}: JSON-LD and meta description differ`);
  }
  const blog = ldOf("/writing");
  assert.equal(blog["@type"], "Blog");
  assert.equal(blog.author["@id"], person);
  assert.deepEqual(blog.blogPost.map((b) => b.url).sort(), posts.map((s) => `${SITE}/writing/${s}`).sort());
  for (const s of posts) assert.equal(ldOf(`/writing/${s}`).isPartOf["@id"], `${SITE}/#website`);
  // The two descriptions name him and the kind of work; the visible h1s stay.
  const writing = decode(app("writing.html").match(/<meta name="description" content="([^"]*)"/)[1]);
  assert.equal(writing, `Posts by ${ME.name}, ${ME.role}, on testing AI steps and workflows: what I tried, what broke, what fixed it.`);
  assert.match(app("writing.html"), /<h1>What I tried, what broke, what fixed it\.<\/h1>/);
  const free = decode(app("working-with-me.html").match(/<meta name="description" content="([^"]*)"/)[1]);
  assert.ok(free.startsWith(`${FREELANCE.kicker} with ${ME.name}: a call about what wastes your time`), free);
  // Their share card is the home card, named whole (size and alt), and every page says its locale.
  for (const page of ["writing.html", "working-with-me.html"]) {
    const head = app(page).match(/<head[\s\S]*?<\/head>/)[0];
    assert.ok(head.includes('<meta property="og:image:width" content="1200"/>') && head.includes('<meta property="og:image:alt" content="Manveen Singh, GTM engineer"/>'), `${page}: card without size or alt`);
    assert.ok(head.includes('<meta name="twitter:image:alt" content="Manveen Singh, GTM engineer"/>'), `${page}: no twitter:image:alt`);
  }
  assert.match(read("app/opengraph-image.tsx"), /export const alt = "Manveen Singh, GTM engineer";/, "the home card's alt moved: update HOME_CARD in lib/site.ts");
  for (const page of ["how-i-build.html", "writing.html", "working-with-me.html", ...posts.map((s) => `writing/${s}.html`)]) {
    assert.ok(app(page).includes('<meta property="og:locale" content="en_US"/>'), `${page}: no og:locale`);
  }
});

test("an agent that asks a page for markdown gets its copy at the page's address; a browser gets the page", () => {
  // Claude Code sends this Accept header on every fetch (checked 3 Nov); Chrome sends the second.
  const agent = "text/markdown, text/html, */*";
  const browser = "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7";
  const manifest = JSON.parse(read(".next/routes-manifest.json"));
  const pages = [["/", "/index.md"], ["/writing", "/writing.md"], ["/how-i-build", "/how-i-build.md"], ["/working-with-me", "/working-with-me.md"], [`/writing/${posts[0]}`, `/md/writing/${posts[0]}`]];
  for (const [page, copy] of pages) {
    const rule = manifest.rewrites.beforeFiles.find((r) => r.has && new RegExp(r.regex).test(page));
    assert.ok(rule, `${page}: no rewrite for Accept: text/markdown`);
    const h = rule.has[0];
    assert.equal(h.type, "header");
    assert.equal(h.key, "accept");
    assert.match(agent, new RegExp(`^${h.value}$`));
    assert.doesNotMatch(browser, new RegExp(`^${h.value}$`), "a browser would get markdown");
    assert.equal(rule.destination.replace(":slug", posts[0]), copy);
    // A shared cache keys on Accept for this address.
    assert.ok(manifest.headers.some((r) => new RegExp(r.regex).test(page) && r.headers.some((x) => x.key === "Vary" && x.value === "Accept")), `${page}: no Vary: Accept`);
  }
  // A post's .md address is still the first rule, and the Accept rule never takes it.
  const accept = manifest.rewrites.beforeFiles.filter((r) => r.has);
  assert.ok(!accept.some((r) => new RegExp(r.regex).test(`/writing/${posts[0]}.md`)), "an Accept rule matches a .md address");
  // The resume's markdown names the PDF as canonical, as each page's copy names its page.
  const rule = manifest.headers.filter((r) => new RegExp(r.regex).test("/resume.md")).at(-1);
  assert.match(rule.headers.find((x) => x.key === "Link").value, /<https:\/\/manveen\.me\/resume\.pdf>; rel="canonical"/);
});

test("each drawing's reading is text in the page too, hidden from sight, for tools that drop SVG and attributes", () => {
  for (const page of ["how-i-build.html", "working-with-me.html"]) {
    const html = app(page);
    const wrappers = [...html.matchAll(/<div class="sketch" role="img" aria-label="([^"]*)">(<span class="sr-only">([^<]*)<\/span>)?/g)];
    assert.ok(wrappers.length >= 2, `${page}: no drawings found`);
    for (const [, label, , text] of wrappers) assert.equal(text, label, `${page}: a drawing's reading is not in the page as text`);
  }
});
