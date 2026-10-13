# Red-pen credibility redesign: implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn manveen.me from a dark "control panel" costume into a quiet red-pen-on-paper page that a business owner from a cold email trusts in under a minute, with every claim sourced and the copy in Manveen's own voice.

**Architecture:** Same Next.js 16 app router site, same repo. Content stays in `data/portfolio.ts`, live run numbers keep coming from `lib/pipeline.ts`. Each home-page section is one server component; the only client code is `components/Pen.tsx` (pen marks that draw when scrolled into view). Plain CSS in `app/globals.css` (Tailwind is kept only for its base reset). Tests read the HTML that `next build` prerenders into `.next/`, using Node's built-in test runner, so no new dependencies.

**Tech Stack:** Next.js 16.1.6 (Turbopack), React 19.2, TypeScript 5, Tailwind 3.4 (base reset only), `next/font/google` (Archivo, IBM Plex Mono), `next/og` for the share image, `node:test`.

**Spec:** `docs/superpowers/specs/2026-10-13-credibility-site-redesign-design.md`

## Global Constraints

- Work on branch `redesign-red-pen`. Never push, never merge to `master`, never touch Vercel settings without Manveen's explicit yes in that moment.
- Build and lint through Windows npm, because `node_modules` only has the Windows Next binary (`@next/swc-win32-x64-msvc`): from WSL run `cmd.exe /c "npm run build"` and `cmd.exe /c "npm run lint"` in the repo folder. On Windows, plain `npm run build`.
- Run tests with WSL Node 24 (`node --version` → v24.21.0): `node --test tests/site.test.mjs tests/runs.test.mjs`. Always build first; the site tests read `.next/`.
- No new dependencies.
- `git status` before every `git add`; add exact paths only, never `git add -A`. `.superpowers/` is excluded locally via `.git/info/exclude`.
- Commit messages follow the repo style (`area: what changed`, lowercase) and end with the trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Palette (exact): paper `#f4f1ea`, wash `#ebe6da`, ink `#1d1d1d`, dim `#5a5750`, rule `#d9d3c5`, red `#c4161c`. Fonts: Archivo (text), IBM Plex Mono (pen notes, small labels).
- Copy rules (spec section 5): no em or en dashes; none of leverage, utilise, streamline, optimise, robust, seamless, cutting-edge, AI-powered, AI-driven, solution, transform; never "honest" on the home page; contractions; no slogans or one-line closers; Manveen's own lines in spec section 5a keep their phrasing.
- "Book a call" (Calendly link) appears exactly 3 times on the home page: header, first screen, bottom.
- Facts only with a source. Tender Radar "sorts for N trades" (not companies); no claim that it emails anyone; "its worst stretch" (21 Jul to 11 Aug), never "broke once".
- Never publish Zackary Beckham's email address or the letter PDF. Never guess anyone's pronouns in copy.

## Review Focus

1. **A 320px-wide phone.** The circled run count, long role lines and the bar chart must not make the page scroll sideways. Test: Task 10, step 3 (`scrollWidth <= innerWidth` at 320px and 375px).
2. **The GitHub read fails in production** (token missing, expired or rate-limited). The page silently falls back to the saved snapshot, so it must say "Numbers saved <date>", never imply it's live. Test: Task 4 (`runs.test.mjs` and the "saved, not live" site test).
3. **The latest run failed.** The panel must say so plainly ("Last run: …, and it failed."), not "running". Test: Task 4, `runs.test.mjs`.
4. **No JavaScript, or "reduce motion" switched on.** Pen marks must still be visible. Test: Task 2 (CSS hides marks only under `.pen-js`, and the reduced-motion block resets `stroke-dashoffset:0`).
5. **Internal links.** The post's "Work with me" goes to `/#contact`, the leadlens card goes to the post, the footer goes to `/writing`; each target must exist in the build. Tests: Task 6 and Task 9.

---

### Task 1: Test harness and current run numbers

**Files:**
- Create: `tests/site.test.mjs`
- Modify: `package.json` (add a `test` script)
- Modify (generated): `data/pipeline-snapshot.json`

**Interfaces:**
- Consumes: nothing.
- Produces: helpers inside `tests/site.test.mjs` that every later task's tests use: `read(rel)`, `markup(page)`, `text(page)`, `css()`, `count(haystack, needle)`, `snapshot`. Later tasks append tests to the end of this file.

- [ ] **Step 1: Write the failing test file**

Create `tests/site.test.mjs`:

```js
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
  assert.ok(snapshot.totalRuns >= 114, `snapshot says ${snapshot.totalRuns} runs`);
});
```

- [ ] **Step 2: Run it and watch the snapshot test fail**

Run: `node --test tests/site.test.mjs`
Expected: 1 pass, 1 fail: `snapshot says 78 runs`.

- [ ] **Step 3: Refresh the saved numbers**

Run (WSL, uses the signed-in `gh`): `node scripts/refresh-snapshot.mjs`
Expected output like: `wrote data/pipeline-snapshot.json: 114 runs total, last 2026-10-13T12:53:46Z (ok), 431 notices, 7 profiles, window 40/40 ok` (numbers may be higher on a later day).

- [ ] **Step 4: Add the test script**

In `package.json`, add to `"scripts"` after `"refresh-snapshot"`:

```json
    "refresh-snapshot": "node scripts/refresh-snapshot.mjs",
    "test": "node --experimental-strip-types --test tests/site.test.mjs tests/runs.test.mjs"
```

(The flag lets Windows Node 22.17 load `lib/runs.ts` in Task 4; Node 24 accepts it too. `tests/runs.test.mjs` arrives in Task 4; until then run the site file directly.)

- [ ] **Step 5: Run the test again**

Run: `node --test tests/site.test.mjs`
Expected: 2 pass, 0 fail.

- [ ] **Step 6: Commit**

```bash
git status --short
git add tests/site.test.mjs package.json data/pipeline-snapshot.json
git commit -m "test: check the built site; refresh saved run numbers" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Strip the costume, lay the paper

Replaces the global look: fonts, CSS, header, footer, the pen-mark components. Old section components keep compiling (unstyled) until their own tasks replace them.

**Files:**
- Modify: `app/layout.tsx` (imports, fonts, `RootLayout`; leave `DESCRIPTION` and `metadata` untouched until Task 9)
- Replace: `app/globals.css`, `lib/tokens.ts`, `lib/hooks.ts`, `tailwind.config.ts`, `components/Nav.tsx`, `components/Footer.tsx`
- Create: `components/Pen.tsx`, `components/Annotated.tsx`
- Modify: `components/Prose.tsx` (token names only), `data/portfolio.ts` (add `OFF_CLOCK`)
- Delete: `components/BootOverlay.tsx`, `components/Ambient.tsx`, `components/Easter.tsx` (`git rm` stages the deletion; don't `git add` them again)
- Test: `tests/site.test.mjs` (append)

**Interfaces:**
- Consumes: `ME` from `data/portfolio.ts` (unchanged shape).
- Produces:
  - `useReveal<T extends HTMLElement>(): RefObject<T | null>` in `lib/hooks.ts`: adds class `in` once the element is 60% in view.
  - `Circle({ children }: { children: ReactNode })` and `Underline({ children }: { children: ReactNode })` in `components/Pen.tsx`.
  - `Annotated({ note, children }: { note: ReactNode; children: ReactNode })` default export in `components/Annotated.tsx`: content plus a red margin note.
  - `OFF_CLOCK: string` in `data/portfolio.ts`.
  - `T` in `lib/tokens.ts` with keys `paper, wash, ink, dim, rule, red, sans, mono`.
  - CSS classes for later tasks: `wrap sec hero kicker h2 h3 lede body small btn link links count bars f pen pen-circle pen-under annotated note quote roles what work card metrics stack broke fix steps cta-row box chip prose-link post-list photo head head-name head-cta foot`.

- [ ] **Step 1: Append the failing tests**

Append to `tests/site.test.mjs`:

```js
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
```

- [ ] **Step 2: Build and watch them fail**

Run: `cmd.exe /c "npm run build"` then `node --test tests/site.test.mjs`
Expected: the 4 new tests FAIL (first one on `"P-00"`).

- [ ] **Step 3: Delete the costume components**

```bash
git rm -q components/BootOverlay.tsx components/Ambient.tsx components/Easter.tsx
```

- [ ] **Step 4: Replace `app/globals.css`**

```css
@tailwind base;

/* Red pen on paper. One ink, one red, two fonts.
   Spec: docs/superpowers/specs/2026-10-13-credibility-site-redesign-design.md */

:root {
  --paper: #f4f1ea;
  --wash:  #ebe6da;
  --ink:   #1d1d1d;
  --dim:   #5a5750;
  --rule:  #d9d3c5;
  --red:   #c4161c;
  --col:   640px;  /* reading column */
  --note:  210px;  /* margin-note column on wide screens */
}

* { box-sizing: border-box; }
html { background: var(--paper); scroll-behavior: smooth; }
body {
  margin: 0;
  color: var(--ink);
  background: var(--paper);
  font-family: var(--font-sans), Archivo, "Helvetica Neue", Arial, sans-serif;
  font-size: 17px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}
a { color: inherit; }
::selection { background: var(--red); color: var(--paper); }
a:focus-visible, .btn:focus-visible { outline: 2px solid var(--red); outline-offset: 3px; }

