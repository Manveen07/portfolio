# Design verdicts: the four taste calls (14 Oct 2026)

These are the four open "taste calls for him" from the handoff (item 6, from the Task 10 visual check). Each one now has a verdict and the exact change, so another session can apply them without re-deciding.

How these were judged: the production build (`next start`) rendered in headless Chromium at 320×568, 375×667, 390×844 and 1280×900, with element boxes measured in the page. The screenshots are in `2026-10-14-design-shots/`. Every verdict holds to the binding spec: the red-pen look, business owners as the audience, and section 5a copy kept word for word. **None of these needs a copy change.**

| # | Call | Verdict | Size |
|---|------|---------|------|
| 1 | Hero button below the fold on small phones | **Leave as is** | none |
| 2 | Red `##` before blog headings | **Remove it, and match the site's heading style** | small (`components/Prose.tsx`) |
| 3 | Two desktop margin notes a line off | **Fix both**, and each needs a different fix | small (`Proof.tsx`, `About.tsx`, CSS) |
| 4 | Share card uses a fallback font | **Fix: load Archivo into the card** | small (`app/opengraph-image.tsx` + one font file) |

---

## 1. Hero button below the fold on 375/320 phones: leave as is

Measured:

| Viewport | Button top–bottom | Fold | Result |
|---|---|---|---|
| 320×568 | below the fold | 568 | hidden until you scroll |
| 375×667 (iPhone SE) | 638–688 | 667 | cut in half by the fold |
| 390×844 (most iPhones) | 605–655 | 844 | fully visible |
| 1280×900 | 543–594 | 900 | fully visible |

Why it stays:
- The red **"Book a call"** link in the header is above the fold on every width (`hero-320.png`, `hero-375.png`). A phone visitor always sees a way to book without scrolling.
- Lifting the button above the fold at 320/375 means cutting hero copy, which is section 5a (his words, kept), or shrinking the headline, which weakens the one thing the page has to land. Neither is worth it for a button the header already duplicates.
- The visitor arrives from a cold email and came to read. The button sits right after the hours line, where the reading ends, and that's the correct place for it.

Don't do: a sticky bottom CTA bar, or moving the button above the "how" paragraphs. Both read as salesy to this audience and break the quiet-page brief.

Optional, only if he dislikes the half-cut button on the SE: nothing in CSS fixes it cleanly. Leave it.

## 2. Red `##` before blog headings: remove

See `blog-h2-1280.png`. The `##` is Markdown syntax. To a developer it reads as a wink. To a business owner it reads as a stray symbol, and at 13px mono next to a 26px heading it looks like a rendering glitch. The red pen on this site marks things Manveen points at (circles, underlines, margin notes), and decorating every heading spends that red on nothing.

