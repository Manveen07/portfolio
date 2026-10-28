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
const text = (page) => plain(markup(page));

/** Markup to the words a reader sees. */
const plain = (html) =>
  html
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

/** The inside of every `@media (min-width:Npx){...}` block in the built CSS, found by matching braces. */
const mediaBlocks = (styles, query) => {
  const out = [];
  const head = `@media (min-width:${query}){`;
  for (let at = styles.indexOf(head); at !== -1; at = styles.indexOf(head, at + 1)) {
    let depth = 1;
    let i = at + head.length;
    for (; i < styles.length && depth > 0; i++) depth += styles[i] === "{" ? 1 : styles[i] === "}" ? -1 : 0;
    out.push(styles.slice(at + head.length, i - 1));
  }
  return out;
};

/** The built CSS with every min-width media block cut out: the rules that apply on a phone. */
const outsideMedia = (styles) => {
  let rest = styles;
  for (const px of ["640px", "720px", "1000px", "1200px"]) for (const block of mediaBlocks(styles, px)) rest = rest.replace(`@media (min-width:${px}){${block}}`, "");
  return rest;
};

const snapshot = JSON.parse(read("data/pipeline-snapshot.json"));

/** Every post's slug, in data/posts.ts order. */
const posts = [...read("data/posts.ts").matchAll(/slug: "([a-z0-9-]+)"/g)].map((m) => m[1]);

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
  // next/font/local names the family after the variable that holds it.
  assert.match(styles, /IBM ?Plex ?Mono/);
  assert.doesNotMatch(styles, /Barlow/);
});

test("fonts ship inside the repo: the build never downloads them from Google", () => {
  // 15 Oct: a Vercel preview build failed when Google's font server did not deliver Archivo
  // ("module not found" on each url() in next/font/google's CSS). The same files now live in app/fonts.
  const layout = read("app/layout.tsx");
  assert.doesNotMatch(layout, /next\/font\/google/, "the layout still fetches fonts from Google at build time");
  assert.match(layout, /from "next\/font\/local"/);
  for (const f of ["archivo-latin.woff2", "plex-mono-400-latin.woff2", "plex-mono-500-latin.woff2"]) {
    assert.match(layout, new RegExp(`\\./fonts/${f.replace(/\./g, "\\.")}`), `${f} is not used`);
    assert.ok(built(`app/fonts/${f}`), `app/fonts/${f} is missing`);
  }
  const html = markup("index.html");
  assert.doesNotMatch(html, /fonts\.(?:googleapis|gstatic)\.com/);
  // Same weights as before, declared the same way: Archivo at 400, 600, 800 and 900 (one variable file; <b> asks
  // for 700 and must round to 800, as it did with Google's CSS), Plex Mono at 400 and 500.
  const styles = css();
  const archivoFaces = (styles.match(/@font-face\{[^}]*archivo-latin[^}]*\}|@font-face\{font-family:Archivo;[^}]*\}/g) ?? []).join("\n");
  for (const w of ["400", "600", "800", "900"]) assert.match(archivoFaces, new RegExp(`font-weight:${w}[;}]`), `no Archivo face at ${w}`);
  assert.doesNotMatch(styles, /font-weight:400 900/, "Archivo is a weight range again: <b> would draw a thinner 700");
  assert.match(styles, /font-weight:500/);
  // Characters the fonts lack (the → arrows) are drawn in Arial, scaled. Keep Google's exact scaling so
  // they look the same as before; next/font/local's own guess made them wider (102.8% vs 98.7%).
  assert.match(styles, /font-family:Archivo Fallback;src:local\(Arial\);ascent-override:88\.96%;descent-override:21\.28%;line-gap-override:0(?:\.0)?%;size-adjust:98\.7%/);
  assert.match(styles, /font-family:IBM Plex Mono Fallback;src:local\(Arial\);ascent-override:76\.16%;descent-override:20\.43%;line-gap-override:0(?:\.0)?%;size-adjust:134\.59%/);
  assert.doesNotMatch(styles, /size-adjust:102\.8%/, "next/font/local's own fallback scaling is still there");
});

test("header has Write to me (mail, ink, plain underline); footer has recruiter links and the off-the-clock line", () => {
  const html = markup("index.html");
  const head = html.match(/<header[\s\S]*?<\/header>/)?.[0] ?? "";
  assert.match(head, /<a class="head-cta" href="mailto:manveen9650@gmail\.com">Write to me<\/a>/);
  assert.doesNotMatch(head, /calendly|Book a call/);
  const cta = css().match(/\.head-cta\{[^}]*\}/)?.[0] ?? "";
  assert.ok(cta, "no .head-cta rule");
  assert.doesNotMatch(cta, /var\(--red\)|background/, "the header link is red or a button");
  const foot = html.slice(html.lastIndexOf("<footer"));
  for (const href of ["/resume.pdf", "linkedin.com/in/manveen-singh-b9b7672a0", "github.com/Manveen07", 'href="/writing"']) {
    assert.ok(foot.includes(href), `footer missing ${href}`);
  }
  assert.match(text("index.html"), /Off the clock: Hunter x Hunter/);
  // 23 Oct 2026: linkedin.com/in/Manveen is someone else's profile; it was linked everywhere until then.
  assert.ok(!html.includes("linkedin.com/in/Manveen"), "the page links the wrong LinkedIn profile");
});

test("the pilot steps list is still styled as a numbered list, for screen readers that announce list style", () => {
  // It is visually hidden behind the drawn timeline (.sr-only), but the CSS reset strips list markers
  // and some screen readers then stop announcing it as a list, so the rule keeps decimal numbering.
  assert.match(css(), /\.steps\{[^}]*list-style:decimal/);
});

