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
  assert.match(t, /Caprae Capital Partners · Machine Learning Intern/);
  assert.match(t, /Aug 2025 → Jan 2026/);
  assert.doesNotMatch(t, /Jun → Dec 2025/);
  assert.match(t, /Precise Leads · GTM automation engineer/);
  assert.doesNotMatch(t, /8h → 2h/);
  assert.doesNotMatch(t, /origin story/i);
});

// ── Task 6: three projects, no stale, agency or demo-data cards ────────
test("work shows resume screening, PresentAI and leadlens only", () => {
  const html = markup("index.html");
  const work = html.match(/<section[^>]*id="work"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.equal(count(work, "<article"), 3);
  const t = text("index.html");
  for (const s of ["Resume screening, automated", "PresentAI", "leadlens", "10h → 3h", "82%"]) {
    assert.ok(t.includes(s), `missing "${s}"`);
  }
  for (const s of ["Lead enrichment on autopilot", "Research-grounded writing", "deploying sep 2026", "BAY-0", "watch one", "operator-demo"]) {
    assert.ok(!t.toLowerCase().includes(s.toLowerCase()) && !html.includes(s), `still has "${s}"`);
  }
});

test("the leadlens card links to a post that was built", () => {
  assert.ok(markup("index.html").includes('href="/writing/schema-as-eval-spec"'));
  assert.ok(built(".next/server/app/writing/schema-as-eval-spec.html"));
});

// ── Task 7: what broke, quieter ────────────────────────────────────────
test("all four incidents are listed with what changed", () => {
  const broke = markup("index.html").match(/<section[^>]*id="broke"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.equal(count(broke, 'class="fix"'), 4);
  const t = text("index.html");
  assert.match(t, /When something I built breaks, I write it down\./);
  assert.match(t, /Jul 2026 · tender radar/);
  assert.match(t, /“guard” inside “safeguarding”/);
  assert.match(t, /Took my notes out, re-ran it, and published the lower number\./);
});

// ── Task 8: the whole home page follows the copy rules ─────────────────
test("sections appear in the agreed order, with no writing section on the home page", () => {
  const html = markup("index.html");
  const at = ["top", "proof", "people", "work", "broke", "contact"].map((id) => html.indexOf(`id="${id}"`));
  assert.ok(at.every((i) => i >= 0), `missing a section: ${at}`);
  assert.deepEqual([...at].sort((a, b) => a - b), at, "sections out of order");
  assert.ok(!html.includes('id="writing"'));
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
  assert.doesNotMatch(read("public/favicon.svg"), /#ffd60a/);
  assert.ok(!built("app/favicon.ico"), "create-next-app favicon.ico still overrides the svg");
});
