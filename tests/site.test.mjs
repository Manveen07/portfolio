// Checks the built site the way a visitor sees it: reads the HTML that
// `next build` prerenders into .next/, so no server and no test library.
// Build first, then:  node --test tests/site.test.mjs

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFileSync(path.join(root, rel), "utf8");
const built = (rel) => existsSync(path.join(root, rel));

/** Prerendered page with <script> blocks removed, so the RSC payload doesn't double-count. */
const markup = (page) => read(`.next/server/app/${page}`).replace(/<script[\s\S]*?<\/script>/g, "");

/** What a reader sees: head, comments and tags stripped, entities decoded, spaces collapsed. */
const text = (page) =>
  markup(page)
    .replace(/<head[\s\S]*?<\/head>/, " ")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<\/?(?:a|b|strong|i|em|span|code|mark|small|sup|sub)\b[^>]*>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");

/** All built CSS as one string. */
const css = () => {
  const dir = path.join(root, ".next/static/chunks");
  return readdirSync(dir)
    .filter((f) => f.endsWith(".css"))
    .map((f) => readFileSync(path.join(dir, f), "utf8"))
    .join("\n");
};

/** Number of non-overlapping matches of a string or a RegExp. */
const count = (haystack, needle) => {
  const re =
    needle instanceof RegExp
      ? new RegExp(needle.source, "g")
      : new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
  return (haystack.match(re) ?? []).length;
};

const snapshot = JSON.parse(read("data/pipeline-snapshot.json"));

// ── Task 1: the build exists and the saved run numbers are current ─────
test("the home page was built", () => {
  assert.ok(built(".next/server/app/index.html"), "run the build first");
  assert.ok(markup("index.html").length > 1000);
});

test("saved run numbers are current, one run per morning", () => {
  assert.ok(snapshot.totalRuns >= 102, `snapshot says ${snapshot.totalRuns} runs`);
  assert.equal(new Set(snapshot.history.map((h) => h.date)).size, snapshot.history.length, "two runs on one date: manual runs are being counted");
});

// ── Task 2: the costume is gone; paper, pen and fonts are in ───────────
test("layout no longer renders the boot screen, grain or easter eggs", () => {
  const html = markup("index.html");
  for (const s of ["P-00", "POWER ON", "CLICK ANYWHERE", "pf-grain", "pf-vignette", "unattended and I will know", "S/N 0075-0342"]) {
    assert.ok(!html.includes(s), `still contains "${s}"`);
  }
});