/* ── Layout: one reading column, a margin for pen notes on wide screens ── */
.wrap { width: 100%; max-width: calc(var(--col) + var(--note) + 48px + 40px); margin: 0 auto; padding-left: 20px; padding-right: 20px; }
.wrap > * { max-width: var(--col); }
.wrap > .annotated { max-width: none; }
.sec { padding-top: 56px; padding-bottom: 56px; border-top: 1px solid var(--rule); }
.hero { border-top: 0; padding-top: 24px; }

.annotated { display: grid; grid-template-columns: minmax(0, var(--col)); }
.note {
  margin: 4px 0 14px;
  font-family: var(--font-mono), "IBM Plex Mono", monospace;
  font-size: 12.5px;
  line-height: 1.4;
  color: var(--red);
  transform: rotate(-1.5deg);
  transform-origin: left top;
}
.note::before { content: "↑ "; }
@media (min-width: 1000px) {
  .annotated { grid-template-columns: minmax(0, var(--col)) var(--note); column-gap: 48px; align-items: start; }
  .note { margin-top: 10px; }
  .note::before { content: "← "; }
}

/* ── Type ── */
h1, h2, h3 { margin: 0; letter-spacing: -0.02em; }
h1 { font-size: clamp(30px, 4.4vw, 44px); line-height: 1.1; font-weight: 800; margin-bottom: 18px; }
.h2 { font-size: clamp(24px, 3vw, 30px); font-weight: 800; line-height: 1.15; margin-bottom: 14px; }
.h3 { font-size: 21px; font-weight: 800; line-height: 1.2; margin-bottom: 8px; }
.lede { font-size: 20px; line-height: 1.45; margin: 0 0 14px; }
.body { margin: 0 0 12px; }
.small { font-size: 14px; color: var(--dim); margin: 0 0 10px; }
.kicker {
  margin: 0 0 14px;
  font-family: var(--font-mono), "IBM Plex Mono", monospace;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--dim);
}
.link, .links a { text-decoration: underline; text-decoration-thickness: 1.5px; text-underline-offset: 3px; }
.link:hover, .links a:hover { color: var(--red); }
.links { display: flex; flex-wrap: wrap; gap: 8px 20px; margin: 14px 0 0; font-weight: 600; font-size: 15px; }
.btn { display: inline-block; background: var(--ink); color: var(--paper); font-weight: 600; padding: 12px 18px; text-decoration: none; }
.btn:hover { background: var(--red); }

/* ── Header and footer ── */
.head { display: flex; justify-content: space-between; align-items: baseline; gap: 16px; padding-top: 22px; padding-bottom: 22px; }
.head-name { font-weight: 800; text-decoration: none; }
.head-cta { color: var(--red); font-weight: 700; text-decoration: underline; text-underline-offset: 3px; }
.foot { padding-top: 32px; padding-bottom: 48px; border-top: 1px solid var(--rule); }
.foot a { text-decoration: underline; text-underline-offset: 2px; }
.photo { display: block; width: 132px; height: auto; margin: 0 0 22px; border: 1px solid var(--rule); }

/* ── Proof ── */
.count { font-size: 64px; font-weight: 900; line-height: 1; margin: 18px 0 10px; }
.bars { display: flex; gap: 2px; height: 26px; max-width: 420px; margin: 12px 0 8px; }
.bars i { flex: 1; background: var(--ink); }
.bars i.f { background: var(--red); }

/* ── Red pen marks. Drawn by default; hidden only once JS can draw them. ── */
.pen-circle { position: relative; display: inline-block; padding: 0 8px; }
.pen-circle svg { position: absolute; left: -14px; top: -12px; width: calc(100% + 28px); height: calc(100% + 24px); overflow: visible; pointer-events: none; }
.pen path {
  fill: none;
  stroke: var(--red);
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-dasharray: 1;
  stroke-dashoffset: 0;
  transition: stroke-dashoffset 0.9s cubic-bezier(0.6, 0.1, 0.3, 1) 0.15s;
}
.pen-under {
  background-image: linear-gradient(var(--red), var(--red));
  background-repeat: no-repeat;
  background-position: 0 100%;
  background-size: 100% 2px;
  padding-bottom: 2px;
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;
  transition: background-size 0.9s ease 0.15s;
}
.pen-js .pen:not(.in) path { stroke-dashoffset: 1; }
.pen-js .pen:not(.in) .pen-under { background-size: 0% 2px; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .pen path, .pen-under { transition: none; }
  .pen-js .pen:not(.in) path { stroke-dashoffset: 0; }
  .pen-js .pen:not(.in) .pen-under { background-size: 100% 2px; }
}

/* ── What people say ── */
.quote { margin: 0 0 28px; }
.quote blockquote { margin: 0; font-size: 20px; line-height: 1.45; }
.quote blockquote p { margin: 0; }
.quote figcaption { margin-top: 10px; font-size: 15px; }
.roles { list-style: none; padding: 0; margin: 0 0 12px; }
.roles li { padding: 12px 0; border-bottom: 1px dashed var(--rule); }
.roles p { margin: 0; }
.roles .what { margin-top: 6px; }

/* ── Work ── */
.work { display: grid; gap: 18px; }
.card { background: var(--wash); padding: 20px 22px; }
.metrics { display: flex; flex-wrap: wrap; gap: 8px 28px; margin: 14px 0 8px; }
.metrics dt { font-size: 28px; font-weight: 800; line-height: 1.1; }
.metrics dd { margin: 0; font-size: 13.5px; color: var(--dim); }
.stack { margin: 6px 0 0; font-family: var(--font-mono), "IBM Plex Mono", monospace; font-size: 12px; color: var(--dim); }

/* ── What broke ── */
.broke { list-style: none; padding: 0; margin: 8px 0 0; }
.broke li { padding: 14px 0; border-bottom: 1px dashed var(--rule); }
.fix { margin: 4px 0 0; font-family: var(--font-mono), "IBM Plex Mono", monospace; font-size: 14px; color: var(--red); }

/* ── How working with me goes ── */
.steps { padding-left: 20px; margin: 0 0 22px; }
.steps li { margin-bottom: 8px; }
.cta-row { display: flex; flex-wrap: wrap; align-items: center; gap: 14px 22px; margin: 0; }

/* ── Writing ── */
.box { border: 1px solid var(--rule); background: var(--wash); }
.chip { font-family: var(--font-mono), "IBM Plex Mono", monospace; font-size: 12px; color: var(--dim); border: 1px solid var(--rule); padding: 2px 8px; }
.prose-link { color: var(--red); text-decoration: underline; text-underline-offset: 3px; }
.post-list { list-style: none; padding: 0; margin: 0; }
.post-list li { padding: 18px 0; border-bottom: 1px dashed var(--rule); }
.post-list a { text-decoration: none; }
.post-list a:hover .h3 { color: var(--red); }
```

- [ ] **Step 5: Replace `lib/tokens.ts`**

```ts
// Red pen on paper. Matches the CSS variables in app/globals.css.
// Import in components as: `import { T } from "@/lib/tokens"`.

export const T = {
  paper: "#f4f1ea",
  wash:  "#ebe6da",
  ink:   "#1d1d1d",
  dim:   "#5a5750",
  rule:  "#d9d3c5",
  red:   "#c4161c",
  sans:  'var(--font-sans), Archivo, "Helvetica Neue", Arial, sans-serif',
  mono:  'var(--font-mono), "IBM Plex Mono", "Courier New", ui-monospace, monospace',
} as const;

export type Tokens = typeof T;
```

- [ ] **Step 6: Point `components/Prose.tsx` at the new tokens**

Run from the repo root (WSL):

```bash
python3 -I - <<'EOF'
p = "components/Prose.tsx"
s = open(p, encoding="utf-8").read()
for a, b in [
    ("in the terminal aesthetic.", "in red pen on paper."),
    ("T.text", "T.ink"),
    ("T.yellow", "T.red"),
    ("T.bevelHi", "T.rule"),
    ("T.bevel", "T.rule"),
    ("T.dim2", "T.dim"),
    ('className="panel"', 'className="box"'),
    ("rgba(255,214,10,0.07)", "rgba(196,22,28,0.06)"),
    ("rgba(255,214,10,0.03)", "rgba(196,22,28,0.04)"),
    ("maxWidth: 720", 'maxWidth: "var(--col)"'),
]:
    assert a in s, a
    s = s.replace(a, b)
open(p, "w", encoding="utf-8").write(s)
EOF
grep -n "yellow\|bevel\|dim2\|T\.text\|255,214\|panel" components/Prose.tsx
```

Expected: the `grep` prints nothing.

- [ ] **Step 7: Replace `lib/hooks.ts`**

```ts
"use client";

import { useEffect, useRef, type RefObject } from "react";

/** Adds `.in` once the element is well into view. CSS draws the pen mark. */
export function useReveal<T extends HTMLElement = HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}
```

- [ ] **Step 8: Create `components/Pen.tsx`**

```tsx
"use client";

// Red-pen marks. Server HTML has them drawn; the `pen-js` class set in
// app/layout.tsx hides them until useReveal adds `.in`, so readers without
// JS, or with reduced motion, always see them.

import type { ReactNode } from "react";
import { useReveal } from "@/lib/hooks";

