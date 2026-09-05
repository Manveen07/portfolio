// All copy & structural data for the portfolio sections.
// Edit values here and the relevant components re-render with new content.
//
// Every figure on this site is real and sourced. See CONTENT-PACK-2026-09-04.md
// in the repo root for where each number comes from.

// ── Identity ─────────────────────────────────────────────────────────
export const ME = {
  name: "Manveen Singh",
  role: "GTM automation engineer",
  location: "Delhi, India",
  hours: "remote · mornings overlap the UK, evenings the US",
  email: "manveen9650@gmail.com",
  github: "https://github.com/Manveen07",
  linkedin: "https://linkedin.com/in/Manveen",
  calendly: "https://calendly.com/manveen9650/30min",
  resume: "/resume.pdf",
} as const;

// ── Nav (the five numbered steps) ────────────────────────────────────
export const NAV: { id: string; label: string }[] = [
  { id: "proof",   label: "1 · proof" },
  { id: "about",   label: "2 · about" },
  { id: "work",    label: "3 · work" },
  { id: "writing", label: "4 · writing" },
  { id: "contact", label: "5 · contact" },
];

// ── Live pipeline snapshot ───────────────────────────────────────────
// Read from the GitHub Actions API + the job's own daily summary on
// 2026-09-04. `lib/runs.ts` refreshes this at build time when a token is
// present; these values are the fallback and the shape of the live data.
export type RunDay = { date: string; ok: boolean };

export const PIPELINE = {
  asOf: "2026-09-04",
  lastRunUtc: "09:52 UTC",
  totalRuns: 75,
  firstRun: "3 July",
  noticesRead: 342,
  clientProfiles: 7,
  manualSteps: 0,
  outageNote:
    "The red stretch is two weeks in August when a config change broke it. I fixed it on 11 August. It has not failed since. I leave that on the page because a system that never fails is a system nobody is watching.",
  loom: "https://www.loom.com/share/ed073589208c4e24a7543ba30b9d24dc",
  repo: "https://github.com/Manveen07/tender-radar-showcase",
} as const;

/** Last 40 scheduled runs: 15 failures (28 Jul → 11 Aug), then 25 successes. */
export const RUN_HISTORY: RunDay[] = (() => {
  const days: RunDay[] = [];
  const start = Date.UTC(2026, 6, 28); // 28 July 2026
  for (let i = 0; i < 40; i++) {
    const d = new Date(start + i * 86400000);
    days.push({ date: d.toISOString().slice(0, 10), ok: i >= 15 });
  }
  return days;
})();

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
      ["−40%", "time spent researching leads"],
      ["8h → 2h", "enrichment work per week"],
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

// ── Tools on the bench ───────────────────────────────────────────────
export const TOOLS = [
  "clay", "smartlead", "instantly", "apollo", "hubspot",
  "n8n", "leadmagic", "python", "postgres", "claude code",
];

// ── What working together looks like ─────────────────────────────────
export const PLATES: [string, string][] = [
  ["What you hand me", "A process your team repeats by hand every week, and the tools you already pay for."],
  ["What you get back", "A system that does it on its own, documentation a new hire can read, and me on call to keep it running."],
  ["How I keep it honest", "I test every AI step against hand-checked examples before it touches real data, and I report the real score, not the flattering one."],
];

// ── Work bays ────────────────────────────────────────────────────────
export type Bay = {
  n: string;                    // bay number, zero-padded
  status: string;               // header strip text
  lamp: "on" | "warn";
  title: string;
  lead: string;                 // one plain sentence, white
  detail: string;               // short explanation, grey
  stack: string[];
  metrics: [string, string][];
  links?: { label: string; href: string }[];
  wide?: boolean;               // spans both columns
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
      ["75", "mornings run on its own"],
      ["100%", "right on the hand-checked test set"],
    ],
    links: [
      { label: "watch it work (3 min) ↗", href: "https://www.loom.com/share/ed073589208c4e24a7543ba30b9d24dc" },
      { label: "see the code ↗", href: "https://github.com/Manveen07/tender-radar-showcase" },
    ],
    wide: true,
  },
  {
    n: "02",
    status: "internal tool",
    lamp: "warn",
    title: "Cold emails that only say true things",
    lead: "Writes a personal cold email for each lead using only facts my research agents actually found.",
    detail:
      "AI left alone invents flattering details. Here, several agents research the person and company first, and the writer is only allowed to use what they found. A separate checker reads every email against the research.",
    stack: ["claude code", "typescript", "web research"],
    metrics: [
      ["95.5%", "of claims checked true, across 300 emails"],
      ["0", "made-up facts found in the sample"],
    ],
  },
  {
    n: "03",
    status: "at precise leads · in use",
    lamp: "on",
    title: "Lead enrichment on autopilot",
    lead: "Turns a raw list of names into CRM-ready leads with emails, company details and a score, automatically.",
    detail:
      "Pulls from several data sources, fills the gaps, checks the data, scores each lead, syncs to the CRM and posts a Slack alert when a good one lands. Enrichment used to be a person with a spreadsheet.",
    stack: ["python", "clay", "n8n", "crm apis"],
    metrics: [
      ["8h → 2h", "enrichment work per week"],
      ["+30–50%", "more qualified leads"],
    ],
  },
  {
    n: "04",
    status: "finished · going live soon",
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
    n: "05",
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
    n: "06",
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
    body: "A fixed-price build, then a monthly retainer to keep it running. Founders, agencies, sales teams.",
    links: [
      { label: "book 20 min ↗", href: "https://calendly.com/manveen9650/30min" },
      { label: "email ↗", href: "mailto:manveen9650@gmail.com" },
    ],
  },
];
