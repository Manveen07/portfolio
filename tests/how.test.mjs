// The page /how-i-build, read from the build like the other tests: build first, then
//   node --experimental-strip-types --test tests/how.test.mjs
//
// What it pins (v2, 2 Nov 2026; design: the 2 Nov design doc, kept outside this public repo). Manveen, 2 Nov:
// "make sure tis page is easily undersatnble and helps us in building social proof", "they understand my skills". The
// first screen is the AI-edge h1, one sub line and the held-list card (one miss he acted on); then his agents and
// where a person approves, a habit from his own project, two day-job failures as charts with their stories behind a
// click, nine skill rows each with a receipt and a gap (the pipeline, the email story and the details behind one
// click), links a stranger can check with a dated corrections log, and how to reach him. The visible words stay at the count measured at the build; the day job is described,
// never named, and the source files name no private folder; the markdown copy says everything the page says, charts,
// drawings and cards included, and nothing else. The cards' own words and numbers are pinned in tests/proof.test.mjs.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { HOW, AGENTS, HABITS, FAILURES, EMAILS, PIPELINE_STEPS, SKILLS, NERD, LIVE, VISUAL, logSummary } from "../data/how.ts";
import { PROOF } from "../data/proof.ts";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFileSync(path.join(root, rel), "utf8");
const app = (rel) => read(`.next/server/app/${rel}`);
const SITE = "https://manveen.me";

const decode = (s) =>
  s.replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;|&#160;/g, " ").replace(/&amp;/g, "&");
const plain = (html) =>
  decode(html.replace(/<!--[\s\S]*?-->/g, "").replace(/<svg[\s\S]*?<\/svg>/g, "").replace(/<\/?(?:a|b|strong|i|em|span|code|small|s|time)\b[^>]*>/g, "").replace(/<[^>]+>/g, " "));
