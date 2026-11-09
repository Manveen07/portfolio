// Proof cards (1 Nov 2026): one story each, told as what broke, the check he added, and the measured result.
// Manveen, 1 Nov: "i think use the visual idea also on the website make it easily undrersatndble" and "i want my things
// to build proofs and they should be able to eaily undersatnd". Rendered by components/ProofCard.tsx, printed into the
// markdown copies by lib/md/proof.ts.
//
// Rules for every string here:
// - Word for word from his application proof cards (another project; notes joined with a space, the legend dropped,
//   the focal label as circledLabel). Only the link labels are new words, `limit` (a site-only line added 2 Nov, in
//   the 2 Nov design, so the caveat travels with the number), held-list's first struck line (reworded on the site
//   2 Nov: a reviewer couldn't parse it; the application card still has the old words, decision 7) and held-list's
//   circled line (2 Nov, verify loop round 2: its circled label and its footer merged into one line, so what the 90%
//   measures sits where the eye lands; three round 1 readers asked "90% of what", one thought he sampled by hand).
// - Round 3 of the verify loop (2 Nov) changed held-list's title, circled line and limit (the session's decision and the
//   round 2 grader's plan: two readers read "My AI check missed" as the checker failing, and the cto caught "a separate
//   Claude review" against "the Claude session that wrote the rubric"), and gave the two cards of his own projects a
//   `line`: one plain line for the home page, built only from the card's own facts and caveats.
// - Every number passes claims_check.py --strict-numbers in a claims draft kept outside this public repo (its quotes
//   come from the employer's repo). tests/proof.test.mjs pins the numbers, so a changed number fails the build until
//   it is re-checked there.
// - cheap-check-first and quiet-failures stay off the site for now (the 1 Nov proof-card plan and its review): the
//   first reads bigger than the Claygent story beside it, the second's "40 live workflows" was the 14 Oct count.

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
  /** What broke: the lines are underlined in red (struck through until 2 Nov: two round 2 readers read the strike as
      "deleted, not true"), the note is the red scribble beside them. */
  before: { label: string; lines: string[]; note: string };
  /** The flow, start to end. The first and the last are drawn rounded. */
  steps: ProofStep[];
  /** What a red circle means on this card. */
  circledLabel: string;
  /** The truth qualifier under the card. Both densities keep it. held-list has none since 2 Nov: its circled line says it. */
  footer?: string;
  /** What the number can't tell you, under the footer in both densities (site only, 2 Nov). */
  limit?: string;
  links: { href: string; label: string }[];
  /** The compact card shows two steps instead of the flow: the check, then the result (indexes into steps). `note`, if
      set, replaces the result's note on the compact card only (round 6, 2 Nov), for a step the pair leaves out. */
  compact: { check: number; result: number; note?: string };
  /** Home only (round 3, 2 Nov): one plain line, 30 words or fewer, shown with the full card behind a click. */
  line?: string;
};

