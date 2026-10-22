// All copy for the home page. Components read from here; edit words here.
// Rules for every string: spec section 5 (no dashes, no sales words, Manveen's
// own phrasing where spec 5a has it). Every figure needs a source: see
// docs/superpowers/specs/2026-10-13-claims.md.

// ── Identity ─────────────────────────────────────────────────────────
export const ME = {
  name: "Manveen Singh",
  role: "automation engineer",
  location: "Delhi, India",
  hours: "Delhi, India. UK working hours are my afternoon and evening, US mornings my evening.",
  email: "manveen9650@gmail.com",
  github: "https://github.com/Manveen07",
  linkedin: "https://linkedin.com/in/Manveen",
  calendly: "https://calendly.com/manveen9650/30min",
  resume: "/resume.pdf",
} as const;

// ── Off the clock: footer line, from Manveen's own answers (13 Oct) ──
export const OFF_CLOCK = "Hunter x Hunter theory videos, Peacemaker, Elden Ring, Sekiro, Doom, The Weeknd.";

// ── Hero: Manveen's own words (approved 15 Oct, version A), keep the phrasing ──
export const HERO = {
  headline: "Every week has a job that's the same clicks, in the same order.",
  answer: "I make it run by itself,",
  marked: "the same way every time.",
  nerdNote: "nerd word for this: deterministic. Same input, same result, every time.",
  how: [
    "I spent a year automating lead-finding for an outbound agency, got good at it, got bored of it, and noticed the same missing piece everywhere: nobody measures whether the automation is right. So now I build the thing, and the test for the thing.",
  ],
} as const;

/** Path under /public plus its pixel size. Set to null to hide the photo. */
export const PHOTO: { src: string; alt: string; width: number; height: number } | null = {
  src: "/me.jpg",
  alt: "Manveen Singh",
  width: 264,
  height: 330,
};

// ── Tender Radar: prose only. Numbers come from lib/pipeline.ts ──────
// (GitHub at request time when GITHUB_TOKEN is set, else the committed
// data/pipeline-snapshot.json; refresh it with `npm run refresh-snapshot`).
export const PIPELINE = {
  firstRun: "4 July 2026",
  intro:
    "Government contract notices for cleaning, security and facilities work are spread across several UK websites. I wanted one script to read all of them every morning and sort out which ones each trade should bid on.",
  penNote: "every bar is a morning nobody pressed a button",
  sketchNote: "every number here comes from the same run as the bars below",
  outage:
    "Its worst stretch was about three weeks, from 21 July to 11 August, when a data-format change broke the morning run and nothing told me.",
  loom: "https://www.loom.com/share/ed073589208c4e24a7543ba30b9d24dc",
  repo: "https://github.com/Manveen07/tender-radar-showcase",
} as const;

// ── What people say: verbatim from Zackary Beckham's signed letter (11 Jan 2026).
// Never publish the letter PDF or the email address on it. It renders in the Work
// section, as a block right after the card marked `quote: true`.
export const QUOTE = {
  before: "…produced clear and maintainable technical documentation, and ",
  marked: "effectively communicated complex engineering concepts to non-technical stakeholders.",
  name: "Zackary Beckham",
  title: "Chief Operations Officer",
  company: "Caprae Capital Partners",
  source: "From a signed letter of recommendation, 11 Jan 2026. Full letter available on request.",
  penNote: "the bit that matters if you don't write code",
} as const;

// The last line of the Work section, before the resume link.
export const NOW_LINE = "B.Tech Computer Science, MSIT Delhi, 2026.";

