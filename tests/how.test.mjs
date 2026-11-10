// The page /how-i-build, read from the build like the other tests: build first, then
//   node --experimental-strip-types --test tests/how.test.mjs
//
// What it pins (v2, 2 Nov 2026; design: the 2 Nov design doc, kept outside this public repo). Manveen, 2 Nov:
// "make sure tis page is easily undersatnble and helps us in building social proof", "they understand my skills". The
// first screen is the AI-edge h1, two sub lines (the role, then what an AI step is and how many have a test) and his
// agents and where a person approves (round 5: the held-list card, one miss he acted on, sits behind a click under the skills rows); a habit from the day job (the email check, replayed before switching, its story behind the
// card's click; v2.1), two day-job failures as charts with their stories behind a click, eight skill rows of one plain
// sentence each and one "Not yet" line (v2.1; the pipeline and the details behind one click), links a stranger can
// check with a dated corrections log, and how to reach him. The visible words stay at the count measured at the build; the day job is described,
// never named, and the source files name no private folder; the markdown copy says everything the page says, charts,
// drawings and cards included, and nothing else. The cards' own words and numbers are pinned in tests/proof.test.mjs.
// 3 Nov: the inbox fleet (the agency's inbox bot, stage by stage, a person deciding at three of them) sits after the
// skills and their clicks; its own test is near the end of this file. The same day, two figures that play once in view
// (his pick of the animation mockups, options 4 and 5): the free check under Clay in depth, and what runs on its own
// behind a click under the agents lines; their tests close the file.

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { HOW, AGENTS, SPLIT, HABITS, HELD, FAILURES, EMAILS, PIPELINE_STEPS, SKILLS, TESTING, NERD, FREE_CHECK, INBOX, LIVE, VISUAL, logSummary, stageHead } from "../data/how.ts";
import { HERO, JOBS, FIVE_HABITS } from "../data/portfolio.ts";
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
/** Words a reader sees without opening anything: each <details> counts by its <summary>; drawings left out, and so is
    text hidden for screen readers and text tools (since 3 Nov each drawing's reading is one, components/Sketch.tsx). */
const visibleWords = () => {
  const shown = page()
    .replace(/<span class="sr-only">[^<]*<\/span>/g, " ")
    .replace(/<details[\s\S]*?<\/details>/g, (d) => d.match(/<summary[\s\S]*?<\/summary>/)?.[0] ?? " ");
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
  // The description is the h1 and the sub lines (2 Nov; two lines since round 4).
  assert.ok(decode(head).includes(`<meta name="description" content="${HOW.headline} ${HOW.sub.join(" ")}"/>`), "the description is not the h1 and the sub lines");
  assert.ok(existsSync(path.join(root, ".next/server/app/how-i-build/opengraph-image.body")), "no share card");
  assert.equal(JSON.parse(app("how-i-build.md.meta")).headers["content-type"], "text/markdown; charset=utf-8");
  assert.match(app("sitemap.xml.body"), /<loc>https:\/\/manveen\.me\/how-i-build<\/loc>/);
  assert.ok(app("llms.txt.body").includes(`](${SITE}/how-i-build.md)`), "llms.txt does not link the copy");
  // 3 Nov: the blurb names the sections in page order, read off this copy (tests/ai.test.mjs holds the order). 9 Nov:
  // the page opens on What broke, and what I changed (his pick, "Proof first"); since 9 Nov late on What I've built.
  assert.ok(app("llms.txt.body").includes(`for hiring managers: ${HOW.headline} In page order: ${VISUAL.kickers.skills} (`), "llms.txt's blurb is the old one");
  assert.ok(app("llms-full.txt.body").includes(md().trim()), "llms-full.txt does not hold the copy whole");
});

test("the first screen: the photo, the kicker, the h1, the role line, no proof card, then What I've built", () => {
  const hero = section("top");
  assert.equal((page().match(/<h1[\s>]/g) ?? []).length, 1);
  assert.equal(squash(plain(hero.match(/<h1>([\s\S]*?)<\/h1>/)[1])), HOW.headline);
  // Round 6 (2 Nov, 2 of 3 jurors): a kicker, the nav link's words, between the photo and the h1, as home has "GTM
  // engineer": the h1 is the same on both pages, and three round 5 readers thought the link had reloaded home.
  assert.equal(HOW.kicker, "How I build");
  assert.match(hero, /<div class="hero-head"><img[^>]*alt="Manveen Singh"[^>]*class="photo"[^>]*\/?><p class="kicker hero-kicker">How I build<\/p><h1>/, "not the photo, the kicker, then the h1 in the head block");
  // Round 4 (2 Nov): one block of two lines, each 30 words or fewer: the role, then home's 82-step line, which says what
  // an AI step is (all 4 round 3 readers asked; the eval inventory counts model steps only).
  const sub = hero.match(/<div class="how-sub">([\s\S]*?)<\/div>/)?.[1] ?? "";
  assert.equal((hero.match(/class="how-sub"/g) ?? []).length, 1, "not exactly one sub block");
  assert.deepEqual([...sub.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => squash(plain(m[1]))), [...HOW.sub]);
  for (const l of HOW.sub) assert.ok(words(l) <= 30, `a sub line is over 30 words: ${l}`);
  assert.equal(HOW.sub[0], "GTM engineer at an outbound agency since November 2025.");
  // Review (2 Nov): the h1's limit sits on the same screen as the h1 (the eval inventory's count line), and no tool list.
  // Round 5 (2 Nov): it says where the 82 steps are (all 4 round 4 readers asked "steps of what?").
  // 3 Nov (his ask, "i just want us to not look weak"): the step count is the skills row "Testing AI steps" now.
  assert.equal(HOW.sub.length, 1, "the sub is back to two lines");
  assert.doesNotMatch(HOW.sub.join(" "), /\b82\b|none yet/, "the step count is back in the first screen");
  // Round 6 (2 Nov): home's hero has his 15 Oct story back where this line stood; the 82-step line is on this page only.
  assert.ok(!HERO.how.some((l) => /\b82\b/.test(l)), "the step count is in home's hero");
  assert.doesNotMatch(HOW.sub.join(" "), /Clay, n8n and Python/, "the tool list is back in the sub line");
  // Round 4: the held-list card left the first screen (three round 3 readers thought home's link "hadn't changed pages"),
  // so Me and my agents followed the hero. 9 Nov (his pick, "Proof first"): two cold readers, Hormozi and Karpathy each
  // found the measured miss three screens down, so the held list comes back as the first story, in the story shape
  // (the red-pen line, its checker and its limit), not as the home page's proof card; that card sits behind its click.
  assert.ok(!hero.includes('class="pc '), "a proof card is back in the hero");
  // 9 Nov, late (his pick, "What I've built"): the systems he built open the page, then How I test, then the stories.
  assert.deepEqual([...page().matchAll(/<section id="([^"]+)"/g)].map((m) => m[1]).slice(0, 2), ["top", "skills"]);
  // No paragraph outside the sub block: anything else the hero says in a <p> is a row of links.
  const rest = hero.replace(/<div class="how-sub">[\s\S]*?<\/div>/, "").replace(/<p class="kicker hero-kicker">[^<]*<\/p>/, "");
  for (const [, p] of rest.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)) {
    assert.ok(!squash(plain(p.replace(/<a\b[\s\S]*?<\/a>/g, ""))), `a paragraph in the first screen: ${squash(plain(p)).slice(0, 60)}`);
  }
  for (const l of VISUAL.heroLinks) assert.ok(hero.includes(`href="${l.href}"`), `the hero has no link to ${l.href}`);
});

// 3 Nov, final jury: +10 words on the Tender Radar link (its AI step is down since September), a truth fix.
// 3 Nov, his ask: the inbox fleet (kicker, lead line, caption, credit, click label): 679.
// 3 Nov, his pick of the animation mockups (option 5): the new click under the agents lines adds its 11-word label
// ("What runs on its own, and what waits for a person"); everything inside it, and the free check figure inside the
// pipeline click, sits behind a click. Measured 687 (676 before).
// 9 Nov (his pick, "Proof first"): the held list opens the page in the story shape, and Claygent and the mail servers
// gain what they were checked against and their limit (+); the skills row it repeated, the agents section's two lines
// (into its click), a Claygent line and the email card's "costs twice" line (behind its click) went (-). Measured 749.
// The 9 Nov jury: the mail-server card says what changed in a line, the pen line says "new ones", the Claygent tag says
// whose labels on which rows, its caption drops "tuned on", and the held list's tag drops the bar it repeated: 756.
// 9 Nov evening, his call ("i think they add value"): the Checking AI output row and the email card's "costs twice"
// line came back, past the 760 ceiling the comments above name: 804. The cap still stops any growth without a decision.
// Then (his yes) the first story says what the sample caught instead of repeating the row: 799.
// 9 Nov, late (his asks: a portfolio that doesn't undersell, a narrative, workflows "tested like software"): What I've
// built opens the page with three more systems, How I test is a section of its own, and the gap lines are out: 979. The
// cap still stops growth without a decision.
// The 9 Nov late jury: the rows say who the follow-ups are for, where the lead finder ran and why it stopped, what the
// HubSpot sync wrote, and the gate as merged; the n8n and Python rows moved to How I test: 1012. Round 2: 1013.
// 10 Nov (his ask, social proof for a recruiter): the reference sentence on the first screen, +21: 1034.
// 10 Nov (his ask, "easy to follow"): the four jump links under the h1, +9: 1043. The rows' lead figures are drawn from an
// attribute, not counted: each repeats words of its own sentence.
const VISIBLE_CAP = 1043;

