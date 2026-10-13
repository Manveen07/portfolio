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

test("saved run numbers are no older than 13 Oct 2026", () => {
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
  assert.match(t, /My mornings overlap the UK, my evenings the US\./);
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
  assert.match(t, /mornings it has run on its own since 4 July 2026\./);
  assert.match(t, new RegExp(`It sorts for ${snapshot.clientProfiles} trades`));
  assert.match(t, new RegExp(`has read ${snapshot.noticesRead} notices so far`));
  assert.match(t, /Its worst stretch was about three weeks, from 21 July to 11 August/);
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
});