The blog also breaks from the home page in two other ways:
- Post headings are weight **600**. Every heading elsewhere on the site is **800**.
- Post body text is `T.dim` (grey #5a5750). The home page body is ink.

Change in `components/Prose.tsx`, in the `b.t === "h2"` branch:
- Delete the `<span …>##</span>`.
- Drop `display: "flex"`, `alignItems` and `gap`. They only existed for the span.
- Set `fontWeight: 800` and `fontSize: 26` (keep 26; it already falls between the site's `.h2` clamp bounds).

Do **not** change the body colour in this pass. Grey long-form body on paper is a reasonable reading choice, and the spec doesn't rule on it. Raise it with him only if he asks why the blog looks lighter than the home page.

Check: grep `tests/site.test.mjs` for `##` first. Nothing pins it at the time of writing.

## 3. Desktop margin notes a line off: fix both

Measured at 1280px (≥1000px is the only layout with notes in the margin). The hero note is fine: it sits level with the line it annotates (lede top 306, note 310). The other two point at the wrong thing.

### 3a. Proof: "every bar is a morning nobody pressed a button"

See `note-proof-1280.png`. The note sits level with the circled **102** (note top 845, number 858), but it talks about the **bars**, which are about 120px lower. The `←` points at the number.

Fix it by restructuring, with no magic numbers. In `components/Proof.tsx`, move `<Annotated>` so it wraps only the bars `<div>` and the `.small` caption under them. The `.count` paragraph and the "mornings it has started on its own…" line move above it as plain children of the section. The note then aligns with the top of the bars on desktop. On phones it drops under the caption, where `↑` still points at the bars.

### 3b. Quote: "the bit that matters if you don't write code"

See `note-quote-1280.png`. The note sits on quote line 1 ("…produced clear and maintainable technical documentation, and"). The part it refers to is the red-underlined `QUOTE.marked` ("effectively communicated complex engineering concepts to non-technical stakeholders"), which starts on line 2. So the note is exactly one line high.

The quote column is a fixed 640px from 1000px up, so its line breaks don't change on desktop and a fixed offset is reliable there.

- `components/Annotated.tsx`: add an optional prop `drop?: boolean`, and render `<aside className={drop ? "note note-drop" : "note"}>`.
- `app/globals.css`, inside the existing `@media (min-width: 1000px)` block, add `.note-drop { margin-top: calc(10px + 29px); }`. 29px is one blockquote line (20px × 1.45). Leave phones alone: there the note sits under the quote and `↑` is correct.
- `components/About.tsx`: `<Annotated note={QUOTE.penNote} drop>`.

If Zackary's wording changes (Task 14 approval), check this again at 1280px, since the line the marked text starts on could move.

## 4. Share card uses a fallback font: fix

See `share-card.png`. `app/opengraph-image.tsx` sets `fontFamily: "sans-serif"` and loads no font, so `next/og` falls back to its built-in default (Noto Sans in this render). The result is a generic card that doesn't match the site: no Archivo, the `fontWeight: 800` headline renders at regular weight, and the "102" circle looks thin. This card is the first thing a business owner sees when the link is pasted into Slack, LinkedIn or email, so it is worth the small fix.

Fix:
1. Add `app/Archivo-ExtraBold.ttf` (weight 800, from Google Fonts / the Archivo GitHub release, OFL licence). A static `.ttf` is required, because `next/og` can't read `woff2` or variable fonts. Add `Archivo-Regular.ttf` (400) too for the small grey line and the name.
2. In `opengraph-image.tsx`:
   ```ts
   const [bold, regular] = await Promise.all([
     fetch(new URL("./Archivo-ExtraBold.ttf", import.meta.url)).then((r) => r.arrayBuffer()),
     fetch(new URL("./Archivo-Regular.ttf", import.meta.url)).then((r) => r.arrayBuffer()),
   ]);
   // …
   { ...size, fonts: [
       { name: "Archivo", data: bold, weight: 800, style: "normal" },
       { name: "Archivo", data: regular, weight: 400, style: "normal" },
   ] }
   ```
   and set `fontFamily: "Archivo"` on the root div. Keep the edge runtime, because `new URL(…, import.meta.url)` is the supported way to bundle a font there.
3. Keep the card's copy exactly as it is. `tests/site.test.mjs` pins "mornings one system has started on its own" and `#f4f1ea`.
4. Check: `npm run build`, then open `/opengraph-image` and confirm the headline is visibly heavy and in Archivo (the double-storey `g` and squared terminals).

The card's red URL and circled number are right. Don't add the photo to the card even after Task 12, because at link-preview size it turns into a thumbnail smudge.

---

## For Task 12 (photo), so it isn't a fresh design decision later

The current slot is `.photo`: 132px wide, above the H1, with a 1px `--rule` border. That's right for this page: small and documentary, not a hero portrait. Ask him for:
- A plain, real photo of him (no studio glamour shot), face clearly lit, shot at a 4:5 portrait crop.
- Natural colour. Don't grayscale it or tint it red. The red belongs to the pen marks.
- Export at 264px wide (2× for retina) per the plan's ffmpeg step.

After it lands, recheck call 1 at 390×844. The photo adds about 190px, which pushes the hero button below the fold on most iPhones as well. The verdict still holds (the header CTA is there), but say so to him rather than let him find it.
