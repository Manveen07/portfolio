// The page /how-i-build, read from the build like the other tests: build first, then
//   node --experimental-strip-types --test tests/how.test.mjs
//
// What it pins (visual-first since the evening of 29 Oct, Manveen: "people don't have that much intrest to read wall
// of text"): the first screen is the niche line, three number tiles and the pipeline drawing, with no paragraph; each
// failure story is a chart with a one-line caption and its full text behind a click; the visible words stay under
// 40% of the earlier text version (1,334); the day job is described, never named; the markdown copy says
// everything the page says, charts included, and nothing else.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { HOW, FAILURES, PIPELINE_STEPS, VISUAL } from "../data/how.ts";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFileSync(path.join(root, rel), "utf8");
const app = (rel) => read(`.next/server/app/${rel}`);
const SITE = "https://manveen.me";

const decode = (s) =>
  s.replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;|&#160;/g, " ").replace(/&amp;/g, "&");
const plain = (html) =>
  decode(html.replace(/<!--[\s\S]*?-->/g, "").replace(/<svg[\s\S]*?<\/svg>/g, "").replace(/<\/?(?:a|b|strong|i|em|span|code|small)\b[^>]*>/g, "").replace(/<[^>]+>/g, " "));
/** Arrows are drawn glyphs, not words: they go, with the space before them. */
const squash = (s) => s.replace(/[  ]?[↑↓←→↗]/g, "").replace(/\s+/g, " ").trim();
const unmark = (md) =>
  squash(md.replace(/\[((?:\\.|[^\]])*)\]\([^)]*\)/g, "$1").replace(/\\([[\]])/g, "$1").replace(/^#+ |^> ?|^- |^\d+\. /gm, "").replace(/\*|`/g, ""));

/** The page from <main> to </main>, scripts out. */
const page = () => {
  const html = app("how-i-build.html").replace(/<script[\s\S]*?<\/script>/g, "");
  return html.slice(html.indexOf("<main"), html.indexOf("</main>"));
};
const text = () => squash(plain(page()));
const md = () => app("how-i-build.md.body");
/** Words a reader sees without opening anything: each <details> counts by its <summary>; drawings left out. */
const visibleWords = () => {
  const shown = page().replace(/<details[\s\S]*?<\/details>/g, (d) => d.match(/<summary[\s\S]*?<\/summary>/)?.[0] ?? " ");
  return squash(plain(shown)).split(" ").filter(Boolean).length;
};

test("the page and its markdown copy are built, and the head names both", () => {
  assert.ok(existsSync(path.join(root, ".next/server/app/how-i-build.html")), "run the build first");
  const head = app("how-i-build.html").match(/<head[\s\S]*?<\/head>/)[0];
  assert.match(head, /<link rel="canonical" href="https:\/\/manveen\.me\/how-i-build"\/>/);
  assert.match(head, /<meta property="og:url" content="https:\/\/manveen\.me\/how-i-build"\/>/);
  assert.match(head, /<meta property="og:image" content="https:\/\/manveen\.me\/how-i-build\/opengraph-image/);
  assert.ok(head.includes(`<link rel="alternate" type="text/markdown" href="${SITE}/how-i-build.md"/>`));
  assert.ok(head.includes('<link rel="describedby" href="/llms.txt" type="text/plain"/>'));
  assert.ok(existsSync(path.join(root, ".next/server/app/how-i-build/opengraph-image.body")), "no share card");
  assert.equal(JSON.parse(app("how-i-build.md.meta")).headers["content-type"], "text/markdown; charset=utf-8");
  assert.match(app("sitemap.xml.body"), /<loc>https:\/\/manveen\.me\/how-i-build<\/loc>/);
  assert.ok(app("llms.txt.body").includes(`](${SITE}/how-i-build.md)`), "llms.txt does not link the copy");
  assert.ok(app("llms-full.txt.body").includes(md().trim()), "llms-full.txt does not hold the copy whole");
});

test("the first screen: the niche line, three number tiles and the pipeline drawing, and no paragraph", () => {
  const hero = page().match(/<section[^>]*id="top"[\s\S]*?<\/section>/)[0];
  assert.equal((page().match(/<h1[\s>]/g) ?? []).length, 1);
  assert.equal(squash(plain(hero.match(/<h1>([\s\S]*?)<\/h1>/)[1])), HOW.headline);
  const tiles = hero.match(/<dl class="tiles">[\s\S]*?<\/dl>/)?.[0] ?? "";
  assert.deepEqual([...tiles.matchAll(/<dt>([^<]*)<\/dt>/g)].map((m) => m[1]), VISUAL.tiles.map(([n]) => n));
  assert.ok(hero.indexOf('<dl class="tiles">') < hero.indexOf('class="sketch"'), "the tiles come before the drawing");
  assert.match(hero, /<figure class="pipe">[\s\S]*class="sketch"[\s\S]*<figcaption class="cap">/);
  // No paragraph above the fold: everything the hero says in a <p> is a row of links.
  for (const [, p] of hero.replace(/<details[\s\S]*?<\/details>/g, "").replace(/<p class="kicker">[\s\S]*?<\/p>/, "").matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)) {
    assert.ok(!squash(plain(p.replace(/<a\b[\s\S]*?<\/a>/g, ""))), `a paragraph in the first screen: ${squash(plain(p)).slice(0, 60)}`);
  }
  assert.match(hero, /href="#claygent"/);
});

test("visible text is cut by at least 60% from the text version (1,334 words)", () => {
  const n = visibleWords();
  assert.ok(n <= 533, `the page shows ${n} words without a click`);
});

test("sections in order; each failure is a chart, a one-line caption, and the story behind a click", () => {
  const html = page();
  const h2 = [...html.matchAll(/<h2 class="kicker">([^<]*)<\/h2>/g)].map((m) => decode(m[1]));
  const K = VISUAL.kickers;
  assert.deepEqual(h2, [K.patterns, K.failures, K.testing, K.clay, K.live, K.contact]);
  assert.doesNotMatch(html, /<details[^>]* open/, "a detail starts open");
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
  // Visual round 1: one measure per comparison (good ones kept, before and after; then agreement, tuning set greyed).
  assert.deepEqual(rows.map((r) => (r.match(/<i class="(on|off)"/g) ?? []).length), [4, 4, 25, 30]);
  assert.deepEqual(rows.map((r) => (r.match(/class="on"/g) ?? []).length), [0, 4, 25, 30]);
  assert.deepEqual(rows.map((r) => r.match(/class="urow ?([a-z]*)"/)[1]), ["bad", "", "tuned", "main"]);
  const bars = [...html.matchAll(/<span class="blabel">([^<]*)<\/span><span class="btrack"><i class="(bar red|bar)" style="--w:([\d.]+)"/g)];
  assert.deepEqual(bars.map((b) => b[1]), ["Google", "Barracuda", "Mimecast", "My lists, before", "My lists, after", "Lists without it"]);
  assert.deepEqual(bars.map((b) => b[2]), ["bar", "bar red", "bar red", "bar", "bar", "bar"]);
  const w = bars.map((b) => Number(b[3]));
  assert.ok(Math.abs(w[3] - 2.7 / 5.1) < 0.001 && Math.abs(w[4] - 0.7 / 5.1) < 0.001 && Math.abs(w[5] - 2.1 / 5.1) < 0.001, "result bars off scale");
  assert.ok(Math.abs(w[0] / w[2] - 0.5 / 5.1) < 0.01 && Math.abs(w[1] / w[2] - 2.4 / 5.1) < 0.01, `bar lengths ${w} are not to scale`);
  // Never colour alone: each red bar says "skipped" in words.
  assert.equal((html.match(/<span class="bval">[^<]*· skipped<\/span>/g) ?? []).length, 2);
  for (const s of ["+77", "2,376", "0.5%", "2.4%", "5.1%", "505,461", "2.7%", "0.7%", "2.1%", "95.5%", "15,514"]) assert.ok(text().includes(s), `${s} is missing`);
  // Red means a gate, a failure or "skipped", never a good result.
  assert.doesNotMatch(html, /class="hit"/);
});

test("the day job is described, never named, and nothing points into private work", () => {
  // The employer's name is public on the home page; this page leaves it out on purpose (29 Oct decision).
  // Client names are checked outside this public repo (new 10x engineer money/showcase/tools/namecheck.py).
  for (const s of [text(), unmark(md())]) {
    assert.doesNotMatch(s, /Precise\s?Leads|preciseleads/i, "the employer is named");
    assert.doesNotMatch(s, /\bworkspace \d|\bcampaign \d{4,}|webhook\/[a-z0-9]{6,}/i, "an id slipped in");
  }
  assert.match(text(), /Day-job code and client data stay private/);
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

test("the drawing: twelve steps in both layouts, the four gates circled, every drawn word in the copy", () => {
  const html = page();
  const sketch = html.match(/<div class="sketch" role="img" aria-label="([^"]*)">([\s\S]*?)<\/div>/);
  assert.ok(sketch, "no pipeline drawing");
  assert.equal(decode(sketch[1]), PIPELINE_STEPS.label);
  for (const cls of ["sketch-wide", "sketch-tall"]) {
    const svg = sketch[2].match(new RegExp(`<svg class="${cls}"[\\s\\S]*?</svg>`))[0];
    const words = [...svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => decode(m[1]));
    PIPELINE_STEPS.steps.forEach((s, i) => assert.ok(words.includes(`${i + 1} ${s.name}`), `${cls}: step ${i + 1}`));
    assert.equal((svg.match(/class="mark"/g) ?? []).length, PIPELINE_STEPS.steps.filter((s) => s.gate).length, `${cls}: gates`);
  }
  const copy = unmark(md());
  assert.ok(copy.includes(PIPELINE_STEPS.label), "the drawing's label is not in the copy");
  assert.ok(copy.includes(PIPELINE_STEPS.note), "the red note is not in the copy");
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

test("links: outside ones open in a new tab, inside ones point at pages that were built", () => {
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
  }
  for (const l of [...VISUAL.live_items, ...VISUAL.heroLinks, ...VISUAL.patterns]) assert.ok(html.includes(`href="${l.href}"`), `${l.href} is missing`);
  // "/#proof" points at the home page's Tender Radar section, which must still exist.
  assert.match(app("index.html"), /<section id="proof"/);
});

test("the words match their sources: résumé numbers and the Loom story, as written down in data/how.ts", () => {
  const t = text();
  for (const s of ["12,030", "78%", "34,044", "870+", "31", "149", "45"]) assert.ok(t.includes(s), `${s} is missing`);
  const all = unmark(md());
  for (const s of ["2,800+", "28%", "8,649", "2,047", "2.1%", "17,056", "95.5%", "so I say after, not because"]) {
    assert.ok(all.includes(s), `${s} is missing from the page's full text`);
  }
  assert.match(all, /on nine mornings since 17 October a tender portal stopped answering/);
  assert.match(all, /On 29 October I made each source fail on its own, with tests/);
  assert.match(t, /Salesforce: not yet\./);
});
