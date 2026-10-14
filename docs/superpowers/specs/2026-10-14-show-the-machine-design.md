# Show the machine: making manveen.me intriguing (design addendum)

Date: 14 Oct 2026. Builds on `2026-10-13-credibility-site-redesign-design.md` (still binding) and `2026-10-14-design-verdicts.md` (applied first). Direction "A: show the machine", chosen by Manveen from three mockups on 14 Oct.

## 1. Why

The red-pen page is credible but reads like a well-set document. Manveen asked for it to be intriguing, fresh, with his personality, and not AI slop. Intrigue here comes from one thing: showing the inside of the work, the way he'd explain it himself. He described himself as curious, quiet and obsessed with how things work; he watches channels that break a system down piece by piece. The page should feel like that person sketched it.

## 2. Hard rules: fresh, his, not slop

Every addition must pass all of these. The final review checks each one.

1. **Shows something real.** A number from a real run, a real screenshot, a real score. If it doesn't show something real, it isn't added.
2. **Looks hand-made.** Sketch boxes and arrows are slightly uneven hand-drawn paths, never perfect rectangles or icon-library shapes. Pen marks stay red, notes stay in the mono "handwriting".
3. **Banned (the AI-template look):** gradients, glass or blur effects, drop shadows on cards, emoji or icon sets, stock illustrations, logo strips, testimonial carousels, animated number counters, typewriter text, particle or cursor effects, a "features" grid of identical cards with icons, gradient or glowing buttons, any fake or placeholder data.
4. **Sounds like him.** Notes are short, plain, a bit nerdy, never salesy; spec section 5 copy rules apply (no dashes, no banned words, contractions). New lines go through the humanizer and Manveen's read-aloud in the voice pass.
5. **One idea per section.** At most two margin notes per section; red pen marks only on the thing a note or sentence points at.
6. **Quiet motion only.** The only motion is a pen mark drawing itself once. Off under reduced motion; visible without JS.

## 3. What gets added

### 3.1 Tender Radar sketch (the signature piece)
In the Tender Radar section, between the intro paragraph and the circled run count.