/** A hand-drawn ellipse around its children. */
export function Circle({ children }: { children: ReactNode }) {
  const ref = useReveal<HTMLSpanElement>();
  return (
    <span ref={ref} className="pen pen-circle">
      {children}
      <svg viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">
        <path pathLength={1} d="M8,32 C6,10 40,2 70,6 C96,10 98,40 80,52 C58,64 14,58 9,38" />
      </svg>
    </span>
  );
}

/** A red underline under a run of text. */
export function Underline({ children }: { children: ReactNode }) {
  const ref = useReveal<HTMLSpanElement>();
  return (
    <span ref={ref} className="pen">
      <span className="pen-under">{children}</span>
    </span>
  );
}
```

- [ ] **Step 9: Create `components/Annotated.tsx`**

```tsx
import type { ReactNode } from "react";

/** Content with a red margin note: beside it on wide screens, under it on phones. */
export default function Annotated({ note, children }: { note: ReactNode; children: ReactNode }) {
  return (
    <div className="annotated">
      <div>{children}</div>
      <aside className="note">{note}</aside>
    </div>
  );
}
```

- [ ] **Step 10: Replace `components/Nav.tsx`**

```tsx
import Link from "next/link";
import { ME } from "@/data/portfolio";

export default function Nav() {
  return (
    <header className="wrap head">
      <Link href="/" className="head-name">
        {ME.name}
      </Link>
      <a className="head-cta" href={ME.calendly} target="_blank" rel="noopener">
        Book a call
      </a>
    </header>
  );
}
```

- [ ] **Step 11: Add `OFF_CLOCK` to `data/portfolio.ts`**

Insert directly after the closing `} as const;` of `ME`:

```ts

// ── Off the clock: footer line, from Manveen's own answers (13 Oct) ──
export const OFF_CLOCK = "Hunter x Hunter theory videos, Peacemaker, Elden Ring, Sekiro, Doom, The Weeknd.";
```

- [ ] **Step 12: Replace `components/Footer.tsx`**

```tsx
import Link from "next/link";
import { ME, OFF_CLOCK } from "@/data/portfolio";

export default function Footer() {
  return (
    <footer className="wrap foot">
      <p className="small">
        <b>Off the clock:</b> {OFF_CLOCK}
      </p>
      <p className="small">
        Hiring? <a href={ME.resume}>Resume</a> ·{" "}
        <a href={ME.linkedin} target="_blank" rel="noopener">LinkedIn</a> ·{" "}
        <a href={ME.github} target="_blank" rel="noopener">GitHub</a> ·{" "}
        <Link href="/writing">Writing</Link> · <a href={`mailto:${ME.email}`}>{ME.email}</a>
      </p>
      <p className="small">
        {ME.location} · © 2026 {ME.name}
      </p>
    </footer>
  );
}
```

- [ ] **Step 13: Replace `tailwind.config.ts`**

```ts
import type { Config } from "tailwindcss";

