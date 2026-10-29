// The page /how-i-build (29 Oct 2026), read from the build like the other tests: build first, then
//   node --experimental-strip-types --test tests/how.test.mjs
//
// What it pins: the page is short up top and opens on a click below; the day job is described, never named;
// the copy follows the site's word rules; and the markdown copy says everything the page says and nothing else.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { HOW, FAILURES, TESTING, PIPELINE_STEPS, CLAY, LIVE } from "../data/how.ts";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFileSync(path.join(root, rel), "utf8");
const app = (rel) => read(`.next/server/app/${rel}`);
const SITE = "https://manveen.me";

const decode = (s) =>
  s.replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;|&#160;/g, " ").replace(/&amp;/g, "&");
const plain = (html) =>
  decode(html.replace(/<!--[\s\S]*?-->/g, "").replace(/<svg[\s\S]*?<\/svg>/g, "").replace(/<\/?(?:a|b|strong|i|em|span|code|small)\b[^>]*>/g, "").replace(/<[^>]+>/g, " "));
/** Arrows are drawn glyphs, not words: they go, with the space before them. */
const squash = (s) => s.replace(/[ \u00a0]?[↑↓←→↗]/g, "").replace(/\s+/g, " ").trim();
const unmark = (md) =>
  squash(md.replace(/\[((?:\\.|[^\]])*)\]\([^)]*\)/g, "$1").replace(/\\([[\]])/g, "$1").replace(/^#+ |^> ?|^- |^\d+\. /gm, "").replace(/\*|`/g, ""));

/** The page from <main> to </main>, scripts out. */
const page = () => {
  const html = app("how-i-build.html").replace(/<script[\s\S]*?<\/script>/g, "");
  return html.slice(html.indexOf("<main"), html.indexOf("</main>"));
};
const text = () => squash(plain(page()));
const md = () => app("how-i-build.md.body");

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

test("the first screen: the niche line as the one h1, what he builds, three numbers, the hardest fix", () => {
  const html = page();
  const hero = html.match(/<section[^>]*id="top"[\s\S]*?<\/section>/)[0];
  assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1);
  assert.equal(squash(plain(hero.match(/<h1>([\s\S]*?)<\/h1>/)[1])), HOW.headline);
  assert.equal((hero.match(/<dt>/g) ?? []).length, 3, "not three proof numbers");
  for (const [n] of HOW.proofs) assert.ok(hero.includes(`<dt>${n}</dt>`), `${n} is not in the first screen`);
  assert.match(squash(plain(hero)), /The hardest failure I've fixed:/);
  assert.match(hero, /href="#claygent"/, "the hardest-failure link does not open the story");
  // The page opens the story a link names (round A1: the link landed on a list of closed stories).
  assert.match(app("how-i-build.html"), /tagName===&#x27;DETAILS&#x27;|tagName==='DETAILS'/);
  // Not a wall of text: the first screen stays short.
  const words = squash(plain(hero)).split(" ").length;
  assert.ok(words <= 190, `the first screen has ${words} words`);
});

test("sections in order, each detail behind a click: three stories and the step list", () => {
  const html = page();
  const h2 = [...html.matchAll(/<h2 class="kicker">([^<]*)<\/h2>/g)].map((m) => decode(m[1]));
  assert.deepEqual(h2, ["Patterns GTM teams ask for", "Three failures I fixed", "How I test a workflow", "The whole pipeline", "Clay, in depth", "See it running", "Write to me"]);
  assert.equal((html.match(/<details class="more"/g) ?? []).length, 4);
  assert.doesNotMatch(html, /<details[^>]* open/, "a detail starts open");
  for (const s of FAILURES.stories) {
    const d = html.match(new RegExp(`<details class="more" id="${s.id}">[\\s\\S]*?</details>`))?.[0] ?? "";
    assert.ok(d, `no story ${s.id}`);
    const dts = [...d.matchAll(/<dt>([^<]*)<\/dt>/g)].map((m) => m[1]);
    assert.deepEqual(dts, ["What broke", "How I found it", "How I proved the fix", "What it changed"], `${s.id}: parts`);
  }
});

test("the day job is described, never named, and nothing points into private work", () => {
  // The employer's name is public on the home page; this page leaves it out on purpose (29 Oct decision).
  // Client names are checked outside this public repo (new 10x engineer money/showcase/tools/namecheck.py).
  for (const s of [text(), unmark(md())]) {
    assert.doesNotMatch(s, /Precise\s?Leads|preciseleads/i, "the employer is named");
    assert.doesNotMatch(s, /\bworkspace \d|\bcampaign \d{4,}|webhook\/[a-z0-9]{6,}/i, "an id slipped in");
  }
  assert.match(text(), /The code, prompts and client data stay private; on a call I can show the workflows on screen with names blurred/);
  // Round A1: "I don't name the agency" read as hiding something the resume shows; the page simply doesn't name it.
  assert.doesNotMatch(text(), /I don't name the agency/);
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
  assert.equal(PIPELINE_STEPS.steps.length, 12);
  const copy = unmark(md());
  assert.ok(copy.includes(PIPELINE_STEPS.label), "the drawing's label is not in the copy");
  assert.ok(copy.includes(PIPELINE_STEPS.note), "the red note is not in the copy");
});

test("the markdown copy has every block of the page, and the same numbers both ways", () => {
  const copy = unmark(md());
  const html = page().replace(/<svg[\s\S]*?<\/svg>/g, "");
  const blocks = [];
  for (const tag of ["p", "h1", "h2", "h3", "li", "dt", "dd"]) {
    for (const m of html.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, "g"))) {
      if (/<(?:p|h1|h2|h3|li|dt|dd|ul|ol|div)\b/.test(m[1])) continue;
      // A row of links only (Home, Writing) is checked by the links test; its words run together once tags go.
      if (!squash(plain(m[1].replace(/<a\b[\s\S]*?<\/a>/g, "")))) continue;
      const t = squash(plain(m[1]));
      if (t) blocks.push(t);
    }
  }
  for (const b of blocks) assert.ok(copy.includes(b), `not in the copy: ${b.slice(0, 80)}`);
  const nums = (s) => new Set(s.match(/\d+(?:[.,:/]\d+)*/g) ?? []);
  const pageNums = nums(text());
  // List markers ("1. ") are the page's <ol> numbering, not words.
  const mdNums = nums(md().replace(/^\d+\. /gm, "").replace(/\]\([^)]*\)/g, "]").replace(/https?:\/\/\S+|mailto:\S+/g, ""));
  for (const n of pageNums) assert.ok(mdNums.has(n), `${n} is on the page, not in the copy`);
  for (const n of mdNums) assert.ok(pageNums.has(n), `${n} is in the copy, not on the page`);
});