test("visible words stay at the count measured at the build", (t) => {
  // 2 Nov, v2: 844 measured with the design's full copy; the session's call was to apply its cut order (section 15,
  // all six steps) to about 750 or fewer ("easily undersatnble"), keeping every skills gap and every caveat. Measured
  // after the cuts: 740. After the five reviews' truth and clarity fixes, trimmed (2 Nov): 749. v2.1 (2 Nov): the GTM
  // habit card and the one-sentence skill rows, trimmed inside those two sections: 749. Verify loop round 2 (2 Nov):
  // net cuts only (the held-list card's circled line and footer merged, Tender Radar's morning count out, "daily" out,
  // the habit label plain): 727. Verify loop round 3 (2 Nov): net cuts only (the held-list limit in 20 words, "After, not
  // because:" out, the habit's limit one word shorter, its head the same 16 words, the skills moved up): 719. Verify loop
  // round 4 (2 Nov): net cuts (the GitHub profile's gloss out, the circled line down to its bar, the held-list limit one
  // word shorter; in: what an AI step is, the click's three sub-heads, the habit limit in the first person): 717. Verify
  // loop round 5 (2 Nov): the held-list card went behind a click under the skills rows (all 4 round 4 readers said its
  // story repeats); in: where the 82 steps are, why the Clay map cost 0 data credits, the bounce caveat pointing at the
  // teammate's bars, the plain habit exhibit, the failures label, the contact ask without its question: 600. Round 6
  // (2 Nov, the round 5 jury): the "How I build" kicker and each click's own label: 608 (the cap is 760, CHECK.md C9).
  // Adding words means cutting some.
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

test("sections in order: what I've built, how I test, how I check the work (the held list first), the habit, agents, the inbox fleet, live, contact, each holding its own picture", () => {
  const html = page();
  const h2 = [...html.matchAll(/<h2 class="kicker">([^<]*)<\/h2>/g)].map((m) => decode(m[1]));
  const K = VISUAL.kickers;
  // Verify loop round 3 (2 Nov): What I can do right after Me and my agents, no word changed (the round 2 recruiter gave
  // up in Two times it broke before reaching it; three readers called it the most useful part for a hirer).
  // 3 Nov: the inbox fleet after What I can do and its clicks, before the habit (his ask).
  // 9 Nov (his pick of three judged outlines, "Proof first"): What broke, and what I changed opens the page, then the
  // skills, the habit, the agents, the inbox fleet. Four readers found the measured miss three screens down.
  // 9 Nov, late (his picks, "What I've built" and the narrative he asked for): built, test, check, change, decide, check
  // it yourself, say hi.
  // Jury (9 Nov, late, editor): the stories right after What I've built (pictures sooner), then How I test.
  assert.deepEqual(h2, [K.skills, K.failures, K.testing, K.habits, K.agents, K.fleet, K.live, K.contact]);
  // Round 5 (2 Nov): the held-list card, in full, sits behind a click right under the skills rows (its label since round 6:
  // "How the held list actually went")
  // (all 4 round 4 readers said its story repeats); round 4 gave it a section of its own after What I can do.
  const at = ["skills", "failures", "how-i-test", "habits", "agents", "inbox-fleet", "live", "contact"].map((id) => html.indexOf(`<section id="${id}"`));
  assert.ok(at.every((i) => i >= 0), `a section is missing: ${at}`);
  assert.deepEqual([...at].sort((a, b) => a - b), at, "the sections are out of order");
  assert.ok(!html.includes('<section id="held"'), "the held-list card has its own section again");
  const mdAt = [`## ${K.skills}`, `### ${NERD.summary}`, `## ${K.failures}`, `### ${HELD.head}`, `#### ${VISUAL.clicks["held-list"]}`, `##### ${PROOF["held-list"].title}`, `## ${K.testing}`, `### ${VISUAL.clicks["how-i-test"]}`, `## ${K.habits}`, `## ${K.agents}`, `## ${K.fleet}`, `### ${INBOX.summary}`, `## ${K.live}`, `## ${K.contact}`].map((k) => md().indexOf(`${k}\n`));
  assert.ok(mdAt.every((i) => i >= 0), `a section is missing from the copy: ${mdAt}`);
  assert.deepEqual([...mdAt].sort((a, b) => a - b), mdAt, "the copy is not in page order");
  assert.ok(sketch(section("agents"), AGENTS.label), "#agents does not hold the agents drawing");
  assert.deepEqual([...section("habits").matchAll(/<article class="habit" id="([^"]+)">/g)].map((m) => m[1]), HABITS.map((h) => h.id));
  const skills = section("skills");
  assert.deepEqual([...skills.matchAll(/<li id="([^"]+)" class="skill">/g)].map((m) => m[1]), SKILLS.map((s) => s.id));
  assert.match(skills, /<ul class="skills">/);
  // One click since 9 Nov: the pipeline and the details (the held-list card's click moved to the first story).
  const nerd = [...skills.matchAll(/<details[\s\S]*?<\/details>/g)];
  assert.equal(nerd.length, 1, "#skills should hold one click");
  assert.ok(!skills.includes('id="held-list"'), "the held-list card is back under the skills rows");
  // 9 Nov: the held list is the first story: its heading, the red-pen line (43 of 50 struck, 47 of 50 circled), the
  // skills row's sentence, what it was checked against, its limit, then the card in full behind its click.
  const failures = section("failures");
  const heldAt = failures.indexOf('<article id="held" class="storycard">');
  assert.ok(heldAt >= 0 && heldAt < failures.indexOf('<article id="claygent"'), "the held list is not the first story");
  const heldStory = failures.slice(heldAt, failures.indexOf('<article id="claygent"'));
  assert.equal(squash(plain(heldStory.match(/<h3 class="h3">([\s\S]*?)<\/h3>/)[1])), HELD.head);
  // keep() holds each number to its words with no-break spaces, so it never wraps alone.
  assert.match(heldStory, /<p class="habit-exhibit"><span class="pen"><s class="pen-strike">43[ \u00a0]of[ \u00a0]50<\/s><\/span>/, "43 of 50 is not struck");
  assert.match(heldStory, /<span class="pen pen-circle">47[ \u00a0]of[ \u00a0]50<svg/, "47 of 50 is not circled");
  for (const s of [HELD.caught, HELD.checked, HELD.limit]) assert.ok(squash(plain(heldStory)).includes(s), `the held story lost: ${s}`);
  // 9 Nov, his yes: the story's line is what the sample caught, in the card's words; the row says the numbers.
  const before = PROOF["held-list"].before;
  assert.ok(HELD.caught.includes(before.lines[0].replace(/ \([^)]*\)$/, "")) && HELD.caught.includes(before.lines[1]), "the caught line is not the card's words");
  assert.match(before.note, /^7 misses in 50/);
  assert.ok(HELD.caught.startsWith("The sample caught 7 misses: "), "the caught line lost its count");
  assert.ok(!squash(plain(heldStory)).includes(HELD.line), "the held story repeats the Checking AI output row");
  // Jury (9 Nov, tests): pinned to their sources, so a cut caveat fails here and not only behind the click.
  assert.equal(HELD.limit, PROOF["held-list"].limit, "the story's limit is not the card's three caveats");
  assert.equal(HELD.checked, "checked against: a second Claude session");
  assert.equal(PROOF["held-list"].title, HELD.head, "the story's heading is not the card's title");
  assert.doesNotMatch(squash(plain(heldStory)), /fit check|\bhand[- ]?(?:labels?|labell?ed|read|checked)\b/i, "the held list is told as a fit check or hand labels");
  assert.ok(heldStory.indexOf("story-tag") < heldStory.indexOf("story-limit") && heldStory.indexOf("story-limit") < heldStory.indexOf("<details"), "the held story's tag and limit are not before its click");
  assert.match(heldStory, /<details class="more held-click" id="held-click"><summary><span class="more-line more-label">How the held list actually went<\/span><span class="more-hint" aria-hidden="true"><\/span><\/summary><article class="pc pc-full" id="held-list">/);
  assert.equal(squash(plain(nerd[0][0].match(/<summary>([\s\S]*?)<\/summary>/)[1])), NERD.summary);
  assert.ok(sketch(nerd[0][0], PIPELINE_STEPS.label), "the pipeline drawing is not inside the skills click");
  // v2.1 (2 Nov): the email story is told once, behind the habit card's own click (its id keeps #identity links
  // working), and no longer in the skills click or among the failures.
  assert.equal(EMAILS.id, "identity");
  assert.ok(!nerd[0][0].includes('id="identity"'), "the email story is back in the skills click");
  assert.ok(!html.includes('<article id="identity"'), "the email story is back as a story card");
  const habit = section("habits").match(/<article class="habit" id="habit-replay">[\s\S]*?<\/article>/)?.[0] ?? "";
  const click = habit.match(/<details class="more" id="identity">[\s\S]*?<\/details>/)?.[0] ?? "";
  assert.ok(click, "the habit card has no click with the email story");
  assert.match(click, /<summary><span class="more-line more-label">How the re-run actually went<\/span>/);
  // 9 Nov: the click says the cost too (the card's line is back, his call).
  assert.ok(squash(plain(click)).includes("every wrong rejection costs twice"), "the cost line is not in the habit's click");
  const parts = click.match(/<dl class="story">[\s\S]*?<\/dl>/)?.[0] ?? "";
  assert.deepEqual([...parts.matchAll(/<dt>([^<]*)<\/dt>/g)].map((m) => m[1]), ["What broke", "How I found it", "How I proved the fix", "What it changed"]);
  assert.equal((html.match(/2,376 past provider emails/g) ?? []).length, 1, "the side-by-side on 2,376 emails is told in more than one story");
  assert.doesNotMatch(html, /<details[^>]* open/, "a detail starts open");
  for (const id of ["proof", "pipeline", "testing", "clay"]) assert.ok(!html.includes(`<section id="${id}"`), `the old #${id} section is back`);
  for (const s of FAILURES.stories) {
    const card = html.match(new RegExp(`<article id="${s.id}" class="storycard">[\\s\\S]*?</article>`))?.[0] ?? "";
    assert.ok(card, `no card for ${s.id}`);
    assert.match(card, /<figure class="chart[^"]*" role="img" aria-label="[^"]{40,}"/, `${s.id}: no chart with a reading`);
    const caption = squash(plain(card.match(/<p class="cap">([\s\S]*?)<\/p>/)?.[1] ?? ""));
    assert.ok(caption && caption.split(" ").length <= 25, `${s.id}: caption is missing or long (${caption})`);
    assert.ok(card.includes(`<summary><span class="more-line more-label">${VISUAL.clicks[s.id]}</span>`), `${s.id}: the click is not labelled for its story`);
    // 9 Nov: each story says what it was checked against, before its click.
    const v = VISUAL.stories[s.id];
    assert.ok(card.includes(`<p class="habit-tag story-tag">${v.checked.replace(/'/g, "&#x27;")}</p>`), `${s.id}: no checked-against line`);
    assert.ok(v.checked.startsWith("checked against: "), `${s.id}: the tag does not say what it was checked against`);
    // Jury (9 Nov, tests): the lines and the limit show before the click, the tag before the limit.
    const shown = squash(plain(card.slice(0, card.indexOf("<details"))));
    // 10 Nov (three blind readers): a story marked limitInClick opens its click with the limit instead.
    for (const l of [...v.lines, v.limitInClick ? null : v.limit].filter(Boolean)) assert.ok(shown.includes(squash(l)), `${s.id}: not shown before the click: ${l}`);
    if (v.limitInClick) assert.ok(squash(plain(card.slice(card.indexOf("<details")))).includes(squash(v.limit)), `${s.id}: the limit left the page`);
    assert.ok(card.indexOf("story-tag") < card.indexOf("<details"), `${s.id}: the tag is not before the click`);
    if (v.limit && !v.limitInClick) assert.ok(card.indexOf("story-tag") < card.indexOf("story-limit") && card.indexOf("story-limit") < card.indexOf("<details"), `${s.id}: the limit is not between the tag and the click`);
    const story = card.match(/<details[\s\S]*?<\/details>/)?.[0] ?? "";
    const dts = [...story.matchAll(/<dt>([^<]*)<\/dt>/g)].map((m) => m[1]);
    assert.deepEqual(dts, ["What broke", "How I found it", "How I proved the fix", "What it changed"], `${s.id}: parts`);
  }
});

test("every click names what it opens, and no two on a page share a label (round 6, 2 Nov)", () => {
  // "How it actually went" labelled all six story clicks until round 6; two round 5 readers called it a template, and the
  // round 5 cto said nothing told him which one was worth opening. His phrase starts each label where it fits.
  const labels = (html) => [...html.matchAll(/<span class="more-line more-label">([^<]*)<\/span>/g)].map((m) => decode(m[1]));
  const how = labels(page());
  const homeHtml = app("index.html");
  const home = labels(homeHtml.slice(homeHtml.indexOf("<main"), homeHtml.indexOf("</main>")));
  for (const [name, list] of [["/how-i-build", how], ["home", home]]) {
    assert.ok(list.length > 0, `${name}: no clicks`);
    assert.equal(new Set(list).size, list.length, `${name}: two clicks share a label: ${list.join(" | ")}`);
    assert.ok(!list.includes("How it actually went"), `${name}: a click with the old shared label`);
  }
  // 3 Nov: "on-its-own", the click under the agents lines (option 5 of the animation mockups).
  assert.deepEqual(Object.keys(VISUAL.clicks).sort(), ["bounces", "caught-my-own-test", "claygent", "held-list", "how-i-test", "identity", "labelled-drawings", "on-its-own"]);
  for (const k of ["held-list", "identity", "claygent", "bounces", "on-its-own", "how-i-test"]) assert.ok(how.includes(VISUAL.clicks[k]), `/how-i-build: no click "${VISUAL.clicks[k]}"`);
  for (const k of ["caught-my-own-test", "labelled-drawings"]) assert.ok(home.includes(VISUAL.clicks[k]), `home: no click "${VISUAL.clicks[k]}"`);
  assert.ok(!("readStory" in VISUAL), "the shared label is back in the data");
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
  for (const s of ["accepted 77 more", "2,376", "0.5%", "2.4%", "5.1%", "505,461", "2.74%", "0.73%", "2.26%", "2.09%", "8,649", "2,047"]) assert.ok(text().includes(s), `${s} is missing`);
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
    // 9 Nov (jury, tests): only 10 of the 25 Claygent tuning rows carry his labels, so never "25 companies I labelled".
    assert.doesNotMatch(s, /\b25 (?:companies )?(?:that )?I(?:'d| had)? labell?ed\b|\blabell?ed (?:all )?25\b/i, "25 companies are called his labels");
    assert.doesNotMatch(s, /\bI sent\b/);
    assert.doesNotMatch(s, /\b870\+|95\.5%|nine mornings|\btoy\b/i);
    assert.doesNotMatch(s, /\bhand[- ]?(?:read|labell?ed|checked)\b.{0,80}\b4[37] of 50\b|\b4[37] of 50\b.{0,80}\bhand[- ]?(?:read|labell?ed|checked)\b/i);
    for (const [, after] of s.matchAll(/0\.73%(.{0,60})/g)) assert.doesNotMatch(after, /(?<!not )\bbecause\b/, "a because after the bounce drop");
  }
  assert.doesNotMatch(squash(plain(section("agents"))), /\bevery morning\b/i);
  // 2 Nov (verify loop round 2): no "daily" for the agents (the 1 and 2 Nov runs failed: the sending tool's 401, "Plan
  // expired"), and no Tender Radar morning count here (the home page counts live; the README's 104 read as a clash).
  assert.doesNotMatch(squash(plain(section("agents"))), /\bdaily\b/i);
  assert.match(AGENTS.lines[0], /^Since 16 Oct my Claude Code agents have drafted follow-ups to leads who replied with interest to our outbound\.$/);
  for (const s of [text(), unmark(md())]) assert.doesNotMatch(s, /\b104 mornings\b|\bruns to 15 Oct\b/);
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
    // note: the drawing's red note, or null for a drawing without one (the agents', since 2 Nov).
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
    if (note) assert.ok(copy.includes(note), "the red note is not in the copy");
    else assert.ok(!/class="red"/.test(s), "a red note is drawn");
  };
  // The pipeline sits inside the skills click since 2 Nov, with three steps in plain words.
  check(section("skills"), PIPELINE_STEPS.label, PIPELINE_STEPS.steps, PIPELINE_STEPS.note, 4);
  assert.deepEqual(PIPELINE_STEPS.steps.map((s) => s.name).filter((n) => /qualify|list QA|spintax/.test(n)), []);
  // Me and my agents: six steps, one red loop (the person who approves) per drawing, and his red note, his own words for
  // how he works ("check first, then a guardrail so it doesn't happen twice"): cut in round 2 (2 Nov) on blind readers'
  // flags without his yes, back since round 6 (the round 5 jury). Each layout draws it whole (the tall one on two lines).
  // 3 Nov: reworded at his ask (step 5 is the gate); the tall layout splits it at its comma.
  check(section("agents"), AGENTS.label, AGENTS.steps, AGENTS.note, 1);
  assert.equal(AGENTS.note, "if step 5 catches a mistake, I add a check for it");
  for (const cls of ["sketch-wide", "sketch-tall"]) {
    const svg = sketch(section("agents"), AGENTS.label).match(new RegExp(`<svg class="${cls}"[\\s\\S]*?</svg>`))[0];
    const red = [...svg.matchAll(/<text[^>]*class="red"[^>]*>([^<]*)<\/text>/g)].map((m) => decode(m[1])).join(" ");
    assert.equal(red, AGENTS.note, `${cls}: the red note is not drawn whole`);
  }
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
    ...HABITS.flatMap((h) => (h.link ? [h.link] : [])),
    ...LIVE.log.flatMap((e) => (e.link ? [e.link] : [])),
  ];
  for (const l of want) assert.ok(html.includes(`href="${l.href}"`), `${l.href} is missing`);
  for (const id of ["skills", "live", "agents", "habits", "claygent", "bounces", "live-champion", "corrections"]) assert.ok(html.includes(`id="${id}"`), `no #${id}`);
  // Round 6 (2 Nov): nothing links "/#proof" any more (Tender Radar's section left the home page).
  assert.ok(!html.includes('href="/#proof"'), "a link points at the home page's old Tender Radar section");
  // The deep-link helper ships: a link to a log entry opens its click.
  assert.ok(read("app/how-i-build/page.tsx").includes("<OpenOnHash />"));
});

test("the words match their sources, as written down in data/how.ts", () => {
  const t = text();
  for (const s of ["34,044", "24,506", "505,461", "a second Claude session agrees on 43"]) assert.ok(t.includes(s), `${s} is missing`);
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
  // The held list's reviewer is named in the card's numbers and limit line, and on the share card. Round 4 (2 Nov): who
  // agrees is in the sample's own line (all 4 round 3 readers asked "agree with what?"), the circled line says only the
  // bar, and the limit keeps every caveat: that session wrote the rubric, dropped companies weren't sampled, fifty is small.
  assert.equal(PROOF["held-list"].steps[1].sub, "a second Claude session agrees on 43 (86%)");
  assert.equal(PROOF["held-list"].steps[3].sub, "it agrees on 47 (94%)");
  // Round 5 (2 Nov): the bar is on agreement, said plainly (the round 4 cto read it as accuracy).
  assert.equal(PROOF["held-list"].circledLabel, "my bar: 90% agreement");
  assert.match(PROOF["held-list"].limit, /^That session also wrote the rubric\. Neither sample included companies the agents dropped, and fifty is a small sample\.$/);
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
test("what I've built: eleven systems, one plain sentence each with its number, no Not yet line (v2.1; 9 Nov late)", () => {
  // Manveen, 2 Nov, on the rows with a receipt and a gap each: "i was not sure what we are going for in this".
  // 9 Nov: "Checking AI output" left the rows with the redesign and came back the same evening, his call ("i think they
  // add value"), in the same sentence as the first story's line (HELD.line).
  assert.deepEqual(
    SKILLS.map((s) => s.title),
    // 9 Nov, late (his pick, "What I've built"): the rows name the systems; Testing AI steps is out, three systems are in.
    // Jury (9 Nov, late): Checking AI output first; the n8n and Python rows moved to How I test; the CRM row names its sync.
    // 10 Nov (three blind readers; his ask to fix what they found): plain results first, then the AI rows.
    ["Deliverability", "Finding emails", "Clay and Claygent", "Clay lead finder", "Checking AI output", "AI follow-up agents", "HubSpot exclusions", "HubSpot reply sync", "Inbox bot"],
  );
  assert.equal(new Set(SKILLS.map((s) => s.id)).size, SKILLS.length, "two rows share an id");
  for (const s of SKILLS) {
    assert.deepEqual(Object.keys(s).sort(), ["id", "line", "title"], `${s.id}: a receipt, gap, level or arrow link is back`);
    assert.doesNotMatch(s.title, /,/, `${s.id}: the title is a tool list`);
    assert.match(s.line, /\d/, `${s.id}: no number`);
    // One sentence (a semicolon may join two halves), readable on its own: a link only at its end, never arrow-only.
    assert.equal((s.line.replace(/\]\([^)]*\)/g, "]").match(/[.!?](?=\s|$)/g) ?? []).length, 1, `${s.id}: not one sentence`);
    assert.doesNotMatch(s.line, /[↑↓→↗]/, `${s.id}: an arrow`);
    for (const m of s.line.matchAll(/\[[^\]]*\]\([^)]*\)/g)) assert.ok(s.line.endsWith(`${m[0]}.`), `${s.id}: a link inside the sentence`);
  }
  const row = (id) => squash(plain(section("skills").match(new RegExp(`<li id="${id}" class="skill">[\\s\\S]*?</li>`))?.[0] ?? ""));
  // Review (2 Nov, truth): the approval is a gate on sending, never "a person approves each one" (cards wait unapproved).
  assert.match(row("skill-agents"), /Since 16 Oct my Claude Code agents have drafted follow-ups to leads who replied with interest; each send needs a person's yes\./);
  assert.doesNotMatch(row("skill-agents"), /approves each/, "the agents row claims every draft was approved");
  // The held list (SOURCES.md row 34): agreement with a Claude review, never hand labels; under the bar, then a fix and
  // 47 on new rows. Review (2 Nov): the card's terms, never "fit check" (the Claygent step's name on this page). Round 4:
  // "a second Claude session", as on the card.
  // 9 Nov: the sentence is the first story's line now (HELD.line), word for word, and still never "fit check".
  assert.equal(HELD.line, "My agents' company picks matched a second Claude session on 43 of 50, under my 90% bar; I held the list until a fix passed 47 of 50 new ones.");
  assert.doesNotMatch(HELD.line, /fit check/, "the held list is called the fit check");
  assert.ok(squash(plain(section("failures"))).includes(HELD.caught), "the held list's story line is not on the page");
  assert.equal(row("skill-checking"), `Checking AI output ${HELD.line}`, "the Checking AI output row is not the held list's sentence");
  // 9 Nov, late (his pick, "Drop them"; his 5 Nov rule: a gap stays out unless they ask): the 42-of-82 row is gone.
  assert.ok(!SKILLS.some((s) => s.id === "skill-testing"), "the Testing AI steps row is back");
  assert.doesNotMatch(text(), /42 of my 82 AI steps|11 of them are solid/, "the step count is back on the page");
  // 9 Nov, late: three systems from his claims table, each with its must-say.
  // Jury (9 Nov, late, truth): never "scores about 350" (on 2 Nov it scored one client's 72); the credit and the person's call stay.
  assert.match(row("skill-inbox"), /I built most of our inbox bot \(a teammate built its renewal tracker\): it scores our sending inboxes 0 to 100, and a person decides what we buy\./);
  assert.doesNotMatch(row("skill-inbox"), /scores about 350/, "the tracked count is said as scored");
  assert.match(row("skill-finder"), /for the agency and 2 clients until 27 Oct, when the searches paused to save search quota\./);
  assert.match(row("skill-exclusions"), /found 13 live leads, 5 already emailed, all removed; a daily n8n sync now keeps excluded companies out of new uploads\./);
  assert.doesNotMatch(row("skill-exclusions"), /BettrData|Bettr/i, "the client is named");
  // Round 5 (2 Nov): why the map cost 0 data credits (SOURCES.md row 11: "search quota only"; 3 of 4 round 4 readers asked).
  assert.match(row("skill-clay"), /I mapped a 34,044-company market for 0 data credits, because Clay's search spends search quota; then Claygent checked 24,506 of them at about 0\.18 credits each\./);
  assert.match(row("skill-emails"), /verified emails for 12,030 of 15,514 decision-makers \(78%\) in one batch\./);
  assert.match(row("skill-deliverability"), /^Deliverability After I screened out high-bounce mail servers, bounces on my lists went from 2\.7% to 0\.7%/);
  assert.doesNotMatch(row("skill-deliverability"), /\bbecause\b/, "the bounce drop said as because");
  const testRow = (id) => squash(plain(section("how-i-test").match(new RegExp(`<li id="${id}" class="skill">[\\s\\S]*?</li>`))?.[0] ?? ""));
  assert.match(testRow("skill-n8n"), /On 14 Oct I put error alerts on 40 live workflows; my public n8n repo runs 45 tests\./);
  // Past tense, one sync (nothing has come in since 2 Oct).
  assert.match(row("skill-crm"), /I built an n8n sync that wrote the last reply date, campaign and lead category from the sending tool into HubSpot contact properties\./);
  assert.match(testRow("skill-python"), /60 tests and a release gate in CI: champion-move-checker\./);
  // 9 Nov, late (his pick, "Drop them"): no "Not yet" line; a gap stays out unless they ask (his 5 Nov rule).
  const skills = section("skills");
  assert.ok(!skills.includes("skills-notyet") && !/Not yet:/.test(text()), "the Not yet line is back");
  assert.doesNotMatch(skills, /skill-gap|skill-proof|skill-to/, "a gap label, receipt or arrow link is back");
  assert.equal(VISUAL.kickers.skills, "What I've built");
  // How I test (9 Nov, late): the rows' shape, one sentence each, in their sources' words.
  assert.equal(VISUAL.kickers.testing, "How I test");
  const tests = section("how-i-test");
  assert.deepEqual([...tests.matchAll(/<li id="([^"]+)" class="skill">/g)].map((m) => m[1]), TESTING.map((s) => s.id));
  for (const s of TESTING) {
    assert.equal((s.line.match(/[.!?](?=\s|$)/g) ?? []).length, 1, `${s.id}: not one sentence`);
    assert.ok(squash(plain(tests)).includes(s.line.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")), `${s.id}: not on the page`);
  }
  const test = (id) => TESTING.find((s) => s.id === id)?.line ?? "";
  assert.ok(NERD.testing[0].includes("149 automated tests") && test("test-code").includes("149 tests"));
  assert.ok(NERD.testing[1].includes("passed 872 tests on 19 Oct") && test("test-suite").includes("passed 872 tests on 19 Oct"));
  assert.match(test("test-alerts"), /when I replayed 13 Oct, a day our webhook dropped a reply, it flagged the miss\.$/);
  assert.doesNotMatch(test("test-alerts"), /\bcaught\b/, "the regression test is told as a catch");
  assert.match(test("test-gates"), /^On campaigns I upload myself, /, "the gate lost its scope");
  // Jury (9 Nov, late, truth, a blocker): the gate is merged, never live (SOURCES.md "Claygent production gate").
  assert.ok(FAILURES.stories[0].changed.includes("On 3 Nov I merged a check for this market: a segment that misses its bar stops before it runs"));
  assert.match(test("test-stop"), /^On 3 Nov I merged a gate for the 34,044-company market: /, "the gate lost its date, its market or its merged");
  for (const s of [text(), unmark(md())]) assert.doesNotMatch(s, /(?<!it said a miss stops the run )since 3 Nov,? a miss stops|Since 3 Nov it does|The same check ran on new companies/i, "the gate is told as running live");
  assert.ok(FAILURES.stories[0].changed.includes("Until the lead finder paused on 27 Oct, Claygent also checked the new companies it brought in, with no gate."), "the lead finder's checks read as the merged gate's");
});

test("labels say what the section is: no slogans (verify loop round 2, 2 Nov)", () => {
  // Round 1: 4 of 4 readers flagged "One habit, with receipts" (a build session's label). Round 6 (2 Nov): no ban on "not
  // just": "you see every miss, not just a score" is his own (claims row 56), back on /working-with-me.
  assert.equal(VISUAL.kickers.habits, "Before I change a rule");
  for (const s of [text(), unmark(md())]) assert.doesNotMatch(s, /One habit, with receipts/i);
  // Round 3 (2 Nov): the bounce chart's line lost "After, not because:" (two round 2 readers flagged it); the story
  // behind its click still says "so I say after, not because".
  // Round 5 (2 Nov): "Not all of the drop is the screen." read as a tagline (the round 4 recruiter); the line points at the
  // teammate's bars that show it.
  assert.equal(VISUAL.stories.bounces.after, "The teammate's list fell a little too, so the screen isn't the whole cause.");
  assert.doesNotMatch(text(), /After, not because|Not all of the drop is the screen/);
  // Round 5: "Two times it broke" undersold the bounce chart under it (the round 4 agency reader). 9 Nov, late: the
  // stories follow What I've built and How I test, and the label says what they show.
  assert.equal(VISUAL.kickers.failures, "What I caught, and what I changed");
  assert.doesNotMatch(text(), /Two times it broke/);
  // Round 4 (2 Nov): the click is named by its own three sub-heads, and the GitHub profile is a link only (its gloss was
  // flagged by 3 of 4 round 3 readers; the repos above it show what can be checked).
  // 9 Nov, late (jury, 3 of 4): How I test is a section with its own click, so this click names what it holds.
  assert.equal(NERD.summary, "The pipeline and Clay in depth");
  assert.equal(VISUAL.clicks["how-i-test"], "How each test works");
  const profile = LIVE.items.find((l) => l.id === "live-profile");
  assert.ok(profile && !profile.text && !profile.code, "the GitHub profile has a gloss again");
  assert.match(section("live"), /<li id="live-profile"><a class="link" href="https:\/\/github\.com\/Manveen07" target="_blank" rel="noopener">My GitHub profile ↗<\/a><\/li>/);
  for (const s of [text(), unmark(md())]) assert.doesNotMatch(s, /each project says how often it's wrong|nerd details/i);
});

test("habit: the email check replayed before switching, struck and circled, with its limit and its story (v2.1)", () => {
  // Manveen, 2 Nov, on the leadlens card: "i think this is not related to my gtm work maybe you can reword this so it
  // aligns with gtm". The leadlens story stays in the corrections log and its post, off the main page.
  assert.deepEqual(HABITS.map((h) => h.id), ["habit-replay"]);
  const h = HABITS[0];
  // Round 5 (2 Nov): "0 of 123 passed → 70 of 123 pass" needed two reads for all 4 round 4 readers, and its struck 0 was
  // true by construction (they were the check's own refusals).
  assert.deepEqual(h.exhibit, { struck: "123 refused", circled: "70 of them", rest: " pass the new rules" });
  assert.ok(h.lines.length >= 2 && h.lines.length <= 3, "two or three short lines");
  // Reviews (2 Nov): "email match check", never a bare "email check" (it read as an email verifier). Round 3: it says what
  // it matches (all 4 round 2 readers stumbled on it), in the same 16 words.
  assert.match(h.head, /^Our email match check \(right person, right company\) refused real people, so I re-ran its refusals$/);
  assert.ok(h.head.split(" ").length <= 16, "the habit head grew");
  // 9 Nov: off the card with the redesign, back the same evening (his call); the click says it too.
  assert.match(h.lines.join(" "), /costs twice: we paid for that email, then pay the next provider\./);
  assert.match(EMAILS.broke, /every wrong rejection costs twice/, "the click lost the cost line");
  assert.match(h.lines.join(" "), /Before switching, I ran old and new rules on all 2,376 past emails: 77 more passed and no old pass was lost\./);
  // The limit, said last, covers both numbers: the 70 came from the same 123 the rules did, and nobody checked the 77
  // (round 3: the cto read the old line as contradicting the head). Round 4: in the first person.
  assert.equal(h.lines.at(-1), "I built the rules from those 123, and no one has checked yet whether the 77 are the right people.");
  assert.match(h.checked, /^checked against: the old rules' answers$/);
  assert.equal(h.story, EMAILS);
  const card = section("habits").match(/<article class="habit" id="habit-replay">[\s\S]*?<\/article>/)?.[0] ?? "";
  assert.ok(card.includes('<s class="pen-strike">123 refused</s>'), "123 refused is not struck through");
  // The circle keeps the one word after it, and the rest wraps (the whole phrase is wider than a phone's line).
  assert.match(card, /<span class="pc-nb"><span class="pen pen-circle">70 of them<svg[\s\S]*?<\/svg><\/span> pass<\/span> the new rules<\/p>/);
  assert.ok(card.indexOf('class="habit-tag"') < card.indexOf("<details"), "the click is not under the tag");
  for (const s of [squash(plain(section("habits"))), squash(plain(section("habits").replace(/<details[\s\S]*?<\/details>/g, "")))]) {
    assert.doesNotMatch(s, /fake AI job|11 of 11|leadlens|\bA\/B\b/, "the leadlens story or an A/B is on the habit card");
  }
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
  // Round 5 (2 Nov): "Where I corrected myself (newest: ...)" until then (the round 4 founder flagged it).
  assert.match(logSummary(), /^My corrections log \(last entry \d{1,2} [A-Z][a-z]{2}\)$/);
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
  for (const id of ["skills", "inbox-fleet", "live", "agents", "habits", "contact"]) {
    const html = section(id).replace(/<details[\s\S]*?<\/details>/g, "");
    assert.doesNotMatch(html, /style="[^"]*(?:#c4161c|rgb\(196, ?22, ?28\)|var\(--red\))/i, `#${id}: an inline red style`);
  }
  assert.doesNotMatch(page(), /class="prose-link"/, "a red post link on this page");
  assert.doesNotMatch(section("live"), /<code style=/, "the command is styled through Inline (red)");
  // The struck and circled habit numbers, the agents' gate loop and the Claygent rings are the pen's.
  assert.match(styles, /\.sketch \.lane\{[^}]*stroke:var\(--rule\)/);
});

// ── 3 Nov: the inbox fleet ──────────────────────────────────────────────────
test("the inbox fleet: seven stages in order, the person's three circled in red, the test an open dot, one click, the credit", () => {
  // Manveen, 3 Nov: "you did not have anything about inboxes we have ramping up killing odering fleet management domain
  // renewal all automated but i don;t thnk we mention it", then "start with outcome how it would look on the website and
  // then we can build", and "but [teammate] built an app that tracked renwals we imporved it and built all of the rest". The
  // bot's checked inventory: ordering, retiring and renewing each wait on a person, and the warm-up change is a test.
  assert.equal(VISUAL.kickers.fleet, "The inbox fleet");
  assert.deepEqual(INBOX.stages.map((s) => s.name), ["order", "set up", "score", "watch", "warm-up", "retire list", "before the bill"]);
  assert.deepEqual(INBOX.stages.map((s) => s.who), ["person", "bot", "bot", "bot", "test", "person", "person"]);
  const html = page();
  // 9 Nov (his pick, "Proof first"): after Me and my agents, before Check it yourself.
  const at = ["agents", "inbox-fleet", "live"].map((id) => html.indexOf(`<section id="${id}"`));
  assert.ok(at[0] >= 0 && at[0] < at[1] && at[1] < at[2], `not after Me and my agents and before Check it yourself: ${at}`);
  const sec = section("inbox-fleet");
  const copy = unmark(md());
  const drawing = sketch(sec, INBOX.label);
  assert.ok(drawing, "#inbox-fleet does not hold its drawing");
  assert.ok(copy.includes(INBOX.label), "the drawing's reading is not in the copy");
  for (const cls of ["sketch-wide", "sketch-tall"]) {
    const svg = drawing.match(new RegExp(`<svg class="${cls}"[\\s\\S]*?</svg>`))?.[0] ?? "";
    assert.ok(svg, `${cls}: missing`);
    // One group per stage, in order: its dot, its numbered name, its grey line, and a red loop only where a person decides.
    const groups = [...svg.matchAll(/<g>([\s\S]*?)<\/g>/g)].map((m) => m[1]);
    assert.equal(groups.length, INBOX.stages.length, `${cls}: not one group per stage`);
    INBOX.stages.forEach((s, i) => {
      const g = groups[i];
      const texts = [...g.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => decode(m[1]));
      assert.deepEqual(texts, [`${i + 1} ${s.name}`, s.sub], `${cls}: stage ${i + 1} is not drawn in its place`);
      assert.equal(/class="mark"/.test(g), s.who === "person", `${cls}: stage ${i + 1}: a red loop only where a person decides`);
      assert.match(g, new RegExp(`<circle[^>]*class="${s.who === "test" ? "open" : "dot"}"`), `${cls}: stage ${i + 1} has the wrong dot`);
    });
    // The key circles its own "a person decides", so each layout has one red loop more than it has gates.
    assert.equal((svg.match(/class="mark"/g) ?? []).length, INBOX.stages.filter((s) => s.who === "person").length + 1, `${cls}: red loops`);
    const drawn = [...svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => decode(m[1]));
    for (const k of Object.values(INBOX.key)) assert.ok(drawn.includes(k), `${cls}: the key's "${k}" is not drawn`);
    for (const w of drawn) assert.ok(copy.includes(w), `${cls}: "${w}" is drawn but not in the copy`);
    const red = [...svg.matchAll(/<text[^>]*class="red"[^>]*>([^<]*)<\/text>/g)].map((m) => decode(m[1])).join(" ");
    assert.equal(red, INBOX.note, `${cls}: the red note is not drawn whole`);
  }
  // Stage 5 is a test, said as one and dated (his standup of 2 Nov, in the past tense), never as running for every
  // inbox, and never as the bot's (the standup says "it", never which code).
  const warm = INBOX.stages[4];
  assert.match(warm.sub, /^a test, as of \d{1,2} [A-Z][a-z]{2}$/);
  assert.match(warm.detail, /As of 2 Nov I was testing a change on a subset of the agency's own inboxes/);
  assert.match(warm.detail, /only if it works\.$/);
  assert.doesNotMatch(warm.detail, /\bthe bot\b|\bsince \d/i, "stage 5 names the bot or a start date");
  // The truth review (3 Nov), against the bot's own files: a person places each order by hand (Slack ordering is off);
  // the setup intake isn't shown to run, so the bot is never said to write the standard; the renewal review marks the
  // bot's own tracker, so "changes nothing" is said only of the provider.
  const [order, setup, , , , , bill] = INBOX.stages;
  assert.match(order.detail, /A person places each one by hand/);
  assert.doesNotMatch(order.detail, /approver says yes|that path/, "stage 1 says Slack approvals placed the orders");
  assert.doesNotMatch(setup.detail, /bot writes|is piloting/, "stage 2 says the bot writes the standard or the pilot runs");
  assert.match(setup.detail, /by 31 Oct those domains had sent nothing, so it hadn't changed a limit\.$/);
  assert.match(bill.detail, /It changes nothing at the provider; it only marks the retire and check inboxes on the bot's own tracker/);
  assert.doesNotMatch(bill.detail, /changes nothing itself/);
  // The wide line ends just past the last stage's dot, as it starts just before the first (a longer tail read as a
  // missing eighth stage).
  const wide = drawing.match(/<svg class="sketch-wide"[\s\S]*?<\/svg>/)[0];
  const ends = wide.match(/<path class="ink" d="M(\d+) \d+ [^"]* (\d+) \d+"/);
  const cx = [...wide.matchAll(/<circle cx="(\d+)" cy="(\d+)" r="5" class="(?:dot|open)"/g)].map((m) => Number(m[1]));
  assert.ok(ends, "the wide line is missing");
  assert.ok(cx[0] - Number(ends[1]) <= 15 && Number(ends[2]) <= cx[INBOX.stages.length - 1] && cx[INBOX.stages.length - 1] - Number(ends[2]) <= 15, `the wide line runs from ${ends[1]} to ${ends[2]}, the stages from ${cx[0]} to ${cx[INBOX.stages.length - 1]}`);
  // What shows without a click: the lead line, the drawing, one caption and the credit; one click holds each stage's detail.
  const shown = sec.replace(/<details[\s\S]*?<\/details>/g, "");
  assert.deepEqual([...shown.matchAll(/<p class="([^"]+)">([\s\S]*?)<\/p>/g)].map((m) => [m[1], squash(plain(m[2]))]), [["body", INBOX.lead], ["body", INBOX.credit]]);
  assert.equal(squash(plain(shown.match(/<figcaption class="cap">([\s\S]*?)<\/figcaption>/)?.[1] ?? "")), INBOX.caption);
  assert.equal(INBOX.lead, "A bot runs the routine work on our sending inboxes; a person decides what we buy and what we retire.");
  assert.equal(INBOX.caption, "About 350 sending inboxes tracked, as of 2 Nov.");
  // His wording (3 Nov), with the bot's commit count beside it (git shortlog, 3 Nov: 365 of 386).
  assert.equal(INBOX.credit, "My teammate built its renewal tracker; I improved it and built the rest: 365 of the bot's 386 commits are mine.");
  const clicks = [...sec.matchAll(/<details[\s\S]*?<\/details>/g)].map((m) => m[0]);
  assert.equal(clicks.length, 1, "#inbox-fleet should hold one click");
  assert.equal(INBOX.summary, "How the inbox bot works");
  assert.match(clicks[0], /^<details class="more" id="inbox-bot"><summary><span class="more-line more-label">How the inbox bot works<\/span>/);
  const items = [...clicks[0].matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => squash(plain(m[1])));
  assert.deepEqual(items, INBOX.stages.map((s) => `${stageHead(s)} ${s.detail}`), "the click's stages are not the drawing's, in order");
  assert.equal(stageHead(INBOX.stages[0]), "Order, a person decides.");
  assert.equal(INBOX.never, "The bot never orders, renews or retires anything by itself.");
  assert.ok(squash(plain(clicks[0])).includes(INBOX.never), "the never line is not in the click");
  // No "automated" in this section, and none beside ordering, renewing, retiring or killing on the page or in its copy
  // (the inventory: each waits on a person).
  assert.doesNotMatch(squash(plain(sec)), /automat/i, "the inbox fleet says automated");
  for (const s of [text(), copy]) {
    assert.doesNotMatch(s, /\bautomat\w*\b[^.]{0,80}\b(?:order|renew|retir|kill)\w*|\b(?:order|renew|retir|kill)\w*\b[^.]{0,80}\bautomat\w*/i, "automated beside ordering, renewing, retiring or killing");
  }
});

// ── 3 Nov: two figures that play once in view (his pick of the animation mockups: "sure ggo with 2 but other can be in
// their respected blogs"; options 4 and 5 live here) ──────────────────────────────────────────────────────────────
/** Each `--at` delay in a piece of markup, in page order. */
const delays = (html) => [...html.matchAll(/--at:([\d.]+)s/g)].map((m) => Number(m[1]));
const inOrder = (d) => d.every((x, i) => i === 0 || x >= d[i - 1]);
/** The CSS outside every (min-width: 640px) block. */
const outsideMedia640 = (styles) => {
  let rest = styles;
  for (let at = rest.indexOf("@media (min-width:640px){"); at !== -1; at = rest.indexOf("@media (min-width:640px){")) {
    let depth = 1;
    let i = at + "@media (min-width:640px){".length;
    for (; i < rest.length && depth > 0; i++) depth += rest[i] === "{" ? 1 : rest[i] === "}" ? -1 : 0;
    rest = rest.slice(0, at) + rest.slice(i);
  }
  return rest;
};

// The Clay line as master had it (data/how.ts NERD.clay[1] until 3 Nov evening, when his yes cut it from under the
// figure that draws it): the free check's numbers and wording are pinned to it.
const CLAY_LINE = "I mapped a 34,044-company market from Clay's search for 0 data credits, and a free mail-server check cut 28% of it. Claygent checked 24,506 companies at about 0.18 credits each, and 16,728 passed.";

test("the free check (3 Nov): under Clay in depth, every bar to scale of the market, the cut the one red, each caveat beside its number", () => {
  const F = FREE_CHECK;
  const nerd = section("skills").match(/<details class="more" id="nerd">[\s\S]*?<\/details>/)?.[0] ?? "";
  const open = `<figure id="${F.id}" class="fc" aria-labelledby="${F.id}-head">`;
  const at = nerd.indexOf(open);
  assert.ok(at > 0, "no free check figure in the pipeline click");
  // Under the Clay heading and before its list (whose line saying this funnel in words was cut, 3 Nov evening).
  const head = nerd.indexOf(`<h3 class="nerd-head">${NERD.clayHead}</h3>`);
  assert.ok(head >= 0 && head < at && at < nerd.indexOf('<ul class="nerd-list">', head), "the figure is not between Clay in depth and its list");
  const fig = nerd.slice(at, nerd.indexOf("</figure>", at) + "</figure>".length);
  assert.ok(decode(fig).startsWith(`${open}<div class="fc-top"><h4 id="${F.id}-head" class="fc-head">${F.head}</h4><button type="button" class="replay">${F.replay}</button></div><ol class="fc-rows" role="list">`));
  // Its markdown copy sits in the same place.
  const mdAt = [`#### ${NERD.clayHead}\n`, `##### ${F.head}\n`, `- ${NERD.clay[0]}`].map((s) => md().indexOf(s));
  assert.ok(mdAt.every((i) => i >= 0) && inOrder(mdAt), `the copy is not in page order: ${mdAt}`);

  // Every row's words in the server HTML, and its bar to scale of the market; the cut row draws what's left in ink and the
  // cut hatched in red.
  const market = F.rows[0].n;
  const rows = [...fig.matchAll(/<li class="fc-row[^"]*">([\s\S]*?)<\/li>/g)].map((m) => m[1]);
  assert.equal(rows.length, 4);
  rows.forEach((html, i) => {
    const r = F.rows[i];
    const blocks = [...html.matchAll(/<p class="(fc-[a-z]+)"[^>]*>([\s\S]*?)<\/p>/g)].map((m) => [m[1], squash(plain(m[2]))]);
    assert.deepEqual(blocks, [["fc-name", r.name], ["fc-sub", r.sub], ["fc-val", r.value], ...(r.note ? [["fc-note", r.note]] : [])], `row ${i + 1}`);
    const w = [...html.matchAll(/<i class="(fc-bar|fc-cut)" aria-hidden="true" style="[^"]*--w:([\d.]+)/g)].map((m) => [m[1], Number(m[2])]);
    const want = r.cut ? [["fc-bar", 1 - r.cut / 100], ["fc-cut", r.cut / 100]] : [["fc-bar", r.n / market]];
    assert.deepEqual(w.map((x) => x[0]), want.map((x) => x[0]), `row ${i + 1}: its bars`);
    w.forEach((x, k) => assert.ok(Math.abs(x[1] - want[k][1]) < 0.0001, `row ${i + 1}: ${x[0]} is ${x[1]}, not ${want[k][1]}`));
    if (r.n) assert.equal(r.value, r.n.toLocaleString("en-US"));
  });
  assert.equal((fig.match(/class="fc-cut"/g) ?? []).length, 1, "not one red cut");
  // Hyphenated words stay whole when a line wraps (3 Nov late, seen at 1440: "mail-" / "server").
  assert.match(rows[1], /^<p class="fc-name">Cut by a free <span class="nw">mail-server<\/span> check<\/p>/);

  // The numbers are the Clay line's (CLAY_LINE), told as two facts: the cut is 28% of the market, and 24,506 is what
  // went to Claygent (its own count, not what the cut left), so the figure prints no 72%. Never "qualified".
  assert.ok(!NERD.clay.includes(CLAY_LINE) && NERD.clay.every((l) => !l.startsWith("I mapped a 34,044")), "the cut Clay line is back");
  for (const r of F.rows) assert.ok(CLAY_LINE.includes(r.value), `${r.value} is not in the Clay line`);
  assert.deepEqual(F.rows.map((r) => r.sub).filter((s) => /credit/.test(s)), ["mapped with Clay's search, 0 data credits", "before a single credit was spent", "about 0.18 credits each"]);
  const [claygent, bounces] = FAILURES.stories;
  assert.ok(bounces.tested.includes(`On the 34,044-company market it cut 28% ${F.rows[1].sub}`), "the cut's line is not the bounces story's");
  assert.ok(claygent.changed.includes(`${F.rows[3].sub}: it checked 24,506 companies, and 16,728 passed.`), "what passed is not the Claygent story's");
  assert.doesNotMatch(squash(plain(fig)), /\b72%|24,492|qualified|\b195\b/i, "a derived 72%, the cut's remainder, 'qualified' or the mockup's unsourced 195");
  // The fit check's caveat, beside what passed, in the site's words: the Claygent story, the 2 Nov corrections log and
  // the claims table's short form ("none of the 5 niches cleared my full bar until I relabelled borderline companies;
  // then 3 did"). Review (3 Nov, truth): "Not every segment had passed its bar" understated it (none had, before the
  // relabels), and 3 of 4 readers could not decode the old line.
  // Two rows carry a line under their number (3 Nov, late): the market its "sorted in four days" (the home page's old
  // 34,044 tile, moved here when this figure took its place there), and what passed its caveat. The market's line says
  // what sorted them (review, 3 Nov: three of four readers asked "sorted into what?").
  assert.deepEqual(F.rows.map((r) => r.note !== undefined), [true, false, false, true], "the caveat is not beside what passed");
  assert.equal(F.rows[0].note, "All of them sorted by the checks below, in four days.");
  assert.ok(claygent.changed.includes("Two ran with one check short"));
  assert.ok(claygent.tested.includes("only cleared it after I changed borderline companies' labels to toss-ups, with the same answers from the model, so I don't count those passes as proof."));
  assert.ok(LIVE.log.some((e) => e.text.endsWith("It said one segment cleared my bar only after a relabel; three did.")));
  assert.equal(F.rows[3].note, "Three segments cleared my bar only after I relabelled borderline companies, so that's not proof. Two missed it and ran; on 3 Nov I merged a check to stop that.");
  assert.doesNotMatch(F.rows[3].note, /Not every segment/);

  // The bounce row: the bounces story's sentence, the teammate's lists beside mine, and its "after, not because".
  // Review (3 Nov, truth): under "Checked by Claygent" and a head saying "On one market", "the check" read as Claygent's,
  // on that market; the story's check is the DNS mail-server check, on every list he built, so the row says both.
  const R = F.result;
  const result = fig.slice(fig.indexOf('<div class="fc-result">'));
  assert.deepEqual(
    [...result.matchAll(/<p class="(fc-[a-z]+)"[^>]*>([\s\S]*?)<\/p>/g)].map((m) => [m[1], squash(plain(m[2]))]),
    [["fc-name", R.name], ["fc-sub", R.sub], ["fc-line", R.lines[0]], ["fc-line", R.lines[1]], ["fc-note", R.note]],
  );
  assert.equal(R.name, "Bounces on all the lists I built");
  assert.equal(R.sub, "after the mail-server check went in");
  assert.ok(bounces.changed.includes(`Bounces on the lists I built went from ${R.lines[0]} after the check went in.`), "the bounce line is not the story's");
  assert.ok(bounces.tested.startsWith("Now a DNS check (a free lookup of which mail server a company uses) runs before any paid email lookup"), "the story's check is not the mail-server check");
  assert.equal(R.lines[1].split(": ")[0], "a teammate's lists, loaded without it");
  assert.ok(bounces.changed.includes(`A teammate's lists, loaded without it, went from ${R.lines[1].split(": ")[1]} over the same weeks.`), "the teammate's line is not the story's");
  assert.ok(bounces.changed.endsWith(R.note.replace("the mail-server check", "this one check")), "the bounce caveat is not the story's");

  // Short blocks, played in reading order, in about 3.6 seconds (3 Nov, late: about 9 until then, and the night's readers
  // called it slow; the home page's copy plays the same schedule): the last part starts by 3.6 s and rises in 450ms.
  for (const b of [F.head, ...F.rows.flatMap((r) => [r.name, r.sub, r.value, r.note ?? ""]), R.name, R.sub, ...R.lines, R.note]) assert.ok(words(b) <= 30, `over 30 words: ${b}`);
  const d = delays(fig);
  assert.equal(d.length, 14, "not one delay per bar, number, line and caveat");
  assert.ok(inOrder(d), `delays out of order: ${d}`);
  assert.ok(Math.max(...d) >= 3 && Math.max(...d) <= 3.6, `the last part starts at ${Math.max(...d)} s`);
});

test("what runs on its own (3 Nov): its own click under the agents drawing, the two agents lines inside it, two columns, real lines only, each in the site's words", () => {
  const S = SPLIT;
  const sec = section("agents");
  const clicks = [...sec.matchAll(/<details[\s\S]*?<\/details>/g)].map((m) => m[0]);
  assert.equal(clicks.length, 1, "#agents should hold one click");
  const click = clicks[0];
  // 9 Nov: the two lines under the drawing moved inside the click, before its columns (two readers found them repeating
  // step 5 and the AI agents row); nothing sits between the drawing and the click.
  assert.ok(sec.indexOf(AGENTS.lines[0]) > sec.indexOf("<details"), "the agents lines are back under the drawing");
  assert.ok(sec.indexOf("<svg") >= 0 && sec.indexOf("<svg") < sec.indexOf("<details"), "the click is above the agents drawing");
  assert.equal(VISUAL.clicks[S.id], "What runs on its own, and what waits for a person");
  const lines = AGENTS.lines.map((l) => `<p class="body">${l}</p>`).join("");
  assert.ok(
    decode(click).startsWith(
      `<details class="more" id="${S.id}"><summary><span class="more-line more-label">${VISUAL.clicks[S.id]}</span><span class="more-hint" aria-hidden="true"></span></summary>${lines}<div class="split"><div class="split-top"><button type="button" class="replay">${S.replay}</button></div><div class="split-cols">`,
    ),
    "the click is not styled like the page's other clicks, its lines aren't first, or its figure doesn't open it",
  );
  // The columns: the drawing's lane name for the person; every line in the server HTML, in order.
  assert.deepEqual([...click.matchAll(/<h3 class="split-head[^"]*">([^<]*)<\/h3>/g)].map((m) => decode(m[1])), ["agents and bots", "a person"]);
  assert.match(click, /<h3 class="split-head split-head-person">a person<\/h3>/, "the person's head is not the one red");
  assert.equal(S.heads.person, AGENTS.lanes.person);
  const list = (cls) => click.match(new RegExp(`<ul class="${cls}" role="list">([\\s\\S]*?)</ul>`))?.[1] ?? "";
  assert.deepEqual([...list("split-bots").matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((m) => squash(plain(m[1]))), S.bots);
  const calls = [...list("split-calls").matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map((m) => [...m[1].matchAll(/<p class="split-(?:call|why)">([\s\S]*?)<\/p>/g)].map((p) => squash(plain(p[1]))));
  assert.deepEqual(calls, S.person.map((c) => [c.call, ...(c.why ? [c.why] : [])]));
  assert.equal(squash(plain(click.match(/<p class="split-cap">([\s\S]*?)<\/p>/)?.[1] ?? "")), S.note);
  // The copy prints it under the agents drawing, its two lines first, before The inbox fleet (9 Nov).
  const mdAt = [`## ${VISUAL.kickers.agents}\n`, `### ${VISUAL.clicks[S.id]}\n`, `${AGENTS.lines[0]}\n`, `#### ${S.heads.bots}\n`, `#### ${S.heads.person}\n`, `## ${VISUAL.kickers.fleet}\n`].map((s) => md().indexOf(s));
  assert.ok(mdAt.every((i) => i >= 0) && inOrder(mdAt), `the copy is not in page order: ${mdAt}`);

  // Left: every line is already on this page, in its words, in the order things ran (review, 3 Nov: the free check
  // before the Claygent spend, as the free check figure shows).
  // 9 Nov: "Checking AI output" left the skills rows; its sentence is the first story's line (HELD.line).
  // 9 Nov, late: the n8n and Python rows moved to How I test (TESTING), ids kept.
  const skill = (id) => (id === "skill-checking" ? HELD.line : ([...SKILLS, ...TESTING].find((s) => s.id === id)?.line ?? ""));
  const [cutLine, claygentLine, agentsLine, inboxLine, alertsLine, listLine] = S.bots;
  assert.ok(CLAY_LINE.includes(`${claygentLine}, and 16,728 passed.`), "the Claygent line is not the Clay line's");
  assert.ok(CLAY_LINE.includes("a free mail-server check cut 28% of it"));
  assert.ok(FAILURES.stories[1].tested.includes("On the 34,044-company market it cut 28% before a single credit was spent"));
  assert.equal(cutLine, "a free mail-server check cut 28% of a 34,044-company market before a single credit was spent");
  // 9 Nov, late: the row says who the follow-ups are for; the click's line is its first words.
  assert.ok(skill("skill-agents").startsWith(`Since 16 Oct m${agentsLine.slice(1).replace(" since 16 Oct", "")}`), "the agents line is not the AI agents row's");
  assert.match(INBOX.stages.find((s) => s.name === "score")?.detail ?? "", /scores it 0 to 100/);
  assert.equal(INBOX.caption, "About 350 sending inboxes tracked, as of 2 Nov.");
  assert.equal(inboxLine, "our inbox bot scores every sending inbox 0 to 100; about 350 are tracked, as of 2 Nov");
  // 40 is the 14 Oct count, so "as of", never "since".
  assert.match(skill("skill-n8n"), /^On 14 Oct I put error alerts on 40 live workflows;/);
  assert.equal(alertsLine, "error alerts on 40 live n8n workflows, as of 14 Oct");
  // Review (3 Nov, truth): the step's "what" ("Reads the whole list before anything uses it"), under "runs on its own",
  // read as the retired "nothing moves on" and hid the person who reads a sample; the line is its check's own words.
  const listCheck = PIPELINE_STEPS.steps.find((s) => s.name === "list check")?.check ?? "";
  assert.equal(listLine, "the list check blocks duplicates, do-not-contact and recent contact; a person reads a sample");
  assert.ok(listCheck.startsWith("Blocks duplicates, ") && listCheck.includes("do-not-contact, recent contact") && listCheck.endsWith("; a person reads a sample."), "the list check line is not its step's check");

  // Right: the calls that stay with a person, each in its source's words; the held list's caveats in the caption.
  const [bar, yes, buy, mistake] = S.person;
  assert.equal(bar.why, skill("skill-checking").replace(/^My/, "my").replace(", under my 90% bar;", ", so").replace(/\.$/, ""));
  assert.equal(bar.call, "My 90% bar on a sample of 50");
  assert.equal(PROOF["held-list"].steps[1].name, "Sample of 50");
  assert.ok(skill("skill-agents").endsWith("each send needs a person's yes."));
  assert.equal(yes.call, "Each follow-up send needs a person's yes");
  assert.ok(INBOX.lead.endsWith(`; ${buy.call[0].toLowerCase()}${buy.call.slice(1)}.`), "the buy and retire call is not the inbox fleet's lead");
  assert.equal(INBOX.never, `T${buy.why.slice(1)}.`);
  // The merge from home's Work point, its second half in the testing line's plainer words with "email" (3 of 4 readers
  // found "one address on two people" cryptic); the call is the home strip's step 5, an action, never the retired rule.
  assert.ok(JOBS[0].points?.some((p) => p.startsWith("A merge once put emails on the wrong people; ")), "the mistake's example is not the Work point's");
  assert.ok(NERD.testing.some((l) => l.includes("now the list check blocks a list where one address sits on two people.")));
  assert.equal(mistake.why, "a merge once put emails on the wrong people; now the list check blocks a list where one email address sits on two people");
  assert.equal(mistake.call, "Turning a mistake into a check");
  assert.equal(FIVE_HABITS.steps[4].name, "turn a mistake into a check");
  // The caption names the session it means (one reader: "that session" had nothing to point at inside the click).
  assert.equal(S.note, `On the held list, the second Claude session ${PROOF["held-list"].limit.replace(/^That session /, "")}`);

  // Retired: the mockup's heading (he said not to brag) and its made-up feed lines; no "daily" here (the follow-up agents'
  // runs failed on 1 and 2 Nov), no "every list" (ticked rows skip the gates), no "since 14 Oct" for a count of that day.
  for (const s of [squash(plain(click)), unmark(md())]) {
    assert.doesNotMatch(s, /do the volume|I set the bar and decide|company 1,2\d\d|\b(?:87|41|92)\/100\b|a reseller|Mimecast · skipped|waits for a person's yes|reads the thread first/i);
  }
  assert.doesNotMatch(squash(plain(click)), /\bdaily\b|\bevery list\b|since 14 Oct|before anything uses it|becomes a check/i);

  for (const b of [VISUAL.clicks[S.id], ...S.bots, ...S.person.flatMap((c) => [c.call, c.why ?? ""]), S.note]) assert.ok(words(b) <= 30, `over 30 words: ${b}`);
  // The left lines first, then each call in turn, about 4 seconds (3 Nov, two of four readers: at 7.5 the calls sat
  // dimmed so long they looked switched off).
  const d = delays(click);
  assert.equal(d.length, S.bots.length + S.person.length);
  assert.ok(inOrder(d), `delays out of order: ${d}`);
  assert.ok(Math.max(...d) >= 3 && Math.max(...d) <= 4.5, `the last call lights at ${Math.max(...d)} s`);
});

test("the two figures (3 Nov) play once in view and hold their last frame; no JavaScript or reduced motion get it still", () => {
  const styles = css();
  // Each (prefers-reduced-motion: no-preference) block, whole.
  const blocks = [];
  for (const m of styles.matchAll(/@media \(prefers-reduced-motion:no-preference\)[^{]*\{/g)) {
    let depth = 1;
    let i = m.index + m[0].length;
    for (; i < styles.length && depth > 0; i++) depth += styles[i] === "{" ? 1 : styles[i] === "}" ? -1 : 0;
    blocks.push(styles.slice(m.index, i));
  }
  const motion = blocks.filter((b) => /\.(?:fc|split)\b/.test(b)).join("\n");
  // The waiting state needs JavaScript (pen-js) and waits for the observer (.in); the play starts on .in, held at the end.
  for (const sel of [".fc-val", ".fc-note", ".fc-line"]) assert.match(motion, new RegExp(`\\.pen-js \\.fc:not\\(\\.in\\) \\${sel}[,{]`));
  assert.match(motion, /\.pen-js \.split:not\(\.in\) \.split-bots li[,{]/);
  assert.match(motion, /\.pen-js \.split:not\(\.in\) \.split-calls p\{opacity:0?\.3\}/);
  for (const [sel, name] of [["\\.fc\\.in \\.fc-bar", "fc-grow"], ["\\.fc\\.in \\.fc-cut", "fc-grow"], ["\\.split\\.in \\.split-bots li", "rise-in"], ["\\.fc\\.in \\.fc-val", "rise-in"], ["\\.split\\.in \\.split-calls p", "split-on"], ["\\.split\\.in \\.split-calls li:{1,2}before", "split-mark"]]) {
    assert.match(motion, new RegExp(`${sel}[^{]*\\{animation:${name} [^}]*var\\(--at\\) ?both\\}`), `${sel}: not played on .in, held at the end`);
  }
  // Outside those blocks nothing of the two figures waits unseen or moves: no-JS readers and reduced motion see the last frame.
  let rest = styles;
  for (const b of blocks) rest = rest.replace(b, "");
  for (const [, sel, body] of rest.matchAll(/([^{}]*\.(?:fc|split)\b[^{}]*)\{([^}]*)\}/g)) {
    assert.doesNotMatch(body, /opacity:(?:0|\.\d)|scale[XY]?\(0\)|animation/, `${sel.trim()} hides or moves a figure outside no-preference`);
  }
  // Only opacity and transform move.
  const frames = [...styles.matchAll(/@keyframes (fc-grow|rise-in|split-on|split-mark)\{((?:[^{}]*\{[^}]*\})+)\}/g)];
  assert.deepEqual(frames.map((m) => m[1]).sort(), ["fc-grow", "rise-in", "split-mark", "split-on"]);
  for (const [, name, body] of frames) {
    for (const [, decls] of body.matchAll(/\{([^}]*)\}/g)) for (const dcl of decls.split(";").filter(Boolean)) assert.match(dcl, /^(?:opacity|transform):/, `${name}: ${dcl}`);
  }
  // Red is the pen, one mark each: the cut and its number; the "a person" head (code review, 3 Nov: four red call edges
  // were four red moments, so the edges draw in ink).
  const reds = [...styles.matchAll(/([^{}]*\.(?:fc|split)\b[^{}]*)\{([^}]*)\}/g)].filter((m) => /--red|#c4161c/i.test(m[2])).map((m) => m[1].trim().replace(/::?before/, ":before"));
  assert.deepEqual([...new Set(reds)].sort(), [".fc-cut", ".fc-cutrow .fc-val", ".split-head-person"]);
  assert.match(styles, /\.split-calls li:{1,2}before\{[^}]*background:var\(--ink\)/);
  // The bounce row's sub line sits right under its name from 640px (it floated 38px down).
  assert.match(styles, /\.fc-result\{grid-template-rows:auto 1fr\}/);
  assert.match(styles, /\.fc-sub\{[^}]*text-wrap:balance/);
  // Hyphenated words in the split stay whole when a line wraps ("do-" / "not-contact", seen in Edge on 3 Nov).
  // One rule with the free check's since 3 Nov late (components/sketches/whole.tsx): an inline-block, so text-wrap:
  // balance weighs the word as one box.
  assert.match(styles, /\.fc \.nw,\.split \.nw\{(?=[^}]*display:inline-block)(?=[^}]*white-space:nowrap)[^}]*\}/);
  assert.match(section("agents"), /<span class="nw">do-not-contact<\/span>/);
  // Phones: one column; the free check's two columns and the split's only from 640px.
  assert.doesNotMatch(outsideMedia640(styles), /\.split-cols\{[^}]*grid-template-columns/, "the split's two columns apply on phones");
  assert.match(styles, /\.split-cols\{[^}]*grid-template-columns:minmax\(0,1\.15fr\) ?minmax\(0,1fr\)/, "no two columns from 640px");
  assert.doesNotMatch(outsideMedia640(styles), /\.fc-row,\.fc-result\{[^}]*grid-template-columns:240px/, "the free check's two columns apply on phones");
  assert.match(styles, /\.fc-row,\.fc-result\{[^}]*grid-template-columns:240px minmax\(0,1fr\)/, "no two columns from 640px");
  // Replay: shown once the figure has played, a visible focus ring, gone under reduced motion (nothing to replay).
  assert.match(styles, /\.fc\.in \.replay,\.split\.in \.replay(?:,[^{}]*)?\{visibility:visible\}/);
  assert.match(styles, /\.replay:focus-visible\{outline:2px solid var\(--red\)/);
  assert.match(styles, /@media \(prefers-reduced-motion:reduce\)\{[^@]*(?<![\w-])\.replay\{display:none\}/);
  // No timers or listeners to leak (the delays are CSS; the observer is useReveal's, disconnected on unmount), and no
  // words that only JavaScript writes.
  for (const f of ["components/sketches/FreeCheckFirst.tsx", "components/sketches/OnItsOwn.tsx", "lib/motion.ts"]) {
    assert.doesNotMatch(read(f), /setTimeout|setInterval|requestAnimationFrame|addEventListener|textContent|innerHTML|innerText/, f);
  }
  assert.match(read("components/sketches/FreeCheckFirst.tsx"), /useReveal<HTMLElement>\(\)/);
  assert.match(read("components/sketches/OnItsOwn.tsx"), /useReveal<HTMLDivElement>\(\)/);
});