// ── Work: two groups. Jobs, newest first (Precise Leads, then Caprae and its quote), then
// Built on my own (leadlens, then PresentAI). Order matters; tests/site.test.mjs pins it.
// Tender Radar has its own section above.
export type WorkItem = {
  title: string;
  where: string;
  lead: string;
  /** Optional: leadlens has none, its scorecard and margin note tell the story. */
  detail?: string;
  metrics: [string, string][];
  stack: string[];
  links?: { label: string; href: string }[];
  /** A line under `where`, for a card that is a job (title, dates, place). */
  role?: string;
  /** Zackary's quote renders as a block right after this card. */
  quote?: true;
  /** A real 2x2 score (spec 3.2). Counts are against hand labels; see claims row 43. */
  scorecard?: { caught: number; missed: number; falseAlarms: number; leftAlone: number; caption: string };
  /** A real screenshot under /public (spec 3.3), with its true pixel size. */
  shot?: { src: string; alt: string; width: number; height: number };
  /** A red margin note beside the card (wide screens) or under it (phones). The section allows two. */
  note?: string;
};

export const JOBS: WorkItem[] = [
  {
    title: "Outbound, built end to end",
    where: "At Precise Leads",
    // Title and start date from public/resume.pdf ("Precise Leads, Nov. 2025 to Present"). The rest was rewritten
    // 15 Oct from his own repos (gtm, precise-automator, infra-bot, slack message exporter); claims rows 77 to 81.
    role: "GTM automation engineer · Nov 2025 → now · remote",
    lead: "Finds the companies worth writing to and the right person at each, then writes emails that only say what the research found.",
    detail:
      "I built the agency's outbound pipeline. One run sorted 34,044 companies in four days, and every yes came with a quote from the company's own website. Each draft is checked claim by claim against that research, and when someone spots a new kind of mistake, it becomes a check that runs before anything goes out. I also built the Slack bot that buys and warms up the sending inboxes, the tool that turns a client's sequence into a ready campaign, and a daily scan of five sales-tool Slack communities that passes likely buyers to the sales team.",
    metrics: [
      ["0", "contradicted claims in 300 drafted emails"],
      ["34,044", "companies sorted in four days"],
    ],
    stack: ["python", "typescript", "clay", "smartlead", "n8n"],
  },
  {
    title: "Resume screening, automated",
    where: "At Caprae Capital Partners",
    // Title and dates come from the signed letter (11 Jan 2026); "US, remote" from the resume.
    role: "Machine Learning Intern · Aug 2025 → Jan 2026 · US, remote",
    quote: true,
    lead: "Reads incoming resumes, ranks the candidates, and books the interviews.",
    detail:
      "A recruiting team was spending about ten hours a week reading resumes by hand. The system reads each one, scores it against the role, writes the shortlist and schedules the calls.",
    metrics: [
      ["10h → 3h", "screening per week"],
      ["5 → 1.5", "days to a shortlist"],
    ],
    stack: ["python", "embeddings", "slack"],
  },
];

export const OWN_WORK: WorkItem[] = [
  {
    title: "leadlens",
    where: "My own project",
    lead: "Reads a job posting and tells you whether the AI role is real, dressed up, or a scam.",
    // No detail paragraph: the scorecard caption and the margin note say it (claims rows 41, 42, 45).
    // The scorecard replaces the two metric lines. TP 9, FN 2, FP 0, TN 61 (claims rows 43 and 44).
    metrics: [],
    scorecard: {
      caught: 9,
      missed: 2,
      falseAlarms: 0,
      leftAlone: 61,
      caption: "Out of 72 postings I checked by hand:",
    },
    note: "it once scored 100%, because my own notes leaked the answers. This is the score after I took them out.",
    stack: ["python", "gemini", "pydantic"],
    links: [{ label: "How I tested it →", href: "/writing/schema-as-eval-spec" }],
  },
  {
    title: "PresentAI",
    where: "My own project, live",
    lead: "Type a prompt, get a slide deck in under a minute.",
    detail:
      "It works out the story first, then writes the slides and the speaker notes. The free plan makes 3 decks a month, so you can try it right now. PowerPoint export is on the paid plan.",
    metrics: [["<60s", "for the first draft"]],
    // Captured from the live site 14 Oct 2026 (headless Chrome, 1280x800, scaled to 640 wide).
    shot: { src: "/work/presentai.png", alt: "PresentAI's home page", width: 640, height: 400 },
    stack: ["next.js", "postgres"],
    links: [
      { label: "Try it ↗", href: "https://present-ai-007.vercel.app/" },
      { label: "See the code ↗", href: "https://github.com/Manveen07/PresentAI" },
    ],
  },
];