export const PROOF = {
  // Agency work. Sources: the day-job repo's run folder of 23 Oct (private), its status file lines 43 to 54; the eval
  // inventory of 31 Oct, line 31 ("Labels by the Claude session", "B's 86% held the list"); SOURCES.md row 34. Never
  // "sent" or "released", never "first sample". Review 2 (1 Nov): "their quote" read as a price quote; the quoted words
  // come from the company's LinkedIn "About" or its site, so "the company's words", not "the website line".
  "held-list": {
    slug: "held-list",
    eyebrow: "Outbound agency work · a LinkedIn campaign list · Claude agents",
    // Round 3 (2 Nov): "My AI check missed my 90% bar" read to two round 2 readers as the checker failing.
    title: "My agents' picks missed my 90% bar, so I held the list",
    before: {
      label: "what the sample caught",
      // Site only (review, 2 Nov): the status file's "added a place or building types", in plain words.
      lines: ["3 picks added details the company's own words didn't say (a place, building types)", "4 quoted lines weren't about who the company serves"],
      note: "7 misses in 50, so the list waited",
    },
    steps: [
      { name: "Claude agents pick", sub: "which companies fit the campaign" },
      // Round 4 (2 Nov): who agrees is said in the number (all 4 round 3 readers asked "agree with what?" until the red
      // note), and the second sample's "it" is that session.
      { name: "Sample of 50", sub: "a second Claude session agrees on 43 (86%)", circle: "86%" },
      { name: "Second pass", sub: "rechecks each pick's evidence", note: "built from those 7 misses, so I tested it on a new sample" },
      { name: "New sample of 50", sub: "it agrees on 47 (94%)", circle: "94%", note: "a different 50 companies" },
      { name: "List signed off", sub: "504 people, one per company" },
    ],
    // Until 2 Nov: "circled: measured against my 90% bar", then the footer "agree = same verdict as a separate Claude
    // review of the same 50 companies"; round 2: "agreement with a separate Claude review, against my 90% bar". Round 3
    // (2 Nov): "a second Claude session", so the limit's "That session" names the same reviewer (the cto read "a separate
    // review" and "the session that wrote the rubric" as two reviewers). Round 4 (2 Nov): the reviewer is in the steps,
    // so the circled line says only what the circles are measured against. Round 5 (2 Nov): "against my 90% bar" until
    // then (the round 4 founder flagged it; the cto read the bar as accuracy): the bar is on agreement, said plainly.
    circledLabel: "my bar: 90% agreement",
    // 2 Nov: who checked it, said at body size. The labels were a Claude session's, not his (SOURCES.md row 34).
    // Review (2 Nov, Karpathy): that session wrote the rubric and tuned the agents to its labels, and both samples of 50
    // were drawn from the picks (every row passed the gate), so the companies the agents dropped were never sampled.
    // Round 3: the same three caveats in 20 words (24 before). Round 4 (2 Nov): "so it's two AIs agreeing" is out (the
    // round 3 founder flagged the line; the steps now say a second Claude session agrees), and every caveat stays: that
    // session wrote the rubric, the dropped companies were never sampled, fifty is a small sample. 19 words.
    limit: "That session also wrote the rubric. Neither sample included companies the agents dropped, and fifty is a small sample.",
    links: [{ href: "/how-i-build#held-list", label: "The whole flow →" }],
    // Round 3 (2 Nov): the compact card shows the 86% sample, then the new one at 94% (the cto: "The home-page card never
    // shows the first sample's score"). Round 6 (2 Nov, 2 of 3 jurors): the pair skipped the second pass between them, so
    // 86% to 94% could read as resampling until it passed; the result's note on home says what changed, in the card's
    // own words (steps 2 and 3).
    compact: { check: 1, result: 3, note: "a different 50 companies, after a second pass that rechecks each pick's evidence" },
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
    // Round 3 (2 Nov): the home line, from this card only (what it hunts, the 11 of 11 with his notes in the test, the 9
    // of 11 without, the two later leaks and the re-run). Round 6 (2 Nov): the card's own title leads it (his approved
    // wording, hidden behind the click since round 3; all 4 round 5 readers stumbled on "leaked into its test"), then the
    // published score with its re-run caveat. 29 words.
    line: "I caught my own AI test cheating, and published the lower score: leadlens spotted 9 of 11 fake AI job posts. Two more leaks since: it needs a re-run.",
  },
  // His own project (drawing-proof), labels his (confirmed 1 Nov). Source: its EVAL.md lines 3, 14 to 19 and 91 to
  // 106. Never "never guesses" (4 of the 93 unstated values were filled in), no process names.
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
    // Round 3 (2 Nov): the home line, from this card only (the eyebrow, 23 public CAD drawings and no scans, his own
    // labels, 7 wrong of 419 on its first run). "7 of its 419", never "7 of 419": that is the post's own mark, which the
    // home page leaves to the post (tests/site.test.mjs). 28 words.
    line: "drawing-proof reads engineering drawings into a quote sheet. On 23 public CAD drawings I labelled myself, no scans, its first run got 7 of its 419 values wrong.",
  },
} satisfies Record<string, ProofCard>;

export type ProofSlug = keyof typeof PROOF;

/** The home page's first band, right under the hero: the agency card only (2 Nov, verify loop round 2: three readers
    asked for the day job above the side projects, and why drawing-proof held a top proof slot on a GTM page). Its label
    is a placeholder in his casual voice, his to rename. */
export const HOME_BAND = {
  kicker: "How I check my AI",
  // The hero's link down to the band (review fix 1, his yes needed before merge): the first screen ends on it.
  link: { label: "How I check my AI\u00a0↓", href: "#proof-cards" },
} as const;
export const HOME_CARDS: ProofSlug[] = ["held-list"];
/** The second band, after Work (and before Tender Radar until round 6): his own projects' cards. Kept (three readers named "published
    the lower score" as what sets him apart, and that card is on the home page only). Since round 3 (2 Nov) each card is
    its `line`, with the full card behind a click (components/OwnCheck.tsx; its label names the card since round 6): founder, agency and
    recruiter stopped reading home at this band in round 2, and two of its card lines read as AI-written. */
export const HOME_OWN_BAND = { id: "own-checks", kicker: "AI checks on my own projects" } as const;
export const HOME_OWN_CARDS: ProofSlug[] = ["caught-my-own-test", "labelled-drawings"];
// /how-i-build shows only the held-list card, in full, behind the first story's click under What broke, and what I
// changed (9 Nov, his pick "Proof first"; after What I can do from round 4, 2 Nov, until then).

/** "{name}: {sub}", the line a compact card shows for a step. */
export const stepLine = (s: ProofStep) => `${s.name}: ${s.sub}`;