test("pen marks hide only when JS can draw them, and never under reduced motion", () => {
  assert.ok(read(".next/server/app/index.html").includes("pen-js"), "no pen-js bootstrap script");
  const styles = css();
  assert.match(styles, /\.pen-js \.pen:not\(\.in\)/);
  assert.match(styles, /prefers-reduced-motion[^{]*\{[\s\S]*?stroke-dashoffset:0/);
});

test("an undrawn pen circle leaves no stray dot (dash gap is longer than the path)", () => {
  // pathLength is 1. With dasharray "1" and dashoffset 1, the next dash starts exactly at the
  // path end and the round cap paints a dot. A gap of 2 pushes that dash past the end.
  assert.match(css(), /\.pen path\{[^}]*stroke-dasharray:1 2[;}]/);
});

test("fonts are Archivo and IBM Plex Mono, not the old Barlow set", () => {
  const styles = css();
  assert.match(styles, /Archivo/);
  assert.match(styles, /IBM Plex Mono/);
  assert.doesNotMatch(styles, /Barlow/);
});

test("header has Book a call; footer has recruiter links and the off-the-clock line", () => {
  const html = markup("index.html");
  assert.match(html, /<header[^>]*class="[^"]*\bhead\b[^"]*"[\s\S]*?calendly\.com\/manveen9650[\s\S]*?<\/header>/);
  const foot = html.slice(html.lastIndexOf("<footer"));
  for (const href of ["/resume.pdf", "linkedin.com/in/Manveen", "github.com/Manveen07", 'href="/writing"']) {
    assert.ok(foot.includes(href), `footer missing ${href}`);
  }
  assert.match(text("index.html"), /Off the clock: Hunter x Hunter/);
});

test("the pilot steps list keeps its numbers despite the CSS reset", () => {
  assert.match(css(), /\.steps\{[^}]*list-style:decimal/);
});

// ── Task 3: the hero says the problem first, in Manveen's words ────────
test("hero leads with the problem and drops the slogan", () => {
  const t = text("index.html");
  assert.match(t, /Your tools don't talk to each other, so someone on your team copies things between them\./);
  assert.match(t, /I connect them so it happens on its own, the same way every time\./);
  assert.match(t, /nerd word for this: deterministic\. Same input, same result, every time\./);
  assert.match(t, /I don't automate things that aren't anyone's problem\./);
  assert.match(t, /That's why they're not automatic yet, and that's why they're problems\./);
  assert.match(t, /UK working hours are my afternoon and evening, US mornings my evening\./);
  assert.doesNotMatch(t, /my mornings overlap the UK/i);
  assert.doesNotMatch(t, /automating the boring/i);
  assert.doesNotMatch(t, /scaling the interesting/i);
});

test("hero shows no empty photo frame while PHOTO is null", () => {
  const hero = markup("index.html").match(/<section[^>]*id="top"[\s\S]*?<\/section>/)?.[0];
  assert.ok(hero, "no section#top");
  assert.ok(!hero.includes("<img"), "hero renders an <img> but PHOTO is null");
});

// ── Task 4: Tender Radar, with numbers a skeptic can check ─────────────
test("proof shows the real run count, trades not companies, and no serial labels", () => {
  const t = text("index.html");
  const countP = markup("index.html").match(/<p class="count">([\s\S]*?)<\/p>/)?.[1] ?? "";
  assert.ok(countP.includes(`>${snapshot.totalRuns}<`), "circled run count missing");
  // Final review: 24 of the 102 scheduled mornings failed, so the count says "started", and the
  // legend matches ("Black finished, red failed").
  assert.match(t, /mornings it has started on its own since 4 July 2026\./);
  assert.doesNotMatch(t, /it has run on its own/);
  assert.match(t, /Black finished, red failed\./);
  assert.match(t, new RegExp(`It sorts for ${snapshot.clientProfiles} trades`));
  // Task 13: 431 is the daily summary's "Raw tender records" count, and the fetch step drops
  // expired notices from that file, so it is notices on file, not a running total read.
  assert.match(t, new RegExp(`has ${snapshot.noticesRead} notices on file`));
  assert.doesNotMatch(t, /notices so far/);
  assert.match(t, /Its worst stretch was about three weeks, from 21 July to 11 August/);
  // The workflow has no alert step, so the page must not promise a "visible trace" (audit row 13).
  assert.match(t, /when a data-format change broke the morning run and nothing told me\./);
  assert.doesNotMatch(t, /visible trace/);
  for (const s of ["Companies served", "companies served", "LINE-01", "S/N", "6:30", "broke once", "short list", "short email"]) {
    assert.ok(!t.includes(s), `still says "${s}"`);
  }
});

test("without a GitHub token the panel says the numbers are saved, not live", () => {
  // Local builds have no GITHUB_TOKEN, so getPipeline() returns the snapshot.
  const t = text("index.html");
  assert.match(t, /Numbers saved \d{1,2} [A-Z][a-z]{2}, \d{2}:\d{2} UTC\./);
  assert.doesNotMatch(t, /Read live from GitHub/);
});

test("one bar per saved run, failures marked red", () => {
  const bars = markup("index.html").match(/<div[^>]*class="bars"[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? "";
  assert.equal(count(bars, "<i"), snapshot.history.length);
  assert.equal(count(bars, 'class="f"'), snapshot.history.filter((r) => !r.ok).length);
  // Hover titles use fixed month names ("7 Sep", never "7 Sept") and the legend's word, "finished".
  const titles = [...bars.matchAll(/title="([^"]*)"/g)].map((m) => m[1]);
  assert.equal(titles.length, snapshot.history.length);
  for (const title of titles) assert.match(title, /^\d{1,2} (?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec): (?:finished|failed)$/);
});

test("live and saved run numbers both count scheduled runs only", () => {
  for (const file of ["lib/pipeline.ts", "scripts/refresh-snapshot.mjs"]) {
    assert.match(read(file), /runs\?event=schedule&per_page=40/, `${file} counts manual runs too`);
  }
});

// ── Task 5: what people say, and job history that matches the letter ───
test("Zackary's quote has name, title and company, and no email address", () => {
  const t = text("index.html");
  assert.match(t, /and effectively communicated complex engineering concepts to non-technical stakeholders\./);
  assert.match(t, /Zackary Beckham, Chief Operations Officer, Caprae Capital Partners/);
  assert.match(t, /Full letter available on request\./);
  assert.ok(!markup("index.html").toLowerCase().includes("zackary@"), "his email address is on the page");
});

test("Caprae dates and title follow the signed letter; Precise Leads is one line", () => {
  const t = text("index.html");
  // The role moved onto the Caprae card: company on one line, title and dates on the next.
  assert.match(t, /At Caprae Capital Partners Machine Learning Intern · Aug 2025 → Jan 2026 · US, remote/);
  assert.match(t, /Aug 2025 → Jan 2026/);
  assert.doesNotMatch(t, /Jun → Dec 2025/);
  assert.match(t, /Now: GTM automation engineer at Precise Leads, since Nov 2025\./);
  assert.doesNotMatch(t, /8h → 2h/);
  assert.doesNotMatch(t, /origin story/i);
});

// ── Task 6: three projects, no stale, agency or demo-data cards ────────
test("work shows resume screening, leadlens and PresentAI only", () => {
  const html = markup("index.html");
  const work = html.match(/<section[^>]*id="work"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.equal(count(work, "<article"), 3);
  const t = text("index.html");
  for (const s of ["Resume screening, automated", "leadlens", "PresentAI", "10h → 3h", "9 caught"]) {
    assert.ok(t.includes(s), `missing "${s}"`);
  }
  // Final review: name what was measured, and say nothing the sources can't back.
  // (Show the machine, Task 3: the two metric lines became the scorecard, so "9 of 11 ..." is gone.)
  assert.doesNotMatch(t, /9 of 11/);
  // The scorecard caption now says what was measured ("I hand-checked 72 postings" was cut with the detail paragraph).
  assert.match(t, /Out of 72 postings I checked by hand:/);
  assert.doesNotMatch(t, /72 real postings/);
  assert.doesNotMatch(t, /82%/);
  assert.match(t, /spending about ten hours a week reading resumes by hand/);
  for (const s of ["Lead enrichment on autopilot", "Research-grounded writing", "deploying sep 2026", "BAY-0", "watch one", "operator-demo"]) {
    assert.ok(!t.toLowerCase().includes(s.toLowerCase()) && !html.includes(s), `still has "${s}"`);
  }
});

test("the leadlens card links to a post that was built", () => {
  assert.ok(markup("index.html").includes('href="/writing/schema-as-eval-spec"'));
  assert.ok(built(".next/server/app/writing/schema-as-eval-spec.html"));
});

// ── Show the machine, Task 0: four sections; the quote follows the Caprae card ──
test("work runs Caprae, then the quote, then leadlens, then PresentAI (spec 3.9)", () => {
  const work = markup("index.html").match(/<section[^>]*id="work"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.ok(work, "no section#work");
  const titles = [...work.matchAll(/<h3 class="h3">([^<]*)<\/h3>/g)].map((m) => m[1]);
  assert.deepEqual(titles, ["Resume screening, automated", "leadlens", "PresentAI"]);
  const at = (s) => work.indexOf(s);
  const quoteAt = at('<figure class="quote">');
  assert.ok(quoteAt > 0, "no quote in the Work section");
  assert.ok(at("Resume screening, automated") < quoteAt, "the quote comes before the Caprae card");
  assert.ok(quoteAt < at(">leadlens<"), "the quote is not between the Caprae card and leadlens");
  assert.ok(at(">leadlens<") < at(">PresentAI<"), "PresentAI comes before leadlens");
});

test("the Caprae card has the company line, then the role line, and no card gets a role it doesn't have", () => {
  const work = markup("index.html").match(/<section[^>]*id="work"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.ok(work, "no section#work");
  assert.match(
    work,
    /<article class="card"><p class="small">At Caprae Capital Partners<\/p><p class="small">Machine Learning Intern · Aug 2025 → Jan 2026 · US, remote<\/p><h3 class="h3">Resume screening, automated<\/h3>/,
  );
  // leadlens and PresentAI keep their single "where" line.
  assert.match(work, /<article class="card"><p class="small">My own project<\/p><h3 class="h3">leadlens<\/h3>/);
  assert.match(work, /<article class="card"><p class="small">My own project, live<\/p><h3 class="h3">PresentAI<\/h3>/);
});

test("the quote follows the Caprae card as a block of the Work section, with its margin note", () => {
  const html = markup("index.html");
  const work = html.match(/<section[^>]*id="work"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.ok(work, "no section#work");
  assert.equal(count(html, '<figure class="quote">'), 1, "the quote is not on the page exactly once");
  assert.equal(count(work, '<figure class="quote">'), 1, "the quote is not in the Work section");
  // Cards and the quote block are direct children of the section, so `.wrap > .annotated`
  // gives the quote its margin column. A wrapper div around the cards would stop that.
  assert.ok(!work.includes('<div class="work"'), "cards are still wrapped in a .work div");
  const firstCardEnd = work.indexOf("</article>");
  const quoteAt = work.indexOf('<figure class="quote">');
  const secondCardAt = work.indexOf("<article", firstCardEnd);
  assert.ok(work.slice(0, firstCardEnd).includes("Resume screening, automated"), "the first card is not the Caprae card");
  assert.ok(firstCardEnd < quoteAt && quoteAt < secondCardAt, "the quote is not between the Caprae card and the next card");
  assert.match(work, /<\/article><div class="annotated"><div><figure class="quote">/, "the quote is inside a card, not a section-level block");
  // The next card is leadlens, which has a note of its own, so it opens with its own annotated block.
  assert.match(work, /<\/figure><\/div><aside class="note note-drop">[^<]*<\/aside><\/div><div class="annotated"><div><article/);
  assert.match(text("index.html"), /the bit that matters if you don't write code/);
  // The red underline is on the marked words.
  assert.match(work, /<span class="pen-under">effectively communicated complex engineering concepts to non-technical stakeholders\.<\/span>/);
});

test("the Work section ends with the Now line and the resume link, and keeps 18px between cards", () => {
  const work = markup("index.html").match(/<section[^>]*id="work"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.match(
    text("index.html"),
    /Now: GTM automation engineer at Precise Leads, since Nov 2025\. B\.Tech Computer Science, MSIT Delhi, 2026\. Full resume ↗/,
  );
  assert.match(work, /<a class="link" href="\/resume\.pdf">Full resume ↗<\/a><\/p><\/section>$/);
  assert.match(css(), /\.card\{[^}]*margin:0 0 18px/);
});

test("the people and incident sections are gone, with their copy", () => {
  const html = markup("index.html");
  assert.ok(!html.includes('id="people"') && !html.includes('id="broke"'));
  const t = text("index.html");
  for (const s of ["What people say", "What broke", "Where I've done this", "When something I built breaks", "Here are four of them", "The last 40 runs now show on this page", "An investment firm"]) {
    assert.ok(!t.includes(s), `still says "${s}"`);
  }
  // The two failure stories that stay: the outage inside the Tender Radar section, and leadlens.
  assert.match(t, /Its worst stretch was about three weeks, from 21 July to 11 August/);
  // (Told once, in the leadlens margin note; the card's detail paragraph that said it first is gone.)
  assert.match(t, /my own notes leaked the answers/);
});

// ── Task 8: the whole home page follows the copy rules ─────────────────
test("sections appear in the agreed order: four, and no writing section on the home page", () => {
  const html = markup("index.html");
  const at = ["top", "proof", "work", "contact"].map((id) => html.indexOf(`id="${id}"`));
  assert.ok(at.every((i) => i >= 0), `missing a section: ${at}`);
  assert.deepEqual([...at].sort((a, b) => a - b), at, "sections out of order");
  assert.ok(!html.includes('id="writing"'));
  assert.ok(!html.includes('id="people"') && !html.includes('id="broke"'), "a removed section is back");
  assert.equal(count(html, /<section[\s>]/), 4, "the home page does not have exactly four sections");
});

test("Book a call appears exactly three times: header, first screen, bottom", () => {
  assert.equal(count(markup("index.html"), /calendly\.com\/manveen9650/), 3);
});

test("no dashes, banned words, slogans or 'honest' in the home page copy", () => {
  const t = text("index.html");
  assert.doesNotMatch(t, /[—–]/, "em or en dash");
  assert.doesNotMatch(
    t,
    /\b(leverage|utilise|utilize|streamline|optimise|optimize|robust|seamless|cutting-edge|AI-powered|AI-driven|solutions?|honest(?:ly)?|transform)\b/i,
  );
});

test("the pilot section opens with the 'is it a real problem' line", () => {
  assert.match(text("index.html"), /If it isn't a real problem, I'll say so and we won't build it\./);
});

// ── Final review: a real heading outline ───────────────────────────────
test("home page headings: one h1, an h2 per section, h3 for cards and job history", () => {
  const html = markup("index.html");
  assert.equal(count(html, /<h1[\s>]/), 1);
  // React writes the apostrophe in "I've" as &#x27;; decode it before comparing.
  const h2 = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((m) =>
    m[1].replace(/<[^>]+>/g, "").replace(/&#x27;|&#39;/g, "'").trim(),
  );
  assert.deepEqual(h2, [
    "Running right now · Tender Radar",
    "Work, and who vouches for it",
    "How working with me goes",
  ]);
  assert.equal(count(html, /<h3[\s>]/), 3);
});

test("a kicker that is now a heading still looks like a kicker", () => {
  // Preflight resets heading size and weight; the .kicker rule must set the rest.
  const rule = css().match(/\.kicker\{[^}]*\}/)?.[0] ?? "";
  assert.match(rule, /font-size:12px/);
  assert.match(rule, /text-transform:uppercase/);
  assert.match(rule, /margin:0 0 14px/);
  assert.doesNotMatch(rule, /font-weight:(?:[5-9]\d\d|bold)/);
  // The kicker is an h2 now: it must be the element that carries the class.
  assert.equal(count(markup("index.html"), /<h2 class="kicker">/), 3);
});

test("post headings use a font weight that is loaded (Archivo ships 400, 600, 800, 900)", () => {
  const html = markup("writing/schema-as-eval-spec.html");
  const h2s = html.match(/<h2[^>]*>/g) ?? [];
  assert.ok(h2s.length > 0, "no h2 in the post");
  for (const tag of h2s) {
    const w = Number(/font-weight:(\d+)/.exec(tag)?.[1]);
    assert.ok([400, 600, 800, 900].includes(w), `h2 uses weight ${w}`);
  }
});

// ── Task 9: writing pages, 404, metadata and share image match ─────────
test("writing pages and 404 have no control-panel labels or dashes", () => {
  for (const page of ["writing.html", "writing/schema-as-eval-spec.html", "_not-found.html"]) {
    const html = markup(page);
    for (const s of ["P-05", "P-XX", "back to the panel", "Back to the panel", "panel on"]) {
      assert.ok(!html.includes(s), `${page} still has "${s}"`);
    }
    assert.doesNotMatch(text(page), /[—–]/, `${page} has a dash`);
  }
});

test("the post links to the pilot section, which exists", () => {
  assert.ok(markup("writing/schema-as-eval-spec.html").includes('href="/#contact"'));
  assert.ok(markup("index.html").includes('id="contact"'));
});

test("meta description and share text are current", () => {
  const head = read(".next/server/app/index.html").match(/<head[\s\S]*?<\/head>/)[0];
  const desc = head.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
  assert.match(desc, /copy-paste work between them happens on its own/);
  assert.doesNotMatch(head, /quote intake/i);
  assert.doesNotMatch(head, /automating the boring/i);
});

test("share image and icon have the new look", () => {
  const og = read("app/opengraph-image.tsx");
  assert.doesNotMatch(og, /automating the boring|hazard|#ffd60a/i);
  assert.match(og, /#f4f1ea/);
  // Same wording as the page: the count is mornings started, not mornings that worked.
  assert.match(og, /mornings one system has started on its own/);
  assert.doesNotMatch(og, /has run on its own/);
  assert.doesNotMatch(read("public/favicon.svg"), /#ffd60a/);
  assert.ok(!built("app/favicon.ico"), "create-next-app favicon.ico still overrides the svg");
});

// ── Task 13: claims that failed the skeptic pass (docs/superpowers/specs/2026-10-13-claims.md) ──
test("the Loom link states the video's real length (281 s per Loom's oEmbed, so under 5 minutes)", () => {
  const t = text("index.html");
  assert.match(t, /Watch it work \(under 5 min\)/);
  assert.doesNotMatch(t, /\(3 min\)/);
});

test("PresentAI does not claim to be free: the live pricing page has a 3-a-month free plan and a paid plan with PowerPoint export", () => {
  const t = text("index.html");
  assert.doesNotMatch(t, /It's free/);
  assert.match(t, /free plan/);
  assert.match(t, /PowerPoint export is on the paid plan/);
});

test("PresentAI card: the live app takes a typed prompt, the public repo has no Python, one timing figure", () => {
  const t = text("index.html");
  assert.match(t, /Type a prompt, get a slide deck in under a minute\./);
  assert.doesNotMatch(t, /Paste your notes/);
  assert.match(t, /built with next\.js, postgres(?!,)/);
  assert.doesNotMatch(t, /python-pptx/);
  assert.match(t, /<60s for the first draft/);
  assert.doesNotMatch(t, /2h → 15m/);
});

test("the post's read time is in line with its length", () => {
  const html = markup("writing/schema-as-eval-spec.html");
  const article = html.match(/<article[\s\S]*?<\/article>/)?.[0] ?? "";
  const plain = article.replace(/<[^>]+>/g, " ");
  const words = plain.split(/\s+/).filter(Boolean).length;
  const mins = Number(/(\d+)\s+min read/.exec(plain)?.[1]);
  assert.ok(mins >= Math.floor(words / 260) && mins <= Math.ceil(words / 180), `says ${mins} min for ${words} words`);
});

// ── Design verdicts (docs/superpowers/specs/2026-10-14-design-verdicts.md) ──
test("verdict 2: post headings have no ## marker and match the site's 800 weight", () => {
  const html = markup("writing/schema-as-eval-spec.html");
  assert.doesNotMatch(html, />##</);
  const h2s = html.match(/<h2[^>]*>/g) ?? [];
  assert.ok(h2s.length > 0, "no h2 in the post");
  for (const tag of h2s) {
    assert.match(tag, /font-weight:800/, `post h2 is not weight 800: ${tag}`);
    assert.doesNotMatch(tag, /display:flex/, `post h2 is still a flex row: ${tag}`);
  }
});

test("verdict 3a: the proof note sits with the bars, below the run count", () => {
  const proof = markup("index.html").match(/<section[^>]*id="proof"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.ok(proof, "no section#proof");
  const countAt = proof.indexOf('class="count"');
  // The Tender Radar sketch has its own annotated block above the count; the bars' block is the last one.
  const annotatedAt = proof.lastIndexOf('class="annotated"');
  assert.ok(countAt !== -1 && annotatedAt !== -1, "count or annotated block missing");
  assert.ok(countAt < annotatedAt, "the circled count is still inside the annotated block");
  const annotated = proof.slice(annotatedAt, proof.indexOf("</aside>", annotatedAt));
  assert.ok(annotated.includes('class="bars"'), "the bars are not inside the annotated block");
  assert.ok(annotated.includes("Black finished, red failed"), "the bar caption is not inside the annotated block");
  assert.ok(!annotated.includes('class="count"'), "the count is still inside the annotated block");
  assert.ok(proof.indexOf("mornings it has started on its own") < annotatedAt, "the count line is still inside the annotated block");
});

test("verdict 3b: only the quote's note drops one line on wide screens", () => {
  const html = markup("index.html");
  const work = html.match(/<section[^>]*id="work"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.match(work, /<aside class="note note-drop">/);
  assert.equal(count(html, 'class="note note-drop"'), 1, "other notes were dropped too");
  assert.ok(count(html, /<aside class="note">/) >= 2, "the hero and proof notes lost their plain class");
  // One blockquote line is 20px x 1.45 = 29px, added to the usual 10px margin. The minifier may fold the calc to 39px.
  assert.match(css(), /\.note-drop\{margin-top:(?:calc\(10px \+ 29px\)|39px)\}/);
  assert.match(css(), /@media \(min-width:1000px\)\{[^@]*\.note-drop\{/, "the drop rule is not inside the 1000px media block");
});

test("verdict 4: the share card loads Archivo from real static TTF files", () => {
  const og = read("app/opengraph-image.tsx");
  assert.match(og, /Archivo-ExtraBold\.ttf/);
  assert.match(og, /Archivo-Regular\.ttf/);
  assert.match(og, /fontFamily: "Archivo"/);
  assert.match(og, /export const runtime = "edge"/);
  for (const file of ["app/Archivo-ExtraBold.ttf", "app/Archivo-Regular.ttf"]) {
    assert.ok(built(file), `${file} is missing`);
    const head = readFileSync(path.join(root, file)).subarray(0, 4);
    assert.deepEqual([...head], [0x00, 0x01, 0x00, 0x00], `${file} is not a TrueType font`);
  }
});

// ── Show the machine, Task 1: verdict counts are saved ────────────────
test("saved snapshot has the Tender Radar verdict counts", () => {
  for (const k of ["checks", "bid", "maybe"]) assert.ok(Number.isInteger(snapshot[k]) && snapshot[k] >= 0, `snapshot.${k} missing`);
  assert.ok(snapshot.checks > snapshot.bid + snapshot.maybe, "checks must exceed bid + maybe");
});

// ── Show the machine, Task 2: the Tender Radar sketch ─────────────────
test("Tender Radar sketch shows the saved numbers in both layouts", () => {
  const proof = markup("index.html").match(/<section[^>]*id="proof"[\s\S]*?<\/section>/)?.[0] ?? "";
  const sketch = proof.match(/<div[^>]*class="sketch[^"]*"[^>]*role="img"[\s\S]*?<\/div>/)?.[0] ?? "";
  assert.ok(sketch, "no sketch in the proof section");
  assert.match(sketch, /aria-label="[^"]*checked for \d+ trades[^"]*"/);
  assert.match(sketch, /aria-label="3 public tender sites feed my script every morning\./);
  for (const v of ["sketch-wide", "sketch-tall"]) assert.ok(proof.includes(v), `missing ${v}`);
  const comma = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // Each string is in the wide SVG, the tall SVG and the sketch's aria-label.
  for (const s of [`${snapshot.maybe} worth a look`, `${snapshot.bid} worth bidding`, `out of ${comma(snapshot.checks)} checks`]) {
    assert.equal(count(proof, s), 3, `"${s}" should appear once per layout and once in the aria-label`);
  }
  assert.match(text("index.html"), /every number here comes from the same run as the bars below/);
});

test("Tender Radar sketch draws only the sources the daily run really reads", () => {
  const proof = markup("index.html").match(/<section[^>]*id="proof"[\s\S]*?<\/section>/)?.[0] ?? "";
  for (const s of ["Find a Tender", "Contracts Finder", "ProContract"]) assert.equal(count(proof, `>${s}<`), 2, `${s}: one box per layout`);
  for (const s of ["Public Contracts Scotland", "Sell2Wales"]) assert.ok(!proof.includes(s), `${s} returns 403 every morning, so it must not be drawn`);
});

test("sketch red marks hide only under pen-js and never under reduced motion", () => {
  const styles = css();
  assert.match(styles, /\.pen-js \.sketch:not\(\.in\) \.mark\{stroke-dashoffset:1/);
  assert.match(styles, /prefers-reduced-motion[^{]*\{[\s\S]*?\.sketch:not\(\.in\) \.mark\{stroke-dashoffset:0/);
  assert.match(styles, /@media \(min-width:640px\)\{[^}]*\.sketch-tall\{display:none/);
});

// ── Show the machine, Task 3: real artifacts on the work cards ────────
test("leadlens shows its real scorecard with the false alarms circled", () => {
  const work = markup("index.html").match(/<section[^>]*id="work"[\s\S]*?<\/section>/)?.[0] ?? "";
  const card = work.match(/<table[^>]*class="scorecard"[\s\S]*?<\/table>/)?.[0] ?? "";
  assert.ok(card, "no scorecard");
  const t = card.replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  for (const s of ["9 caught", "2 missed", "0 false alarms", "61 left alone"]) assert.ok(t.includes(s), `missing "${s}"`);
  assert.ok(card.includes("pen-circle"), "0 false alarms should be circled");
  assert.equal(count(card, "pen-circle"), 1, "only the false alarms are circled");
  assert.match(text("index.html"), /Out of 72 postings I checked by hand:/);
  assert.match(text("index.html"), /it once scored 100%, because my own notes leaked the answers\. This is the score after I took them out\./);
});

test("the leadlens card goes lead, scorecard, stack, link: no detail paragraph, no metric lines", () => {
  const work = markup("index.html").match(/<section[^>]*id="work"[\s\S]*?<\/section>/)?.[0] ?? "";
  // The leadlens card is wrapped in its own annotated block, directly under the section.
  assert.match(work, /<div class="annotated"><div><article class="card"><p class="small">My own project<\/p><h3 class="h3">leadlens<\/h3>/);
  const card = work.match(/<article class="card"><p class="small">My own project<\/p><h3 class="h3">leadlens<\/h3>[\s\S]*?<\/article>/)?.[0] ?? "";
  // The story is told once, in the margin note. The old detail paragraph (and its "I hand-checked 72 postings") is gone.
  assert.doesNotMatch(text("index.html"), /It scored a perfect 100%, which was the problem/);
  assert.ok(!card.includes("I hand-checked 72 postings"), "the old detail paragraph is still in the card");
  // The only <p class="body"> in the card is the lead line, so nothing sits between it and the scorecard.
  assert.equal(count(card, '<p class="body">'), 1, "leadlens has a body paragraph besides its lead line");
  const order = ["Reads a job posting", "<table", "<caption>", "</table>", "class=\"stack\"", "class=\"links\""].map((s) => card.indexOf(s));
  assert.ok(order.every((i) => i >= 0), `a piece of the card is missing: ${order}`);
  assert.deepEqual([...order].sort((a, b) => a - b), order, "the card is not lead, table (caption first), stack, link");
  assert.match(card, /<\/b><\/p><table class="scorecard"><caption>/, "something sits between the lead line and the scorecard");
  assert.ok(!card.includes('class="metrics"'), "leadlens still has an empty metrics list");
  for (const s of ["dressed-up AI roles caught", "real jobs wrongly flagged"]) assert.ok(!card.includes(s), `old metric line "${s}" is still there`);
  // The note belongs to the card, outside the article, in the margin column.
  assert.match(work, /<\/article><\/div><aside class="note">it once scored 100%[^<]*<\/aside><\/div>/);
});

test("the work section has two margin notes (the quote's and leadlens's) and PresentAI has none", () => {
  const work = markup("index.html").match(/<section[^>]*id="work"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.equal(count(work, /<aside class="note/), 2, "the Work section should have exactly two margin notes");
  assert.ok(work.lastIndexOf("<aside") < work.indexOf(">PresentAI<"), "PresentAI has a margin note");
});

test("PresentAI card shows a real screenshot of the live app", () => {
  const work = markup("index.html").match(/<section[^>]*id="work"[\s\S]*?<\/section>/)?.[0] ?? "";
  const card = work.match(/<article class="card"><p class="small">My own project, live<\/p>[\s\S]*?<\/article>/)?.[0] ?? "";
  // React writes the apostrophe in an attribute as &#x27;.
  assert.match(card, /<img[^>]*alt="PresentAI(?:'|&#x27;|&#39;)s home page"/);
  assert.ok(built("public/work/presentai.png"));
  // The width and height on the tag are the file's real size (PNG header: width and height are big-endian 32-bit at byte 16 and 20).
  const png = readFileSync(path.join(root, "public/work/presentai.png"));
  assert.deepEqual([...png.subarray(0, 4)], [0x89, 0x50, 0x4e, 0x47], "presentai.png is not a PNG");
  const [w, h] = [png.readUInt32BE(16), png.readUInt32BE(20)];
  assert.equal(w, 640, "the screenshot is not 640px wide");
  assert.match(card, new RegExp(`<img[^>]*width="${w}"`));
  assert.match(card, new RegExp(`<img[^>]*height="${h}"`));
});

test("scorecard and screenshot styles: ink grid, thin rule border, no shadow", () => {
  const styles = css();
  assert.match(styles, /\.scorecard\{[^}]*border-collapse:collapse/);
  assert.match(styles, /\.scorecard td\{[^}]*border:1\.5px solid var\(--ink\)/);
  assert.match(styles, /\.scorecard b\{[^}]*font-size:26px[^}]*font-weight:800/);
  assert.match(styles, /\.scorecard caption\{[^}]*caption-side:top/);
  assert.match(styles, /\.shot\{[^}]*border:1px solid var\(--rule\)/);
  assert.doesNotMatch(styles.match(/\.shot\{[^}]*\}/)?.[0] ?? "", /shadow|filter|blur/);
});

// ── Show the machine, Task 4: the problem, drawn ──────────────────────
test("hero has the problem sketch in both layouts, between the headline and the answer", () => {
  const hero = markup("index.html").match(/<section[^>]*id="top"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.match(hero, /aria-label="An order arrives by email, someone retypes it into your system\. I connect the two directly\."/);
  assert.ok(hero.indexOf("<h1") < hero.indexOf('class="sketch"') && hero.indexOf('class="sketch"') < hero.indexOf('class="lede"'));
  // "someone retypes it" is in the wide SVG, the tall SVG and the sketch's aria-label; the red label is in the two SVGs only.
  assert.equal(count(hero, "someone retypes it"), 3);
  assert.equal(count(hero, "I connect these two directly"), 2);
  for (const v of ["sketch-wide", "sketch-tall"]) assert.ok(hero.includes(v), `missing ${v}`);
});
