// All copy & structural data for the portfolio sections.
// Edit values here and the relevant components re-render with new content.
//
// Every figure on this site is real and sourced. See CONTENT-PACK-2026-09-04.md
// in the repo root for where each number comes from.

// ── Identity ─────────────────────────────────────────────────────────
export const ME = {
  name: "Manveen Singh",
  role: "automation engineer",
  location: "Delhi, India",
  hours: "remote · mornings overlap the UK, evenings the US",
  email: "manveen9650@gmail.com",
  github: "https://github.com/Manveen07",
  linkedin: "https://linkedin.com/in/Manveen",
  calendly: "https://calendly.com/manveen9650/30min",
  resume: "/resume.pdf",
} as const;

// ── Hero ─────────────────────────────────────────────────────────────
export const HERO = {
  tagline:
    "I build the piece of software a business is usually missing: the one that reads what customers send (lists, orders, forms) so a person doesn't have to retype it.",
  promise:
    "Every build comes with a test that shows how often it's right, so you know what it gets wrong before you trust it.",
} as const;

// ── Nav (the six numbered steps) ─────────────────────────────────────
export const NAV: { id: string; label: string; tag: string }[] = [
  { id: "proof",     label: "1 · proof",   tag: "Receipts." },
  { id: "about",     label: "2 · about",   tag: "Origin story." },
  { id: "work",      label: "3 · work",    tag: "The evidence." },
  { id: "incidents", label: "4 · log",     tag: "What broke." },
  { id: "writing",   label: "5 · writing", tag: "Field notes." },
  { id: "contact",   label: "6 · contact", tag: "The call." },
];
export const TAG = Object.fromEntries(NAV.map((n) => [n.id, n.tag])) as Record<string, string>;

// ── Live pipeline: prose only. Numbers come from lib/pipeline.ts ─────
// (GitHub at request time when GITHUB_TOKEN is set, else the committed
// data/pipeline-snapshot.json — refresh it with `npm run refresh-snapshot`).
import snapshot from "./pipeline-snapshot.json";

export const PIPELINE = {
  firstRun: "3 July 2026",
  manualSteps: 0,
  outageNote:
    "It broke once, for about three weeks, when a data-format change silently killed the morning run. Fixed, and a failed run now leaves a visible trace. I leave the red stretch on the page because a system that never fails is a system nobody is watching.",
  loom: "https://www.loom.com/share/ed073589208c4e24a7543ba30b9d24dc",
  repo: "https://github.com/Manveen07/tender-radar-showcase",
} as const;

/** Committed fallback figures, so static places (bay card, share image, boot) match the panel. */
export const SNAPSHOT = snapshot;

// ── Second proof: quote intake, scored ──────────────────────────────
// The five distributor catalogs that publish part codes (Equippers, SideDish,
// GTP, Questar, Gehl): 140 lines = 120 real requests + 20 traps. Scorer runs
// in projects/quote-proof/out, 2026-09-06. Same numbers as the outreach emails.
// A sixth catalog had no part codes at all, so it was not a fair test and is
// not counted. Every one of the 116 correct answers carries a price (checked).
export const QUOTE_PROOF = {
  catalogs: 5,
  lines: 140,
  realRequests: 120,
  right: 116,
  traps: 20,
  trapsRefused: 20,
  wrong: 0,
  closing: "A wrong quote costs money. A flagged one costs thirty seconds.",
  screenshot: "/quote-proof-equippers.webp",
  screenshotAlt: "Scorer output for one distributor: 30 customer lines, 26 quoted with price, 4 flagged for a person, 0 wrong",
} as const;

// ── Career ───────────────────────────────────────────────────────────
export type Role = {
  co: string;
  role: string;
  span: string;
  what: string;
  metrics: [string, string][];
};

