// The proof cards (1 Nov 2026), read from the build like the other tests: build first, then
//   node --experimental-strip-types --test tests/proof.test.mjs
//
// Manveen, 1 Nov: "i think use the visual idea also on the website make it easily undrersatndble" and "i want my things
// to build proofs and they should be able to eaily undersatnd". Each card is one story: what broke (struck through in
// red), the check, and the measured result (circled in red), in real text.
//
// What it pins: each card's title and its exact set of numbers (each one passed claims_check.py --strict-numbers in
// new 10x engineer\runs\2026-11-01-job-agent\site-visuals\claims\, outside this repo), the application cards' banned
// words, the retired eval claims on both pages and their copies, where the cards sit, and that a card is evidence on
// the paper: no border, no shadow, no tilt, and red only through the pen.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PROOF, HOME_CARDS, HOW_CARDS, HOME_BAND, stepLine } from "../data/proof.ts";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFileSync(path.join(root, rel), "utf8");
const app = (rel) => read(`.next/server/app/${rel}`);

const decode = (s) =>
  s.replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;|&#160;/g, " ").replace(/&amp;/g, "&");
const plain = (html) =>
  decode(html.replace(/<!--[\s\S]*?-->/g, "").replace(/<svg[\s\S]*?<\/svg>/g, "").replace(/<\/?(?:a|b|strong|i|em|span|code|small|s)\b[^>]*>/g, "").replace(/<[^>]+>/g, " "));