// ── Task 3: the hero says the problem first, in Manveen's words ────────
test("hero leads with the weekly job and drops the slogan", () => {
  const t = text("index.html");
  const hero = markup("index.html").match(/<section[^>]*id="top"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.match(hero, /<h1>Every week has a job that(?:'|&#x27;)s the same clicks, in the same order\.<\/h1>/);
  assert.match(t, /I make it run by itself, the same way every time\./);
  assert.match(hero, /<span class="pen-under">the same way every time\.<\/span>/, "the underline is not on its words");
  assert.doesNotMatch(t, /talk to each other|copies things between/);
  assert.doesNotMatch(hero, /class="btn"/, "the hero still has a button");
  assert.match(t, /nerd word for this: deterministic\. Same input, same result, every time\./);
  // Manveen's pick, 15 Oct: headline A with version C's story in place of the two old paragraphs.
  assert.match(t, /nobody measures whether the automation is right\. So now I build the thing, and the test for the thing\./);
  assert.doesNotMatch(t, /I don't automate things that aren't anyone's problem\./);
  assert.match(t, /UK working hours are my afternoon and evening, US mornings my evening\./);
  assert.doesNotMatch(t, /my mornings overlap the UK/i);
  assert.doesNotMatch(t, /automating the boring/i);
  assert.doesNotMatch(t, /scaling the interesting/i);
});

test("hero shows Manveen's photo", () => {
  const hero = markup("index.html").match(/<section[^>]*id="top"[\s\S]*?<\/section>/)?.[0];
  assert.ok(hero, "no section#top");
  assert.match(hero, /<img[^>]*alt="Manveen Singh"/);
  // The alt text alone would let a different picture slip in: the file and its size are pinned too.
  // next/image writes the file into src as an encoded query (/_next/image?url=%2Fme.jpg&w=...).
  const img = hero.match(/<img[^>]*>/)?.[0] ?? "";
  assert.match(img, /src="[^"]*me\.jpg/, "the photo is not me.jpg");
  assert.match(img, /width="264"/);
  assert.match(img, /height="330"/);
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

test("Caprae dates and title follow the signed letter; Precise Leads is a job entry, not a Now line", () => {
  const t = text("index.html");
  // The role moved onto the Caprae card: company on one line, title and dates on the next.
  assert.match(t, /At Caprae Capital Partners Machine Learning Intern · Aug 2025 → Jan 2026 · US, remote/);
  assert.match(t, /Aug 2025 → Jan 2026/);
  assert.doesNotMatch(t, /Jun → Dec 2025/);
  assert.doesNotMatch(t, /Now: GTM automation engineer/);
  assert.match(t, /At Precise Leads GTM automation engineer · Nov 2025 → now · remote/);
  assert.doesNotMatch(t, /8h → 2h/);
  assert.doesNotMatch(t, /origin story/i);
});

// ── Task 6: three projects, no stale, agency or demo-data cards ────────
test("work shows lead research, resume screening, leadlens and PresentAI only", () => {
  const html = markup("index.html");
  const work = html.match(/<section[^>]*id="work"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.equal(count(work, "<article"), 4);
  const t = text("index.html");
  for (const s of ["Outbound, built end to end", "Resume screening, automated", "leadlens", "PresentAI", "10h → 3h", "9 caught"]) {
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
test("work runs Jobs (Precise Leads, Caprae, the quote), then Built on my own (leadlens, PresentAI)", () => {
  const work = markup("index.html").match(/<section[^>]*id="work"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.ok(work, "no section#work");
  assert.match(work, /<h2 class="kicker">Work, and who vouches for it<\/h2>/, "the section lost its kicker");
  const titles = [...work.matchAll(/<h3 class="h3">([^<]*)<\/h3>/g)].map((m) => m[1]);
  assert.deepEqual(titles, ["Outbound, built end to end", "Resume screening, automated", "leadlens", "PresentAI"]);
  const at = (s) => work.indexOf(s);
  const quoteAt = at('<figure class="quote">');
  assert.ok(quoteAt > 0, "no quote in the Work section");
  const order = [
    '<p class="group">Jobs</p>',
    ">Outbound, built end to end<",
    ">Resume screening, automated<",
    '<figure class="quote">',
    '<p class="group">Built on my own</p>',
    ">leadlens<",
    ">PresentAI<",
  ].map(at);
  assert.ok(order.every((i) => i >= 0), `a piece is missing: ${order}`);
  assert.deepEqual([...order].sort((a, b) => a - b), order, "the Work section is out of order");
  // One pencil tick inside each group, between its two entries.
  assert.equal(count(work, '<hr class="tick"/>'), 2);
  const label = css().match(/\.group\{[^}]*\}/)?.[0] ?? "";
  assert.match(label, /font-family:var\(--font-mono\)/, "the group labels are not mono");
});

test("the Precise Leads entry: meta, title, plain text, two metrics, stack; no note and no link", () => {
  // Rewritten 15 Oct from Manveen's own repos (gtm, precise-automator, infra-bot, slack message exporter); claims rows 77 to 81.
  const work = markup("index.html").match(/<section[^>]*id="work"[\s\S]*?<\/section>/)?.[0] ?? "";
  const entry = work.match(/<article class="entry"><p class="small">At Precise Leads<\/p>[\s\S]*?<\/article>/)?.[0] ?? "";
  assert.ok(entry, "no Precise Leads entry");
  assert.match(entry, /<p class="small">At Precise Leads<\/p><p class="small">GTM automation engineer · Nov 2025 → now · remote<\/p><h3 class="h3">Outbound, built end to end<\/h3>/);
  assert.match(entry, /<p class="body">Finds the companies worth writing to and the right person at each, then writes emails that only say what the research found\.<\/p>/);
  assert.match(
    entry,
    /<p class="body">I built the agency(?:'|&#x27;)s outbound pipeline\. One run sorted 34,044 companies in four days, and every yes came with a quote from the company(?:'|&#x27;)s own website\. Each draft is checked claim by claim against that research, and when someone spots a new kind of mistake, it becomes a check that runs before anything goes out\. I also built the Slack bot that buys and warms up the sending inboxes, the tool that turns a client(?:'|&#x27;)s sequence into a ready campaign, and a daily scan of five sales-tool Slack communities that passes likely buyers to the sales team\.<\/p>/,
  );
  assert.match(entry, /<dt>0<\/dt><dd>contradicted claims in 300 drafted emails<\/dd>/);
  assert.match(entry, /<dt>34,044<\/dt><dd>companies sorted in four days<\/dd>/);
  assert.match(entry, /<p class="stack">built with (?:<!-- -->)?python, typescript, clay, smartlead, n8n<\/p>/);
  assert.doesNotMatch(entry, /Lead research, automated|watches Slack communities as messages come in/);
  assert.doesNotMatch(entry, /<a /, "the Precise Leads entry has a link");
  // No note: it is not inside an annotated block.
  assert.match(work, /<p class="group">Jobs<\/p><article class="entry"><p class="small">At Precise Leads/);
});

test("the Caprae card has the company line, then the role line, and no card gets a role it doesn't have", () => {
  const work = markup("index.html").match(/<section[^>]*id="work"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.ok(work, "no section#work");
  assert.match(
    work,
    /<article class="entry"><p class="small">At Caprae Capital Partners<\/p><p class="small">Machine Learning Intern · Aug 2025 → Jan 2026 · US, remote<\/p><h3 class="h3">Resume screening, automated<\/h3>/,
  );
  // leadlens and PresentAI keep their single "where" line.
  assert.match(work, /<article class="entry"><p class="small">My own project<\/p><h3 class="h3">leadlens<\/h3>/);
  assert.match(work, /<article class="entry"><p class="small">My own project<\/p><h3 class="h3">PresentAI<\/h3>/);
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
  const capraeAt = work.indexOf(">Resume screening, automated<");
  const capraeEnd = work.indexOf("</article>", capraeAt);
  const quoteAt = work.indexOf('<figure class="quote">');
  const nextCardAt = work.indexOf("<article", capraeEnd);
  assert.ok(capraeAt > 0, "no Caprae entry");
  assert.ok(capraeEnd < quoteAt && quoteAt < nextCardAt, "the quote is not between the Caprae entry and the next entry");
  assert.match(work, /<\/article><div class="annotated"><div><figure class="quote">/, "the quote is inside a card, not a section-level block");
  // The quote closes the Jobs group; leadlens opens Built on my own, with a note of its own, so its own annotated block.
  assert.match(work, /<\/figure><\/div><aside class="note">[^<]*<\/aside><\/div><p class="group">Built on my own<\/p><div class="annotated"><div><article/);
  assert.match(text("index.html"), /the bit that matters if you don't write code/);
  // The red underline is on the marked words.
  assert.match(work, /<span class="pen-under">effectively communicated complex engineering concepts to non-technical stakeholders\.<\/span>/);
});

test("the Work section ends with the Now line and the resume link", () => {
  const work = markup("index.html").match(/<section[^>]*id="work"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.match(work, /<p class="small now">B\.Tech Computer Science, MSIT Delhi, 2026\.(?:<!-- -->)? <a class="link" href="\/resume\.pdf">Full resume ↗<\/a><\/p><\/section>$/);
});

// ── Layout pass (15 Oct), item 1: one centred column, entries on the paper ──
test("one reading column, centred: header, sections and footer share its width and left edge", () => {
  const styles = css();
  const wrap = styles.match(/\.wrap\{[^}]*\}/)?.[0] ?? "";
  assert.match(wrap, /max-width:calc\(var\(--col\) \+ 40px\)/, "the wrap is wider than the column plus its 20px padding");
  assert.match(wrap, /margin:0 auto/);
  // Nothing inside the wrap may be narrower than it on purpose: the old `.wrap > *` cap pinned blocks to the left.
  assert.doesNotMatch(styles, /\.wrap>\*\{/, "a .wrap > * rule still caps children");
  // Header, every section and the footer are wraps.
  const html = markup("index.html");
  assert.match(html, /<header class="wrap head">/);
  assert.equal(count(html, /<section[^>]*class="wrap sec/), 5);
  assert.match(html, /<footer class="wrap foot">/);
  // The old left-weighted page (column plus note column in one box) is gone: no 1000px layout block.
  assert.equal(mediaBlocks(styles, "1000px").length, 0, "a 1000px media block is left over");
});

test("red notes stay inside the centred column at every width, under the block they point at", () => {
  // Centring pass (15 Oct): notes hanging in the right margin made the page lean right. Nothing leaves the column now.
  const styles = css();
  assert.equal(mediaBlocks(styles, "1200px").length, 0, "a 1200px block still moves notes into the margin");
  assert.doesNotMatch(styles, /--note:/, "the margin-note column width is still defined");
  assert.doesNotMatch(styles, /content:"← "/, "a note still points left from the margin");
  assert.match(outsideMedia(styles), /\.note:{1,2}before\{content:"↑ "\}/);
  const ann = styles.match(/\.annotated\{[^}]*\}/)?.[0] ?? "";
  assert.doesNotMatch(ann, /margin-right/, "the annotated block still grows out of the column");
});

test("the hero answers its headline first, then shows the week", () => {
  const hero = markup("index.html").match(/<section[^>]*id="top"[\s\S]*?<\/section>/)?.[0] ?? "";
  const lede = hero.indexOf('class="lede"');
  const sketch = hero.indexOf('class="sketch');
  const story = hero.indexOf("I spent a year automating");
  assert.ok(lede > 0 && sketch > 0 && story > 0, `a hero piece is missing: ${[lede, sketch, story]}`);
  assert.ok(hero.indexOf("</h1>") < lede && lede < sketch && sketch < story, "the hero is not h1, lede, week sketch, story");
  // Manveen, 15 Oct: Precise Leads is an outbound agency, not a sales-software company.
  assert.match(hero, /I spent a year automating lead-finding for an outbound agency, got good at it/);
  assert.doesNotMatch(hero, /sales-software/);
});

test("from 1100px the page is a side rail (photo, section labels) beside the reading column", () => {
  // Manveen picked version B on 15 Oct: a lone 640px column left both sides of a laptop screen empty.
  const styles = css();
  const wide = mediaBlocks(styles, "1100px").join("\n");
  assert.ok(wide, "no 1100px block");
  assert.match(wide, /\.wrap\{max-width:calc\(var\(--rail\) \+ 60px \+ var\(--col\) \+ 40px\)\}/);
  const sec = wide.match(/\.sec\{[^}]*\}/)?.[0] ?? "";
  assert.match(sec, /display:grid/);
  // The minifier drops the space before minmax.
  assert.match(sec, /grid-template-columns:var\(--rail\)\s?minmax\(0,\s?var\(--col\)\)/);
  assert.match(wide, /\.sec>\*\{grid-(?:column:2|column-start:2)/);
  assert.match(wide, /\.sec>\.kicker\{[^}]*grid-(?:column:1|area:1\/1)[^}]*position:sticky/);
  assert.match(wide, /\.hero-head\{display:contents\}/);
  assert.match(wide, /\.hero \.photo\{[^}]*grid-(?:column:1|area:1\/1)/);
  assert.match(styles, /--rail:190px/);
  // Below 1100px it stays the single centred column.
  assert.match(outsideMedia(styles), /\.wrap\{[^}]*max-width:calc\(var\(--col\) \+ 40px\)/);
});

test("the photo sits inside the column beside the h1 from 720px, above it below that, never positioned", () => {
  const styles = css();
  const base = outsideMedia(styles).match(/\.photo\{[^}]*\}/)?.[0] ?? "";
  assert.ok(base, "no .photo rule");
  assert.match(base, /width:176px/);
  // Manveen, 15 Oct: printed onto the paper (multiplied, a slight tilt), not a framed form photo.
  // In colour (grey made the page dull), softened so the pink flowers don't fight the red pen.
  // 176px is as large as the 264px-wide file stays sharp at 1.5x.
  assert.doesNotMatch(base, /grayscale/, "the photo is grey again");
  assert.match(base, /filter:saturate\(\.8\)|filter:saturate\(0\.8\)|filter:saturate\(80%\)/);
  assert.match(base, /mix-blend-mode:multiply/);
  assert.match(base, /rotate\(-1\.5deg\)/);
  assert.doesNotMatch(base, /border:|outline:1px/);
  for (const rule of styles.match(/\.photo\{[^}]*\}/g) ?? []) assert.doesNotMatch(rule, /position:(?:absolute|fixed)/, "the photo is positioned against layout constants");
  const hero = markup("index.html").match(/<section[^>]*id="top"[\s\S]*?<\/section>/)?.[0] ?? "";
  // Photo, then h1, in one head block: stacked on a phone, side by side from 720px.
  assert.match(hero, /<div class="hero-head"><img[^>]*class="photo"[^>]*\/?><h1>/);
  const mid = mediaBlocks(styles, "720px").join("\n");
  assert.match(mid, /\.hero-head\{[^}]*display:grid/);
  assert.match(mid, /\.hero-head\{[^}]*grid-template-columns:minmax\(0,\s?1fr\) 176px/);
  // The minifier folds grid-column 2 / grid-row 1 into grid-area:1/2.
  assert.match(mid, /\.photo\{[^}]*grid-(?:column:2|area:1\/2)/);
});

test("work entries sit on the paper: no wash box, a short pencil tick between them, plain lead line", () => {
  const styles = css();
  assert.doesNotMatch(styles, /\.card\{/, "the old boxed .card rule is still there");
  const entry = styles.match(/\.entry\{[^}]*\}/)?.[0] ?? "";
  assert.ok(entry, "no .entry rule");
  assert.doesNotMatch(entry, /background|padding/, "entries are boxed again");
  const tick = styles.match(/\.tick\{[^}]*\}/)?.[0] ?? "";
  assert.match(tick, /background-image:var\(--divider\)/, "the tick is not the pencil stroke");
  assert.match(tick, /width:80px/);
  const work = markup("index.html").match(/<section[^>]*id="work"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.ok(count(work, '<hr class="tick"/>') >= 2, "entries are not separated by ticks");
  assert.doesNotMatch(work, /<p class="body"><b>/, "the lead sentence is still bold");
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
test("sections appear in the agreed order: five, with the newest writing just before the pilot", () => {
  // On 22 Oct Manveen added drawing-proof and the confidently-wrong notes between Work and the pilot, then asked for
  // the writing to be findable ("a person navigating the website will never lead to the writing section. I want them
  // to go to the writing section."), then moved both blocks into the writing: "these are the blogs"; "I want my
  // website to be not filled with balls of text". So Work is followed by a short Writing list.
  const html = markup("index.html");
  const at = ["top", "proof", "work", "writing", "contact"].map((id) => html.indexOf(`id="${id}"`));
  assert.ok(at.every((i) => i >= 0), `missing a section: ${at}`);
  assert.deepEqual([...at].sort((a, b) => a - b), at, "sections out of order");
  for (const id of ["people", "broke", "drawings", "wrong"]) assert.ok(!html.includes(`id="${id}"`), `a removed section is back: #${id}`);
  assert.equal(count(html, /<section[\s>]/), 5, "the home page does not have exactly five sections");
});

test("one Calendly link on the home page, at the bottom, and no buttons", () => {
  const html = markup("index.html");
  assert.equal(count(html, /calendly\.com\/manveen9650/), 1);
  assert.doesNotMatch(text("index.html"), /Book a 30-minute call|Book a call/);
  assert.doesNotMatch(html, /class="btn"/);
});

test("no black buttons anywhere: the 404 and post pages end with plain links too", () => {
  for (const page of ["_not-found.html", ...posts.map((s) => `writing/${s}.html`)]) {
    assert.doesNotMatch(markup(page), /class="btn"/, `${page} still has a button`);
  }
  assert.doesNotMatch(css(), /\.btn[{:]/, "the .btn style is still in the CSS");
  assert.match(markup("_not-found.html"), /<a class="link" href="\/">Back to the home page<\/a>/);
  for (const s of posts) assert.match(markup(`writing/${s}.html`), /<a class="link" href="\/#contact">Write to me<\/a>/);
});

test("a post fills the side rail too: back link and date sit in the rail, the title stays readable", () => {
  // Release check, 15 Oct: the post left the rail empty, so its text sat pushed to the right.
  const html = markup("writing/schema-as-eval-spec.html");
  assert.match(html, /<article class="wrap sec hero post"><div class="post-meta"><p class="small"><a class="link" href="\/writing">← all writing<\/a><\/p><p class="small">14 June 2026/);
  for (const s of posts) assert.match(markup(`writing/${s}.html`), /<article class="wrap sec hero post"><div class="post-meta"><p class="small"><a class="link" href="\/writing">← all writing<\/a><\/p><p class="small">/, `${s}: no rail`);
  const wide = mediaBlocks(css(), "1100px").join("\n");
  assert.match(wide, /\.sec>\.post-meta\{[^}]*grid-(?:column:1|area:1\/1)[^}]*position:sticky/);
  // A long post title is a heading, not a poster: at most 44px.
  assert.match(css(), /\.post h1\{font-size:clamp\(30px,\s?3\.4vw,\s?44px\)/);
});

test("the contact section ends with the one-task line, the email address, then the calendar link", () => {
  const c = markup("index.html").match(/<section[^>]*id="contact"[\s\S]*?<\/section>/)?.[0] ?? "";
  const at = (s) => c.indexOf(s);
  const order = [
    'class="sketch"',
    "Tell me one task you repeat every week. I(?:'|&#x27;)ll reply within a day and say whether it can run by itself.",
    'href="mailto:manveen9650@gmail.com"',
    "or pick a time on my calendar",
  ];
  assert.match(c, new RegExp(order[1]), "the one-task line is missing");
  const pos = [at(order[0]), c.search(new RegExp(order[1])), at(order[2]), at(order[3])];
  assert.ok(pos.every((p) => p >= 0), `a piece is missing: ${pos}`);
  assert.deepEqual([...pos].sort((a, b) => a - b), pos, "the contact end is out of order");
  // The address is the main link: its own class, larger than body text, underlined.
  assert.match(c, /<a class="mail" href="mailto:manveen9650@gmail\.com">manveen9650@gmail\.com<\/a>/);
  const mail = css().match(/\.mail\{[^}]*\}/)?.[0] ?? "";
  const px = Number(/font-size:(\d+)px/.exec(mail)?.[1]);
  assert.ok(px > 17, `the email link is ${px}px, not larger than the 17px body`);
  assert.match(mail, /text-decoration:underline|text-decoration-line:underline/);
  // The calendar link is small, on its own line, and is the page's one Calendly link.
  assert.match(c, /<p class="small"><a class="link" href="https:\/\/calendly\.com\/manveen9650\/30min"[^>]*>or pick a time on my calendar<\/a><\/p><\/section>$/);
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
    "Writing",
    "How working with me goes",
  ]);
  // Four work entries and the three newest posts.
  assert.equal(count(html, /<h3[\s>]/), 7);
});

test("a kicker that is now a heading still looks like a kicker", () => {
  // Preflight resets heading size and weight; the .kicker rule must set the rest.
  const rule = css().match(/\.kicker\{[^}]*\}/)?.[0] ?? "";
  assert.match(rule, /font-size:12px/);
  assert.match(rule, /text-transform:uppercase/);
  assert.match(rule, /margin:0 0 14px/);
  assert.doesNotMatch(rule, /font-weight:(?:[5-9]\d\d|bold)/);
  // The kicker is an h2 now: it must be the element that carries the class.
  assert.equal(count(markup("index.html"), /<h2 class="kicker">/), 4);
});

/** A prose post up to its "More writing" list: the post's own headings. */
const prose = (slug) => {
  const html = markup(`writing/${slug}.html`);
  const end = html.indexOf(">More writing<");
  return end < 0 ? html : html.slice(0, end);
};

test("post headings use a font weight that is loaded (Archivo ships 400, 600, 800, 900)", () => {
  const html = prose("schema-as-eval-spec");
  const h2s = html.match(/<h2[^>]*>/g) ?? [];
  assert.ok(h2s.length > 0, "no h2 in the post");
  for (const tag of h2s) {
    const w = Number(/font-weight:(\d+)/.exec(tag)?.[1]);
    assert.ok([400, 600, 800, 900].includes(w), `h2 uses weight ${w}`);
  }
});

// ── Task 9: writing pages, 404, metadata and share image match ─────────
test("writing pages and 404 have no control-panel labels or dashes", () => {
  for (const page of ["writing.html", ...posts.map((s) => `writing/${s}.html`), "_not-found.html"]) {
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
  // Layout pass item 5: the head says what the hero says.
  assert.match(desc, /^Every week has a job that(?:'|&#x27;)s the same clicks, in the same order\. I make it run by itself, the same way every time\.$/);
  assert.doesNotMatch(head, /talk to each other|copies things between|copy-paste work between/);
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
  // Layout pass item 5: the card carries hero A's headline, the circled count and the red URL.
  assert.match(og, /Every week has a job that(?:&apos;|')s\s/);
  assert.match(og, /the same clicks, in the same order\./);
  assert.doesNotMatch(og, /talk to each other|I connect them/);
  assert.match(og, /\{snapshot\.totalRuns\}/);
  assert.match(og, /border: "4px solid #c4161c"/);
  // 15 Oct: the domain reads like the underlined words on the page: ink text, a hand-drawn red line under it.
  const domain = og.slice(og.indexOf(">manveen.me<") - 400, og.indexOf(">manveen.me<") + 700);
  assert.match(domain, /color: "#1d1d1d"[^>]*>manveen\.me</, "the domain is not in ink");
  assert.match(domain, /<svg[\s\S]*?<path[^>]*stroke="#c4161c"[^>]*strokeLinecap="round"/, "no pen underline under the domain");
  assert.doesNotMatch(domain, /<line|<rect/, "the underline is a straight rule, not a pen stroke");
});

test("claims and README follow the new hero and the Precise Leads entry", () => {
  const claims = read("docs/superpowers/specs/2026-10-13-claims.md");
  assert.match(claims, /Every week has a job that's the same clicks, in the same order\./);
  assert.match(claims, /his own words approved 15 Oct/);
  assert.match(claims, /Precise Leads, Nov\. 2025 to Present/);
  // The Precise Leads rows now cite his own repos, not only the old resume.
  assert.match(claims, /SHOWCASE-300-REPORT\.md/);
  assert.match(claims, /universe-to-people-at-scale\.md/);
  assert.match(claims, /Outbound, built end to end/);
  assert.match(claims, /an outbound agency/);
  const readme = read("README.md");
  assert.doesNotMatch(readme, /copy-paste work between them|talk to each other/);
  assert.doesNotMatch(read("public/favicon.svg"), /#ffd60a/);
  // 15 Oct: the favicon matches the page. The M is Archivo ExtraBold drawn as a path (a favicon can't load
  // web fonts, so <text> would fall back to Arial); the loop is a pen stroke, not a perfect ellipse.
  const fav = read("public/favicon.svg");
  assert.doesNotMatch(fav, /<text|<ellipse|<circle/, "the favicon still uses a font or a perfect shape");
  assert.match(fav, /<path[^>]*fill="#1d1d1d"[^>]*d="M75 0L75 -687/, "the M is not the Archivo ExtraBold outline");
  assert.match(fav, /<path[^>]*fill="none"[^>]*stroke="#c4161c"[^>]*stroke-linecap="round"[^>]*d="M[^"]*C/, "no hand-drawn red loop");
  assert.match(fav, /fill="#f4f1ea"/, "the paper background is gone");
  assert.ok(!built("app/favicon.ico"), "create-next-app favicon.ico still overrides the svg");
});

// ── Task 13: claims that failed the skeptic pass (docs/superpowers/specs/2026-10-13-claims.md) ──
test("the Loom link states the video's real length (281 s per Loom's oEmbed, so under 5 minutes)", () => {
  const t = text("index.html");
  assert.match(t, /Watch it work \(under 5 min\)/);
  assert.doesNotMatch(t, /\(3 min\)/);
});

test("PresentAI claims only what its code does: no export, no free plan, no live demo while its model is retired", () => {
  // 25 Oct 2026: the code has no PDF/PPTX export and every deck needs a paid account (Manveen: "it does not have export").
  const t = text("index.html");
  for (const claim of [/It's free/, /free plan/, /PowerPoint export/, /export to P/, /speaker notes/, /decks a month/]) {
    assert.doesNotMatch(t, claim);
  }
  assert.ok(!markup("index.html").includes("present-ai-007.vercel.app"), "the card links a live demo that can't generate");
});

test("PresentAI card: a typed topic, the public repo has no Python, no unsourced timing figure", () => {
  const t = text("index.html");
  assert.match(t, /Type a topic, get a first-draft slide deck you can edit\./);
  assert.doesNotMatch(t, /Paste your notes/);
  assert.match(t, /built with next\.js, postgres(?!,)/);
  assert.doesNotMatch(t, /python-pptx/);
  assert.doesNotMatch(t, /<60s/, "a timing figure with no source");
  assert.doesNotMatch(t, /2h → 15m/);
});

test("every post's read time is in line with its length", () => {
  for (const s of posts) {
    const html = markup(`writing/${s}.html`);
    const article = html.match(/<article[\s\S]*?<\/article>/)?.[0] ?? "";
    const plain = article.replace(/<[^>]+>/g, " ");
    const words = plain.split(/\s+/).filter(Boolean).length;
    const mins = Number(/(\d+)\s+min read/.exec(plain)?.[1]);
    assert.ok(mins >= Math.max(1, Math.floor(words / 260)) && mins <= Math.ceil(words / 180), `${s} says ${mins} min for ${words} words`);
  }
});

// ── Design verdicts (docs/superpowers/specs/2026-10-14-design-verdicts.md) ──
test("verdict 2: post headings have no ## marker and match the site's 800 weight", () => {
  const html = prose("schema-as-eval-spec");
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

test("every note is a plain note: the margin offsets (note-drop, note-score) are gone", () => {
  const html = markup("index.html");
  assert.ok(count(html, /<aside class="note">/) >= 5, "a note lost its plain class");
  assert.doesNotMatch(html, /note-(?:drop|score)/);
  assert.doesNotMatch(css(), /\.note-(?:drop|score)/);
});

test("verdict 4: the share card loads Archivo from real static TTF files", () => {
  const og = read("app/opengraph-image.tsx");
  assert.match(og, /Archivo-ExtraBold\.ttf/);
  assert.match(og, /Archivo-Regular\.ttf/);
  assert.match(og, /fontFamily: "Archivo"/);
  // Node runtime, not edge: the edge bundle with both fonts was ~939 KB gzipped against Vercel's 1 MB Hobby limit.
  assert.doesNotMatch(og, /runtime = "edge"/);
  assert.match(og, /readFile\(join\(process\.cwd\(\), "app\/Archivo-ExtraBold\.ttf"\)\)/);
  assert.match(og, /readFile\(join\(process\.cwd\(\), "app\/Archivo-Regular\.ttf"\)\)/);
  assert.doesNotMatch(og, /import\.meta\.url/);
  // Only weights 400 and 800 are loaded, so the name line asks for 800, not 700.
  assert.match(og, /fontSize: 28, fontWeight: 800 \}\}>Manveen Singh/);
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

test("Tender Radar tall sketch text stays readable on a 320px phone", () => {
  const proof = markup("index.html").match(/<section[^>]*id="proof"[\s\S]*?<\/section>/)?.[0] ?? "";
  const tall = proof.match(/<svg[^>]*class="sketch-tall"[^>]*>/)?.[0] ?? "";
  assert.ok(tall, "no tall sketch in the proof section");
  // The tall SVG is 320 units wide and shows about 280px wide at a 320 viewport, so 11 gave 9.6px text.
  const size = Number(/font-size="(\d+(?:\.\d+)?)"/.exec(tall)?.[1]);
  assert.ok(size >= 12, `tall radar sketch font-size is ${size}, under 12 (about 10.5px at 320)`);
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
  assert.match(work, /<div class="annotated"><div><article class="entry"><p class="small">My own project<\/p><h3 class="h3">leadlens<\/h3>/);
  const card = work.match(/<article class="entry"><p class="small">My own project<\/p><h3 class="h3">leadlens<\/h3>[\s\S]*?<\/article>/)?.[0] ?? "";
  // The story is told once, in the margin note. The old detail paragraph (and its "I hand-checked 72 postings") is gone.
  assert.doesNotMatch(text("index.html"), /It scored a perfect 100%, which was the problem/);
  assert.ok(!card.includes("I hand-checked 72 postings"), "the old detail paragraph is still in the card");
  // The only <p class="body"> in the card is the lead line, so nothing sits between it and the scorecard.
  assert.equal(count(card, '<p class="body">'), 1, "leadlens has a body paragraph besides its lead line");
  const order = ["Reads a job posting", "<table", "<caption>", "</table>", "class=\"stack\"", "class=\"links\""].map((s) => card.indexOf(s));
  assert.ok(order.every((i) => i >= 0), `a piece of the card is missing: ${order}`);
  assert.deepEqual([...order].sort((a, b) => a - b), order, "the card is not lead, table (caption first), stack, link");
  assert.match(card, /scam\.<\/p><table class="scorecard"><caption>/, "something sits between the lead line and the scorecard");
  assert.ok(!card.includes('class="metrics"'), "leadlens still has an empty metrics list");
  for (const s of ["dressed-up AI roles caught", "real jobs wrongly flagged"]) assert.ok(!card.includes(s), `old metric line "${s}" is still there`);
  // The note belongs to the card, outside the article, under it.
  assert.match(work, /<\/article><\/div><aside class="note">it once scored 100%[^<]*<\/aside><\/div>/);
});

test("the work section has two margin notes (the quote's and leadlens's) and PresentAI has none", () => {
  const work = markup("index.html").match(/<section[^>]*id="work"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.equal(count(work, /<aside class="note/), 2, "the Work section should have exactly two margin notes");
  assert.ok(work.lastIndexOf("<aside") < work.indexOf(">PresentAI<"), "PresentAI has a margin note");
});

test("PresentAI card shows a real screenshot of the live app", () => {
  const work = markup("index.html").match(/<section[^>]*id="work"[\s\S]*?<\/section>/)?.[0] ?? "";
  const card = work.match(/<article class="entry"><p class="small">My own project<\/p><h3 class="h3">PresentAI<\/h3>[\s\S]*?<\/article>/)?.[0] ?? "";
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
  const shot = styles.match(/\.shot\{[^}]*\}/)?.[0] ?? "";
  assert.match(shot, /outline:1px solid/);
  assert.match(shot, /outline-offset:-1px/);
  assert.doesNotMatch(shot, /border:|shadow|filter|blur/);
});

test("hover colours apply only on pointers that can hover, so a tap never leaves a link red", () => {
  let rest = css();
  const head = "@media (hover:hover){";
  for (let at = rest.indexOf(head); at !== -1; at = rest.indexOf(head)) {
    let depth = 1;
    let i = at + head.length;
    for (; i < rest.length && depth > 0; i++) depth += rest[i] === "{" ? 1 : rest[i] === "}" ? -1 : 0;
    rest = rest.slice(0, at) + rest.slice(i);
  }
  assert.doesNotMatch(rest, /:hover/, "a :hover rule sits outside @media (hover: hover)");
  assert.match(css(), /@media \(hover:hover\)\{[^@]*\.link:hover/);
});

test("the pilot timeline's dots take the ink colour from CSS, not a hard-coded hex", () => {
  const src = read("components/sketches/PilotSketch.tsx");
  assert.doesNotMatch(src, /(?:fill|stroke)="#/);
  assert.match(css(), /\.sketch \.dot\{[^}]*fill:var\(--ink\)/);
});

// ── Show the machine, Task 4: the problem, drawn ──────────────────────
test("hero has the week sketch: one SVG, five crossed-out days, a bracket and its red label", () => {
  const hero = markup("index.html").match(/<section[^>]*id="top"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.match(
    hero,
    /role="img" aria-label="A week of the same task: Monday to Friday, copy, paste, double-check, crossed out in red\. Runs on its own now\."/,
  );
  // Order (h1, lede, sketch, story) is checked in "the hero answers its headline first".
  const svgs = hero.match(/<svg[\s\S]*?<\/svg>/g) ?? [];
  assert.equal(svgs.length, 1, "the week sketch should be one SVG");
  const svg = svgs[0];
  assert.doesNotMatch(svg, /sketch-wide|sketch-tall/);
  assert.deepEqual([...svg.matchAll(/>(mon|tue|wed|thu|fri)</g)].map((m) => m[1]), ["mon", "tue", "wed", "thu", "fri"]);
  assert.equal(count(svg, ">copy, paste, double-check<"), 5, "one task line per day");
  // One red strike per day, plus the bracket.
  assert.equal(count(svg, 'class="mark"'), 6);
  // The red label beside the bracket reads "runs on its own now" across its lines.
  const red = [...svg.matchAll(/<text[^>]*class="red"[^>]*>([^<]*)<\/text>/g)].map((m) => m[1]).join(" ");
  assert.equal(red, "runs on its own now");
  // Readable on a 320 phone: the column is 280px there, so font-size x 280 / viewBox width must be at least 11.
  const vbw = Number(/viewBox="0 0 ([\d.]+) [\d.]+"/.exec(svg)?.[1]);
  const size = Number(/font-size="([\d.]+)"/.exec(svg)?.[1]);
  assert.ok((size * 280) / vbw >= 11, `week sketch text is ${((size * 280) / vbw).toFixed(1)}px at 320`);
  // No straight rectangles: no rect elements, and the old problem sketch is gone.
  assert.doesNotMatch(svg, /<rect/);
  assert.ok(!built("components/sketches/ProblemSketch.tsx"), "ProblemSketch.tsx is still there");
  // It never grows past the column.
  assert.match(css(), /\.sketch-week\{[^}]*max-width:(?:\d+px|100%)/);
});

test("tall sketches stop growing at 420px, and the wide ones are not capped", () => {
  const styles = css();
  assert.match(styles, /\.sketch-tall\{[^}]*max-width:420px/);
  assert.doesNotMatch(styles.match(/\.sketch-wide\{[^}]*\}/)?.[0] ?? "", /max-width/);
});

// ── Show the machine, Task 5: the offer, drawn ────────────────────────
test("pilot timeline is drawn, the steps list stays for screen readers", () => {
  const c = markup("index.html").match(/<section[^>]*id="contact"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.match(c, /<ol class="steps sr-only">/);
  assert.match(c, /class="sketch"[^>]*role="img"/);
  // Each step title is in the wide SVG and the tall SVG. "every miss logged," is also in the sketch's aria-label, so 3.
  for (const s of ["1 · a call", "2 · a fixed quote", "3 · a month, for real", "4 · you decide"]) {
    assert.equal(count(c, s), 2, `"${s}" once per layout`);
  }
  assert.equal(count(c, "every miss logged,"), 3, `"every miss logged," in both layouts and the aria-label`);
  assert.match(text("index.html"), /you see every miss, not just a score/);
  // .sr-only must hide the list from the eye but not from screen readers: display:none or
  // visibility:hidden would remove it from the accessibility tree too.
  const sr = css().match(/\.sr-only\{[^}]*\}/)?.[0] ?? "";
  assert.ok(sr, "no .sr-only rule");
  assert.match(sr, /position:absolute/);
  assert.match(sr, /clip:rect\(0,\s?0,\s?0,\s?0\)|width:1px/, "the list is not clipped to nothing");
  assert.doesNotMatch(sr, /display:none|visibility:hidden/, ".sr-only would hide the list from screen readers too");
});

// ── Show the machine, Task 6: hand-drawn dividers ─────────────────────
test("sections are divided by a hand-drawn pencil line, not a straight border", () => {
  const rule = css().match(/\.sec\{[^}]*\}/)?.[0] ?? "";
  // The pencil line is defined once, as the --divider custom property, and used by .sec and .foot.
  assert.match(rule, /background-image:var\(--divider\)/);
  assert.match(css().match(/:root\{[^}]*\}/)?.[0] ?? "", /--divider:\s?url\("?data:image\/svg\+xml/, "--divider is not defined on :root");
  assert.equal(count(css(), "data:image/svg+xml"), 1, "the divider's data URI is pasted more than once");
  assert.doesNotMatch(rule, /border-top:1px solid/);
  // .hero is a .sec too, so it must switch the pencil line off.
  assert.match(css().match(/\.hero\{[^}]*\}/)?.[0] ?? "", /background-image:none/);
});

test("the footer has the same pencil line above it", () => {
  const foot = css().match(/\.foot\{[^}]*\}/)?.[0] ?? "";
  assert.ok(foot, "no .foot rule");
  assert.match(foot, /background-image:var\(--divider\)/, "the footer has no divider");
  assert.match(foot, /background-repeat:no-repeat/);
  assert.doesNotMatch(foot, /border-top/);
});

// ── Final fix wave, item 2: the PresentAI capture is a small framed thumbnail (Manveen's pick B, 15 Oct) ──
test("the PresentAI screenshot shows as a 280px thumbnail, left-aligned, and the browser is told so", () => {
  const shot = css().match(/\.shot\{[^}]*\}/)?.[0] ?? "";
  assert.match(shot, /(?:^|[{;])width:280px/, "the screenshot is not 280px wide");
  assert.match(shot, /max-width:100%/, "a narrow phone card would push the thumbnail out");
  assert.match(shot, /outline:1px solid/);
  assert.doesNotMatch(shot, /margin:[^;}]*auto/, "the thumbnail is centred, not left-aligned");
  const work = markup("index.html").match(/<section[^>]*id="work"[\s\S]*?<\/section>/)?.[0] ?? "";
  const img = work.match(/<img[^>]*alt="PresentAI(?:'|&#x27;|&#39;)s home page"[^>]*>/)?.[0] ?? "";
  assert.ok(img, "no PresentAI screenshot");
  // sizes tells next/image the real display width, so it stops serving a 640px source to a 280px box.
  assert.match(img, /sizes="280px"/);
  // The file stays 640x400: the thumbnail is the same picture shown smaller.
  assert.match(img, /width="640"/);
  assert.match(img, /height="400"/);
});

// ── Final fix wave, item 3: one run per page ───────────────────────────
test("a summary that cannot be parsed sends the live path back to the whole saved run", () => {
  // The sketch's note says every number comes from the same run as the bars. Saved verdicts under
  // live run data, still labelled "Read live from GitHub", would break that. (lib/pipeline.ts imports
  // through the @/ alias, which plain Node cannot load, so this reads the source.)
  const src = read("lib/pipeline.ts");
  assert.match(src, /const verdicts = parseVerdicts\(md\);\s*if \(!verdicts\) return FALLBACK;/);
  assert.doesNotMatch(src, /parseVerdicts\(md\)\s*\?\?/, "a null parse is still patched with saved totals");
  assert.doesNotMatch(src, /checks: FALLBACK\.checks/);
});

// ── Final fix wave, item 4: the leadlens note points at its scorecard ──
// ── Final fix wave, item 5: even spacing on the tall pilot timeline ───
test("the tall pilot timeline has an even gap before each step and no blank tail", () => {
  const c = markup("index.html").match(/<section[^>]*id="contact"[\s\S]*?<\/section>/)?.[0] ?? "";
  const tall = c.match(/<svg[^>]*class="sketch-tall"[\s\S]*?<\/svg>/)?.[0] ?? "";
  assert.ok(tall, "no tall pilot sketch");
  const texts = [...tall.matchAll(/<text ([^>]*)>([^<]*)<\/text>/g)].map((m) => ({
    y: Number(/ y="([\d.]+)"/.exec(" " + m[1])?.[1]),
    title: /font-weight="500"/.test(m[1]),
  }));
  const titles = texts.filter((t) => t.title).map((t) => t.y);
  assert.equal(titles.length, 4, "four step titles");
  // Gap before step k+1 = its title's baseline minus the baseline of step k's last line.
  const gaps = [0, 1, 2].map((k) => titles[k + 1] - Math.max(...texts.filter((t) => t.y > titles[k] && t.y < titles[k + 1]).map((t) => t.y)));
  assert.ok(Math.max(...gaps) - Math.min(...gaps) <= 10, `gaps before steps 2, 3 and 4 are ${gaps.join(", ")}: uneven`);
  // Each dot sits on its title's line, 4 units above the baseline.
  const dots = [...tall.matchAll(/<circle [^>]*cy="([\d.]+)"/g)].map((m) => Number(m[1]));
  assert.deepEqual(dots, titles.map((y) => y - 4), "a dot is not level with its title");
  // The line stops a step's height below the last dot, and the sketch ends just under the last text.
  const lineEnd = Number(/class="ink" d="[^"]* ([\d.]+)"/.exec(tall)?.[1]);
  const lastText = Math.max(...texts.map((t) => t.y));
  assert.ok(lineEnd > lastText && lineEnd - dots[3] <= 60, `the line ends at ${lineEnd}, last dot at ${dots[3]}`);
  const viewH = Number(/viewBox="0 0 300 ([\d.]+)"/.exec(tall)?.[1]);
  assert.ok(viewH - lastText <= 30, `${viewH - lastText} units of blank under the last line`);
});

// ── Final fix wave, item 6: wide sketch text one size up ──────────────
test("the wide radar and pilot sketches draw their text at 13 or more (about 11px at 640)", () => {
  const html = markup("index.html");
  for (const id of ["proof", "contact"]) {
    const section = html.match(new RegExp(`<section[^>]*id="${id}"[\\s\\S]*?</section>`))?.[0] ?? "";
    const wide = section.match(/<svg[^>]*class="sketch-wide"[^>]*>/)?.[0] ?? "";
    assert.ok(wide, `no wide sketch in #${id}`);
    const size = Number(/font-size="(\d+(?:\.\d+)?)"/.exec(wide)?.[1]);
    assert.ok(size >= 13, `the wide sketch in #${id} has font-size ${size}: its text is 10.4px at a 640px window`);
  }
});

// ── Final fix wave, item 10: the README describes the current site ────
test("README describes the current site: short, plain, no badges, emoji, dashes or old preview", () => {
  const readme = read("README.md");
  assert.ok(readme.split("\n").filter((l) => l.trim()).length <= 30, "the README is long again");
  assert.doesNotMatch(readme, /shields\.io|og-image|Framer|Tailwind CSS 3|manveen\.vercel/i, "the old site's badges, preview or stack are still there");
  assert.doesNotMatch(readme, /\p{Extended_Pictographic}/u, "emoji in the README");
  assert.doesNotMatch(readme, /[—–]/, "em or en dash in the README");
  assert.doesNotMatch(readme, /\b(leverage|utilise|utilize|streamline|optimise|optimize|robust|seamless|cutting-edge|AI-powered|AI-driven|solutions?|honest(?:ly)?|transform)\b/i);
  assert.doesNotMatch(readme, /book a 30-minute call/i, "the README still describes the old booking button");
  for (const s of ["manveen.me", "Tender Radar", "email address", "npm run dev", "npm run build", "tests/site.test.mjs", "tests/runs.test.mjs", "tests/reveal.test.mjs", "npm run refresh-snapshot", "GITHUB_TOKEN"]) {
    assert.ok(readme.includes(s), `the README does not mention "${s}"`);
  }
});

// ── 22 Oct: two new blocks, Manveen's pick ("make sure their quirky"); claims rows 84 to 100. Home page sections
// at first; the same day he moved them into the writing ("these are the blogs"), so they are posts now. ──
/** A post's body: from the component's wrapper to the "More writing" list (or the closing links). */
const postBody = (slug) => {
  const html = markup(`writing/${slug}.html`);
  const at = html.indexOf('<div class="post-body">');
  if (at < 0) return "";
  const ends = ['<h2 class="kicker">More writing', '<p class="cta-row"'].map((s) => html.indexOf(s, at)).filter((i) => i >= 0);
  return html.slice(at, Math.min(...ends));
};

test("drawing-proof is marked like homework: the real crop, the wrong answer circled, the scores from EVAL.md", () => {
  const sec = postBody("marking-the-ais-homework");
  assert.ok(sec, "no drawing-proof post body");
  // The crop is a real PNG of the sheet, shown with its true size on the tag.
  const png = readFileSync(path.join(root, "public/work/rod-titleblock.png"));
  assert.deepEqual([...png.subarray(0, 4)], [0x89, 0x50, 0x4e, 0x47], "rod-titleblock.png is not a PNG");
  const img = sec.match(/<img[^>]*class="tb-img"[^>]*>/)?.[0] ?? "";
  assert.match(img, new RegExp(`width="${png.readUInt32BE(16)}"`));
  assert.match(img, new RegExp(`height="${png.readUInt32BE(20)}"`));
  assert.match(img, /alt="The title block of the pinion lift rod drawing: PART pinion-lift-rod, DWG\. NO\. MHA-060/);
  // Two red marks on top: a loop round the wrong answer, a line under the right one.
  const marked = sec.match(/<div class="marked">[\s\S]*?<\/svg>/)?.[0] ?? "";
  assert.equal(count(marked, 'class="mark"'), 2, "the crop does not carry its two red marks");
  const t = plain(sec);
  // EVAL.md, 26 Sep 2026, gemini-3-flash-preview: 7 wrong of 419, 316 of 326, 89 of 93, 194 of 194 plus one header row.
  for (const s of [
    "7 of 419", "answers wrong (1.7%)", "316 of 326", "89 of 93", "194 of 194",
    "that's its name, not its part number", "205 seconds", "One person labelled them: me", "scanned drawings are untested", "26 Sep 2026",
  ]) assert.ok(t.includes(s), `missing "${s}"`);
  // 22 Oct, a fresh reader's notes: the sums say how the four numbers fit (the 194 inside the 419, the header row one of
  // the 7 wrong, what "flagged" means), and 7 wrong + 7 missed or half right is the 10 short of 326 plus the 4 of 93.
  for (const s of [
    "326 where the drawing has an answer, 93 where it doesn't", "The 194 parts list fields are in there too",
    "Of the 326 with an answer it got 316: 3 wrong, 6 left blank (once with a note saying it wasn't sure), 1 half right",
    "the parts list's own header row, read as a part", "3 + 4 = the 7 wrong",
  ]) assert.ok(t.includes(s), `the sums lost "${s}"`);
  assert.equal(326 + 93, 419);
  assert.equal(3 + 6 + 1, 326 - 316); // 6 blank = 5 without a word + 1 flagged
  assert.equal(3 + (93 - 89), 7);
  // The lesson, early and at the end; "a price quote", since "quote" here also means the text a value came from.
  assert.match(text("writing/marking-the-ais-homework.html"), /fill in a price quote from an engineering drawing/);
  assert.ok(t.includes("That proves the text is on the drawing, not that it went in the right box."), "the lesson is not said early");
  assert.ok(t.includes("A quote proves the text exists, not that it went in the right box. So check the box."));
  assert.ok(t.includes("Before you trust an AI that reads your documents, answer a small batch yourself and mark its work."));
  assert.doesNotMatch(t, /hold it up against the drawing/, "the old non sequitur is back");
  // The slow runs were not all right (2 of the 6 that hit the output cap had a wrong value): never say they were.
  assert.doesNotMatch(t, /slow(?:est)? (?:runs?|ones?) (?:were|was) (?:all )?(?:right|correct)/i);
  assert.equal(count(sec, /<aside class="note">/), 2, "the section should have exactly two margin notes");
  // The sheet is marked CC BY-SA: its author, the project and the licence are named and linked.
  assert.match(t, /Drawing © 2026 Pedro Paulo Vezza Campos/);
  assert.match(sec, /href="https:\/\/github\.com\/pedropaulovc\/harmonic-analyzer"/);
  assert.match(sec, /href="https:\/\/creativecommons\.org\/licenses\/by-sa\/4\.0\/"/);
});

test("drawing-proof marks draw once, and are always drawn without JS or under reduced motion", () => {
  const styles = css();
  assert.match(styles, /\.pen-js \.marked:not\(\.in\) \.mark\{stroke-dashoffset:1(?:px)?\}/);
  assert.match(styles, /prefers-reduced-motion:reduce\)\{[^@]*\.pen-js \.marked:not\(\.in\) \.mark\{stroke-dashoffset:0\}/);
  assert.match(styles, /\.marked\{[^}]*mix-blend-mode:multiply/, "the crop is not printed on the paper");
  assert.doesNotMatch(styles.match(/\.marked\{[^}]*\}/)?.[0] ?? "", /shadow|border/);
});

test("the confidently-wrong notes: four real dates in four different months, the latest in September, none in October", () => {
  const sec = postBody("things-ai-got-confidently-wrong");
  assert.ok(sec, "no confidently-wrong post body");
  const dates = [...sec.matchAll(/<time dateTime="(\d{4}-\d{2}-\d{2})">/g)].map((m) => m[1]);
  assert.deepEqual(dates, ["2026-05-25", "2026-07-07", "2026-08-11", "2026-09-19"], "the dates moved: each one must come from a dated file or commit");
  assert.equal(new Set(dates.map((d) => d.slice(0, 7))).size, dates.length, "two notes share a month");
  assert.equal(dates.at(-1).slice(0, 7), "2026-09", "the latest note is not in September");
  assert.ok(dates.every((d) => d < "2026-10-01"), "a note is from October");
  // Each note: the AI's words as code with a red mark on the wrong part, what happened, and the lesson.
  assert.equal(count(sec, /<li class="pin">/), 4);
  assert.equal(count(sec, /<code class="exhibit">/), 4);
  assert.equal(count(sec, /class="pen pen-circle|class="pen"><span class="pen-under">/), 4, "a note lost its red mark");
  assert.equal(count(sec, "<b>What I check now:</b>"), 4);
  // It teaches; it never pitches.
  assert.doesNotMatch(sec, /mailto:|calendly|hire me|work with me|book a call|pilot|fixed price/i);
  assert.equal(count(sec, /<aside class="note/), 0, "the pinned notes carry their own red pen, not margin notes");
  // 22 Oct, a fresh reader's notes: the 11 Aug note says what Tender Radar is and what broke, in plain words
  // (commit f6eff1e6: the new profiles lacked two required fields); the 25 May note claims no proof it doesn't have.
  const t = plain(sec);
  assert.ok(t.includes("Tender Radar is my script that reads UK government tender notices every morning"), "the 11 Aug note doesn't say what Tender Radar is");
  assert.ok(t.includes("The new files were missing two details the script insists on"));
  assert.ok(t.includes("on my home page as bars"));
  assert.doesNotMatch(t, /fit the checker/, "engineer's shorthand is back in the 11 Aug note");
  assert.ok(t.includes("It doesn't make the number right by itself"), "the 25 May note implies the fix proved the score");
});

test("pinned notes sit on the paper a step darker, tilted, with no border or shadow", () => {
  const pin = css().match(/\.pin\{[^}]*\}/)?.[0] ?? "";
  assert.match(pin, /background:var\(--wash\)/);
  assert.match(pin, /rotate\(/);
  assert.doesNotMatch(pin, /shadow|border:/);
});

// ── 22 Oct: the June post trimmed to its best part, with real numbers (Manveen: "Trim to its best part, with real
// numbers"). Sources: the comment on the post in data/posts.ts; claims section K. ──
test("the June post is the eval that leaked its own answers: one title everywhere, the real numbers, a red-pen line", () => {
  const title = "How I caught my own AI test cheating, and why the lower score is the one I trust";
  const html = markup("writing/schema-as-eval-spec.html");
  assert.match(html, new RegExp(`<h1>${title}</h1>`));
  assert.ok(text("writing.html").includes(title), "the writing index shows another title");
  assert.doesNotMatch(text("writing.html"), /Full title|Schema-as-eval-spec/, "the old long title is still listed");
  const t = plain(prose("schema-as-eval-spec"));
  // 72 labelled by hand, 11 fakes and 61 real; 11 of 11 before; 31 sentences cut; 9 of 11 after, no false alarms.
  for (const s of ["72 postings by hand: 11 fakes, 61 real jobs", "It caught all 11 fakes", "31 sentences", "It caught 9 of the 11 fakes, still with no false alarms", "9 is lower, and closer to the truth"]) {
    assert.ok(t.includes(s), `missing "${s}"`);
  }
  // Its red-pen moment: the tell that gave the answer away, underlined, with a scribble.
  const ex = prose("schema-as-eval-spec").match(/<p class="pin-exhibit">[\s\S]*?<\/p>/)?.[0] ?? "";
  assert.match(ex, /<code class="exhibit"><span class="pen"><span class="pen-under">Judge must catch this<\/span><\/span><\/code>/);
  assert.ok(plain(ex).includes("that's my handwriting"));
  // It links the drawing post, in the same tab.
  assert.match(html, /<a href="\/writing\/marking-the-ais-homework" class="prose-link">Marking the AI(?:'|&#x27;)s homework<\/a>/);
  // Part 1 and the lines that read machine-written are gone.
  for (const s of ["Part 1", "confidence_reasoning", "Here's the part I didn't expect", "It made me uneasy", "It wasn't reasoning", "The order is the discipline", "Cost was never the constraint", "final-year", "literally cannot"]) {
    assert.ok(!t.includes(s), `still says "${s}"`);
  }
});

// ── 22 Oct: the writing is findable. Manveen: "a person navigating the website will never lead to the writing
// section. I want them to go to the writing section." It was only a footer link. ──
test("every page's header links Writing, plainly, beside the mail link", () => {
  for (const page of ["index.html", "writing.html", ...posts.map((s) => `writing/${s}.html`), "_not-found.html"]) {
    const head = markup(page).match(/<header[\s\S]*?<\/header>/)?.[0] ?? "";
    assert.match(head, /<nav class="head-links" aria-label="Site"><a class="head-link" href="\/writing">Writing<\/a><a class="head-cta" href="mailto:/, `${page}: no Writing link before the mail link`);
  }
  const styles = css();
  assert.match(styles, /\.head-link\{[^}]*text-decoration:none/, "Writing is underlined like the mail link");
  assert.match(styles, /\.head\{[^}]*flex-wrap:wrap/, "on a narrow phone the links would squeeze the name");
});

test("the home page lists the three newest posts after the work: a title and one line each, and all writing", () => {
  const w = markup("index.html").match(/<section[^>]*id="writing"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.match(w, /<h2 class="kicker">Writing<\/h2>/);
  const items = [...w.matchAll(/<li><a href="\/writing\/([a-z0-9-]+)"><h3 class="h3">([^<]*)<\/h3><p class="body">([^<]*)<\/p><\/a><\/li>/g)];
  // 25 Oct: the n8n testing post is the newest, so the eval post now sits behind "All writing".
  assert.deepEqual(items.map((m) => m[1]), ["149-tests-for-a-few-slack-buttons", "marking-the-ais-homework", "things-ai-got-confidently-wrong"], "not the three newest, newest first");
  assert.equal(items[0][2], "How I test an n8n workflow before it goes live");
  assert.equal(items[0][3], "My task tracker is a few Slack buttons and two n8n workflows. It has 149 tests, because of one week of green ticks.");
  assert.match(items[1][2], /^Marking the AI(?:'|&#x27;)s homework$/);
  assert.equal(items[2][2], "Things AI got confidently wrong");
  // "Not filled with balls of text": one line each, no dates, no read times, no long paragraphs.
  for (const m of items) assert.ok(m[3].length <= 140, `a long line under "${m[2]}": ${m[3].length} characters`);
  assert.doesNotMatch(w, /min read|<time/, "the list carries dates or read times");
  assert.match(w, /<a href="\/writing">All writing →<\/a>/);
  assert.doesNotMatch(w, /class="btn"|Read more|Subscribe/i, "the block pitches");
});

test("the two blocks left the home page whole: no crop, no scores, no pinned notes", () => {
  const html = markup("index.html");
  const t = text("index.html");
  for (const s of ['class="tb-img"', 'class="pins"', 'class="pin"', 'class="exhibit"', 'class="marked"']) assert.ok(!html.includes(s), `the home page still has ${s}`);
  for (const s of ["7 of 419", "316 of 326", "Pedro Paulo Vezza Campos", "What I check now", "Pinned here so I don't forget them"]) {
    assert.ok(!t.includes(s), `the home page still says "${s}"`);
  }
});

test("the writing index lists every post newest first, with the date each one shows", () => {
  const html = markup("writing.html");
  const items = [...html.matchAll(/<li><a href="\/writing\/([a-z0-9-]+)"><p class="small">([^<]*)<\/p><h2 class="h3">/g)].map((m) => [m[1], m[2]]);
  assert.deepEqual(items, [
    ["149-tests-for-a-few-slack-buttons", "25 October 2026 · 3 min read"],
    ["marking-the-ais-homework", "Marked 26 Sep 2026 · 2 min read"],
    ["things-ai-got-confidently-wrong", "Last entry 19 Sep 2026 · 2 min read"],
    ["schema-as-eval-spec", "14 June 2026 · 2 min read"],
  ]);
  // The notes post is dated by its newest note. The blocks moved here on 22 Oct keep their own dates: the only October
  // date on the writing pages is the n8n testing post's own, 25 October 2026 (written that day).
  const notes = [...postBody("things-ai-got-confidently-wrong").matchAll(/<time dateTime="([\d-]+)">/g)].map((m) => m[1]);
  assert.equal(notes.at(-1), "2026-09-19");
  for (const page of ["writing.html", ...posts.map((s) => `writing/${s}.html`)]) {
    assert.doesNotMatch(text(page).replaceAll("25 October 2026", ""), /\d+ Oct(?:ober)? 2026/, `${page} shows an October date`);
  }
});

test("the writing pages link back home, and a post links the rest of the writing, newest first", () => {
  assert.match(markup("writing.html"), /<a class="link" href="\/">← Home<\/a>/);
  for (const s of posts) {
    const post = markup(`writing/${s}.html`);
    assert.match(post, /<a class="link" href="\/writing">← all writing<\/a><a class="link" href="\/">Home<\/a><a class="link" href="\/#contact">Write to me<\/a>/);
    const more = post.slice(post.indexOf("More writing"));
    const listed = [...more.matchAll(/<a href="\/writing\/([a-z0-9-]+)">/g)].map((m) => m[1]);
    assert.deepEqual(listed, ["149-tests-for-a-few-slack-buttons", "marking-the-ais-homework", "things-ai-got-confidently-wrong", "schema-as-eval-spec"].filter((x) => x !== s), `${s}: More writing`);
  }
});

// ── 28 Oct: Vercel Web Analytics, from Manveen's screenshot of the project's Analytics "Get Started" page ──
test("every page counts its views with Vercel Web Analytics, loaded after the page", () => {
  const layout = read("app/layout.tsx");
  assert.match(layout, /import \{ Analytics \} from "@vercel\/analytics\/next";/);
  // In <body>, after the footer: the component adds its deferred script once React is running, never in <head>.
  assert.match(layout, /<Footer \/>[\s\S]*<Analytics \/>[\s\S]*<\/body>/);
  assert.ok(JSON.parse(read("package.json")).dependencies["@vercel/analytics"], "@vercel/analytics is not a dependency");
});

// ── 28 Oct: SEO. Manveen: "do complete seo and aeo of the site" ──
/** A built page's <head>. */
const headOf = (page) => read(`.next/server/app/${page}`).match(/<head[\s\S]*?<\/head>/)[0];
const tag = (head, re) => head.match(re)?.[1];

test("every page names one canonical address, and its share card points to the same one", () => {
  const pages = [["index.html", "https://manveen.me"], ["writing.html", "https://manveen.me/writing"], ...posts.map((s) => [`writing/${s}.html`, `https://manveen.me/writing/${s}`])];
  for (const [page, url] of pages) {
    const head = headOf(page);
    assert.equal(head.match(/rel="canonical"/g)?.length, 1, `${page}: canonical count`);
    assert.equal(tag(head, /<link rel="canonical" href="([^"]+)"/), url, `${page}: canonical`);
    assert.equal(tag(head, /<meta property="og:url" content="([^"]+)"/), url, `${page}: og:url`);
    assert.ok(tag(head, /<meta property="og:image" content="([^"]+)"/), `${page}: no share image`);
    assert.equal(tag(head, /<meta name="twitter:card" content="([^"]+)"/), "summary_large_image", `${page}: twitter card`);
  }
  // The writing index shares as itself, not as the home page.
  assert.equal(tag(headOf("writing.html"), /<meta property="og:title" content="([^"]+)"/), "Writing | Manveen Singh");
});

test("each post shares with its own card and title, and says so in BlogPosting JSON-LD", () => {
  for (const s of posts) {
    const html = read(`.next/server/app/writing/${s}.html`);
    const head = headOf(`writing/${s}.html`);
    const h1 = plain(markup(`writing/${s}.html`).match(/<h1>([\s\S]*?)<\/h1>/)[1]).trim();
    assert.match(tag(head, /<meta property="og:image" content="([^"]+)"/), new RegExp(`^https://manveen\\.me/writing/${s}/opengraph-image`), `${s}: card`);
    assert.equal(plain(tag(head, /<meta name="twitter:title" content="([^"]+)"/)), h1, `${s}: twitter:title`);
    assert.ok(built(`.next/server/app/writing/${s}/opengraph-image.body`), `${s}: card not built`);
    const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    assert.equal(ld["@type"], "BlogPosting");
    assert.equal(ld.headline, h1, `${s}: headline is not the page title`);
    assert.equal(ld.url, `https://manveen.me/writing/${s}`);
    assert.match(ld.datePublished, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(ld.author["@id"], "https://manveen.me/#person", `${s}: author is not the home page's Person`);
  }
  const home = JSON.parse(read(".next/server/app/index.html").match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(home["@id"], "https://manveen.me/#person");
});