test("links: outside ones open in a new tab, inside ones point at pages that were built", () => {
  const html = page();
  for (const [, a] of html.matchAll(/(<a [^>]*>)/g)) {
    const href = a.match(/href="([^"]*)"/)[1];
    if (/^https?:/.test(href)) assert.match(a, /target="_blank" rel="noopener"/, `${href} opens in the same tab`);
    else if (href.startsWith("/") && !href.startsWith("/#") && href !== "/") {
      const p = href.split("#")[0];
      const built = p === "/resume.pdf" ? existsSync(path.join(root, "public/resume.pdf")) : existsSync(path.join(root, `.next/server/app${p}.html`));
      assert.ok(built, `${href} was not built`);
    }
  }
  // Every live link named in data/how.ts is on the page.
  for (const l of [...LIVE.items, ...HOW.heroLinks]) assert.ok(html.includes(`href="${l.href}"`), `${l.href} is missing`);
  // "/#proof" points at the home page's Tender Radar section, which must still exist.
  assert.match(app("index.html"), /<section id="proof"/);
});

test("the words match their sources: résumé numbers and the Loom story, as written down in data/how.ts", () => {
  const t = text();
  for (const s of ["12,030", "15,514", "78%", "34,044", "870+", "2,376", "77", "505,461", "5.1%", "2.4%", "0.5%", "28%", "2,800+", "2.7%", "0.7%", "2.1%", "8,649", "2,047", "24,506", "0.18", "95.5%"]) {
    assert.ok(t.includes(s), `${s} is missing`);
  }
  // The bounce drop is "after", never "because" (SOURCES.md caveat).
  assert.match(t, /so I say after, not because/);
  // The public repo has 45 tests; 149 is the private tracker it stands in for.
  assert.match(t, /149 automated tests/);
  assert.match(t, /a public version with 45 tests/);
  assert.equal(TESTING.items.length, 6);
  assert.equal(CLAY.items.length, 6);
  // Round A1: the Tender Radar outage in October is on the bars, so the page says what it was.
  assert.match(t, /on nine mornings since 17 October a tender portal stopped answering/);
  assert.match(t, /I haven't run Salesforce in production yet/);
});