export const ROLES: Role[] = [
  {
    co: "Precise Leads",
    role: "GTM automation engineer",
    span: "Nov 2025 → now",
    what: "A lead-generation company. I automated how leads get researched, enriched and pushed into the CRM.",
    metrics: [
      ["8h → 2h", "enrichment work per week, measured"],
    ],
  },
  {
    co: "Caprae Capital Partners",
    role: "AI / ML engineer (intern)",
    span: "Jun → Dec 2025 · US, remote",
    what: "An investment firm. I built the system that reads resumes and ranks candidates for their recruiting team.",
    metrics: [
      ["10h → 3h", "resume screening per week"],
      ["3×", "candidates processed"],
    ],
  },
];

export const EDUCATION = "B.Tech Computer Science · MSIT Delhi · 2026";

// ── About copy ───────────────────────────────────────────────────────
export const ABOUT = {
  line1: "I automate the repetitive step between",
  quote1: "a customer sent us something",
  mid: "and",
  quote2: "we acted on it.",
  body: "Lists, orders, postings, tenders: the part a person re-keys because nothing reads it for them.",
  bio: "I spent a year automating lead-gen for a sales-software company, got good at it, got bored of it, and noticed the same missing piece everywhere: nobody measures whether the automation is right. So now I build the thing, and the test for the thing.",
} as const;

// Engineering first, the day-job SaaS last. Same facts; the order says what I am.
export const TOOLS = ["python", "pydantic", "postgres", "playwright", "github actions", "gemini", "claude code", "n8n"];
export const TOOLS_DAYJOB = ["clay", "smartlead", "apollo", "hubspot"];

export const PLATES: [string, string][] = [
  ["What you hand me", "A process your team repeats by hand every week, and the tools you already pay for."],
  ["What you get back", "A system that does it on its own, documentation a new hire can read, and me on call to keep it running."],
  ["How I keep it honest", "I test every AI step against hand-checked examples before it touches real data, and I report the real score, not the flattering one."],
];

// ── Work bays ────────────────────────────────────────────────────────
export type Bay = {
  n: string;
  status: string;
  lamp: "on" | "warn";
  title: string;
  lead: string;
  detail: string;
  stack: string[];
  metrics: [string, string][];
  links?: { label: string; href: string }[];
  wide?: boolean;
};

