// Proof cards (1 Nov 2026): one story each, told as what broke, the check he added, and the measured result.
// Manveen, 1 Nov: "i think use the visual idea also on the website make it easily undrersatndble" and "i want my things
// to build proofs and they should be able to eaily undersatnd". Rendered by components/ProofCard.tsx, printed into the
// markdown copies by lib/md/proof.ts.
//
// Rules for every string here:
// - Word for word from the application cards: C:\Users\Manveen\Desktop\new_things_to_mess_araound\ai-job-search\assets\
//   proof-cards\specs\<slug>.json (notes joined with a space, the legend dropped, focal_label as circledLabel). Only the
//   link labels are new words. The README there says why each word is there and what never goes on a card.
// - Every number passes claims_check.py --strict-numbers in new 10x engineer\runs\2026-11-01-job-agent\site-visuals\
//   claims\<slug>.json (outside this repo: their quotes come from the employer's repo). tests/proof.test.mjs pins the
//   numbers, so a changed number fails the build until it is re-checked there.
// - cheap-check-first and quiet-failures stay off the site for now (DESIGN-PLAN.md and its review, 1 Nov): the first
//   reads bigger than the Claygent story beside it, the second's "40 live workflows" was the 14 Oct count.

export type ProofStep = {
  name: string;
  sub: string;
  /** The words circled in red: a part of `name` or of `sub`. */
  circle?: string;
  /** A red note right under the step. */
  note?: string;
};

export type ProofCard = {
  slug: string;
  /** Where the story comes from: the agency's work or one of his own projects. */
  eyebrow: string;
  title: string;
  /** What broke: the lines are struck through in red, the note is the red scribble beside them. */
  before: { label: string; lines: string[]; note: string };
  /** The flow, start to end. The first and the last are drawn rounded. */
  steps: ProofStep[];
  /** What a red circle means on this card. */
  circledLabel: string;
  /** The truth qualifier under the card. Both densities keep it. */
  footer: string;
  links: { href: string; label: string }[];
  /** The compact card shows two steps instead of the flow: the check, then the result (indexes into steps). */
  compact: { check: number; result: number };
};

