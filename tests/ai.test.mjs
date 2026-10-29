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
  assert.deepEqual(sections, ["Resume", "Pages", "Projects and work", "Writing", "Optional"]);
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
  for (const p of ["/resume.md", "/resume.json", "/resume.pdf", "/index.md", "/writing.md", "/llms-full.txt", ...posts.map((s) => `/writing/${s}.md`)]) {
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
  assert.ok(words.length > 40, "no sketch text found: did the sketches move?");
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
  assert.deepEqual([...inMd].filter((n) => !withTitles.has(n)), [], "in index.md, not on the page");
});

test("every project and job title on the page is in llms.txt, index.md and llms-full.txt", () => {
  const work = homePage().match(/<section[^>]*id="work"[\s\S]*?<\/section>/)?.[0] ?? "";
  const titles = [...work.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g)].map((m) => squash(plain(m[1])));
  assert.ok(titles.length >= 4, `only ${titles.length} titles in #work`);
  titles.push("Tender Radar");
  for (const [name, body] of [["llms.txt", route("llms.txt").body], ["index.md", route("index.md").body], ["llms-full.txt", route("llms-full.txt").body]]) {
    for (const t of titles) assert.ok(unmark(body).includes(t), `${name} is missing "${t}"`);
  }
});

test("llms.txt lists every post under Writing, newest first, with the date its page shows; the moved blocks are posts, not projects", () => {
  // 22 Oct: drawing-proof and the confidently-wrong notes left the home page for the writing ("these are the blogs"),
  // so llms.txt lists them where they now live, with the numbers and dates they carried as projects.
  const txt = route("llms.txt").body;
  const part = (name) => txt.split(`\n## ${name}\n`)[1].split("\n## ")[0];
  const writing = [...part("Writing").matchAll(/^- \[[^\]]+\]\(https:\/\/manveen\.me\/writing\/([a-z0-9-]+)\.md\): (.+)$/gm)];
  assert.deepEqual(writing.map((m) => m[1]), ["149-tests-for-a-few-slack-buttons", "marking-the-ais-homework", "things-ai-got-confidently-wrong", "schema-as-eval-spec"]);
  assert.match(writing[0][2], /\(25 October 2026\)$/);
  assert.match(writing[1][2], /Numbers: 7 of 419 answers wrong \(1\.7%\)[^\n]*\(Marked 26 Sep 2026\)$/);
  assert.match(writing[2][2], /25 May 2026, 0\.95, fifty times; [^\n]*19 Sep 2026, POD matching, allegedly\. \(Last entry 19 Sep 2026\)$/);
  assert.match(writing[3][2], /\(14 June 2026\)$/);
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
    ...r.experience.flatMap((j) => [j.org, j.dates, j.title, j.location, ...j.bullets]),
    r.headings.projects,
    ...r.projects.flatMap((p) => [`${p.name} | ${p.stack.join(", ")}${p.links.map((l) => ` · ${l.label}`).join("")}`, p.date, ...p.bullets]),
    r.headings.education,
    ...r.education.flatMap((e) => [e.school, e.gpa, e.degree, e.dates]),
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
  const pages = [["index.html", "/index.md"], ["writing.html", "/writing.md"], ...posts.map((s) => [`writing/${s}.html`, `/writing/${s}.md`])];
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
  // The description is the visible paragraph under the hero, so it says what the page says.
  assert.ok(plain(html).includes(p.description), "Person.description is not on the page");
  assert.equal(p.name, "Manveen Singh");
  assert.equal(p.jobTitle, RESUME.role);
  assert.equal(p.url, `${SITE}/`);
  assert.equal(p.address.addressLocality, "Delhi");
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
  const want = ["/", "/writing", "/how-i-build", "/resume.pdf", ...posts.map((s) => `/writing/${s}`)];
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
  const pages = [["/index.md", "/"], ["/writing.md", "/writing"], ...posts.map((s) => [`/writing/${s}.md`, `/writing/${s}`])];
  for (const [md, page] of pages) {
    const link = linkFor(md);
    assert.ok(link.includes(`<${SITE}${page}>; rel="canonical"`), `${md}: ${link}`);
    assert.ok(link.includes('</llms.txt>; rel="describedby"'), `${md} lost describedby`);
  }
  assert.doesNotMatch(linkFor("/writing"), /canonical/, "the page itself gets no canonical header");
});