- Five source boxes, top to bottom: `Find a Tender`, `Contracts Finder`, `Public Contracts Scotland`, `Sell2Wales`, `ProContract`. (Verified 14 Oct from the daily workflow: `fetch.py` holds the first four APIs and `fetch_procontract.py` runs as its own step. Implementation must confirm `fetch.py` actually calls all four; drop any it doesn't.)
- Their arrows converge on a box: `my script` / `every morning,` / `no one presses go`.
- An arrow to a result box: `each notice, checked` / `for {trades} trades` / `{maybe} worth a look` / `{bid} worth bidding` with a red hand-drawn circle around the last line.
- Under the result box, red mono: `↑ {bid} out of {checks} checks were worth bidding on.`
- Margin note (desktop beside, phone under): `every number here comes from the same run as the bars below`.
- Two versions: wide (fan-in left to right) from 640px up, tall (stacked top to bottom) below 640px, so text stays readable at 320px. Same numbers, same labels.
- The red circle draws once when scrolled into view (same mechanism as the other pen marks).

Numbers, all from the Tender Radar daily summary (`projects/tender-radar/reports/daily-summary.md`), same live path and saved fallback as the run count:
- `trades` = number of rows in the "Profile results" table (today 7; already `clientProfiles`).
- `checks` = sum of the `Classified` column across rows (today 3,671).
- `bid` = sum of the `Bid` column (today 8). `maybe` = sum of the `Maybe` column (today 64).
- If the table can't be parsed, the sketch still renders with the saved snapshot's numbers; it never shows zeros it didn't read.

Why "checks" and not "notices": the Classified counts include notices no longer on file (593 classified vs 431 on file for cleaning), so putting `bid` next to "431 notices" would mix two populations.

### 3.2 leadlens: the real scorecard
Replaces the card's two metric lines. A 2×2 grid, ink lines, big numbers:
`9` caught · `2` missed · `0` false alarms (red circle) · `61` left alone. Caption above the grid: `Out of 72 postings I checked by hand:`. Source: claims file rows on leadlens (TP 9, FN 2, FP 0, TN 61).
Margin note: `it once scored 100%, because my own notes leaked the answers. This is the score after I took them out.`

### 3.3 PresentAI: a real screenshot
A screenshot of the live app (`present-ai-007.vercel.app`), 640px wide, real colours, thin `--rule` border, `alt="PresentAI's home page"`. No margin note (the section already has two; the free-plan detail is in the card text). If the public page is only a login wall, skip the screenshot and list "a screenshot of a deck it made" as a needs-Manveen input; never mock one up.

### 3.4 Resume screening
Unchanged: text only. It's Caprae's internal system; nothing honest to show.

### 3.5 Photo
Plan Task 12 with Manveen's choice (14 Oct): `IMG_7795`, cropped 4:5 head and shoulders, natural colour, 264px wide. Not the AI-edited `bg_removed_profile_image.png`.

### 3.6 Hero sketch: the problem, drawn (added 14 Oct, approved from mockup)
Between the H1 and the lede, a small sketch of the headline itself:
- Three boxes left to right: `an order comes in` / `by email` → `someone retypes it` / `every single time` → `your system` / `(CRM, sheet, ERP)`.
- Red pen: an X across the middle box, and a red arc from the first box to the third with an arrowhead, labelled above it in red mono `I connect these two directly`.
- The X and the arc draw once when scrolled into view.
- Tall version below 640px (boxes stacked, the red line runs down the side).
- Decorative explanation of the sentence above it: `role="img"` with `aria-label="An order arrives by email, someone retypes it into your system. I connect the two directly."`

### 3.7 Pilot timeline (added 14 Oct, approved from mockup)
In "How working with me goes", replacing the visible numbered list (the `<ol>` stays in the DOM, visually hidden, for screen readers):
- A hand-drawn horizontal line with four dots. Labels: `1 · a call` / `you tell me what` / `wastes the most time` / `not a real problem?` / `I'll say so`; `2 · a fixed quote` / `before any work` / `starts`; `3 · a month, for real` / `on your actual requests` / `every miss logged,` / `you see the list`; `4 · you decide` / `keep it: a monthly` / `fee, I look after it`.
- Red circle around `every miss logged, you see the list`. Margin note: `you see every miss, not just a score`.
- Tall version below 640px (vertical line, steps stacked).
- The lede above it (`On the first call you tell me what wastes the most time. If it isn't a real problem, I'll say so and we won't build it.`) stays as is.

### 3.8 Hand-drawn dividers (added 14 Oct)
Section top borders become a slightly uneven pencil line (an SVG background in `--rule` colour, about 1.4px stroke) instead of a straight 1px line. Same spacing.

With 3.1, that makes three drawings on the page: the problem, the machine, the offer. No fourth: past three it reads as a theme, not an explanation.

### 3.9 Four sections only (Manveen, 14 Oct, chosen from two outlines)
The home page has exactly four sections, in this order:
1. **You** (`#top`): photo, headline, problem sketch, the how-I-pick-problems lines, hours line, Book a call.
2. **The machine** (`#proof`): Tender Radar sketch, circled count, bars, the outage told inline, links.
3. **Work, and who vouches for it** (`#work`, kicker `Work, and who vouches for it`): the Caprae card (resume screening) carries Zackary's quote with its red underline and margin note `the bit that matters if you don't write code`, and its role line `Machine Learning Intern · Aug 2025 → Jan 2026 · US, remote`; then leadlens (scorecard and its note); then PresentAI (screenshot, no note). The section ends with one small line: `Now: GTM automation engineer at Precise Leads, since Nov 2025. B.Tech Computer Science, MSIT Delhi, 2026. Full resume ↗`.
4. **How we start** (`#contact`, kicker stays `How working with me goes`): lede, pilot timeline, Book a call, email.

Removed: the separate "What people say" section (folded into the Caprae card) and the "What broke" section and its data. The two best failure stories stay where they happened (the Tender Radar outage line, the leadlens note). This supersedes the earlier spec's decision to keep the incident log as its own section.

### 3.10 Versions instead of questions (Manveen, 14 Oct)
Where a taste call is still open after building, render two or three real built versions as screenshots side by side for Manveen to pick from. Don't ask in text.

## 4. Out of scope
Crossed-out "marked-up draft" lines (direction B), clickable per-day run history (direction C), new copy beyond the strings above, any animation beyond pen marks drawing once, changes to the hero words.

## 5. Checks before it ships
1. Unit tests for the summary parsing (checks, bid, maybe; unparseable table → null, never zeros).
2. Page tests: sketch numbers equal the saved snapshot's; both sketch versions present; scorecard numbers; photo and screenshot have alt text; the new strings follow the copy rules.
3. Screenshots at 320, 390 and 1280 px; no sideways scroll; sketch text readable at 320.
4. A slop audit against section 2, rule by rule, in the final review, with screenshots as evidence.
5. Claims file: a row for each new number and source list, with the command that checks it.