const squash = (s) => s.replace(/[  ]?[↑↓←→↗]/g, "").replace(/\s+/g, " ").trim();
const unmark = (md) =>
  squash(md.replace(/\[((?:\\.|[^\]])*)\]\([^)]*\)/g, "$1").replace(/\\([[\]])/g, "$1").replace(/^#+ |^> ?|^- |^\d+\. /gm, "").replace(/\*|`/g, ""));

/** A built page from <main> to </main>, scripts out. */
const page = (file) => {
  const html = app(file).replace(/<script[\s\S]*?<\/script>/g, "");
  return html.slice(html.indexOf("<main"), html.indexOf("</main>"));
};
const home = () => page("index.html");
const how = () => page("how-i-build.html");
const cardHtml = (html, slug) => html.match(new RegExp(`<article class="pc pc-(?:full|compact)" id="${slug}">[\\s\\S]*?</article>`))?.[0] ?? "";

/** Every word a card holds, the way the site can show it. */
const cardText = (c) =>
  [c.eyebrow, c.title, c.before.label, ...c.before.lines, c.before.note, ...c.steps.flatMap((s) => [s.name, s.sub, s.note ?? ""]), `circled: ${c.circledLabel}`, c.footer, ...c.links.map((l) => l.label)].join("\n");
const numbers = (s) => [...new Set(s.match(/\d+(?:[.,]\d+)*%?/g) ?? [])].sort();

// ── 1. The data ─────────────────────────────────────────────────────────
const PINNED = {
  "held-list": {
    title: "My AI check missed my 90% bar, so I held the list",
    numbers: ["3", "4", "7", "43", "47", "50", "86%", "90%", "94%", "504"],
    circles: ["86%", "94%"],
  },
  "caught-my-own-test": {
    title: "I caught my own AI test cheating, and published the lower score",
    numbers: ["9", "11", "31", "61", "72"],
    circles: ["9 of 11 caught"],
  },
  "labelled-drawings": {
    title: "I labelled 23 drawings, then marked the AI's work",
    numbers: ["1", "7", "23", "89", "93", "194", "419"],
    circles: ["7 wrong of 419"],
  },
};

test("the site has exactly the three checked cards, each with its pinned title, numbers and circles", () => {
  // cheap-check-first and quiet-failures stay off the site (DESIGN-PLAN.md and its review, 1 Nov).
  assert.deepEqual(Object.keys(PROOF).sort(), Object.keys(PINNED).sort());
  for (const [slug, pin] of Object.entries(PINNED)) {
    const c = PROOF[slug];
    assert.equal(c.slug, slug);
    assert.equal(c.title, pin.title, `${slug}: title`);
    assert.deepEqual(numbers(cardText(c)), [...pin.numbers].sort(), `${slug}: a number changed; re-run claims_check before pinning it`);
    assert.deepEqual(c.steps.filter((s) => s.circle).map((s) => s.circle), pin.circles, `${slug}: circles`);
    for (const s of c.steps.filter((x) => x.circle)) assert.ok(s.name.includes(s.circle) || s.sub.includes(s.circle), `${slug}: "${s.circle}" is not in its step`);
    const { check, result } = c.compact;
    assert.ok(Number.isInteger(check) && Number.isInteger(result) && check >= 0 && check < result && result < c.steps.length, `${slug}: compact steps`);
    assert.ok(c.steps[result].circle, `${slug}: the compact result is not the circled step`);
    assert.ok(c.steps.length >= 4 && c.steps.length <= 5, `${slug}: ${c.steps.length} steps`);
  }
  // Review fix 5: the drawings card's check line is the AI reading with its source text, not the source check (which
  // passed both wrong boxes; his hand labels found the 7).
  assert.equal(stepLine(PROOF["labelled-drawings"].steps[PROOF["labelled-drawings"].compact.check]), "AI reads each one: a value plus the text it came from");
  assert.equal(stepLine(PROOF["held-list"].steps[PROOF["held-list"].compact.check]), "Second pass: rechecks each pick's evidence");
  assert.equal(stepLine(PROOF["caught-my-own-test"].steps[PROOF["caught-my-own-test"].compact.check]), "Notes removed: same judge, same 72 posts");
  // The truth qualifiers beside each circle (review fix 4): agreement with a Claude review, the published score, his labels.
  assert.deepEqual(
    Object.values(PROOF).map((c) => [c.circledLabel, c.footer]),
    [
      ["measured against my 90% bar", "agree = same verdict as a separate Claude review of the same 50 companies"],
      ["the score I published", "72 posts: 11 fake AI jobs, 61 real · the two it missed sit right on the line"],
      ["scored against my own labels", "a cited source proves the text is on the drawing, not that it went in the right box"],
    ],
  );
});

// ── 2. The application cards' banned words (ai-job-search assets/proof-cards/check_cards.py, BANNED and BANNED_ON) ──
const BANNED = [
  [/\bfit gate\b|\bverifier\b|\bfresh rows?\b|\bbuyer phrases?\b/i, "jargon: say what it does in plain words"],
  [/\bsent\b|\breleased?\b/i, "the held list was never sent or released"],
  [/\b17,?056\b/, "17,056 includes 328 fits added later; 16,728 of 24,506 passed"],
  [/\b599\b/, "599 is a README answer, not a card number"],
  [/\bbecause\b/i, "bounces fell after the screen; never say because"],
  [/\bfixed\b/i, "causal wording: state the action, not that it fixed a result"],
  [/\bfirst sample\b/i, "the 86% sample was not the first: an earlier one calibrated the agents"],
  [/\b2 more\b/i, "write 'two more leaks'"],
];
const BANNED_ON = {
  "labelled-drawings": [
    [/\bnever guess/i, "4 of the 93 values the drawings don't state were filled in"],
    [/\bprocess(es|ing)?\b/i, "processes are unscored hints: never in a claim"],
  ],
};

test("no card says what the application cards may never say", () => {
  for (const c of Object.values(PROOF)) {
    const t = cardText(c);
    for (const [re, why] of [...BANNED, ...(BANNED_ON[c.slug] ?? [])]) assert.doesNotMatch(t, re, `${c.slug}: ${why}`);
  }
});

// ── 3. Retired claims, on both pages and both markdown copies ────────────
test("retired eval claims stay off the home page, /how-i-build and their markdown copies", () => {
  const RETIRED = [
    // "Not every AI step I've built has a test like this yet" (data/how.ts TESTING) is the honest version; it stays.
    /(?<!not )\b(?:every|all|any) AI steps?\b/i,
    /\b17,?056\b/,
    /\bqualified 24,?506\b|\b24,?506 qualified\b/i,
    /\bfind rate\b/i,
    /tested like software before they touch a real lead/i,
    // tests/how.test.mjs's list (EVALS-2026-10-31.md, 1 Nov), now on the home page too.
    /never s(?:een|aw)|30 of 30|25 of 25|124 of 124|nothing moves on|had to match|hand-labelled 25|live only after|label 25 to 30|check every email|every email vs|only now/i,
  ];
  const copies = [
    ["home", squash(plain(home()))],
    ["/how-i-build", squash(plain(how()))],
    ["index.md", unmark(app("index.md.body"))],
    ["how-i-build.md", unmark(app("how-i-build.md.body"))],
  ];
  for (const [name, s] of copies) for (const re of RETIRED) assert.doesNotMatch(s, re, `${name}: ${re}`);
});

// ── 4. Home: three compact cards between the hero and Tender Radar ─────
test("home: the proof band sits between the hero and Tender Radar and holds the three cards, AI stories first", () => {
  const html = home();
  const at = ['id="top"', 'id="proof-cards"', 'id="proof"'].map((s) => html.indexOf(s));
  assert.ok(at.every((i) => i >= 0) && at[0] < at[1] && at[1] < at[2], `the band is not between the hero and Tender Radar: ${at}`);
  const band = html.match(/<section id="proof-cards" class="wrap sec">[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.match(band, new RegExp(`^<section id="proof-cards" class="wrap sec"><h2 class="kicker">${HOME_BAND.kicker}</h2>`));
  assert.deepEqual([...band.matchAll(/<article class="pc pc-compact" id="([^"]+)">/g)].map((m) => m[1]), HOME_CARDS);
  assert.deepEqual(HOME_CARDS, ["held-list", "caught-my-own-test", "labelled-drawings"]);
  for (const slug of HOME_CARDS) {
    const c = PROOF[slug];
    const card = cardHtml(band, slug);
    assert.match(card, new RegExp(`<h3 class="h3">${c.title.replace(/'/g, "(?:'|&#x27;)")}</h3>`), `${slug}: no h3 title`);
    for (const line of c.before.lines) {
      assert.ok(decode(card).includes(`<s class="pen-strike">${line}</s>`), `${slug}: "${line}" is not struck through`);
    }
    // Compact: no brace, the note under the struck lines pointing up at every width, then the check and the result.
    assert.ok(!card.includes("pen-brace") && !card.includes("arr-left") && card.includes('class="arr-up"'), `${slug}: compact note or brace`);
    assert.ok(!card.includes("<img") && !card.includes("pc-flow"), `${slug}: an image or the full flow in a compact card`);
    const result = c.steps[c.compact.result];
    assert.equal(squash(plain(card.match(/<p class="pc-check">([\s\S]*?)<\/p>/)?.[1] ?? "")), stepLine(c.steps[c.compact.check]));
    assert.equal(squash(plain(card.match(/<p class="pc-result">([\s\S]*?)<\/p>/)?.[1] ?? "")), stepLine(result));
    assert.equal((card.match(/pen-circle/g) ?? []).length, 1, `${slug}: one circle, on the result`);
    assert.match(card.match(/<p class="pc-result">[\s\S]*?<\/p>/)[0], new RegExp(`pen-circle(?: tight)?">${result.circle}<svg`), `${slug}: the result's circle`);
    // Review fix 4: what the circle means sits right under the result (and its note), then the footer, then the link.
    const order = ['class="pc-result"', `circled: <!-- -->${c.circledLabel}`, 'class="small pc-foot"', 'class="links"'].map((s) => decode(card).indexOf(s));
    assert.ok(order.every((i) => i > 0), `${slug}: a part is missing: ${order}`);
    assert.deepEqual([...order].sort((a, b) => a - b), order, `${slug}: not result, circled, footer, link`);
    for (const l of c.links) {
      assert.ok(card.includes(`href="${l.href}"`), `${slug}: no link to ${l.href}`);
      const p = l.href.split("#")[0];
      assert.ok(existsSync(path.join(root, `.next/server/app${p}.html`)), `${l.href} was not built`);
      if (l.href.includes("#")) assert.match(app(`${p.slice(1)}.html`), new RegExp(`id="${l.href.split("#")[1]}"`), `${l.href} points at nothing`);
    }
  }
});

// ── 5. /how-i-build: held-list in full in the first screen, one compact card under it ──
test("/how-i-build: the full held-list card opens the page, five steps, both samples circled, no link to itself", () => {
  const hero = how().match(/<section id="top"[\s\S]*?<\/section>/)?.[0] ?? "";
  const card = cardHtml(hero, "held-list");
  assert.ok(card.startsWith('<article class="pc pc-full" id="held-list">'), "no full held-list card in the first screen");
  const flow = card.match(/<ol class="pc-flow">[\s\S]*?<\/ol>/)?.[0] ?? "";
  const steps = [...flow.matchAll(/<li class="pc-step">([\s\S]*?)<\/li>/g)].map((m) => m[1]);
  assert.equal(steps.length, 5);
  assert.deepEqual(steps.map((s) => squash(plain(s.match(/<p class="pc-pill">([\s\S]*?)<\/p>/)[1]))), PROOF["held-list"].steps.map((s) => `${s.name} ${s.sub}`));
  assert.deepEqual([...flow.matchAll(/pen-circle tight">([^<]*)<svg/g)].map((m) => m[1]), ["86%", "94%"]);
  // Notes sit under the step they explain.
  assert.match(steps[2], /<p class="note">built from those 7 misses, so it gets a new sample<\/p>/);
  assert.match(steps[3], /<p class="note">a different 50 companies<\/p>/);
  assert.ok(card.includes("pen-brace") && card.includes('class="arr-left"'), "the full card lost its brace or its side note");
  assert.ok(!card.includes('class="links"'), "the full card links to itself");
  assert.ok(card.indexOf("pc-flow") < card.indexOf("circled: "), "the circle's meaning is not under the flow");
  const proof = how().match(/<section id="proof" class="wrap sec">[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.deepEqual([...proof.matchAll(/<article class="pc pc-compact" id="([^"]+)">/g)].map((m) => m[1]), HOW_CARDS);
  // The Claygent story stays as it was (review fix 2): no card replaced it.
  assert.ok(!how().includes('id="cheap-check-first"'));
});

// ── 6. The look: evidence on the paper, red only through the pen ────────
const css = () => {
  const dir = path.join(root, ".next/static/chunks");
  return readdirSync(dir).filter((f) => f.endsWith(".css")).map((f) => readFileSync(path.join(dir, f), "utf8")).join("\n");
};

test("a card is the tiles' wash, straight, no border or shadow; red comes only through the pen", () => {
  const styles = css();
  const pc = styles.match(/\.pc\{[^}]*\}/)?.[0] ?? "";
  assert.match(pc, /background:var\(--wash\)/);
  assert.doesNotMatch(pc, /border|shadow|transform|rotate/, "the card box is framed or tilted");
  for (const [, sel, body] of styles.matchAll(/([^{}]*\.pc[^{}]*)\{([^}]*)\}/g)) {
    if (/--red|#c4161c/i.test(body)) assert.match(sel, /\.pen|\.scribble|\.note/, `${sel.trim()} paints red outside the pen`);
    assert.doesNotMatch(body, /box-shadow/, `${sel.trim()} has a shadow`);
  }
  // The strike is drawn without JS and under reduced motion, and every wrapped line gets its own (clone).
  const strike = styles.match(/\.pen-strike\{[^}]*\}/)?.[0] ?? "";
  assert.match(strike, /box-decoration-break:clone/);
  assert.match(strike, /background-size:100% 2px/);
  assert.match(styles, /\.pen-js \.pen:not\(\.in\) \.pen-strike\{background-size:0(?:%)? 2px\}/);
  assert.match(styles, /prefers-reduced-motion:reduce\)\{[^@]*\.pen-js \.pen:not\(\.in\) \.pen-strike\{background-size:100% 2px\}/);
  // The arrows in the flow are CSS with empty alt text, so screen readers read the steps, not the arrows.
  assert.match(styles, /\.pc-pill:after\{content:"→"\/""/);
  // From 1100px the full card spans the rail and the column.
  assert.match(styles, /\.sec>\.pc-full\{grid-column:1\/-1\}/);
});

// ── 7. The markdown copies say what the cards draw ─────────────────────
test("the markdown copies write the pen out: what is struck, what is circled, and what a circle means", () => {
  const homeMd = unmark(app("index.md.body"));
  for (const slug of HOME_CARDS) {
    const c = PROOF[slug];
    const r = c.steps[c.compact.result];
    for (const s of [`${c.before.label} (struck through in red): ${c.before.lines.join(" ")}`, stepLine(c.steps[c.compact.check]), `${stepLine(r)}. Circled in red: ${r.circle}`, `circled: ${c.circledLabel}`, c.footer]) {
      assert.ok(homeMd.includes(s), `index.md: ${s}`);
    }
  }
  const howMd = unmark(app("how-i-build.md.body"));
  for (const s of PROOF["held-list"].steps) assert.ok(howMd.includes(`${s.name} ${s.sub}${s.circle ? `. Circled in red: ${s.circle}` : ""}`), `how-i-build.md: ${s.name}`);
});