export const BAYS: Bay[] = [
  {
    n: "01",
    status: "live · the system from step 1",
    lamp: "on",
    title: "Tender Radar",
    lead: "Finds government contracts for cleaning, security and facilities companies, every morning, on its own.",
    detail:
      "Government contract notices are spread across several websites that alert tools don't read. This pulls from all of them, uses AI to decide which fit each company, checks the deadline is real, and emails a short list. Built alone, running unattended since July.",
    stack: ["python", "playwright", "gemini", "github actions"],
    metrics: [
      [String(snapshot.totalRuns), "mornings run on its own"],
      ["6 of 6", "on a small hand-checked set, still growing it"],
    ],
    links: [
      { label: "watch it work (3 min) ↗", href: "https://www.loom.com/share/ed073589208c4e24a7543ba30b9d24dc" },
      { label: "see the code ↗", href: "https://github.com/Manveen07/tender-radar-showcase" },
    ],
    wide: true,
  },
  {
    n: "02",
    status: "tested on 5 real distributor catalogs · sep 2026",
    lamp: "on",
    title: "Quote intake for distributors",
    lead: "Reads the parts list a customer emails in, drafts the quote, and hands anything it is unsure of to a person instead of guessing.",
    detail:
      "Distributors ask customers to \"send us your list\" and someone types it into the system before anyone can send a price. Lists arrive messy: wrong codes, typos, \"2x\" instead of a quantity. This reads them as they arrive, and every match it claims is re-checked against the catalog by code, so the AI cannot slip in a made-up part.",
    stack: ["python", "pydantic", "gemini", "rapidfuzz"],
    metrics: [
      ["0", "wrong across 140 lines"],
      ["116 of 120", "real requests right, with price"],
      ["20 of 20", "made-up requests refused"],
    ],
  },
  {
    n: "03",
    status: "finished · deploying sep 2026",
    lamp: "warn",
    title: "leadlens",
    lead: "Reads a job posting and tells you whether the “AI” role is real, dressed up, or a scam.",
    detail:
      "I hand-checked 72 real postings first, then measured the AI against them. When it scored a suspiciously perfect 100%, I found my own test was leaking the answers, fixed it, and published the lower, honest score.",
    stack: ["python", "gemini", "pydantic"],
    metrics: [
      ["82%", "of scams caught"],
      ["0", "real jobs wrongly flagged"],
    ],
    links: [{ label: "read how I tested it →", href: "/writing/schema-as-eval-spec" }],
  },
  {
    n: "04",
    status: "at caprae capital · 2025",
    lamp: "on",
    title: "Resume screening, automated",
    lead: "Reads incoming resumes, ranks the candidates, and books the interviews.",
    detail:
      "Built for a recruiting team spending most of a day a week reading resumes by hand. The system reads them, scores them against the role, writes the shortlist and schedules the calls.",
    stack: ["python", "embeddings", "slack"],
    metrics: [
      ["10h → 3h", "screening per week"],
      ["5 → 1.5", "days to a shortlist"],
    ],
  },
  {
    n: "05",
    status: "try it yourself",
    lamp: "on",
    title: "PresentAI",
    lead: "Paste your notes, get a slide deck in under a minute.",
    detail:
      "Structures the story, writes the slides and speaker notes, exports to PowerPoint. Live, free to try.",
    stack: ["next.js", "postgres", "python-pptx"],
    metrics: [
      ["2h → 15m", "to a first deck"],
      ["<60s", "for the first draft"],
    ],
    links: [
      { label: "try it ↗", href: "https://present-ai-007.vercel.app/" },
      { label: "see the code ↗", href: "https://github.com/Manveen07/PresentAI" },
    ],
  },
  {
    n: "06",
    status: "at precise leads · in use",
    lamp: "on",
    title: "Lead enrichment on autopilot",
    lead: "Turns a raw list of names into CRM-ready leads with emails, company details and a score, automatically.",
    detail:
      "Pulls from several data sources, fills the gaps, checks the data, scores each lead, syncs to the CRM and posts a Slack alert when a good one lands. Enrichment used to be a person with a spreadsheet.",
    stack: ["python", "clay", "n8n", "crm apis"],
    metrics: [
      ["8h → 2h", "enrichment work per week, measured"],
    ],
  },
  {
    n: "07",
    status: "internal tool",
    lamp: "warn",
    title: "Research-grounded writing",
    lead: "Writes a short, factual email about a company using only what a research step actually found.",
    detail:
      "AI left alone invents flattering details. Here, a research step runs first, the writer is only allowed to use what it found, and a separate checker reads every claim against the research.",
    stack: ["claude code", "typescript", "web research"],
    metrics: [
      ["95.5%", "of claims checked true, 300-email sample"],
      ["0", "made-up facts found"],
    ],
  },
];

// ── incident.log ─────────────────────────────────────────────────────
// Real entries only. Dates from commit history. Add one whenever something
// real breaks; never pad it.
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
    changed: "Stripped them, re-ran, published the lower honest number.",
  },
];

// ── Contact doors ────────────────────────────────────────────────────
export const DOORS = [
  {
    lamp: "on" as const,
    kicker: "If you're hiring",
    title: "Need someone like this on the team?",
    body: "Full-time or contract, remote. Everything above is the interview prep.",
    links: [
      { label: "resume ↗", href: "/resume.pdf" },
      { label: "linkedin ↗", href: "https://linkedin.com/in/Manveen" },
      { label: "github ↗", href: "https://github.com/Manveen07" },
    ],
  },
  {
    lamp: "warn" as const,
    kicker: "If you run a business",
    title: "Want the system built and looked after?",
    body: "First step is a fixed-scope pilot on a month of your real requests, measured the same way as the proof above, so you see the numbers before deciding anything. Then a monthly retainer to keep it running.",
    links: [
      { label: "book a call ↗", href: "https://calendly.com/manveen9650/30min" },
      { label: "email ↗", href: "mailto:manveen9650@gmail.com" },
    ],
  },
];
