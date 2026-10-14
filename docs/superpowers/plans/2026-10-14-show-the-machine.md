# Show the machine: implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make manveen.me intriguing by showing the inside of the work: three hand-drawn sketches (the problem, the machine, the offer) driven by real data, leadlens's real scorecard, a real PresentAI screenshot, Manveen's photo, and hand-drawn dividers, without any AI-template look.

**Architecture:** Same Next.js 16 app on branch `redesign-red-pen`. Sketches are server components that render inline SVG (a wide version from 640px up, a tall version below) inside one small client wrapper, `Sketch`, which only adds `.in` when scrolled into view so the red marks draw once. New Tender Radar numbers come from the daily summary through a pure parser in `lib/runs.ts`, on the same live/snapshot path as the run count.

**Tech Stack:** Next.js 16.1.6, React 19.2, TypeScript 5, plain CSS in `app/globals.css`, `node:test`.

**Spec:** `docs/superpowers/specs/2026-10-14-show-the-machine-design.md` (binding), which builds on `docs/superpowers/specs/2026-10-13-credibility-site-redesign-design.md` (still binding).

## Global Constraints

- Branch `redesign-red-pen`. Never push or merge; never touch Vercel.
- Build and lint: `cmd.exe /c "npm run build"`, `cmd.exe /c "npm run lint"` (Windows npm; node_modules has only the Windows Next binary). Tests: WSL Node 24, `node --test tests/site.test.mjs tests/runs.test.mjs`, after a build.
- Edit files ONLY with the Write and Edit tools: the Bash tool turns `\b`, `\d`, `\s` in command text into control characters. Before committing run `python3 -I .superpowers/sdd/2026-10-13-red-pen-redesign/ctrlchars.py <changed files>` (each must print `clean`).
- No new dependencies. `git status` before `git add`; exact paths only. Commit as `area: what changed` with a `Co-Authored-By: Claude <your model> <noreply@anthropic.com>` trailer.
- Palette: paper `#f4f1ea`, wash `#ebe6da`, ink `#1d1d1d`, dim `#5a5750`, rule `#d9d3c5`, red `#c4161c`. Sketch labels in IBM Plex Mono via `var(--font-mono)`.
- Copy: every visible string in this plan is exact. No em or en dashes; none of leverage, utilise, streamline, optimise, robust, seamless, cutting-edge, AI-powered, AI-driven, solution, transform, honest. "Book a call" stays exactly 3 Calendly links on the home page.
- Anti-slop rules (spec section 2), every task: shows something real; hand-drawn uneven paths, never perfect rectangles or icons; no gradients, glass, shadows, emoji, icon sets, stock art, logo strips, carousels, counters, typewriter text, cursor effects, feature grids, glowing buttons, fake data; at most two red marks or notes per section; only motion is a red mark drawing once, off under reduced motion, visible without JS.

## Review Focus

1. **A 320px phone.** Sketch text must stay readable (the tall versions) and nothing scrolls sideways. Test: Task 8 screenshots plus `scrollWidth <= innerWidth`.
2. **The summary table changes shape or can't be parsed.** The sketch must show the saved snapshot's numbers, never zeros it didn't read. Test: Task 1 unit test for `parseVerdicts` returning null, and the pipeline falling back.
3. **No JS / reduced motion.** Sketch red marks must be visible. Test: Task 2 CSS assertions.
4. **Screen readers.** Every sketch has a `role="img"` and a plain-English `aria-label`; the pilot's `<ol>` stays in the DOM. Tests: Tasks 2, 4, 5.
5. **The PresentAI page is a login wall.** No mocked screenshot; the card stays text and the need goes to Manveen. Task 3 decides from what the live page shows.

---

### Task 0: Four sections only

**Files:** Modify `app/page.tsx`, `components/Work.tsx`, `data/portfolio.ts`, `app/globals.css`, `tests/site.test.mjs`, `docs/superpowers/specs/2026-10-13-claims.md`; Delete `components/About.tsx`, `components/Incidents.tsx`.

**Interfaces:** Produces section ids `top, proof, work, contact` only. `WorkItem` gains `quote?: true` (renders `QUOTE` inside that card) and `role?: string`. Later tasks (3) build on this Work layout.