/** Arrows are drawn glyphs, not words: they go, with the space before them. */
const squash = (s) => s.replace(/[  ]?[↑↓←→↗]/g, "").replace(/\s+/g, " ").trim();
const unmark = (md) =>
  squash(md.replace(/\[((?:\\.|[^\]])*)\]\([^)]*\)/g, "$1").replace(/\\([[\]])/g, "$1").replace(/^#+ |^> ?|^- |^\d+\. /gm, "").replace(/\*|`/g, ""));
const words = (s) => squash(s).split(" ").filter(Boolean).length;

/** The page from <main> to </main>, scripts out. */
const page = () => {
  const html = app("how-i-build.html").replace(/<script[\s\S]*?<\/script>/g, "");
  return html.slice(html.indexOf("<main"), html.indexOf("</main>"));
};
const text = () => squash(plain(page()));
const md = () => app("how-i-build.md.body");
const section = (id) => page().match(new RegExp(`<section id="${id}" class="wrap sec[^"]*">[\\s\\S]*?</section>`))?.[0] ?? "";
/** Words a reader sees without opening anything: each <details> counts by its <summary>; drawings left out. */
const visibleWords = () => {
  const shown = page().replace(/<details[\s\S]*?<\/details>/g, (d) => d.match(/<summary[\s\S]*?<\/summary>/)?.[0] ?? " ");
  return words(plain(shown));
};
/** A drawing by its reading (the Sketch wrapper's aria-label). */
const sketch = (html, label) => {
  const at = html.indexOf(`<div class="sketch" role="img" aria-label="${label.replace(/'/g, "&#x27;")}">`);
  if (at < 0) return "";
  const end = html.indexOf("</svg></div>", at);
  return html.slice(at, end + "</svg></div>".length);
};

test("the page and its markdown copy are built, and the head names both", () => {
  assert.ok(existsSync(path.join(root, ".next/server/app/how-i-build.html")), "run the build first");
  const head = app("how-i-build.html").match(/<head[\s\S]*?<\/head>/)[0];
  assert.match(head, /<link rel="canonical" href="https:\/\/manveen\.me\/how-i-build"\/>/);
  assert.match(head, /<meta property="og:url" content="https:\/\/manveen\.me\/how-i-build"\/>/);
  assert.match(head, /<meta property="og:image" content="https:\/\/manveen\.me\/how-i-build\/opengraph-image/);
  assert.ok(head.includes(`<link rel="alternate" type="text/markdown" href="${SITE}/how-i-build.md"/>`));
  assert.ok(head.includes('<link rel="describedby" href="/llms.txt" type="text/plain"/>'));
  // The description is the h1 and the sub line (2 Nov).
  assert.ok(decode(head).includes(`<meta name="description" content="${HOW.headline} ${HOW.sub}"/>`), "the description is not the h1 and the sub line");
  assert.ok(existsSync(path.join(root, ".next/server/app/how-i-build/opengraph-image.body")), "no share card");
  assert.equal(JSON.parse(app("how-i-build.md.meta")).headers["content-type"], "text/markdown; charset=utf-8");
  assert.match(app("sitemap.xml.body"), /<loc>https:\/\/manveen\.me\/how-i-build<\/loc>/);
  assert.ok(app("llms.txt.body").includes(`](${SITE}/how-i-build.md)`), "llms.txt does not link the copy");
  assert.ok(app("llms.txt.body").includes(`for hiring managers: ${HOW.headline} How my Claude Code agents work and where a person approves`), "llms.txt's blurb is the old one");
  assert.ok(app("llms-full.txt.body").includes(md().trim()), "llms-full.txt does not hold the copy whole");
});

test("the first screen: the h1, the photo, one sub line, then the held-list card, and no other paragraph", () => {
  const hero = section("top");
  assert.equal((page().match(/<h1[\s>]/g) ?? []).length, 1);
  assert.equal(squash(plain(hero.match(/<h1>([\s\S]*?)<\/h1>/)[1])), HOW.headline);
  assert.match(hero, /<div class="hero-head"><img[^>]*alt="Manveen Singh"[^>]*class="photo"[^>]*\/?><h1>|<div class="hero-head"><img[^>]*class="photo"[^>]*alt="Manveen Singh"[^>]*\/?><h1>/, "the photo is not in the head block before the h1");
  assert.doesNotMatch(hero, /<p class="kicker">/, "a kicker is back above the h1");
  const subs = [...hero.matchAll(/<p class="how-sub">([\s\S]*?)<\/p>/g)];
  assert.equal(subs.length, 1, "not exactly one sub line");
  assert.equal(squash(plain(subs[0][1])), HOW.sub);
  assert.ok(words(HOW.sub) <= 30, "the sub line is over 30 words");
  // Review (2 Nov): the h1's limit sits on the same screen as the h1 (the eval inventory's count line), and no tool list.
  // 2 Nov: said as a measurement he made ("I counted"), not a confession.
  assert.match(HOW.sub, /I counted my 82 AI steps: 11 have a solid test, 31 a partial one, 40 none yet\.$/);
  assert.doesNotMatch(HOW.sub, /Clay, n8n and Python/, "the tool list is back in the sub line");
  const card = hero.indexOf('<article class="pc pc-full" id="held-list">');
  assert.ok(card > hero.indexOf('<p class="how-sub">'), "the held-list card does not follow the sub line");
  // The card keeps "90% bar" on one line with a no-break space (review 2).
  assert.match(hero.replace(/ /g, " "), new RegExp(`<h2 class="h3">${PROOF["held-list"].title}</h2>`), "the card's title is not an h2 styled as h3");
  // No paragraph outside the card and the sub line: anything else the hero says in a <p> is a row of links.
  const rest = hero.replace(/<article class="pc[\s\S]*?<\/article>/g, "").replace(/<p class="how-sub">[\s\S]*?<\/p>/, "");
  for (const [, p] of rest.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)) {
    assert.ok(!squash(plain(p.replace(/<a\b[\s\S]*?<\/a>/g, ""))), `a paragraph in the first screen: ${squash(plain(p)).slice(0, 60)}`);
  }
  for (const l of VISUAL.heroLinks) assert.ok(hero.includes(`href="${l.href}"`), `the hero has no link to ${l.href}`);
});

const VISIBLE_CAP = 749;

test("visible words stay at the count measured at the build", (t) => {
  // 2 Nov, v2: 844 measured with the design's full copy; the session's call was to apply its cut order (section 15,
  // all six steps) to about 750 or fewer ("easily undersatnble"), keeping every skills gap and every caveat. Measured
  // after the cuts: 740. After the five reviews' truth and clarity fixes, trimmed (2 Nov): 749. Adding words means
  // cutting some.
  const n = visibleWords();
  t.diagnostic(`visible words: ${n}`);
  assert.ok(n <= VISIBLE_CAP, `the page shows ${n} words without a click`);
});

test("short blocks: no visible paragraph over 30 words outside a card, and each card under its cap", () => {
  const html = page();
  const outside = html.replace(/<article class="pc[\s\S]*?<\/article>/g, "").replace(/<details[\s\S]*?<\/details>/g, "");
  for (const [, , inner] of outside.matchAll(/<(p|li|dd)\b[^>]*>([\s\S]*?)<\/\1>/g)) {
    // A list item that holds blocks (a skill row) is checked through its own paragraphs.
    if (/<(?:p|h3|div)\b/.test(inner)) continue;
    const n = words(plain(inner));
    assert.ok(n <= 30, `a ${n}-word block: ${squash(plain(inner)).slice(0, 60)}`);
  }
  // Full card: 133 on 1 Nov, plus the limit line (2 Nov); 158 since the reviews (2 Nov) named the reviewer and what
  // wasn't sampled, and reworded the first struck line. Compact: the largest compact card on the site (home).
  for (const [a, cls] of html.matchAll(/<article class="pc (pc-full|pc-compact)"[\s\S]*?<\/article>/g)) {
    const n = words(plain(a));
    assert.ok(n <= (cls === "pc-full" ? 158 : 118), `a ${cls} card shows ${n} words`);
  }
});

test("sections in order: agents, habits, failures, skills, live, contact, each holding its own picture", () => {
  const html = page();
  const h2 = [...html.matchAll(/<h2 class="kicker">([^<]*)<\/h2>/g)].map((m) => decode(m[1]));
  const K = VISUAL.kickers;
  assert.deepEqual(h2, [K.agents, K.habits, K.failures, K.skills, K.live, K.contact]);
  assert.ok(sketch(section("agents"), AGENTS.label), "#agents does not hold the agents drawing");
  assert.deepEqual([...section("habits").matchAll(/<article class="habit" id="([^"]+)">/g)].map((m) => m[1]), HABITS.map((h) => h.id));
  const skills = section("skills");
  assert.deepEqual([...skills.matchAll(/<li id="([^"]+)" class="skill">/g)].map((m) => m[1]), SKILLS.map((s) => s.id));
  assert.match(skills, /<ul class="skills">/);
  const nerd = [...skills.matchAll(/<details[\s\S]*?<\/details>/g)];
  assert.equal(nerd.length, 1, "#skills should hold one click");
  assert.equal(squash(plain(nerd[0][0].match(/<summary>([\s\S]*?)<\/summary>/)[1])), NERD.summary);
  assert.ok(sketch(nerd[0][0], PIPELINE_STEPS.label), "the pipeline drawing is not inside the skills click");
  // Cut 1: the email story sits in the same click, its chart and four parts open with it.
  const email = nerd[0][0].match(/<article id="identity" class="storycard nerd-story">[\s\S]*?<\/article>/)?.[0] ?? "";
  assert.ok(email, "the email story is not inside the skills click");
  assert.equal(EMAILS.id, "identity");
  assert.match(email, /<figure class="chart" role="img" aria-label="[^"]{40,}"/);
  const parts = email.match(/<dl class="story">[\s\S]*?<\/dl>/)?.[0] ?? "";
  assert.deepEqual([...parts.matchAll(/<dt>([^<]*)<\/dt>/g)].map((m) => m[1]), ["What broke", "How I found it", "How I proved the fix", "What it changed"]);
  assert.ok(!html.includes('<article id="identity" class="storycard">'), "the email story is back among the failures");
  assert.doesNotMatch(html, /<details[^>]* open/, "a detail starts open");
  for (const id of ["proof", "pipeline", "testing", "clay"]) assert.ok(!html.includes(`<section id="${id}"`), `the old #${id} section is back`);
  for (const s of FAILURES.stories) {
    const card = html.match(new RegExp(`<article id="${s.id}" class="storycard">[\\s\\S]*?</article>`))?.[0] ?? "";
    assert.ok(card, `no card for ${s.id}`);
    assert.match(card, /<figure class="chart[^"]*" role="img" aria-label="[^"]{40,}"/, `${s.id}: no chart with a reading`);
    const caption = squash(plain(card.match(/<p class="cap">([\s\S]*?)<\/p>/)?.[1] ?? ""));
    assert.ok(caption && caption.split(" ").length <= 25, `${s.id}: caption is missing or long (${caption})`);
    assert.match(card, /<summary><span class="more-line more-label">How it actually went<\/span>/);
    const story = card.match(/<details[\s\S]*?<\/details>/)?.[0] ?? "";
    const dts = [...story.matchAll(/<dt>([^<]*)<\/dt>/g)].map((m) => m[1]);
    assert.deepEqual(dts, ["What broke", "How I found it", "How I proved the fix", "What it changed"], `${s.id}: parts`);
  }
});

test("the charts show the published numbers, with red only where it means something and words beside it", () => {
  const html = page().replace(/<!--[\s\S]*?-->/g, "");
  const units = html.match(/<figure class="chart units"[\s\S]*?<\/figure>/)[0];
  const rows = [...units.matchAll(/<div class="urow[^"]*"[\s\S]*?<\/div>/g)].map((m) => m[0]);
  // One measure per comparison: good ones kept, before and after (the tuning set, greyed), then the 30 he labelled
  // after reading the model's answers (greyed too, and said in the row's own label since 2 Nov).
  assert.deepEqual(rows.map((r) => (r.match(/<i class="(on|off)"/g) ?? []).length), [4, 4, 18]);
  assert.deepEqual(rows.map((r) => (r.match(/class="on"/g) ?? []).length), [0, 4, 18]);
  assert.deepEqual(rows.map((r) => r.match(/class="urow ?([a-z]*)"/)[1]), ["bad", "tuned", "tuned"]);
  assert.match(decode(rows[2]), /<span class="ulabel">[^<]*labelled after its answers[^<]*<\/span>/);
  const bars = [...html.matchAll(/<span class="blabel">([^<]*)<\/span><span class="btrack"><i class="(bar red|bar)" style="--w:([\d.]+)"/g)];
  assert.deepEqual(bars.map((b) => decode(b[1])), ["Google", "Barracuda", "Mimecast", "Mine, before (8,649 leads)", "Mine, after (2,047 leads)", "Teammate's, before", "Teammate's, after"]);
  assert.deepEqual(bars.map((b) => b[2]), ["bar", "bar red", "bar red", "bar", "bar", "bar", "bar"]);
  const all = [...VISUAL.stories.bounces.bars, ...VISUAL.stories.bounces.result];
  bars.forEach((b, i) => assert.ok(Math.abs(Number(b[3]) - all[i].value / 5.1) < 0.001, `${all[i].label}: bar off the 5.1 scale`));
  // Never colour alone: each red bar says "skipped" in words.
  assert.equal((html.match(/<span class="bval">[^<]*· skipped<\/span>/g) ?? []).length, 2);
  for (const s of ["+77", "2,376", "0.5%", "2.4%", "5.1%", "505,461", "2.74%", "0.73%", "2.26%", "2.09%", "8,649", "2,047"]) assert.ok(text().includes(s), `${s} is missing`);
  // Red means a gate, a failure or "skipped", never a good result.
  assert.doesNotMatch(html, /class="hit"/);
});

test("retired claims stay off the page and its copy", () => {
  // EVALS, 31 Oct: the Claygent "30 it had never seen" and "25 of 25", "124 of 124", the gate rules and "every email".
  // 2 Nov: the follow-up agents never "every morning" or Slack cards; the held-list labels were Claude's, never hand
  // labels; the agency's sends, never "I sent"; no 870+, 95.5% or "nine mornings"; no "toy".
  for (const s of [text(), unmark(md())]) {
    assert.doesNotMatch(
      s,
      /never s(?:een|aw)|30 of 30|25 of 25|124 of 124|nothing moves on|had to match|hand-labelled 25|live only after|label 25 to 30|check every email|every email vs|only now/i,
    );
    assert.doesNotMatch(s, /Slack (?:button|card)/i);
    assert.doesNotMatch(s, /\bI sent\b/);
    assert.doesNotMatch(s, /\b870\+|95\.5%|nine mornings|\btoy\b/i);
    assert.doesNotMatch(s, /\bhand[- ]?(?:read|labell?ed|checked)\b.{0,80}\b4[37] of 50\b|\b4[37] of 50\b.{0,80}\bhand[- ]?(?:read|labell?ed|checked)\b/i);
    for (const [, after] of s.matchAll(/0\.73%(.{0,60})/g)) assert.doesNotMatch(after, /(?<!not )\bbecause\b/, "a because after the bounce drop");
  }
  assert.doesNotMatch(squash(plain(section("agents"))), /\bevery morning\b/i);
});

test("the day job is described, never named, and nothing points into private work", () => {
  // The employer's name is public on the home page; this page leaves it out on purpose (29 Oct decision).
  // Client names are checked outside this public repo (his private name check).
  for (const s of [text(), unmark(md())]) {
    assert.doesNotMatch(s, /Precise\s?Leads|preciseleads/i, "the employer is named");
    assert.doesNotMatch(s, /\bworkspace \d|\bcampaign \d{4,}|webhook\/[a-z0-9]{6,}/i, "an id slipped in");
  }
  assert.match(text(), /Day-job code stays private/);
});

test("the source files name no private folder (the public repo's code comments too)", () => {
  // 2 Nov (goal 8): the comments used to name the private repos' folders and an application company. The employer's
  // name is already public on the home page; client and application-company names are checked privately.
  const files = [
    "data/how.ts",
    "data/proof.ts",
    "lib/md/how.ts",
    "components/HowCharts.tsx",
    "components/HabitRow.tsx",
    "components/SkillRows.tsx",
    "components/FixLog.tsx",
    ...readdirSync(path.join(root, "components/sketches")).map((f) => `components/sketches/${f}`),
    ...readdirSync(path.join(root, "app/how-i-build")).filter((f) => f.endsWith(".tsx")).map((f) => `app/how-i-build/${f}`),
  ];
  // Review (2 Nov): the v2 design doc named private folders and was committed; it now lives outside this public repo,
  // and any design doc from 2 Nov on is scanned like the source.
  const specs = path.join(root, "docs/superpowers/specs");
  if (existsSync(specs)) files.push(...readdirSync(specs).filter((f) => f.endsWith(".md") && f >= "2026-11-02").map((f) => `docs/superpowers/specs/${f}`));
  const PRIVATE = /preciseleads|money[\\/]|new 10x engineer|runs[\\/]20\d\d|EVALS-20\d\d|CAN-CLAIM|PITCH\.md|DESIGN-PLAN|frontier-clay-ops|LOOM-TRANSCRIPT|gold-n5|history\.csv|\/mnt\/c\//i;
  for (const f of files) {
    const hit = read(f).match(PRIVATE);
    assert.ok(!hit, `${f} names a private path: ${hit?.[0]}`);
  }
});

test("the site's word rules: no dashes, no sales words, no superlatives", () => {
  for (const s of [text(), md()]) {
    assert.doesNotMatch(s, /[—–]/, "em or en dash");
    assert.doesNotMatch(
      s,
      /\b(leverage|utilise|utilize|streamline|optimise|optimize|robust|seamless|cutting-edge|AI-powered|AI-driven|solutions?|honest(?:ly)?|transform|expert|world-class|10x|obsessed|rockstar|ninja|guru|passionate)\b/i,
    );
  }
});

test("the drawings: every step in both layouts, the gates circled, every drawn word in the copy", () => {
  const copy = unmark(md());
  const check = (html, label, steps, note, marks) => {
    const s = sketch(html, label);
    assert.ok(s, `no drawing: ${label.slice(0, 40)}`);
    for (const cls of ["sketch-wide", "sketch-tall"]) {
      const svg = s.match(new RegExp(`<svg class="${cls}"[\\s\\S]*?</svg>`))[0];
      const drawn = [...svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => decode(m[1]));
      steps.forEach((st, i) => assert.ok(drawn.includes(`${i + 1} ${st.name}`), `${cls}: step ${i + 1}`));
      assert.equal((svg.match(/class="mark"/g) ?? []).length, marks, `${cls}: red loops`);
      // The numbered steps are in the reading; every other drawn word (lanes, notes) is in the copy as drawn.
      for (const w of drawn.filter((d) => !/^\d+ /.test(d))) assert.ok(copy.includes(w), `${cls}: "${w}" is drawn but not in the copy`);
    }
    assert.ok(copy.includes(label), "the drawing's reading is not in the copy");
    assert.ok(copy.includes(note), "the red note is not in the copy");
  };
  // The pipeline sits inside the skills click since 2 Nov, with three steps in plain words.
  check(section("skills"), PIPELINE_STEPS.label, PIPELINE_STEPS.steps, PIPELINE_STEPS.note, 4);
  assert.deepEqual(PIPELINE_STEPS.steps.map((s) => s.name).filter((n) => /qualify|list QA|spintax/.test(n)), []);
  // Me and my agents: six steps, one red loop (the person who approves) per drawing.
  check(section("agents"), AGENTS.label, AGENTS.steps, AGENTS.note, 1);
});

test("the markdown copy has every block and every chart reading of the page, and the same numbers both ways", () => {
  const copy = unmark(md());
  const html = page().replace(/<svg[\s\S]*?<\/svg>/g, "");
  const blocks = [];
  for (const tag of ["p", "h1", "h2", "h3", "li", "dt", "dd", "figcaption"]) {
    for (const m of html.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, "g"))) {
      if (/<(?:p|h1|h2|h3|li|dt|dd|ul|ol|div|dl|figure)\b/.test(m[1])) continue;
      // A row of links only (Home, Writing) is checked by the links test; its words run together once tags go.
      if (!squash(plain(m[1].replace(/<a\b[\s\S]*?<\/a>/g, "")))) continue;
      const t = squash(plain(m[1]));
      if (t) blocks.push(t);
    }
  }
  for (const b of blocks) assert.ok(copy.includes(b), `not in the copy: ${b.slice(0, 80)}`);
  for (const [, label] of html.matchAll(/<figure class="chart[^"]*" role="img" aria-label="([^"]*)"/g)) {
    assert.ok(copy.includes(squash(decode(label))), `chart reading not in the copy: ${label.slice(0, 60)}`);
  }
  const nums = (s) => new Set(s.match(/\d+(?:[.,:/]\d+)*/g) ?? []);
  // The page's own numbers include those its charts read out (aria-labels); the copy prints them as sentences.
  const pageNums = nums(text() + " " + [...page().matchAll(/aria-label="([^"]*)"/g)].map((m) => decode(m[1])).join(" "));
  // List markers ("1. ") are the page's <ol> numbering, not words.
  const mdNums = nums(md().replace(/^\d+\. /gm, "").replace(/\]\([^)]*\)/g, "]").replace(/https?:\/\/\S+|mailto:\S+/g, ""));
  for (const n of pageNums) assert.ok(mdNums.has(n), `${n} is on the page, not in the copy`);
  for (const n of mdNums) assert.ok(pageNums.has(n), `${n} is in the copy, not on the page`);
});

test("links: outside ones open in a new tab, inside ones point at pages that were built, every anchor resolves", () => {
  const html = page();
  for (const [, a] of html.matchAll(/(<a [^>]*>)/g)) {
    const href = a.match(/href="([^"]*)"/)[1];
    if (!/^https?:/.test(href)) assert.doesNotMatch(a, /target="_blank"/, `${href} opens a new tab`);
    if (/^https?:/.test(href)) assert.match(a, /target="_blank" rel="noopener"/, `${href} opens in the same tab`);
    else if (href.startsWith("#")) assert.ok(html.includes(`id="${href.slice(1)}"`), `${href} points at nothing`);
    else if (href.startsWith("/") && !href.startsWith("/#") && href !== "/") {
      const p = href.split("#")[0];
      const built = p === "/resume.pdf" ? existsSync(path.join(root, "public/resume.pdf")) : existsSync(path.join(root, `.next/server/app${p}.html`));
      assert.ok(built, `${href} was not built`);
    }
    // An arrow-only link says where it goes.
    const inner = html.slice(html.indexOf(a) + a.length).split("</a>")[0];
    if (!squash(plain(inner))) assert.match(a, /aria-label="[^"]+"/, `${href}: an arrow-only link with no label`);
  }
  const want = [
    ...LIVE.items.flatMap((l) => [l, ...(l.extra ? [l.extra] : [])]),
    ...VISUAL.heroLinks,
    ...HABITS.map((h) => h.link),
    ...LIVE.log.flatMap((e) => (e.link ? [e.link] : [])),
    ...SKILLS.flatMap((s) => (s.to ? [s.to] : [])),
  ];
  for (const l of want) assert.ok(html.includes(`href="${l.href}"`), `${l.href} is missing`);
  for (const id of ["skills", "live", "agents", "habits", "claygent", "bounces", "live-champion", "corrections"]) assert.ok(html.includes(`id="${id}"`), `no #${id}`);
  // "/#proof" points at the home page's Tender Radar section, which must still exist.
  assert.match(app("index.html"), /<section id="proof"/);
  // The deep-link helper ships: a link to a log entry opens its click.
  assert.ok(read("app/how-i-build/page.tsx").includes("<OpenOnHash />"));
});

test("the words match their sources, as written down in data/how.ts", () => {
  const t = text();
  for (const s of ["Salesforce: not yet.", "34,044", "24,506", "505,461", "two AIs agreeing"]) assert.ok(t.includes(s), `${s} is missing`);
  const all = unmark(md());
  for (const s of ["2,800+", "28%", "8,649", "2,047", "16,728", "12,030", "15,514", "872", "149", "45", "so I say after, not because"]) {
    assert.ok(all.includes(s), `${s} is missing from the page's full text`);
  }
  assert.match(all, /in one batch, verified emails for 12,030 of 15,514 decision makers \(78%\)/i, "78% is not said as one batch");
  // Review (2 Nov): the Claygent bar names all four checks, and the relabelled passes are three, not one.
  const claygent = FAILURES.stories.find((s) => s.id === "claygent");
  assert.match(claygent.tested, /no good company thrown out, 80% agreement with the labels, at most 20% sent to a person for review, and 90% of yeses backed by a quote/);
  assert.match(claygent.tested, /This segment, like two others, only cleared it after I changed borderline companies' labels to toss-ups/);
  assert.match(claygent.tested, /27 of the 29 it decided/);
  // The held list's reviewer is named in the card's limit line and on the share card.
  assert.match(PROOF["held-list"].limit, /the Claude session that wrote the rubric[\s\S]*two AIs agreeing[\s\S]*Companies the agents dropped weren't sampled/);
  assert.match(VISUAL.share[1], /the Claude session that wrote the rubric/);
});

test("the review's retired wordings stay off the page and its copy (2 Nov)", () => {
  // Each was a line the five reviews proved wrong or unclear; the fix is in data/how.ts with its reason.
  for (const s of [text(), unmark(md())]) {
    assert.doesNotMatch(s, /\b2 of (?:the )?5 segments cleared\b|a third only after a relabel/i, "the old Claygent count");
    assert.doesNotMatch(s, /quote a script couldn't find on the saved page|a quote that a script finds in the saved page/i, "the API route's quote check, said of Claygent");
    assert.doesNotMatch(s, /no two sends read the same|Fix it once, fixed everywhere|mostly real cases|I replay the past/i);
    assert.doesNotMatch(s, /skipping is the default|If no website shows that two domains belong together/i);
    assert.doesNotMatch(s, /update HubSpot contact properties|Salesforce in production|sends a company into Clay by webhook and gets/i, "a sync or a caller in the present tense");
    assert.doesNotMatch(s, /I'll demo it|daily runs sit on my home page|fake AI job judge|a cheap AI judge's key/i);
  }
  // Step 6 of the agents drawing is the tool, not the person.
  assert.equal(AGENTS.steps.at(-1).lane, "tool");
  assert.match(AGENTS.steps.at(-1).name, /tool/);
});

// ── 2 Nov: the new sections' data rules ─────────────────────────────────
test("skills: nine rows, a receipt and a gap each, no tool-list titles", () => {
  // Eight in the design, plus the email row from cut 1; the level pills went in cut 5.
  assert.equal(SKILLS.length, 9);
  assert.equal(new Set(SKILLS.map((s) => s.id)).size, SKILLS.length, "two rows share an id");
  for (const s of SKILLS) {
    assert.ok(!("level" in s), `${s.id}: a level pill is back`);
    assert.ok(s.gap.trim(), `${s.id}: no gap`);
    assert.doesNotMatch(s.title, /,/, `${s.id}: the title is a tool list`);
    if (s.id !== "skill-sql") assert.match(s.proof ?? "", /\d|\]\(/, `${s.id}: the receipt has no number and no link`);
  }
  // SQL claims nothing (design section 12.2); CRM stays at the one sync.
  const sql = SKILLS.find((s) => s.id === "skill-sql");
  assert.equal(sql.proof, undefined);
  assert.equal(sql.gap, "Nothing to show yet.");
  assert.match(SKILLS.find((s) => s.id === "skill-crm").proof, /^One sync: /);
  // The gaps sit in the same visual unit as the receipts they qualify (section 12.3).
  const row = (id) => squash(plain(section("skills").match(new RegExp(`<li id="${id}" class="skill">[\\s\\S]*?</li>`))?.[0] ?? ""));
  // Review (2 Nov): on the final prompt's first scoring no segment cleared; three did after relabels, two never.
  assert.match(row("skill-clay"), /24,506[\s\S]*No segment cleared my full bar until I relabelled borderline companies; then three did\. The other two still ran: the run never checked the gate\./);
  assert.match(row("skill-python"), /74%, 81%, 65%[\s\S]*AI agents wrote the labels, on made-up data\./);
  assert.match(row("skill-n8n"), /40 live workflows \(the 14 Oct count\)/);
  // The full 82-step line is the sub line under the h1 (review, 2 Nov); the row keeps the gap.
  assert.match(row("skill-evals"), /40 of my 82 AI steps have no test yet\./);
  assert.ok(section("skills").includes('href="#held-list"'), "the evals row does not link the held list");
  assert.ok(section("skills").includes('href="#identity"'), "the email row does not link its story");
});

test("habits: each one circles a number, says who checked it, and the leadlens score needs a re-run", () => {
  // Cut 6: the drawings habit is on the home page only (its proof card is there).
  assert.deepEqual(HABITS.map((h) => h.id), ["habit-perfect-score"]);
  for (const h of HABITS) {
    assert.ok(h.exhibit.circled, `${h.id}: nothing circled`);
    assert.match(h.checked, /^checked against: /, `${h.id}: who checked it`);
  }
  const leadlens = HABITS.find((h) => h.id === "habit-perfect-score");
  assert.match(leadlens.exhibit.rest ?? "", /re-run/);
  assert.match(leadlens.cap, /two more leaks/);
  const card = section("habits").match(/<article class="habit" id="habit-perfect-score">[\s\S]*?<\/article>/)?.[0] ?? "";
  assert.ok(card.includes('<s class="pen-strike">11 of 11 caught</s>'.replace(/ of /g, " of ")), "11 of 11 is not struck through");
  // The circle and "needs a re-run" share one unbreakable line.
  assert.match(card, /<span class="pc-nb"><span class="pen pen-circle">9 of 11<svg[\s\S]*?<\/svg><\/span>, needs a re-run<\/span>/);
});

test("the corrections log: newest first, dated anchors, the summary names the newest date", (t) => {
  const log = LIVE.log;
  for (let i = 1; i < log.length; i++) assert.ok(log[i - 1].date >= log[i].date, `${log[i].id} is out of order`);
  for (const e of log) {
    assert.match(e.id, /^log-\d{4}-\d{2}-\d{2}-[a-z0-9-]+$/);
    assert.ok(e.id.startsWith(`log-${e.date}-`), `${e.id} does not carry its date ${e.date}`);
  }
  const live = section("live");
  const details = live.match(/<details class="more" id="corrections">[\s\S]*?<\/details>/)?.[0] ?? "";
  assert.ok(details, "no corrections click");
  assert.equal(squash(plain(details.match(/<summary>([\s\S]*?)<\/summary>/)[1])), logSummary());
  assert.match(logSummary(), /\(newest: \d{1,2} [A-Z][a-z]{2}\)$/);
  assert.deepEqual([...details.matchAll(/<li id="([^"]+)">/g)].map((m) => m[1]), log.map((e) => e.id));
  assert.deepEqual([...details.matchAll(/<time dateTime="([\d-]+)">/g)].map((m) => m[1]), log.map((e) => e.date));
  // A quiet month never blocks a deploy, but a stale log gets said out loud.
  const days = (Date.now() - Date.parse(log[0].date)) / 86_400_000;
  if (days > 21) t.diagnostic(`the corrections log's newest entry is ${Math.floor(days)} days old: is there a correction to record?`);
});

const css = () => {
  const dir = path.join(root, ".next/static/chunks");
  return readdirSync(dir).filter((f) => f.endsWith(".css")).map((f) => readFileSync(path.join(dir, f), "utf8")).join("\n");
};

test("red discipline: skills, habit tags, the log, the limit line and the live command are ink", () => {
  const styles = css();
  for (const [, sel, body] of styles.matchAll(/([^{}]*(?:\.skill|\.habit-tag|\.fixlog|\.pc-limit|\.linkgrid code)[^{}]*)\{([^}]*)\}/g)) {
    assert.doesNotMatch(body, /--red|#c4161c/i, `${sel.trim()} paints red`);
  }
  // No inline red on the page outside the pen, and no red post links (Inline's prose-link) on this page.
  for (const id of ["skills", "live", "agents", "habits", "contact"]) {
    const html = section(id).replace(/<details[\s\S]*?<\/details>/g, "");
    assert.doesNotMatch(html, /style="[^"]*(?:#c4161c|rgb\(196, ?22, ?28\)|var\(--red\))/i, `#${id}: an inline red style`);
  }
  assert.doesNotMatch(page(), /class="prose-link"/, "a red post link on this page");
  assert.doesNotMatch(section("live"), /<code style=/, "the command is styled through Inline (red)");
  // The struck and circled habit numbers, the agents' gate loop and the Claygent rings are the pen's.
  assert.match(styles, /\.sketch \.lane\{[^}]*stroke:var\(--rule\)/);
});