export const PROOF = {
  // Agency work. Sources: gtm runs\preciseleads\2026-10-23-linkedin-test\STATUS.md lines 43 to 54; EVALS-2026-10-31.md
  // line 31 ("Labels by the Claude session", "B's 86% held the list"). Never "sent" or "released", never "first sample".
  // Review 2 (1 Nov): "quote" alone read as a price quote; the quoted words come from the company's LinkedIn "About" or
  // its site (gate/GATE.md line 18), so "the company's words", not "the website line".
  "held-list": {
    slug: "held-list",
    eyebrow: "Outbound agency work · a LinkedIn campaign list · Claude agents",
    title: "My AI check missed my 90% bar, so I held the list",
    before: {
      label: "what the sample caught",
      lines: ["3 picks said more about the buyer than the company's words they quoted", "4 quoted lines weren't about who the company serves"],
      note: "7 misses in 50, so the list waited",
    },
    steps: [
      { name: "Claude agents pick", sub: "which companies fit the campaign" },
      { name: "Sample of 50", sub: "43 of 50 agree (86%)", circle: "86%" },
      { name: "Second pass", sub: "rechecks each pick's evidence", note: "built from those 7 misses, so I tested it on a new sample" },
      { name: "New sample of 50", sub: "47 of 50 agree (94%)", circle: "94%", note: "a different 50 companies" },
      { name: "List signed off", sub: "504 people, one per company" },
    ],
    circledLabel: "measured against my 90% bar",
    footer: "agree = same verdict as a separate Claude review of the same 50 companies",
    links: [{ href: "/how-i-build#held-list", label: "The whole flow →" }],
    compact: { check: 2, result: 3 },
  },
  // His own project (leadlens), his own labels. Source: data/posts.ts, the post schema-as-eval-spec, with its 31 Oct
  // note on two more leaks. "two more", never "2 more".
  "caught-my-own-test": {
    slug: "caught-my-own-test",
    eyebrow: "leadlens · my own project · an AI judge that tells real AI job posts from fake ones",
    title: "I caught my own AI test cheating, and published the lower score",
    before: {
      label: "what broke",
      lines: ["11 of 11 caught: a perfect score", "my notes to myself were in the test data"],
      note: "the judge was reading my notes, not the job post",
    },
    steps: [
      { name: "72 job posts", sub: "I labelled by hand" },
      { name: "AI judge", sub: "hunts for the fake AI jobs" },
      { name: "Notes removed", sub: "same judge, same 72 posts", note: "31 sentences were my notes, not the advert's" },
      { name: "9 of 11 caught", sub: "no false alarms", circle: "9 of 11 caught", note: "a later audit found two more leaks: it needs a re-run" },
    ],
    circledLabel: "the score I published",
    footer: "72 posts: 11 fake AI jobs, 61 real · the two it missed sit right on the line",
    links: [{ href: "/writing/schema-as-eval-spec", label: "How I caught it →" }],
    compact: { check: 2, result: 3 },
  },
  // His own project (drawing-proof), labels his (confirmed 1 Nov). Source: projects\drawing-proof\out\EVAL.md lines 3,
  // 14 to 19 and 91 to 106. Never "never guesses" (4 of the 93 unstated values were filled in), no process names.
  // Compact check is step 1, not the source check (review fix 5, 1 Nov): the source check passed both wrong boxes; his
  // hand labels found the 7.
  // Review 2 (1 Nov): the header row is one of the 7 (EVAL.md "Every wrong value", #1), not an eighth error.
  "labelled-drawings": {
    slug: "labelled-drawings",
    eyebrow: "drawing-proof · my own project · an AI reads engineering drawings into a quote sheet",
    title: "I labelled 23 drawings, then marked the AI's work",
    before: {
      label: "two of the 7 I marked wrong",
      lines: ["part number box: it wrote the part's name", "revision box: it wrote a copyright date"],
      note: "real text, wrong box: my source check passed both",
    },
    steps: [
      { name: "23 public drawings", sub: "CAD PDFs, no scans" },
      { name: "AI reads each one", sub: "a value plus the text it came from" },
      { name: "Source check", sub: "value must be in that text and on the page", note: "where the drawing gives no value, it left 89 of 93 blank" },
      { name: "7 wrong of 419 values", sub: "on its first run", circle: "7 wrong of 419", note: "parts lists: 194 of 194 fields right; 1 of the 7 was a header row read as a part" },
    ],
    circledLabel: "scored against my own labels",
    footer: "a cited source proves the text is on the drawing, not that it went in the right box",
    links: [{ href: "/writing/marking-the-ais-homework", label: "The marked drawings →" }],
    compact: { check: 1, result: 3 },
  },
} satisfies Record<string, ProofCard>;

export type ProofSlug = keyof typeof PROOF;

/** The home page's band, between the hero and Tender Radar, AI stories first (DESIGN-PLAN.md section 2). Its label is a
    placeholder in his casual voice, his to rename. */
export const HOME_BAND = {
  kicker: "How I check my AI",
  // The hero's link down to the band (review fix 1, his yes needed before merge): the first screen ends on it.
  link: { label: "How I check my AI\u00a0↓", href: "#proof-cards" },
} as const;
export const HOME_CARDS: ProofSlug[] = ["held-list", "caught-my-own-test", "labelled-drawings"];
/** /how-i-build's section from his own projects, under the full held-list card that opens the page. One card, not the
    plan's two: with both, the page measured 823 words without a click, over the review's 750 cap (1 Nov). The
    drawings card is on the home page and in /writing; this one is the page's "where the tests still fall short". */
export const HOW_CARDS: ProofSlug[] = ["caught-my-own-test"];

/** "{name}: {sub}", the line a compact card shows for a step. */
export const stepLine = (s: ProofStep) => `${s.name}: ${s.sub}`;