- [ ] **Step 1: update tests first** (Edit tool):
  - The sections-order test expects `["top", "proof", "work", "contact"]` and asserts `!html.includes('id="people"') && !html.includes('id="broke"')`.
  - The headings test expects h2s `["Running right now · Tender Radar", "Work, and who vouches for it", "How working with me goes"]` and 3 h3s.
  - Delete the incident tests ("all four incidents are listed…", and any test pinning `BROKE_INTRO`, "Here are four of them", or "The last 40 runs now show on this page").
  - Keep the quote, Caprae dates/title and Precise Leads tests (the content moves, it doesn't go). Change the Precise Leads assertion to `/Now: GTM automation engineer at Precise Leads, since Nov 2025\./`.
- [ ] **Step 2:** build, see the changed tests fail.
- [ ] **Step 3: data.** Remove `BROKE_INTRO`, `Incident`, `INCIDENTS`. Resume screening `WorkItem`: `where: "At Caprae Capital Partners"`, `role: "Machine Learning Intern · Aug 2025 → Jan 2026 · US, remote"`, `quote: true`. Add `export const NOW_LINE = "Now: GTM automation engineer at Precise Leads, since Nov 2025. B.Tech Computer Science, MSIT Delhi, 2026.";`. `ROLES` and `EDUCATION` go if nothing else uses them (grep).
- [ ] **Step 4: Work.tsx.** Kicker `<h2 className="kicker">Work, and who vouches for it</h2>`. For a card with `role`, render it as `<p className="small">` under the `where` line. For a card with `quote`, render after its metrics the same `<figure className="quote">` the old About had (blockquote with `<Underline>` on `QUOTE.marked`, figcaption with name, title, company and source), wrapped in `<Annotated note={QUOTE.penNote} drop>`. Card titles stay `<h3 className="h3">`. End the section with `<p className="small">{NOW_LINE} <a className="link" href={ME.resume}>Full resume ↗</a></p>`.
- [ ] **Step 5:** `app/page.tsx` renders `Hero, Proof, Work, Contact` only; `git rm -q components/About.tsx components/Incidents.tsx`; remove CSS used only by them (`.roles`, `.broke`, `.fix` if unused: grep `className=` first).
- [ ] **Step 6: claims.** Mark the incident-log rows and the "Here are four of them" / "last 40 runs" rows as `removed from page (4-section structure, 14 Oct)`; keep the outage and leadlens rows.
- [ ] **Step 7:** build, all tests, lint, ctrlchars; screenshot 1280 and 390 of the work section into `.superpowers/sdd/2026-10-14-show-the-machine/`. Commit `structure: four sections; quote moves onto the Caprae card`.

---

### Task 1: Tender Radar verdict counts (data)

**Files:** Modify `lib/runs.ts`, `lib/pipeline.ts`, `scripts/refresh-snapshot.mjs`, `package.json`, `data/pipeline-snapshot.json` (regenerated); Test `tests/runs.test.mjs`, `tests/site.test.mjs`.

**Interfaces:** Produces `parseVerdicts(md: string): { checks: number; bid: number; maybe: number } | null` in `lib/runs.ts`, and `PipelineData` gains `checks: number; bid: number; maybe: number` (snapshot JSON gains the same three keys).

- [ ] **Step 1: failing unit tests.** Append to `tests/runs.test.mjs` (Edit tool) and add `parseVerdicts` to its import list:

```js
const SUMMARY_FIXTURE = [
  "## Profile results",
  "",
  "| Profile | Classified | Bid | Maybe | Skip | Unsent matches | Expiries / unseen | Latest digest |",
  "|---|---:|---:|---:|---:|---:|---:|---|",
  "| catering | 584 | 1 | 7 | 576 | 1 | 0 / 0 | `x` |",
  "| cleaning | 593 | 2 | 20 | 571 | 2 | 2 / 0 | `x` |",
  "| security | 593 | 3 | 5 | 585 | 1 | 0 / 0 | `x` |",
].join("\n");

test("parseVerdicts sums classified, bid and maybe across trades", () => {
  assert.deepEqual(parseVerdicts(SUMMARY_FIXTURE), { checks: 1770, bid: 6, maybe: 32 });
});

test("parseVerdicts returns null when the table is missing or malformed", () => {
  assert.equal(parseVerdicts("# Tender Radar Daily Summary\n\nno table today"), null);
  assert.equal(parseVerdicts("| Profile | Classified |\n|---|---:|\n| cleaning | lots |"), null);
});
```

- [ ] **Step 2:** `node --test tests/runs.test.mjs` → FAIL (`parseVerdicts` is not exported).
- [ ] **Step 3: implement** in `lib/runs.ts` (no imports, keep it that way):

```ts
/** Totals across the "Profile results" table of the Tender Radar daily summary:
 *  checks = sum of Classified (one check per notice per trade), bid and maybe = the
 *  classifier's verdict counts. Null if the table is missing or any cell isn't a number,
 *  so callers fall back to saved numbers instead of showing zeros. */
export function parseVerdicts(md: string): { checks: number; bid: number; maybe: number } | null {
  const lines = md.split("\n");
  const head = lines.findIndex((l) => /^\|\s*Profile\s*\|/.test(l));
  if (head < 0) return null;
  const cols = lines[head].split("|").map((c) => c.trim());
  const at = (name: string) => cols.indexOf(name);
  const [ci, bi, mi] = [at("Classified"), at("Bid"), at("Maybe")];
  if (ci < 0 || bi < 0 || mi < 0) return null;
  let checks = 0, bid = 0, maybe = 0, rows = 0;
  for (const line of lines.slice(head + 2)) {
    if (!line.startsWith("|")) break;
    const cells = line.split("|").map((c) => c.trim());
    const nums = [cells[ci], cells[bi], cells[mi]].map((c) => (/^\d+$/.test(c ?? "") ? Number(c) : NaN));
    if (nums.some(Number.isNaN)) return null;
    checks += nums[0]; bid += nums[1]; maybe += nums[2]; rows += 1;
  }
  return rows ? { checks, bid, maybe } : null;
}
```

- [ ] **Step 4:** `node --test tests/runs.test.mjs` → all pass.
- [ ] **Step 5: pipeline.** In `lib/pipeline.ts`: import `parseVerdicts` from `./runs`; add `checks: number; bid: number; maybe: number;` to `PipelineData`; in the live path after `md` is decoded: `const verdicts = parseVerdicts(md) ?? { checks: FALLBACK.checks, bid: FALLBACK.bid, maybe: FALLBACK.maybe };` and spread `...verdicts` into the returned object.
- [ ] **Step 6: refresh script.** In `scripts/refresh-snapshot.mjs` add `import { parseVerdicts } from "../lib/runs.ts";`, compute `const verdicts = parseVerdicts(md);`, throw `new Error("daily summary table did not parse")` if null, and add `checks`, `bid`, `maybe` to the snapshot object and to the console summary line. In `package.json` change the script to `"refresh-snapshot": "node --experimental-strip-types scripts/refresh-snapshot.mjs"` (Windows Node 22 needs the flag; Node 24 accepts it).
- [ ] **Step 7:** run `node scripts/refresh-snapshot.mjs` (WSL, signed-in `gh`). Expect the line to include `checks`, `bid`, `maybe` values (14 Oct: about 3671 / 8 / 64).
- [ ] **Step 8: site test** (append to `tests/site.test.mjs`):

```js
// ── Show the machine, Task 1: verdict counts are saved ────────────────
test("saved snapshot has the Tender Radar verdict counts", () => {
  for (const k of ["checks", "bid", "maybe"]) assert.ok(Number.isInteger(snapshot[k]) && snapshot[k] >= 0, `snapshot.${k} missing`);
  assert.ok(snapshot.checks > snapshot.bid + snapshot.maybe, "checks must exceed bid + maybe");
});
```

- [ ] **Step 9: verify sources.** Read `projects/tender-radar/fetch.py` in `Manveen07/new-10x-engineer` (`gh api repos/Manveen07/new-10x-engineer/contents/projects/tender-radar/fetch.py -q .content | base64 -d`) and confirm the main fetch path actually calls Find a Tender, Contracts Finder, Public Contracts Scotland and Sell2Wales; `fetch_procontract.py` is its own workflow step. Write the result (which ones are called, with line numbers) into the task report. Task 2 uses exactly the confirmed list.
- [ ] **Step 10:** build, full tests, lint, ctrlchars; commit `proof: read bid, maybe and total checks from the daily summary`.

---

### Task 2: The sketch toolkit and the Tender Radar sketch

**Files:** Create `components/Sketch.tsx`, `components/sketches/RadarSketch.tsx`; Modify `components/Proof.tsx`, `app/globals.css`, `data/portfolio.ts`; Test `tests/site.test.mjs`.

**Interfaces:** Consumes `PipelineData.checks/bid/maybe/clientProfiles` (Task 1) and the source list confirmed in Task 1 Step 9. Produces `Sketch({ label, children }: { label: string; children: ReactNode })` default export (client), CSS classes `sketch sketch-wide sketch-tall ink mark`, and `fmtCount(n: number): string` in `lib/runs.ts` (thousands with commas). Later sketches reuse `Sketch` and the classes.

- [ ] **Step 1: failing tests** (append):

```js
// ── Show the machine, Task 2: the Tender Radar sketch ─────────────────
test("Tender Radar sketch shows the saved numbers in both layouts", () => {
  const proof = markup("index.html").match(/<section[^>]*id="proof"[\s\S]*?<\/section>/)?.[0] ?? "";
  const sketch = proof.match(/<div[^>]*class="sketch[^"]*"[^>]*role="img"[\s\S]*?<\/div>/)?.[0] ?? "";
  assert.ok(sketch, "no sketch in the proof section");
  assert.match(sketch, /aria-label="[^"]*checked for \d+ trades[^"]*"/);
  for (const v of ["sketch-wide", "sketch-tall"]) assert.ok(proof.includes(v), `missing ${v}`);
  const comma = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  for (const s of [`${snapshot.maybe} worth a look`, `${snapshot.bid} worth bidding`, `out of ${comma(snapshot.checks)} checks`]) {
    assert.equal(count(proof, s), 2, `"${s}" should appear once per layout`);
  }
  assert.match(text("index.html"), /every number here comes from the same run as the bars below/);
});

test("sketch red marks hide only under pen-js and never under reduced motion", () => {
  const styles = css();
  assert.match(styles, /\.pen-js \.sketch:not\(\.in\) \.mark\{stroke-dashoffset:1/);
  assert.match(styles, /prefers-reduced-motion[^{]*\{[\s\S]*?\.sketch:not\(\.in\) \.mark\{stroke-dashoffset:0/);
  assert.match(styles, /@media \(min-width:640px\)\{[^}]*\.sketch-tall\{display:none/);
});
```

(Adjust only the minified-CSS spellings to what the build really emits, and say so in the report.)

- [ ] **Step 2:** build, run, see both fail.
- [ ] **Step 3: `fmtCount`** in `lib/runs.ts` plus a unit test `assert.equal(fmtCount(3671), "3,671"); assert.equal(fmtCount(64), "64");`:

```ts
/** 3671 → "3,671". Fixed format, no locale. */
export function fmtCount(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
```

- [ ] **Step 4: `components/Sketch.tsx`:**

```tsx
"use client";

// Wrapper for hand-drawn SVG sketches. Server HTML shows everything drawn; once JS
// runs, `pen-js` hides the red `.mark` paths until the sketch scrolls into view,
// then they draw once. Reduced motion and no-JS readers always see them.

import type { ReactNode } from "react";
import { useReveal } from "@/lib/hooks";

export default function Sketch({ label, children }: { label: string; children: ReactNode }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="sketch" role="img" aria-label={label}>
      {children}
    </div>
  );
}
```

- [ ] **Step 5: CSS** (append to `app/globals.css`):

```css
/* ── Hand-drawn sketches ── */
.sketch { margin: 14px 0 18px; }
.sketch svg { display: block; width: 100%; height: auto; overflow: visible; }
.sketch text { font-family: var(--font-mono), "IBM Plex Mono", monospace; fill: var(--ink); }
.sketch .dim { fill: var(--dim); }
.sketch .red { fill: var(--red); }
.sketch .ink { fill: none; stroke: var(--ink); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
.sketch .mark {
  fill: none; stroke: var(--red); stroke-width: 2.2; stroke-linecap: round;
  stroke-dasharray: 1 2; stroke-dashoffset: 0;
  transition: stroke-dashoffset 0.9s cubic-bezier(0.6, 0.1, 0.3, 1) 0.15s;
}
.pen-js .sketch:not(.in) .mark { stroke-dashoffset: 1; }
.sketch-wide { display: none; }
@media (min-width: 640px) {
  .sketch-wide { display: block; }
  .sketch-tall { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .sketch .mark { transition: none; }
  .pen-js .sketch:not(.in) .mark { stroke-dashoffset: 0; }
}
```

- [ ] **Step 6: `components/sketches/RadarSketch.tsx`** (server component). Every red path has `className="mark" pathLength={1}`; ink paths `className="ink"`. Uneven corners are deliberate: do not "tidy" them into rectangles.

```tsx
import Sketch from "@/components/Sketch";
import { fmtCount } from "@/lib/runs";

/** The sources Task 1 confirmed the daily run reads, top to bottom. */
const SOURCES = ["Find a Tender", "Contracts Finder", "Public Contracts Scotland", "Sell2Wales", "ProContract"];

type Props = { trades: number; checks: number; bid: number; maybe: number };

export default function RadarSketch({ trades, checks, bid, maybe }: Props) {
  const label = `${SOURCES.length} public tender sites feed my script every morning. Each notice is checked for ${trades} trades: ${maybe} worth a look, ${bid} worth bidding, out of ${fmtCount(checks)} checks.`;
  const under = `↑ ${bid} out of ${fmtCount(checks)} checks were worth bidding on.`;
  return (
    <Sketch label={label}>
      <svg className="sketch-wide" viewBox="0 0 690 230" aria-hidden="true" fontSize="11">
        {SOURCES.map((s, i) => {
          const y = 8 + i * 38;
          return (
            <g key={s}>
              <path className="ink" d={`M10 ${y + 1} L200 ${y} L201 ${y + 27} L11 ${y + 28} Z`} />
              <text x="18" y={y + 18}>{s}</text>
              <path className="ink" d={`M206 ${y + 14} C232 ${y + 14} 240 ${96 + i * 4} 262 ${98 + i * 3}`} />
            </g>
          );
        })}
        <path className="ink" d="M262 70 L408 68 L410 128 L263 130 Z" />
        <text x="274" y="90">my script</text>
        <text x="274" y="106" className="dim">every morning,</text>
        <text x="274" y="120" className="dim">no one presses go</text>
        <path className="ink" d="M414 100 C428 98 436 98 448 100" />
        <path className="ink" d="M440 93 L449 100 L439 106" />
        <path className="ink" d="M452 40 L680 38 L681 170 L453 172 Z" />
        <text x="464" y="62">each notice, checked</text>
        <text x="464" y="80">for {trades} trades</text>
        <text x="464" y="100" className="dim">{maybe} worth a look</text>
        <text x="470" y="146" fontSize="15" fontWeight="500">{bid} worth bidding</text>
        <path className="mark" pathLength={1} d="M458 146 C456 126 540 122 610 126 C646 130 644 158 596 160 C530 163 462 160 464 140" />
        <text x="452" y="198" className="red">{under}</text>
      </svg>
      <svg className="sketch-tall" viewBox="0 0 320 450" aria-hidden="true" fontSize="11">
        {SOURCES.map((s, i) => {
          const y = 8 + i * 34;
          return (
            <g key={s}>
              <path className="ink" d={`M10 ${y + 1} L200 ${y} L201 ${y + 25} L11 ${y + 26} Z`} />
              <text x="18" y={y + 17}>{s}</text>
              <path className="ink" d={`M206 ${y + 13} C226 ${y + 13} 232 ${90 + i * 2} 240 ${96 + i}`} />
            </g>
          );
        })}
        <path className="ink" d="M240 100 C244 140 200 160 150 184" />
        <path className="ink" d="M158 176 L149 185 L161 189" />
        <path className="ink" d="M40 192 L250 190 L252 246 L41 248 Z" />
        <text x="52" y="212">my script</text>
        <text x="52" y="228" className="dim">every morning,</text>
        <text x="52" y="242" className="dim">no one presses go</text>
        <path className="ink" d="M145 252 C146 264 144 274 145 286" />
        <path className="ink" d="M139 279 L145 288 L151 279" />
        <path className="ink" d="M20 292 L300 290 L301 402 L21 404 Z" />
        <text x="32" y="314">each notice, checked</text>
        <text x="32" y="332">for {trades} trades</text>
        <text x="32" y="350" className="dim">{maybe} worth a look</text>
        <text x="38" y="384" fontSize="15" fontWeight="500">{bid} worth bidding</text>
        <path className="mark" pathLength={1} d="M28 384 C26 364 110 360 180 364 C214 368 212 396 166 398 C100 401 30 398 32 378" />
        <text x="20" y="428" className="red">{`↑ ${bid} out of ${fmtCount(checks)} checks were`}</text>
        <text x="20" y="444" className="red">worth bidding on.</text>
      </svg>
    </Sketch>
  );
}
```

If Task 1 confirmed fewer than five sources, remove the missing ones from `SOURCES` and close the vertical gap (keep the same geometry rules).

- [ ] **Step 7: wire it in.** `data/portfolio.ts` `PIPELINE` gains `sketchNote: "every number here comes from the same run as the bars below"`. In `components/Proof.tsx`, between the intro `<p className="lede">` and `<p className="count">`, insert:

```tsx
<Annotated note={PIPELINE.sketchNote}>
  <RadarSketch trades={pipe.clientProfiles} checks={pipe.checks} bid={pipe.bid} maybe={pipe.maybe} />
</Annotated>
```

- [ ] **Step 8:** build, tests pass (fix only CSS-spelling regexes if the minifier differs), lint, ctrlchars; screenshot the proof section at 320 and 1280 with headless Chrome (`"/mnt/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --hide-scrollbars --window-size=W,H --screenshot=C:\...\file.png URL` against `cmd.exe /c "npm run start"` on port 3000) into `.superpowers/sdd/2026-10-14-show-the-machine/`; look at both: no text outside boxes, circle around the bid line, readable at 320. Commit `proof: hand-drawn Tender Radar sketch with live numbers`.

---

### Task 3: leadlens scorecard and PresentAI screenshot

**Files:** Create `components/Scorecard.tsx`, `public/work/presentai.png` (only if real, see Step 5); Modify `data/portfolio.ts`, `components/Work.tsx`, `app/globals.css`, `docs/superpowers/specs/2026-10-13-claims.md`; Test `tests/site.test.mjs`.

**Interfaces:** `WorkItem` gains `scorecard?: { caught: number; missed: number; falseAlarms: number; leftAlone: number; caption: string }`, `shot?: { src: string; alt: string; width: number; height: number }`, `note?: string`. Work cards with a `note` render inside `Annotated`. The section allows two notes: the Caprae quote note (Task 0) and the leadlens note. PresentAI gets no note.

- [ ] **Step 1: failing tests:**

```js
// ── Show the machine, Task 3: real artifacts on the work cards ────────
test("leadlens shows its real scorecard with the false alarms circled", () => {
  const work = markup("index.html").match(/<section[^>]*id="work"[\s\S]*?<\/section>/)?.[0] ?? "";
  const card = work.match(/<table[^>]*class="scorecard"[\s\S]*?<\/table>/)?.[0] ?? "";
  assert.ok(card, "no scorecard");
  const t = card.replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  for (const s of ["9 caught", "2 missed", "0 false alarms", "61 left alone"]) assert.ok(t.includes(s), `missing "${s}"`);
  assert.ok(card.includes("pen-circle"), "0 false alarms should be circled");
  assert.match(text("index.html"), /Out of 72 postings I checked by hand:/);
  assert.match(text("index.html"), /it once scored 100%, because my own notes leaked the answers\. This is the score after I took them out\./);
});
```

and, only if Step 5 keeps the screenshot:

```js
test("PresentAI card shows a real screenshot of the live app", () => {
  assert.match(markup("index.html"), /<img[^>]*alt="PresentAI's home page"/);
  assert.ok(built("public/work/presentai.png"));
});
```

- [ ] **Step 2:** build, see them fail.
- [ ] **Step 3: `components/Scorecard.tsx`** (server): a real `<table className="scorecard">` (2×2, ink borders, big number on top of a mono label), the false-alarms cell's number wrapped in `<Circle>` from `components/Pen`. Caption as a `<caption>` with the given text. CSS: `.scorecard { border-collapse: collapse; margin: 10px 0; } .scorecard td { border: 1.5px solid var(--ink); padding: 8px 14px; text-align: center; font-family: var(--font-mono), monospace; font-size: 12px; } .scorecard b { display: block; font-family: var(--font-sans), Archivo, sans-serif; font-size: 26px; font-weight: 800; } .scorecard caption { caption-side: top; text-align: left; margin-bottom: 8px; font-size: 15px; }`.
- [ ] **Step 4: data.** leadlens: `metrics: []`, `scorecard: { caught: 9, missed: 2, falseAlarms: 0, leftAlone: 61, caption: "Out of 72 postings I checked by hand:" }`, `note: "it once scored 100%, because my own notes leaked the answers. This is the score after I took them out."`. Update the Task 6 site test from the earlier plan that requires "9 of 11" to require "9 caught" instead (say so in the report). `Work.tsx` renders the scorecard after the detail paragraph, and wraps any card with a `note` in `<Annotated note={w.note}>`; make the work cards direct children of the section (drop the `.work` wrapper div if it blocks the margin column) and keep the 18px gap between cards in CSS.
- [ ] **Step 5: PresentAI screenshot.** Start nothing locally; capture the live app with headless Chrome at 1280×800: `--screenshot=C:\Users\Manveen\AppData\Local\Temp\presentai.png https://present-ai-007.vercel.app/`. Look at it. If it shows the product (not only a sign-in form), resize to 640 wide with `ffmpeg.exe -y -i <in> -vf scale=640:-2 public/work/presentai.png`, get its height with `ffprobe.exe`, and set PresentAI `shot: { src: "/work/presentai.png", alt: "PresentAI's home page", width: 640, height: <h> }` (no note); render it with `next/image` inside the card, border `1px solid var(--rule)`, no shadow. If it is only a sign-in wall, skip the shot, delete the second test, and write "PresentAI: need a screenshot of a deck it made (live page is a login wall)" in the report.
- [ ] **Step 6: claims.** Add rows to `docs/superpowers/specs/2026-10-13-claims.md` for the scorecard (source: the leadlens rows already there) and, if kept, the screenshot (source: the live URL, capture date).
- [ ] **Step 7:** build, tests, lint, ctrlchars, screenshots of the work section at 320 and 1280; commit `work: leadlens scorecard and a real PresentAI screenshot`.

---

### Task 4: Hero sketch (the problem, drawn)

**Files:** Create `components/sketches/ProblemSketch.tsx`; Modify `components/Hero.tsx`; Test `tests/site.test.mjs`.

**Interfaces:** Consumes `Sketch` and the CSS classes from Task 2.

- [ ] **Step 1: failing test:**

```js
// ── Show the machine, Task 4: the problem, drawn ──────────────────────
test("hero has the problem sketch in both layouts, between the headline and the answer", () => {
  const hero = markup("index.html").match(/<section[^>]*id="top"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.match(hero, /aria-label="An order arrives by email, someone retypes it into your system\. I connect the two directly\."/);
  assert.ok(hero.indexOf("<h1") < hero.indexOf('class="sketch"') && hero.indexOf('class="sketch"') < hero.indexOf('class="lede"'));
  assert.equal(count(hero, "someone retypes it"), 2);
  assert.equal(count(hero, "I connect these two directly"), 2);
});
```

- [ ] **Step 2:** build, see it fail.
- [ ] **Step 3: `components/sketches/ProblemSketch.tsx`:**

```tsx
import Sketch from "@/components/Sketch";

const LABEL = "An order arrives by email, someone retypes it into your system. I connect the two directly.";

export default function ProblemSketch() {
  return (
    <Sketch label={LABEL}>
      <svg className="sketch-wide" viewBox="0 0 620 104" aria-hidden="true" fontSize="12">
        <path className="ink" d="M6 52 L150 50 L151 88 L7 90 Z" />
        <text x="16" y="68">an order comes in</text>
        <text x="16" y="82" className="dim">by email</text>
        <path className="ink" d="M156 70 C175 69 185 69 206 70" />
        <path className="ink" d="M198 64 L207 70 L198 76" />
        <path className="ink" d="M212 52 L392 50 L393 88 L213 90 Z" />
        <text x="224" y="68">someone retypes it</text>
        <text x="224" y="82" className="dim">every single time</text>
        <path className="ink" d="M398 70 C417 69 427 69 448 70" />
        <path className="ink" d="M440 64 L449 70 L440 76" />
        <path className="ink" d="M454 52 L612 50 L613 88 L455 90 Z" />
        <text x="466" y="68">your system</text>
        <text x="466" y="82" className="dim">(CRM, sheet, ERP)</text>
        <path className="mark" pathLength={1} d="M220 58 C280 78 330 66 386 84" />
        <path className="mark" pathLength={1} d="M222 84 C290 64 330 74 384 56" />
        <path className="mark" pathLength={1} d="M78 48 C160 20 460 18 530 46" />
        <path className="mark" pathLength={1} d="M518 40 L531 48 L516 52" />
        <text x="216" y="12" className="red">I connect these two directly</text>
      </svg>
      <svg className="sketch-tall" viewBox="0 0 300 236" aria-hidden="true" fontSize="12">
        <path className="ink" d="M10 10 L230 8 L231 46 L11 48 Z" />
        <text x="20" y="26">an order comes in</text>
        <text x="20" y="40" className="dim">by email</text>
        <path className="ink" d="M120 52 C121 60 119 68 120 76" />
        <path className="ink" d="M114 69 L120 78 L126 69" />
        <path className="ink" d="M10 82 L230 80 L231 118 L11 120 Z" />
        <text x="20" y="98">someone retypes it</text>
        <text x="20" y="112" className="dim">every single time</text>
        <path className="ink" d="M120 124 C121 132 119 140 120 148" />
        <path className="ink" d="M114 141 L120 150 L126 141" />
        <path className="ink" d="M10 154 L230 152 L231 190 L11 192 Z" />
        <text x="20" y="170">your system</text>
        <text x="20" y="184" className="dim">(CRM, sheet, ERP)</text>
        <path className="mark" pathLength={1} d="M16 88 C80 108 150 96 224 114" />
        <path className="mark" pathLength={1} d="M18 114 C90 94 150 104 222 86" />
        <path className="mark" pathLength={1} d="M236 28 C292 40 292 160 240 172" />
        <path className="mark" pathLength={1} d="M250 164 L238 172 L251 178" />
        <text x="10" y="216" className="red">I connect these two directly</text>
      </svg>
    </Sketch>
  );
}
```

- [ ] **Step 4:** in `Hero.tsx` render `<ProblemSketch />` right after `<h1>` and before the `<Annotated>` lede. Build, tests, lint, ctrlchars, screenshots at 320/390/1280 (note in the report whether the hero button is now below the fold at 390, per the design verdicts). Commit `hero: the problem, drawn`.

---

### Task 5: Pilot timeline (the offer, drawn)

**Files:** Create `components/sketches/PilotSketch.tsx`; Modify `components/Contact.tsx`, `app/globals.css`, `data/portfolio.ts`; Test `tests/site.test.mjs`.

- [ ] **Step 1: failing test:**

```js
// ── Show the machine, Task 5: the offer, drawn ────────────────────────
test("pilot timeline is drawn, the steps list stays for screen readers", () => {
  const c = markup("index.html").match(/<section[^>]*id="contact"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.match(c, /<ol class="steps sr-only">/);
  assert.match(c, /class="sketch"[^>]*role="img"/);
  for (const s of ["1 · a call", "2 · a fixed quote", "3 · a month, for real", "4 · you decide", "every miss logged,"]) {
    assert.equal(count(c, s), 2, `"${s}" once per layout`);
  }
  assert.match(text("index.html"), /you see every miss, not just a score/);
  assert.match(css(), /\.sr-only\{/);
});
```

- [ ] **Step 2:** build, see it fail.
- [ ] **Step 3:** CSS: `.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }`. `PILOT` gains `note: "you see every miss, not just a score"` and `sketchLabel: "A call about what wastes your time, then a fixed quote, then a month on your real requests with every miss logged, then you decide whether to keep it."`.
- [ ] **Step 4: `components/sketches/PilotSketch.tsx`** (props `{ label: string }`). Wide `viewBox="0 0 690 130"`, fontSize 12: wobbly line `M10 40 C160 37 300 43 450 39 S640 40 680 41` (class ink), dots `<circle cx cy="40" r="5" fill="#1d1d1d">` at x 20, 187, 352, 547; texts (titles fontWeight 500 at y 22; lines at y 66, 80, 94, 108 except where noted): step 1 at x 8: `1 · a call`, `you tell me what`, `wastes the most time`, (dim) `not a real problem?`, (dim) `I'll say so`; step 2 at x 175: `2 · a fixed quote`, `before any work`, `starts`; step 3 at x 340: `3 · a month, for real`, `on your actual requests` (y 66), `every miss logged,` (y 86), `you see the list` (y 100); step 4 at x 535: `4 · you decide`, `keep it: a monthly`, `fee, I look after it`; red mark `M332 92 C330 76 380 72 456 75 C486 79 484 108 444 110 C394 113 334 110 334 96`. Tall `viewBox="0 0 300 380"`: wobbly vertical line `M16 12 C14 120 18 240 16 368` (ink), dots at (16, 20), (16, 124), (16, 204), (16, 320); same texts at x 34 with titles at y 24 / 128 / 208 / 324 and lines 16px apart below each title (step 3: `on your actual requests` y 226, `every miss logged,` y 246, `you see the list` y 260); red mark around step 3's last two lines `M28 248 C26 232 120 228 196 232 C226 236 224 266 186 268 C120 271 30 268 32 252`. Both SVGs `aria-hidden`, wrapped in `<Sketch label={label}>`.
- [ ] **Step 5:** `Contact.tsx`: keep the lede; change the list to `<ol className="steps sr-only">`; after it render `<Annotated note={PILOT.note}><PilotSketch label={PILOT.sketchLabel} /></Annotated>`; button row unchanged. Build, tests (the existing `.steps` list-style test still passes), lint, ctrlchars, screenshots 320/1280. Commit `contact: the pilot, drawn as a timeline`.

---

### Task 6: Hand-drawn dividers

**Files:** Modify `app/globals.css`; Test `tests/site.test.mjs`.

- [ ] **Step 1: failing test:**

```js
// ── Show the machine, Task 6: hand-drawn dividers ─────────────────────
test("sections are divided by a hand-drawn pencil line, not a straight border", () => {
  const rule = css().match(/\.sec\{[^}]*\}/)?.[0] ?? "";
  assert.match(rule, /background-image:url\("?data:image\/svg\+xml/);
  assert.doesNotMatch(rule, /border-top:1px solid/);
});
```

- [ ] **Step 2:** build, see it fail.
- [ ] **Step 3:** in `.sec` replace `border-top: 1px solid var(--rule);` with `background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 820 14' preserveAspectRatio='none'%3E%3Cpath d='M2 8 C120 5 210 10 330 7 S560 5 680 8 S790 9 818 6' fill='none' stroke='%23b9b2a2' stroke-width='1.4' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: top center; background-size: calc(100% - 40px) 14px;`. `.hero` keeps no divider (`background-image: none`). Also apply to `.foot` the same way. While in the CSS tests: tighten the `.note-drop` assertion so a rule outside the media block fails, using `/@media \(min-width:1000px\)\{(?:[^{}]+\{[^{}]*\})*\.note-drop\{margin-top:(?:calc\(10px \+ 29px\)|39px)\}/` (edit with the Edit tool; this regex has backslashes). Build, tests, lint, ctrlchars, screenshot 1280. Commit `look: hand-drawn dividers between sections`.

---

### Task 7: Manveen's photo

**Files:** Create `public/me.jpg`; Modify `data/portfolio.ts`, `tests/site.test.mjs`.

- [ ] **Step 1:** replace the test "hero shows no empty photo frame while PHOTO is null" with:

```js
test("hero shows Manveen's photo", () => {
  const hero = markup("index.html").match(/<section[^>]*id="top"[\s\S]*?<\/section>/)?.[0];
  assert.ok(hero, "no section#top");
  assert.match(hero, /<img[^>]*alt="Manveen Singh"/);
});
```

- [ ] **Step 2:** build, see it fail.
- [ ] **Step 3:** the source is Manveen's pick (14 Oct), `IMG_7795.jpg`, copied to `C:\Users\Manveen\AppData\Local\Temp\mphotos\casual.jpg` (3024×4032). Crop and export: `ffmpeg.exe -y -i "C:\Users\Manveen\AppData\Local\Temp\mphotos\casual.jpg" -vf "crop=1532:1915:827:948,scale=264:330" -q:v 2 public/me.jpg` (run from the repo root). Do not tint or grayscale. Never use `bg_removed_profile_image.png` (AI-edited).
- [ ] **Step 4:** `PHOTO = { src: "/me.jpg", alt: "Manveen Singh", width: 264, height: 330 }`. CSS `.photo` width stays 132px. Build, tests, lint; screenshot the hero at 390×844 and 1280; report whether the hero button is below the fold at 390 (expected, per the verdicts; the header link stays visible). Commit `hero: Manveen's photo`.

---

### Task 8: Share-image runtime, claims, visual check and slop audit

**Files:** Modify `app/opengraph-image.tsx`, `docs/superpowers/specs/2026-10-13-claims.md`; Create `.superpowers/sdd/2026-10-14-show-the-machine/audit/` screenshots.

- [ ] **Step 1: share image off the edge runtime** (the edge bundle was ~939 KB gzipped with the fonts, close to the Hobby edge limit, unverified). Test first: `assert.doesNotMatch(read("app/opengraph-image.tsx"), /runtime = "edge"/);`. Change the existing test that asserts `runtime = "edge"` (from the verdict work, around `tests/site.test.mjs:409`) to this `doesNotMatch`. Then remove `export const runtime = "edge"`, set the name line `fontWeight: 800` (only 400 and 800 are loaded), load the fonts with `readFile(join(process.cwd(), "app/Archivo-ExtraBold.ttf"))` and the Regular file from `node:fs/promises` and `node:path`, keep the card's copy and look byte-identical. Build; confirm the route appears as static (○) or dynamic in the build output and render it from `npm run start`; save the PNG to the audit folder and look at it. Commit `share image: node runtime, fonts read from disk`.
- [ ] **Step 2: claims.** Add rows for: the five (or confirmed) sources, `checks`, `bid`, `maybe` (source: daily summary table, command from Task 1), the scorecard, the screenshot (if any), and the photo (self-supplied). Commit `audit: claims for the sketches and artifacts`.
- [ ] **Step 3: visual check.** From a fresh build and `npm run start`, headless Chrome screenshots of the whole home page at 320×568, 390×844 and 1280×900 (scroll in steps), the post page and `/opengraph-image`, into the audit folder. Check `document.documentElement.scrollWidth <= innerWidth` at 320 and 390 (run a small CDP script or `--dump-dom` alternative; say how). Look at every sketch at 320: text inside its boxes and readable.
- [ ] **Step 4: versions for open taste calls.** For any taste call still open (for example where the quote sits inside the Caprae card, or the photo size), build two or three versions on a scratch copy of the page and save side-by-side screenshots in the audit folder for Manveen to pick from. Do not commit the losing versions.
- [ ] **Step 5: slop audit.** In the task report, go through the spec's section 2 rules one by one with the screenshot that shows each passes, and list anything that fails. Fix only clear failures (CSS or geometry), with a test where one can pin it; taste questions go to Manveen.