// Only Tailwind's base reset is used. The site's own styles are in app/globals.css.
const config: Config = {
  content: ["./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
};

export default config;
```

- [ ] **Step 14: Update `app/layout.tsx`**

Replace everything from the first line down to (not including) `const DESCRIPTION =` with:

```tsx
import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const sans = Archivo({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "600", "800", "900"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

```

Then replace the whole `export default function RootLayout ...` block at the bottom with:

```tsx
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Lets CSS hide pen marks until they scroll into view. Without JS they stay drawn. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('pen-js')" }} />
      </head>
      <body className={`${sans.variable} ${mono.variable}`}>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

Leave `DESCRIPTION` and `metadata` exactly as they are (Task 9 replaces them).

- [ ] **Step 15: Build, test, lint**

Run: `cmd.exe /c "npm run build"` then `node --test tests/site.test.mjs` then `cmd.exe /c "npm run lint"`
Expected: build succeeds; 6 pass, 0 fail; lint exits 0. (The page body still shows old, unstyled sections. That's expected until Tasks 3 to 8.)

- [ ] **Step 16: Commit**

```bash
git status --short
git add app/layout.tsx app/globals.css lib/tokens.ts lib/hooks.ts tailwind.config.ts components/Nav.tsx components/Footer.tsx components/Pen.tsx components/Annotated.tsx components/Prose.tsx data/portfolio.ts tests/site.test.mjs
git commit -m "look: paper, ink and a red pen; boot screen and easter eggs gone" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Hero, problem first, in Manveen's words

**Files:**
- Replace: `components/Hero.tsx`
- Modify: `data/portfolio.ts` (`ME.hours`, replace `HERO`, add `PHOTO`)
- Test: `tests/site.test.mjs` (append)

**Interfaces:**
- Consumes: `Annotated` (Task 2), `Underline` (Task 2), `ME`.
- Produces: `HERO: { headline: string; answer: string; marked: string; nerdNote: string; how: readonly string[] }`, `PHOTO: { src: string; alt: string; width: number; height: number } | null`, section `id="top"`.

- [ ] **Step 1: Append the failing tests**

```js
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
```

- [ ] **Step 2: Build and watch them fail**

Run: `cmd.exe /c "npm run build"` then `node --test tests/site.test.mjs`
Expected: the 2 new tests FAIL (first on "Your tools don't talk").

- [ ] **Step 3: Update the data**

In `data/portfolio.ts`, change the `hours` line inside `ME` to:

```ts
  hours: "Delhi, India. My mornings overlap the UK, my evenings the US.",
```

Replace the whole `// ── Hero ──` block (`export const HERO = { ... } as const;`) with:

```ts
// ── Hero: Manveen's own words (spec 5a), keep the phrasing ──────────
export const HERO = {
  headline: "Your tools don't talk to each other, so someone on your team copies things between them.",
  answer: "I connect them so it happens on its own,",
  marked: "the same way every time.",
  nerdNote: "nerd word for this: deterministic. Same input, same result, every time.",
  how: [
    "I start with the problem that wastes the most of your time. I don't automate things that aren't anyone's problem.",
    "The ones worth fixing are usually messy. That's why they're not automatic yet, and that's why they're problems.",
  ],
} as const;

/** Path under /public plus its pixel size, or null until Manveen sends a photo (Task 12). */
export const PHOTO: { src: string; alt: string; width: number; height: number } | null = null;
```

- [ ] **Step 4: Replace `components/Hero.tsx`**

```tsx
import Image from "next/image";
import { ME, HERO, PHOTO } from "@/data/portfolio";
import Annotated from "@/components/Annotated";
import { Underline } from "@/components/Pen";

export default function Hero() {
  return (
    <section id="top" className="wrap sec hero">
      {PHOTO && (
        <Image className="photo" src={PHOTO.src} alt={PHOTO.alt} width={PHOTO.width} height={PHOTO.height} priority />
      )}
      <h1>{HERO.headline}</h1>
      <Annotated note={HERO.nerdNote}>
        <p className="lede">
          {HERO.answer} <Underline>{HERO.marked}</Underline>
        </p>
      </Annotated>
      {HERO.how.map((line) => (
        <p key={line} className="body">
          {line}
        </p>
      ))}
      <p className="small">{ME.hours}</p>
      <a className="btn" href={ME.calendly} target="_blank" rel="noopener">
        Book a 30-minute call
      </a>
    </section>
  );
}
```

- [ ] **Step 5: Build, test, lint**

Run: `cmd.exe /c "npm run build"`, `node --test tests/site.test.mjs`, `cmd.exe /c "npm run lint"`
Expected: 8 pass, 0 fail; lint exits 0.

- [ ] **Step 6: Commit**

```bash
git status --short
git add components/Hero.tsx data/portfolio.ts tests/site.test.mjs
git commit -m "hero: the problem first, in Manveen's words" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Tender Radar, with numbers a skeptic can check

**Files:**
- Create: `lib/runs.ts`, `tests/runs.test.mjs`
- Modify: `lib/pipeline.ts` (move `fmtRun` out)
- Replace: `components/Proof.tsx`
- Modify: `data/portfolio.ts` (replace `PIPELINE`)
- Test: `tests/site.test.mjs` (append)

**Interfaces:**
- Consumes: `PipelineData` from `lib/pipeline.ts` (`{ asOf: string; live: boolean; totalRuns: number; lastRun: { at: string; ok: boolean }; noticesRead: number; clientProfiles: number; history: { date: string; ok: boolean }[] }`), `Annotated`, `Circle`.
- Produces: `fmtRun(iso: string): string` and `runLine(lastRun: { at: string; ok: boolean }, live: boolean, asOf: string): string` in `lib/runs.ts`; `fmtRun` still importable from `lib/pipeline.ts`; `PIPELINE: { firstRun; intro; penNote; outage; loom; repo }`; section `id="proof"`.

- [ ] **Step 1: Write the failing unit tests**

Create `tests/runs.test.mjs`:

```js
// Unit tests for the run-panel wording. lib/runs.ts has no imports, so Node
// loads it directly (type stripping: built into Node 24, flag on Node 22).

import { test } from "node:test";
import assert from "node:assert/strict";
import { fmtRun, runLine } from "../lib/runs.ts";

test("fmtRun uses fixed month names in UTC", () => {
  assert.equal(fmtRun("2026-09-07T10:39:34Z"), "7 Sep, 10:39 UTC");
});

test("a failed last run is said plainly", () => {
  assert.equal(
    runLine({ at: "2026-10-13T12:53:46Z", ok: false }, true, "2026-10-13T13:00:00Z"),
    "Last run: 13 Oct, 12:53 UTC, and it failed. Read live from GitHub.",
  );
});

test("saved numbers say when they were saved", () => {
  assert.equal(
    runLine({ at: "2026-10-13T12:53:46Z", ok: true }, false, "2026-10-13T18:00:00Z"),
    "Last run: 13 Oct, 12:53 UTC. Numbers saved 13 Oct, 18:00 UTC.",
  );
});
```

- [ ] **Step 2: Append the failing site tests**

Append to `tests/site.test.mjs`:

```js
// ── Task 4: Tender Radar, with numbers a skeptic can check ─────────────
test("proof shows the real run count, trades not companies, and no serial labels", () => {
  const t = text("index.html");
  assert.ok(t.includes(String(snapshot.totalRuns)), "run count missing");
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
```

- [ ] **Step 3: Run and watch them fail**

Run: `node --test tests/runs.test.mjs`
Expected: FAIL, cannot find module `../lib/runs.ts`.
Run: `cmd.exe /c "npm run build"` then `node --test tests/site.test.mjs`
Expected: the 3 new site tests FAIL.

- [ ] **Step 4: Create `lib/runs.ts`**

```ts
// Wording for the run panel. No imports, so tests/runs.test.mjs can load it directly.

export type LastRun = { at: string; ok: boolean };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "7 Sep, 10:39 UTC" from an ISO timestamp. Fixed month names so no locale
 *  renders "Sept" or moves the day. */
export function fmtRun(iso: string): string {
  const d = new Date(iso);
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}, ${hh}:${mm} UTC`;
}

/** The line under the bars: when it last ran, whether that worked, and where the numbers come from. */
export function runLine(lastRun: LastRun, live: boolean, asOf: string): string {
  const when = fmtRun(lastRun.at);
  const run = lastRun.ok ? `Last run: ${when}.` : `Last run: ${when}, and it failed.`;
  const source = live ? "Read live from GitHub." : `Numbers saved ${fmtRun(asOf)}.`;
  return `${run} ${source}`;
}
```

- [ ] **Step 5: Move `fmtRun` out of `lib/pipeline.ts`**

Delete everything from the line `/** "7 Sep, 10:39 UTC" from an ISO timestamp. Fixed month names so no locale` to the end of the file (the `MONTHS` constant and the `fmtRun` function), and put this in its place:

```ts
export { fmtRun } from "./runs";
```

- [ ] **Step 6: Replace `PIPELINE` in `data/portfolio.ts`**

Replace the whole `export const PIPELINE = { ... } as const;` block with:

```ts
export const PIPELINE = {
  firstRun: "3 July 2026",
  intro:
    "Government contract notices for cleaning, security and facilities work are spread across several UK websites. I wanted one script to read all of them every morning and sort out which ones each trade should bid on.",
  penNote: "every bar is a morning nobody pressed a button",
  outage:
    "Its worst stretch was about three weeks, from 21 July to 11 August, when a data-format change quietly stopped the morning run. Now a failed run leaves a visible trace.",
  loom: "https://www.loom.com/share/ed073589208c4e24a7543ba30b9d24dc",
  repo: "https://github.com/Manveen07/tender-radar-showcase",
} as const;
```

- [ ] **Step 7: Replace `components/Proof.tsx`**

```tsx
import { PIPELINE } from "@/data/portfolio";
import type { PipelineData } from "@/lib/pipeline";
import { runLine } from "@/lib/runs";
import Annotated from "@/components/Annotated";
import { Circle } from "@/components/Pen";

/** "7 Sep" for a bar's hover title. */
function fmtDay(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
}

export default function Proof({ pipe }: { pipe: PipelineData }) {
  const failed = pipe.history.filter((r) => !r.ok).length;
  return (
    <section id="proof" className="wrap sec">
      <p className="kicker">Running right now · Tender Radar</p>
      <p className="lede">{PIPELINE.intro}</p>
      <Annotated note={PIPELINE.penNote}>
        <p className="count">
          <Circle>{pipe.totalRuns}</Circle>
        </p>
        <p className="body">mornings it has run on its own since {PIPELINE.firstRun}.</p>
        <div
          className="bars"
          role="img"
          aria-label={`Last ${pipe.history.length} mornings: ${pipe.history.length - failed} ran, ${failed} failed`}
        >
          {pipe.history.map((r, i) => (
            <i key={`${r.date}-${i}`} className={r.ok ? undefined : "f"} title={`${fmtDay(r.date)}: ${r.ok ? "ran" : "failed"}`} />
          ))}
        </div>
        <p className="small">
          One bar per morning, last {pipe.history.length}. Black ran, red failed. {runLine(pipe.lastRun, pipe.live, pipe.asOf)}
        </p>
      </Annotated>
      <p className="body">
        It sorts for {pipe.clientProfiles} trades, from cleaning and security to pest control, and has read {pipe.noticesRead} notices so far.
      </p>
      <p className="body">{PIPELINE.outage}</p>
      <p className="links">
        <a href={PIPELINE.loom} target="_blank" rel="noopener">Watch it work (3 min) ↗</a>
        <a href={PIPELINE.repo} target="_blank" rel="noopener">See the code ↗</a>
      </p>
    </section>
  );
}
```

- [ ] **Step 8: Build, test, lint**

Run: `node --test tests/runs.test.mjs` → 3 pass.
Run: `cmd.exe /c "npm run build"`, `node --test tests/site.test.mjs`, `cmd.exe /c "npm run lint"`
Expected: 11 pass, 0 fail; lint exits 0.

- [ ] **Step 9: Commit**

```bash
git status --short
git add lib/runs.ts lib/pipeline.ts components/Proof.tsx data/portfolio.ts tests/runs.test.mjs tests/site.test.mjs
git commit -m "proof: real run count, trades not companies, says when numbers are saved" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: What people say, and job history that matches the letter

**Files:**
- Replace: `components/About.tsx`
- Modify: `data/portfolio.ts` (replace `Role` and `ROLES`, add `QUOTE`)
- Test: `tests/site.test.mjs` (append)

**Interfaces:**
- Consumes: `Annotated`, `Underline`, `ME`, `EDUCATION`.
- Produces: `QUOTE: { before; marked; name; title; company; source; penNote }` (all strings), `Role = { co: string; role: string; span: string; what?: string }`, `ROLES: Role[]`, section `id="people"`.

- [ ] **Step 1: Append the failing tests**

```js
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
```

- [ ] **Step 2: Build and watch them fail**

Run: `cmd.exe /c "npm run build"` then `node --test tests/site.test.mjs`
Expected: the 2 new tests FAIL.

- [ ] **Step 3: Update the data**

In `data/portfolio.ts`, replace the `Role` type and the `ROLES` array (from `export type Role = {` to the end of `export const ROLES: Role[] = [ ... ];`) with:

```ts
export type Role = { co: string; role: string; span: string; what?: string };

// Caprae dates and title come from the signed letter (11 Jan 2026).
// Precise Leads is one line only: agency results stay off the freelance page.
export const ROLES: Role[] = [
  { co: "Precise Leads", role: "GTM automation engineer", span: "Nov 2025 → now" },
  {
    co: "Caprae Capital Partners",
    role: "Machine Learning Intern",
    span: "Aug 2025 → Jan 2026 · US, remote",
    what: "An investment firm. I built the system that reads resumes and ranks candidates for their recruiting team.",
  },
];

// ── What people say: verbatim from Zackary Beckham's signed letter (11 Jan 2026).
// Never publish the letter PDF or the email address on it.
export const QUOTE = {
  before: "…produced clear and maintainable technical documentation, and ",
  marked: "effectively communicated complex engineering concepts to non-technical stakeholders.",
  name: "Zackary Beckham",
  title: "Chief Operations Officer",
  company: "Caprae Capital Partners",
  source: "From a signed letter of recommendation, 11 Jan 2026. Full letter available on request.",
  penNote: "the bit that matters if you don't write code",
} as const;
```

- [ ] **Step 4: Replace `components/About.tsx`**

```tsx
import { QUOTE, ROLES, EDUCATION, ME } from "@/data/portfolio";
import Annotated from "@/components/Annotated";
import { Underline } from "@/components/Pen";

export default function About() {
  return (
    <section id="people" className="wrap sec">
      <p className="kicker">What people say</p>
      <Annotated note={QUOTE.penNote}>
        <figure className="quote">
          <blockquote>
            <p>
              “{QUOTE.before}
              <Underline>{QUOTE.marked}</Underline>”
            </p>
          </blockquote>
          <figcaption>
            <b>{QUOTE.name}</b>, {QUOTE.title}, {QUOTE.company}
            <br />
            <span className="small">{QUOTE.source}</span>
          </figcaption>
        </figure>
      </Annotated>
      <h2 className="h3">Where I&apos;ve done this</h2>
      <ul className="roles">
        {ROLES.map((r) => (
          <li key={r.co}>
            <p>
              <b>{r.co}</b> · {r.role}
            </p>
            <p className="small">{r.span}</p>
            {r.what && <p className="what">{r.what}</p>}
          </li>
        ))}
      </ul>
      <p className="small">
        {EDUCATION} · <a className="link" href={ME.resume}>Full resume ↗</a>
      </p>
    </section>
  );
}
```

- [ ] **Step 5: Build, test, lint**

Run: `cmd.exe /c "npm run build"`, `node --test tests/site.test.mjs`, `cmd.exe /c "npm run lint"`
Expected: 13 pass, 0 fail; lint exits 0.

- [ ] **Step 6: Commit**

```bash
git status --short
git add components/About.tsx data/portfolio.ts tests/site.test.mjs
git commit -m "people: Zackary Beckham's letter, Caprae dates from the letter" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Three projects, nothing stale

**Files:**
- Replace: `components/Work.tsx`
- Modify: `data/portfolio.ts` (add `WorkItem`, `WORK`)
- Delete: `public/operator-demo.mp4`, `public/operator-demo.jpg`
- Test: `tests/site.test.mjs` (append)

**Interfaces:**
- Consumes: nothing new.
- Produces: `WorkItem = { title: string; where: string; lead: string; detail: string; metrics: [string, string][]; stack: string[]; links?: { label: string; href: string }[] }`, `WORK: WorkItem[]`, section `id="work"`.

- [ ] **Step 1: Append the failing tests**

```js
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
```

- [ ] **Step 2: Build and watch them fail**

Run: `cmd.exe /c "npm run build"` then `node --test tests/site.test.mjs`
Expected: "work shows resume screening..." FAILs (old page has 6 bays).

- [ ] **Step 3: Add `WORK` to `data/portfolio.ts`**

Insert directly before the `// ── Work bays ──` comment:

```ts
// ── Other work: three cards. Tender Radar has its own section above. ──
export type WorkItem = {
  title: string;
  where: string;
  lead: string;
  detail: string;
  metrics: [string, string][];
  stack: string[];
  links?: { label: string; href: string }[];
};

export const WORK: WorkItem[] = [
  {
    title: "Resume screening, automated",
    where: "At Caprae Capital Partners",
    lead: "Reads incoming resumes, ranks the candidates, and books the interviews.",
    detail:
      "A recruiting team was spending most of a day a week reading resumes by hand. The system reads each one, scores it against the role, writes the shortlist and schedules the calls.",
    metrics: [
      ["10h → 3h", "screening per week"],
      ["5 → 1.5", "days to a shortlist"],
    ],
    stack: ["python", "embeddings", "slack"],
  },
  {
    title: "PresentAI",
    where: "My own project, live",
    lead: "Paste your notes, get a slide deck in under a minute.",
    detail:
      "It works out the story first, then writes the slides and the speaker notes, and exports to PowerPoint. It's free, so you can try it right now.",
    metrics: [
      ["2h → 15m", "to a first deck"],
      ["<60s", "for the first draft"],
    ],
    stack: ["next.js", "postgres", "python-pptx"],
    links: [
      { label: "Try it ↗", href: "https://present-ai-007.vercel.app/" },
      { label: "See the code ↗", href: "https://github.com/Manveen07/PresentAI" },
    ],
  },
  {
    title: "leadlens",
    where: "My own project",
    lead: "Reads a job posting and tells you whether the AI role is real, dressed up, or a scam.",
    detail:
      "I hand-checked 72 real postings, then measured it against them. It scored a perfect 100%, which was the problem: my own notes were leaking the answers into the test. I took them out and published the lower score.",
    metrics: [
      ["82%", "of scams caught"],
      ["0", "real jobs wrongly flagged"],
    ],
    stack: ["python", "gemini", "pydantic"],
    links: [{ label: "How I tested it →", href: "/writing/schema-as-eval-spec" }],
  },
];

```

- [ ] **Step 4: Replace `components/Work.tsx`**

```tsx
import Link from "next/link";
import { WORK } from "@/data/portfolio";

export default function Work() {
  return (
    <section id="work" className="wrap sec">
      <p className="kicker">Other things I&apos;ve built</p>
      <div className="work">
        {WORK.map((w) => (
          <article key={w.title} className="card">
            <p className="small">{w.where}</p>
            <h2 className="h3">{w.title}</h2>
            <p className="body">
              <b>{w.lead}</b>
            </p>
            <p className="body">{w.detail}</p>
            <dl className="metrics">
              {w.metrics.map(([n, label]) => (
                <div key={label}>
                  <dt>{n}</dt>
                  <dd>{label}</dd>
                </div>
              ))}
            </dl>
            <p className="stack">built with {w.stack.join(", ")}</p>
            {w.links && (
              <p className="links">
                {w.links.map((l) =>
                  l.href.startsWith("/") ? (
                    <Link key={l.href} href={l.href}>
                      {l.label}
                    </Link>
                  ) : (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener">
                      {l.label}
                    </a>
                  ),
                )}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Delete the demo-data video**

```bash
git rm -q public/operator-demo.mp4 public/operator-demo.jpg
```

- [ ] **Step 6: Build, test, lint**

Run: `cmd.exe /c "npm run build"`, `node --test tests/site.test.mjs`, `cmd.exe /c "npm run lint"`
Expected: 15 pass, 0 fail; lint exits 0.

- [ ] **Step 7: Commit**

```bash
git status --short
git add components/Work.tsx data/portfolio.ts tests/site.test.mjs
git commit -m "work: three cards, no stale status, demo-data video gone" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: What broke, quieter

**Files:**
- Replace: `components/Incidents.tsx`
- Modify: `data/portfolio.ts` (fix the leadlens incident wording, add `BROKE_INTRO`)
- Test: `tests/site.test.mjs` (append)

**Interfaces:**
- Consumes: `INCIDENTS: { when: string; system: string; broke: string; changed: string }[]` (existing shape).
- Produces: `BROKE_INTRO: string`, section `id="broke"`.

- [ ] **Step 1: Append the failing test**

```js
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
```

- [ ] **Step 2: Build and watch it fail**

Run: `cmd.exe /c "npm run build"` then `node --test tests/site.test.mjs`
Expected: the new test FAILs (no `section#broke`).

- [ ] **Step 3: Update the data**

In `data/portfolio.ts`, in the `leadlens` incident, change the `changed` line to:

```ts
    changed: "Took my notes out, re-ran it, and published the lower number.",
```

and insert directly before `export type Incident`:

```ts
export const BROKE_INTRO = "When something I built breaks, I write it down. Here's the list, and what I changed each time.";

```

- [ ] **Step 4: Replace `components/Incidents.tsx`**

```tsx
import { INCIDENTS, BROKE_INTRO } from "@/data/portfolio";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-07" → "Jul 2026". */
function fmtMonth(ym: string) {
  const [y, m] = ym.split("-");
  return `${MONTHS[Number(m) - 1]} ${y}`;
}

export default function Incidents() {
  return (
    <section id="broke" className="wrap sec">
      <p className="kicker">What broke</p>
      <p className="body">{BROKE_INTRO}</p>
      <ol className="broke">
        {INCIDENTS.map((x) => (
          <li key={x.broke}>
            <p className="small">
              {fmtMonth(x.when)} · {x.system}
            </p>
            <p className="body">{x.broke}</p>
            <p className="fix">→ {x.changed}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
```

- [ ] **Step 5: Build, test, lint**

Run: `cmd.exe /c "npm run build"`, `node --test tests/site.test.mjs`, `cmd.exe /c "npm run lint"`
Expected: 16 pass, 0 fail; lint exits 0.

- [ ] **Step 6: Commit**

```bash
git status --short
git add components/Incidents.tsx data/portfolio.ts tests/site.test.mjs
git commit -m "broke: the incident log in red pen, no 'honest'" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: How working with me goes, page order, and clean-up

**Files:**
- Replace: `components/Contact.tsx`, `app/page.tsx`, `data/portfolio.ts` (final complete file)
- Delete: `components/Writing.tsx`
- Test: `tests/site.test.mjs` (append)

**Interfaces:**
- Consumes: every section component from Tasks 3 to 7, `getPipeline()`.
- Produces: `PILOT: { opener: string; steps: readonly string[] }`, section `id="contact"` (the post page links to `/#contact` in Task 9). After this task `data/portfolio.ts` exports exactly: `ME, OFF_CLOCK, HERO, PHOTO, PIPELINE, Role, ROLES, QUOTE, EDUCATION, WorkItem, WORK, BROKE_INTRO, Incident, INCIDENTS, PILOT`.

- [ ] **Step 1: Append the failing tests**

```js
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
```

- [ ] **Step 2: Build and watch them fail**

Run: `cmd.exe /c "npm run build"` then `node --test tests/site.test.mjs`
Expected: the order, Book-a-call count and pilot tests FAIL.

- [ ] **Step 3: Replace `components/Contact.tsx`**

```tsx
import { ME, PILOT } from "@/data/portfolio";

export default function Contact() {
  return (
    <section id="contact" className="wrap sec">
      <p className="kicker">How working with me goes</p>
      <p className="lede">{PILOT.opener}</p>
      <ol className="steps">
        {PILOT.steps.map((s) => (
          <li key={s} className="body">
            {s}
          </li>
        ))}
      </ol>
      <p className="cta-row">
        <a className="btn" href={ME.calendly} target="_blank" rel="noopener">
          Book a 30-minute call
        </a>
        <a className="link" href={`mailto:${ME.email}`}>
          {ME.email}
        </a>
      </p>
    </section>
  );
}
```

- [ ] **Step 4: Replace `app/page.tsx`**

```tsx
import Hero from "@/components/Hero";
import Proof from "@/components/Proof";
import About from "@/components/About";
import Work from "@/components/Work";
import Incidents from "@/components/Incidents";
import Contact from "@/components/Contact";
import { getPipeline } from "@/lib/pipeline";

// The run history is re-read from GitHub at most once an hour.
export const revalidate = 3600;

export default async function Home() {
  const pipe = await getPipeline();
  return (
    <>
      <Hero />
      <Proof pipe={pipe} />
      <About />
      <Work />
      <Incidents />
      <Contact />
    </>
  );
}
```

- [ ] **Step 5: Delete the home-page writing section**

```bash
git rm -q components/Writing.tsx
```

- [ ] **Step 6: Replace `data/portfolio.ts` with the final complete file**

This drops every export only the old components used (`NAV`, `TAG`, `SNAPSHOT`, `ABOUT`, `TOOLS_LINE`, `PLATES`, `Bay`, `BAYS`, `DOORS`) and adds `PILOT`:

```ts
// All copy for the home page. Components read from here; edit words here.
// Rules for every string: spec section 5 (no dashes, no sales words, Manveen's
// own phrasing where spec 5a has it). Every figure needs a source: see
// docs/superpowers/specs/2026-10-13-claims.md.

// ── Identity ─────────────────────────────────────────────────────────
export const ME = {
  name: "Manveen Singh",
  role: "automation engineer",
  location: "Delhi, India",
  hours: "Delhi, India. My mornings overlap the UK, my evenings the US.",
  email: "manveen9650@gmail.com",
  github: "https://github.com/Manveen07",
  linkedin: "https://linkedin.com/in/Manveen",
  calendly: "https://calendly.com/manveen9650/30min",
  resume: "/resume.pdf",
} as const;

// ── Off the clock: footer line, from Manveen's own answers (13 Oct) ──
export const OFF_CLOCK = "Hunter x Hunter theory videos, Peacemaker, Elden Ring, Sekiro, Doom, The Weeknd.";

// ── Hero: Manveen's own words (spec 5a), keep the phrasing ──────────
export const HERO = {
  headline: "Your tools don't talk to each other, so someone on your team copies things between them.",
  answer: "I connect them so it happens on its own,",
  marked: "the same way every time.",
  nerdNote: "nerd word for this: deterministic. Same input, same result, every time.",
  how: [
    "I start with the problem that wastes the most of your time. I don't automate things that aren't anyone's problem.",
    "The ones worth fixing are usually messy. That's why they're not automatic yet, and that's why they're problems.",
  ],
} as const;

/** Path under /public plus its pixel size, or null until Manveen sends a photo (Task 12). */
export const PHOTO: { src: string; alt: string; width: number; height: number } | null = null;

// ── Tender Radar: prose only. Numbers come from lib/pipeline.ts ──────
// (GitHub at request time when GITHUB_TOKEN is set, else the committed
// data/pipeline-snapshot.json; refresh it with `npm run refresh-snapshot`).
export const PIPELINE = {
  firstRun: "3 July 2026",
  intro:
    "Government contract notices for cleaning, security and facilities work are spread across several UK websites. I wanted one script to read all of them every morning and sort out which ones each trade should bid on.",
  penNote: "every bar is a morning nobody pressed a button",
  outage:
    "Its worst stretch was about three weeks, from 21 July to 11 August, when a data-format change quietly stopped the morning run. Now a failed run leaves a visible trace.",
  loom: "https://www.loom.com/share/ed073589208c4e24a7543ba30b9d24dc",
  repo: "https://github.com/Manveen07/tender-radar-showcase",
} as const;

// ── Career ───────────────────────────────────────────────────────────
export type Role = { co: string; role: string; span: string; what?: string };

// Caprae dates and title come from the signed letter (11 Jan 2026).
// Precise Leads is one line only: agency results stay off the freelance page.
export const ROLES: Role[] = [
  { co: "Precise Leads", role: "GTM automation engineer", span: "Nov 2025 → now" },
  {
    co: "Caprae Capital Partners",
    role: "Machine Learning Intern",
    span: "Aug 2025 → Jan 2026 · US, remote",
    what: "An investment firm. I built the system that reads resumes and ranks candidates for their recruiting team.",
  },
];

// ── What people say: verbatim from Zackary Beckham's signed letter (11 Jan 2026).
// Never publish the letter PDF or the email address on it.
export const QUOTE = {
  before: "…produced clear and maintainable technical documentation, and ",
  marked: "effectively communicated complex engineering concepts to non-technical stakeholders.",
  name: "Zackary Beckham",
  title: "Chief Operations Officer",
  company: "Caprae Capital Partners",
  source: "From a signed letter of recommendation, 11 Jan 2026. Full letter available on request.",
  penNote: "the bit that matters if you don't write code",
} as const;

export const EDUCATION = "B.Tech Computer Science · MSIT Delhi · 2026";

// ── Other work: three cards. Tender Radar has its own section above. ──
export type WorkItem = {
  title: string;
  where: string;
  lead: string;
  detail: string;
  metrics: [string, string][];
  stack: string[];
  links?: { label: string; href: string }[];
};

export const WORK: WorkItem[] = [
  {
    title: "Resume screening, automated",
    where: "At Caprae Capital Partners",
    lead: "Reads incoming resumes, ranks the candidates, and books the interviews.",
    detail:
      "A recruiting team was spending most of a day a week reading resumes by hand. The system reads each one, scores it against the role, writes the shortlist and schedules the calls.",
    metrics: [
      ["10h → 3h", "screening per week"],
      ["5 → 1.5", "days to a shortlist"],
    ],
    stack: ["python", "embeddings", "slack"],
  },
  {
    title: "PresentAI",
    where: "My own project, live",
    lead: "Paste your notes, get a slide deck in under a minute.",
    detail:
      "It works out the story first, then writes the slides and the speaker notes, and exports to PowerPoint. It's free, so you can try it right now.",
    metrics: [
      ["2h → 15m", "to a first deck"],
      ["<60s", "for the first draft"],
    ],
    stack: ["next.js", "postgres", "python-pptx"],
    links: [
      { label: "Try it ↗", href: "https://present-ai-007.vercel.app/" },
      { label: "See the code ↗", href: "https://github.com/Manveen07/PresentAI" },
    ],
  },
  {
    title: "leadlens",
    where: "My own project",
    lead: "Reads a job posting and tells you whether the AI role is real, dressed up, or a scam.",
    detail:
      "I hand-checked 72 real postings, then measured it against them. It scored a perfect 100%, which was the problem: my own notes were leaking the answers into the test. I took them out and published the lower score.",
    metrics: [
      ["82%", "of scams caught"],
      ["0", "real jobs wrongly flagged"],
    ],
    stack: ["python", "gemini", "pydantic"],
    links: [{ label: "How I tested it →", href: "/writing/schema-as-eval-spec" }],
  },
];

// ── What broke ───────────────────────────────────────────────────────
// Real entries only. Dates from the projects' own records. Add one whenever
// something real breaks; never pad it.
export const BROKE_INTRO = "When something I built breaks, I write it down. Here's the list, and what I changed each time.";

export type Incident = { when: string; system: string; broke: string; changed: string };

export const INCIDENTS: Incident[] = [
  {
    when: "2026-07",
    system: "tender radar",
    broke: "A data-format change silently stopped the morning run. Nobody noticed for about three weeks.",
    changed: "Fixed it. A failed run now leaves a visible trace instead of dying quietly.",
  },
  {
    when: "2026-08",
    system: "demo pipeline",
    broke: "Rendering videos in parallel cut one down to 39 seconds over an 80-second narration.",
    changed: "One at a time now, with a length check before anything is sent.",
  },
  {
    when: "2026-07",
    system: "tender radar",
    broke: "Short keywords matched inside longer words (“guard” inside “safeguarding”), so the wrong tenders got tagged.",
    changed: "Whole-word matching. Those exact cases live in the test set now.",
  },
  {
    when: "2026-06",
    system: "leadlens",
    broke: "My own notes leaked the answers into the test, so the judge scored a perfect 100%.",
    changed: "Took my notes out, re-ran it, and published the lower number.",
  },
];

// ── How working with me goes ─────────────────────────────────────────
export const PILOT = {
  opener:
    "On the first call you tell me what wastes the most time. If it isn't a real problem, I'll say so and we won't build it.",
  steps: [
    "If it is, I quote a fixed price for a pilot before any work starts.",
    "The pilot runs on a month of your real requests. Every miss gets logged, and you see the list, not just a score.",
    "If you keep it, a monthly fee covers me looking after it.",
  ],
} as const;
```

- [ ] **Step 7: Build, test, lint**

Run: `cmd.exe /c "npm run build"`, `node --test tests/site.test.mjs tests/runs.test.mjs`, `cmd.exe /c "npm run lint"`
Expected: build succeeds (a "has no exported member" error here means a file still uses old copy: fix that file, don't re-add the export); 20 site + 3 unit tests pass (23 total), 0 fail; lint exits 0.

- [ ] **Step 8: Commit**

```bash
git status --short
git add components/Contact.tsx app/page.tsx data/portfolio.ts tests/site.test.mjs
git commit -m "contact: the 'is it a real problem' pilot; page order; drop dead copy" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Writing pages, 404, metadata, share image and icon

**Files:**
- Replace: `app/layout.tsx` (final), `app/writing/page.tsx`, `app/writing/[slug]/page.tsx`, `app/not-found.tsx`, `app/opengraph-image.tsx`, `public/favicon.svg`
- Delete: `app/favicon.ico` (the create-next-app default from the first commit)
- Test: `tests/site.test.mjs` (append)

**Interfaces:**
- Consumes: `POSTS`, `getPost` from `data/posts.ts`; `Prose`; `snapshot` JSON; section `id="contact"` from Task 8.
- Produces: nothing later tasks call.

- [ ] **Step 1: Append the failing tests**

```js
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
```

- [ ] **Step 2: Build and watch them fail**

Run: `cmd.exe /c "npm run build"` then `node --test tests/site.test.mjs`
Expected: the 4 new tests FAIL.

- [ ] **Step 3: Replace `app/layout.tsx` (final version)**

```tsx
import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const sans = Archivo({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "600", "800", "900"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const TITLE = "Manveen Singh | automation engineer";
const DESCRIPTION =
  "Manveen Singh connects the tools a business already uses, so the copy-paste work between them happens on its own, the same way every time.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["automation engineer", "workflow automation", "data entry automation", "Python", "Manveen Singh"],
  authors: [{ name: "Manveen Singh" }],
  metadataBase: new URL("https://manveen.me"),
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: "website",
    locale: "en_US",
    url: "https://manveen.me",
    siteName: "Manveen Singh",
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  icons: { icon: "/favicon.svg", apple: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Lets CSS hide pen marks until they scroll into view. Without JS they stay drawn. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('pen-js')" }} />
      </head>
      <body className={`${sans.variable} ${mono.variable}`}>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Replace `app/writing/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { POSTS } from "@/data/posts";

export const metadata: Metadata = {
  title: "Writing | Manveen Singh",
  description: "What I tried, what broke, what fixed it.",
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function WritingIndex() {
  return (
    <section className="wrap sec hero">
      <p className="kicker">Writing</p>
      <h1>What I tried, what broke, what fixed it.</h1>
      <ul className="post-list">
        {POSTS.map((p) => (
          <li key={p.slug}>
            <Link href={`/writing/${p.slug}`}>
              <p className="small">
                {fmtDate(p.date)} · {p.readMins} min read
              </p>
              <h2 className="h3">{p.cardTitle ?? p.title}</h2>
              <p className="body">{p.cardSummary ?? p.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 5: Replace `app/writing/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { POSTS, getPost } from "@/data/posts";
import Prose from "@/components/Prose";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Not found" };
  return {
    title: `${post.title} | Manveen Singh`,
    description: post.summary,
    openGraph: { title: post.title, description: post.summary, type: "article" },
  };
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="wrap sec hero">
      <p className="small">
        <Link href="/writing" className="link">
          ← all writing
        </Link>
      </p>
      <p className="small">
        {fmtDate(post.date)} · {post.readMins} min read · {post.tags.join(", ")}
      </p>
      <h1>{post.title}</h1>
      <p className="lede">{post.summary}</p>
      <Prose body={post.body} />
      <p className="cta-row" style={{ marginTop: 48 }}>
        <Link href="/writing" className="link">
          ← all writing
        </Link>
        <Link href="/#contact" className="btn">
          Work with me
        </Link>
      </p>
    </article>
  );
}
```

- [ ] **Step 6: Replace `app/not-found.tsx`**

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap sec hero">
      <p className="kicker">404</p>
      <h1>Nothing here.</h1>
      <p className="lede">This page doesn&apos;t exist, or it used to and I took it down.</p>
      <Link className="btn" href="/">
        Back to the home page
      </Link>
    </section>
  );
}
```

- [ ] **Step 7: Replace `app/opengraph-image.tsx`**

```tsx
import { ImageResponse } from "next/og";
import snapshot from "@/data/pipeline-snapshot.json";

export const runtime = "edge";
export const alt = "Manveen Singh, automation engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The card people see when manveen.me is pasted into an email, Slack or LinkedIn.
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f4f1ea",
          color: "#1d1d1d",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, fontWeight: 700 }}>Manveen Singh</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 800, lineHeight: 1.08, letterSpacing: -2 }}>
            Your tools don&apos;t talk to each other.
          </div>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 800, lineHeight: 1.08, letterSpacing: -2 }}>
            I connect them so it happens on its own.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div
              style={{
                display: "flex",
                padding: "6px 26px",
                border: "4px solid #c4161c",
                borderRadius: "50%",
                fontSize: 52,
                fontWeight: 800,
              }}
            >
              {snapshot.totalRuns}
            </div>
            <div style={{ display: "flex", fontSize: 26, color: "#5a5750" }}>mornings one system has run on its own</div>
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#c4161c" }}>manveen.me</div>
        </div>
      </div>
    ),
    size,
  );
}
```

- [ ] **Step 8: Replace `public/favicon.svg` and delete the default `.ico`**

`public/favicon.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#f4f1ea"/>
  <text x="32" y="45" font-family="Arial, Helvetica, sans-serif" font-size="38" font-weight="800" text-anchor="middle" fill="#1d1d1d">M</text>
  <ellipse cx="32" cy="32" rx="27" ry="21" fill="none" stroke="#c4161c" stroke-width="4" transform="rotate(-8 32 32)"/>
</svg>
```

```bash
git rm -q app/favicon.ico
```

- [ ] **Step 9: Build, test, lint**

Run: `cmd.exe /c "npm run build"`, `node --test tests/site.test.mjs tests/runs.test.mjs`, `cmd.exe /c "npm run lint"`
Expected: 24 site + 3 unit tests pass (27 total), 0 fail; lint exits 0.

- [ ] **Step 10: Commit**

```bash
git status --short
git add app/layout.tsx app/writing/page.tsx "app/writing/[slug]/page.tsx" app/not-found.tsx app/opengraph-image.tsx public/favicon.svg tests/site.test.mjs
git commit -m "writing, 404, metadata, share image and icon in red pen" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Look at it like a visitor (phone, desktop, share card)

No code unless something is wrong. Uses the T3 preview tools (`preview_open`, `preview_resize`, `preview_snapshot` with `save: true`, `preview_evaluate`).

**Files:** none (fixes, if any, go in the file that owns the broken thing, with a test first if it's testable).

- [ ] **Step 1: Start the production server**

Run in the background: `cmd.exe /c "npm run start"`
Expected: `Ready` on `http://localhost:3000`.

- [ ] **Step 2: Phone screenshots**

`preview_open` → `http://localhost:3000`; `preview_resize` `{mode: "preset", preset: "iphone-12-pro"}`; `preview_snapshot {save: true}` at the top, then scroll through each section and save a snapshot of each. Check: hero readable without zooming, the circled count isn't clipped, margin notes sit under what they point at, Book a call visible on the first screen.

- [ ] **Step 3: Sideways-scroll check (Review Focus 1)**

At `iphone-se` preset and at `{mode: "freeform", width: 320, height: 640}`, run `preview_evaluate`:

```js
({ scrollWidth: document.documentElement.scrollWidth, innerWidth: window.innerWidth })
```

Expected: `scrollWidth <= innerWidth` at both sizes. If not, find the wide element with:

```js
[...document.querySelectorAll("body *")].filter((e) => e.getBoundingClientRect().right > window.innerWidth + 1).slice(0, 5).map((e) => e.className || e.tagName)
```

and fix its CSS in `app/globals.css`.

- [ ] **Step 4: Desktop screenshots**

`preview_resize {mode: "freeform", width: 1280, height: 800}`; save snapshots of each section. Check: notes sit in the right-hand margin beside what they point at, the column isn't wider than about 640px, the pen marks draw once as you scroll.

- [ ] **Step 5: The share card, the other pages**

Open `http://localhost:3000/opengraph-image`, `/writing`, `/writing/schema-as-eval-spec`, `/no-such-page`; save a snapshot of each.

- [ ] **Step 6: Show Manveen**

Embed the saved screenshot paths in the reply. Collect his reactions as a list; each one is either a CSS or copy change (make it, rebuild, retest, commit `look: <what changed>`) or goes to Task 11.

- [ ] **Step 7: Stop the server**

Stop the background `npm run start` task.

---

### Task 11: Voice pass from Manveen's own answers

Needs: Manveen's answers to the 5 questions in spec section 9 (voice note transcript or typed).

**Files:**
- Create: `docs/superpowers/voice/2026-10-answers.md` (his words, verbatim)
- Modify: `data/portfolio.ts` (copy strings only)

- [ ] **Step 1: Save his answers verbatim** to `docs/superpowers/voice/2026-10-answers.md`, one heading per question.

- [ ] **Step 2: Map answers to fields**

| His answer | Field it feeds |
|---|---|
| 1. Tender Radar to a friend | `PIPELINE.intro` |
| 2. The bug he's proudest of | the matching `INCIDENTS` entry's `broke`/`changed`, or `PIPELINE.penNote` if it's about Tender Radar |
| 3. The fun part of the work | `HERO.how` (already partly his words; extend, don't replace) |
| 4. First minute of a call | `PILOT.opener` and `PILOT.steps` |
| 5. Watching, playing, listening | `OFF_CLOCK` |

- [ ] **Step 3: Rewrite each mapped field from his sentences.** Keep his phrasing; only fix grammar, cut repeats, and apply spec section 5 (no dashes, no banned words, contractions, no slogans). Spec 5a lines stay as they are unless he changes them.

- [ ] **Step 4: Run the `humanizer` skill** on the full list of changed strings (paste them in as one block). Apply its fixes only where meaning stays the same.

- [ ] **Step 5: Build and test**

Run: `cmd.exe /c "npm run build"` then `node --test tests/site.test.mjs tests/runs.test.mjs`
Expected: all pass. A failing Task 3, 7 or 8 test means a field changed that a test pins. Update that test's expected sentence to his new wording in the same commit, but never relax a rule test (dashes, banned words, Book a call count).

- [ ] **Step 6: Read-aloud check with Manveen.** He reads the home page out loud on his phone. Every line he wouldn't say gets rewritten with him, then rebuild and retest.

- [ ] **Step 7: Commit**

```bash
git status --short
git add docs/superpowers/voice/2026-10-answers.md data/portfolio.ts tests/site.test.mjs
git commit -m "copy: in Manveen's own words" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 12: Manveen's photo

Needs: 1 to 3 photos from Manveen; he picks one.

**Files:**
- Create: `public/me.jpg`
- Modify: `data/portfolio.ts` (`PHOTO`), `tests/site.test.mjs` (flip the Task 3 photo test)

- [ ] **Step 1: Change the Task 3 photo test** to expect the image. Replace the test `"hero shows no empty photo frame while PHOTO is null"` with:

```js
test("hero shows Manveen's photo", () => {
  const hero = markup("index.html").match(/<section[^>]*id="top"[\s\S]*?<\/section>/)?.[0];
  assert.ok(hero, "no section#top");
  assert.match(hero, /<img[^>]*alt="Manveen Singh"/);
});
```

- [ ] **Step 2: Build and watch it fail**

Run: `cmd.exe /c "npm run build"` then `node --test tests/site.test.mjs`
Expected: `hero shows Manveen's photo` FAILs.

- [ ] **Step 3: Resize the chosen photo** (Windows ffmpeg through WSL interop; use his file's Windows path):

```bash
ffmpeg.exe -y -i "C:\path\to\his-photo.jpg" -vf "scale=480:-2" -q:v 3 public/me.jpg
ffprobe.exe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 public/me.jpg
```

Expected: `ffprobe` prints `480,<height>`.

- [ ] **Step 4: Set `PHOTO`** in `data/portfolio.ts`, using the height `ffprobe` printed:

```ts
export const PHOTO: { src: string; alt: string; width: number; height: number } | null = {
  src: "/me.jpg",
  alt: "Manveen Singh",
  width: 480,
  height: 600, // the height ffprobe printed in Step 3
};
```

- [ ] **Step 5: Build, test, look**

Run: `cmd.exe /c "npm run build"` then `node --test tests/site.test.mjs tests/runs.test.mjs`
Expected: all pass. Repeat Task 10 Step 2 for the hero only and show Manveen.

- [ ] **Step 6: Commit**

```bash
git status --short
git add public/me.jpg data/portfolio.ts tests/site.test.mjs
git commit -m "hero: Manveen's photo" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 13: Skeptic pass, every claim traced

**Files:**
- Create: `docs/superpowers/specs/2026-10-13-claims.md`
- Modify (only if a claim fails): `data/portfolio.ts`, the matching test

- [ ] **Step 1: Run each check and record the result**

Create `docs/superpowers/specs/2026-10-13-claims.md` with this table, filling the Result column from the command output (✓ with the value seen, or ✗):

| Claim on the page | Source | Check | Result |
|---|---|---|---|
| Scheduled-run count, last run (one per morning; manual runs excluded) | GitHub Actions | `gh api "repos/Manveen07/new-10x-engineer/actions/workflows/tender-radar-daily.yml/runs?event=schedule&per_page=1" -q '.total_count, .workflow_runs[0].created_at, .workflow_runs[0].conclusion'` | |
| Notices read | daily summary | `gh api repos/Manveen07/new-10x-engineer/contents/projects/tender-radar/reports/daily-summary.md -q .content \| base64 -d \| grep "Raw tender records"` | |
| Sorts for 7 trades | daily summary profile table | same file, count rows under "Profile results" | |
| Worst stretch 21 Jul to 11 Aug | GitHub Actions | `gh api "repos/Manveen07/new-10x-engineer/actions/workflows/tender-radar-daily.yml/runs?per_page=100&created=2026-07-01..2026-08-31" -q '.workflow_runs[] \| select(.conclusion!="success") \| .created_at[0:10]' \| sort` | |
| Loom video exists | Loom | `curl -s -o /dev/null -w "%{http_code}" https://www.loom.com/share/ed073589208c4e24a7543ba30b9d24dc` → 200 | |
| Code repos are public | GitHub | `gh api repos/Manveen07/tender-radar-showcase -q .private` and `gh api repos/Manveen07/PresentAI -q .private` → false | |
| PresentAI is live and free | the app | `curl -s -o /dev/null -w "%{http_code}" https://present-ai-007.vercel.app/` → 200, then open it and confirm no paywall | |
| Quote, verbatim | `C:\Users\Manveen\Documents\important docs\Manveen Singh LOR.pdf` | Read the PDF; compare word for word | |
| Caprae title and dates | same letter | "Machine Learning Intern ... August 1, 2025 to January 11, 2026" | |
| 10h → 3h, 5 → 1.5 days (Caprae) | resume or Manveen | Read `..\Manveen Singh 2026.pdf`; else ask Manveen how it was measured | |
| 2h → 15m, <60s (PresentAI) | resume or Manveen | same | |
| 82%, 0 wrongly flagged, 72 postings | `../CONTENT-PACK-2026-09-04.md` line 41 | `grep -n "0.818" ../CONTENT-PACK-2026-09-04.md` | |
| Incident dates and details | `../CONTENT-PACK-2026-09-04.md` incident table, commit history | `grep -n "2026-0[678]" ../CONTENT-PACK-2026-09-04.md` | |
| Precise Leads since Nov 2025; B.Tech 2026 | resume | Read `..\Manveen Singh 2026.pdf` | |

- [ ] **Step 2: Fix every ✗.** Change or remove the claim in `data/portfolio.ts` (a number with no source comes off; don't soften it into a vaguer claim). Update the test that pins it.

- [ ] **Step 3: Build and test**

Run: `cmd.exe /c "npm run build"` then `node --test tests/site.test.mjs tests/runs.test.mjs`
Expected: all pass.

- [ ] **Step 4: Commit**

```bash
git status --short
git add docs/superpowers/specs/2026-10-13-claims.md data/portfolio.ts tests/site.test.mjs
git commit -m "audit: every claim on the page traced to a source" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 14: Go live (each step needs Manveen's yes)

- [ ] **Step 1: Zackary's OK.** Ask Manveen whether Zackary agreed to the quote. If no, or no answer yet, don't merge. If he declined: remove the `<Annotated>…</Annotated>` block from `components/About.tsx`, remove `QUOTE` from `data/portfolio.ts`, delete the test `"Zackary's quote has name, title and company, and no email address"`, rebuild, retest, commit `people: no quote until Zackary agrees`.

- [ ] **Step 2: GitHub token (Manveen does this; the token never goes in chat).**
  1. github.com → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token.
  2. Name `manveen.me run history`, expiry 1 year, Repository access: Only select repositories → `Manveen07/new-10x-engineer`.
  3. Permissions: Actions: Read-only, Contents: Read-only. Generate, copy.
  4. vercel.com → the portfolio project → Settings → Environment Variables → `GITHUB_TOKEN` = the token, for Production and Preview → Save.

- [ ] **Step 3: Push the branch (ask first).** On Manveen's yes: `git push -u origin redesign-red-pen`. Find the preview: `gh api "repos/Manveen07/portfolio/deployments?ref=redesign-red-pen" -q '.[0].id'`, then `gh api repos/Manveen07/portfolio/deployments/<id>/statuses -q '.[0].environment_url'`. If no deployment shows up within 5 minutes, Vercel isn't building branch previews: say so and continue with the local checks only.

- [ ] **Step 4: Check the preview.** Open the preview URL in the preview panel (Vercel may ask Manveen to log in). Expected: the proof line says "Read live from GitHub." and the run count matches Task 13's scheduled-run number from GitHub. Open `<preview>/opengraph-image`.

- [ ] **Step 5: Merge (ask first).** On Manveen's yes:

```bash
git switch master
git merge --ff-only redesign-red-pen
git push origin master
```

- [ ] **Step 6: Check production.**

```bash
curl -s https://manveen.me/ | grep -c "Your tools don&#x27;t talk to each other"
curl -s "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=https://manveen.me/&strategy=mobile&category=performance" | python3 -I -c "import sys, json; print(json.load(sys.stdin)['lighthouseResult']['categories']['performance']['score'])"
```

Expected: first prints `1` or more; second prints a score (target ≥ 0.9; report the real number either way). Then paste `https://manveen.me` into a LinkedIn or Slack draft (not sent) to see the new share card.

- [ ] **Step 7: Clean up.** Stop the brainstorm mockup server: `bash /home/manveen/.claude/plugins/cache/claude-plugins-official/superpowers/6.4.1/skills/brainstorming/scripts/stop-server.sh .superpowers/brainstorm/2352-1791914929`.