// ── drawing-proof: an AI reads engineering drawings, marked against my own labels (added 22 Oct) ──
// Manveen's pick on 22 Oct ("make sure they're quirky"): the red pen marks the AI's answers like homework.
// Paths below are under C:\Users\Manveen\Desktop\new_things_to_mess_araound\new 10x engineer\projects\drawing-proof\.
// Every figure is from out/EVAL.md, "drawing-proof v1: evaluation", 26 Sep 2026, model gemini-3-flash-preview,
// the only model that finished all 23 drawings that day (claims rows 84 to 92). The 13 Oct Claude run is left out.
export const DRAWINGS = {
  kicker: "Marking the AI's homework · drawing-proof",
  // EVAL.md line 3: "23 real public drawings, hand-labelled before the tool ever ran on them."
  lede: "Can an AI fill in a quote from an engineering drawing? I answered 23 real drawings myself first, then marked its work.",
  // What it fills in: EVAL.md "The honest email claim" and the per-field table (part number, revision, material,
  // finish, tolerances, BOM rows), each value with the exact text it came from (the evidence column).
  what: "It reads the drawing (a PDF) and fills in the part number, revision, material, finish, tolerances and every line of the parts list. Each value comes with the exact text it was read from.",
  // A crop of the real sheet, rendered 22 Oct with pymupdf at 340 dpi from data/drawings/machined-rod-harmonic-analyzer.pdf,
  // clip (962, 641) to (1189, 757) pt: the right half of the title block. Pixels untouched; the red marks are an SVG on top.
  shot: {
    src: "/work/rod-titleblock.png",
    alt: "The title block of the pinion lift rod drawing: PART pinion-lift-rod, DWG. NO. MHA-060, REV v32, scale 1:1, unit mm.",
    width: 1073,
    height: 549,
  },
  // EVAL.md wrong value #3 (machined-rod): label MHA-060, tool said "pinion-lift-rod", "Took the title block's PART (name)
  // cell instead of DWG. NO." out/records/gemini-3-flash-preview/machined-rod-harmonic-analyzer.json: part_number
  // "pinion-lift-rod", evidence "PART pinion-lift-rod"; drawing_number "MHA-060" read right; call.seconds 205.3,
  // tokens_out 64013 (one of the 6 runs that hit the output cap; 2 of those 6 had a wrong value, this is one of them).
  caption: "Circled: what it wrote in the part number box, with \"PART pinion-lift-rod\" quoted as its proof. Underlined: the part number.",
  shotNote: "that's its name, not its part number. It thought for 205 seconds to get here.",
  // EVAL.md headline table, gemini-3-flash-preview column: wrong values 7 (1.7%) of 419 fields scored; correct when
  // the drawing states the value 316 / 326; left blank when it does not 89 / 93; BOM / cut-list fields 194 / 194,
  // plus 1 header row read as a part.
  marks: [
    ["7 of 419", "answers wrong (1.7%); 7 more were missed or half right (5 missed without a flag, 1 flagged, 1 partial)"],
    ["316 of 326", "right, where the drawing gives the value"],
    ["89 of 93", "left blank, where it doesn't"],
    ["194 of 194", "parts list fields, plus one header row read as a part"],
  ] as [string, string][],
  // EVAL.md "Every wrong value": "All 7 quote real text from the sheet: the quote is genuine but it landed in the wrong field."
  wrongLine: "All 7 wrong answers quote real text from the sheet. The text is real; the AI put it in the wrong box, like the rod above, or read it wrong (20 holes counted where the drawing has 36). So every value carries its quote, and you can hold it up against the drawing.",
  // EVAL.md caveats: "One labeller (me), no second reviewer"; "all CAD exports, no scans"; "All 23 were clean CAD PDFs,
  // and 22 of them have a usable text layer" (the Eaton sheet was read from the image alone, so "with a text layer" is
  // not said of all 23). Scans untested: verdict, "Scanned, faxed or photographed drawings: unknown."
  finePrint: "One person labelled them: me. All 23 are clean CAD exports, no scans, so scanned drawings are untested. Marked 26 Sep 2026.",
  // EVAL.md caveats: "Two labels were corrected after the first run, both because the model was right and I was wrong."
  finePrintNote: "it marked me back twice: two of my labels were wrong, and it was right.",
  // data/SOURCES.md: machined-rod-harmonic-analyzer.pdf, "CC BY-SA marked in the title block; repo LICENSE file is MIT".
  // The title block reads "© 2026 Pedro Paulo Vezza Campos" and a CC BY-SA badge with no version number.
  credit: {
    by: "Pedro Paulo Vezza Campos",
    project: "harmonic-analyzer",
    projectHref: "https://github.com/pedropaulovc/harmonic-analyzer",
    licence: "CC BY-SA",
    licenceHref: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  // pyproject.toml dependencies: google-genai, pymupdf, pydantic.
  stack: ["python", "gemini", "pymupdf", "pydantic"],
} as const;

// ── Things AI got confidently wrong: pinned notes (added 22 Oct) ──
// Manveen, 22 Oct: "make sure their quirky" and "have distriibuted date and last one in september". Each date is the
// day the mistake was caught, from a dated file or commit; nothing from October. The block teaches, it never pitches.
// Paths are under C:\Users\Manveen\Desktop\new_things_to_mess_araound\new 10x engineer\ (claims rows 93 to 100).
export type Pin = {
  /** ISO date for <time>, and the date as shown. */
  iso: string;
  date: string;
  title: string;
  /** The AI's own words or data, in mono. `marked` gets the red pen. */
  exhibit: { before: string; marked: string; after?: string; pen: "circle" | "tight" | "underline" };
  /** The red scribble beside the exhibit. */
  scribble: string;
  what: string;
  now: string;
};

export const WRONG: { kicker: string; lede: string; pins: Pin[] } = {
  kicker: "Things AI got confidently wrong",
  lede: "Pinned here so I don't forget them. Each one came back sounding sure of itself, and each one changed what I check.",
  pins: [
    {
      // notes/week-1-saturday-notes-v2.md, "Open-coding 50 traces (Mon 2026-05-25)": "0.95 confidence | 50/50 |
      // Definitive hardcoded default", "Hard failure (label ≠ ground_truth) 0/50"; commit 0baea8bc, 25 May 2026.
      // The 50 traces (month-1/test files/traces.json at 6cb8d6e8): every output has "confidence": 0.95.
      // The fix: projects/business-classification-pipeline/leadlens_v01.py, confidence_reasoning Field(min_length=100),
      // "No score without reasoning." Already told on this site in the post /writing/schema-as-eval-spec.
      iso: "2026-05-25",
      date: "25 May 2026",
      title: "0.95, fifty times",
      exhibit: { before: '"confidence": ', marked: "0.95", pen: "circle" },
      scribble: "on all 50 of them",
      what: "A classifier I was building gave all 50 of its answers the same confidence, 0.95. The answers were fine. The number meant nothing: it was filling in a box.",
      now: "a score the model writes is just more text. Mine has to write out its evidence first, 100 characters at least, before it gets to give a score.",
    },
    {
      // client-hunting/BUG-STALE-TENDER-JUL7.md: "15 leads total got this same dead-tender pitch ... all fired 2026-07-07";
      // "the tender closed 1 August 2025"; "deadline_hint": "" in the stored record; the classifier prompt "DOES instruct
      // the LLM to skip tenders 'with a deadline already passed' but with nothing in deadline_hint to check, it had no
      // signal". Fix the same day, commit b51d9167 (7 Jul 2026): "a hard code filter (not just the LLM instruction)
      // drops unknown/unverified/expired tenders from the digest regardless of what the model said."
      iso: "2026-07-07",
      date: "7 Jul 2026",
      title: "A blank deadline, read as fine",
      exhibit: { before: '"deadline_hint": ', marked: '""', pen: "circle" },
      scribble: "it closed in Aug 2025",
      what: "I emailed 15 businesses about a cleaning tender my pipeline called live. It had closed eleven months earlier. The prompt said to skip anything past its deadline, but the deadline was blank, so the model had nothing to check.",
      now: "rules that matter live in code, not in the prompt. A plain filter now drops any tender with a past or unknown deadline, whatever the model says.",
    },
    {
      // Commit c6327322 (20 Jul 2026, co-authored by Claude): three new trades (pest, grounds, electrical-testing),
      // message "tests (12/12)". Its test_radar.py has 12 tests and none reads profiles/*.yaml or FirmProfile.
      // Commit f6eff1e6 (11 Aug 2026): the three profiles had staff_count as an int and lacked two required fields;
      // "crashing on FirmProfile validation since ~20 July". Claims row 11: scheduled runs failed on all 22 days,
      // 21 Jul to 11 Aug. The bars: the Tender Radar section above, last 40 scheduled runs, red when one failed (row 13).
      iso: "2026-08-11",
      date: "11 Aug 2026",
      title: "12 of 12, and down for three weeks",
      exhibit: { before: "", marked: "tests (12/12)", pen: "underline" },
      scribble: "none of them opened the new files",
      what: "An AI helped me add three trades to Tender Radar, and its commit said the tests passed, 12 of 12. None of them loaded the new files, which didn't fit the checker, so the morning run crashed every day for three weeks.",
      now: "a passing test only vouches for what it opens. The last 40 runs sit higher up this page as bars, red when one fails.",
    },
    {
      // Commit 7abe5472 (19 Sep 2026): "Two OpenCode runs produced confident write-ups whose quotes did not support
      // them - a 'POD matching' lead whose only 'POD' was inside 'chiropody' ... a duty here counts only when its regex
      // hit AND the sentence it hit is stored beside the label. No sentence, no duty, no row." client-hunting/tools/
      // discover.py (LinkedIn job adverts, point 2) and tools/clay_duties.py: "\b keeps 'POD' from matching inside
      // 'chiropody', which it did once." OpenCode is an AI coding agent.
      iso: "2026-09-19",
      date: "19 Sep 2026",
      title: "POD matching, allegedly",
      exhibit: { before: "chiro", marked: "pod", after: "y", pen: "tight" },
      scribble: "feet, not freight",
      what: "An AI agent reading job adverts for me wrote up a firm as one that matches proof of delivery paperwork, POD for short. The only POD in the advert it quoted was inside the word chiropody.",
      now: "no sentence, no claim. A lead only counts if the exact sentence behind it is saved next to it, and POD has to be a whole word.",
    },
  ],
};

// ── How working with me goes ─────────────────────────────────────────
export const PILOT = {
  opener:
    "On the first call you tell me what wastes the most time. If it isn't a real problem, I'll say so and we won't build it.",
  steps: [
    "If it is, I quote a fixed price for a pilot before any work starts.",
    "The pilot runs on a month of your real requests. Every miss gets logged, and you see the list, not just a score.",
    "If you keep it, a monthly fee covers me looking after it.",
  ],
  note: "you see every miss, not just a score",
  // The section's end: no button, just the address and, small, the calendar (one Calendly link on the page).
  ask: "Tell me one task you repeat every week. I'll reply within a day and say whether it can run by itself.",
  calendar: "or pick a time on my calendar",
  sketchLabel:
    "A call about what wastes your time, then a fixed quote, then a month on your real requests with every miss logged, then you decide whether to keep it.",
} as const;
