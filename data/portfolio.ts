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
  firstRun: "4 July 2026",
  intro:
    "Government contract notices for cleaning, security and facilities work are spread across several UK websites. I wanted one script to read all of them every morning and sort out which ones each trade should bid on.",
  penNote: "every bar is a morning nobody pressed a button",
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

// The last line of the Work section. Precise Leads is one line only: agency results
// stay off the freelance page.
export const NOW_LINE = "Now: GTM automation engineer at Precise Leads, since Nov 2025. B.Tech Computer Science, MSIT Delhi, 2026.";

// ── Work: leads with the Caprae card and its quote, then leadlens, then PresentAI (spec 3.9).
// Order matters; tests/site.test.mjs pins it. Tender Radar has its own section above.
export type WorkItem = {
  title: string;
  where: string;
  lead: string;
  detail: string;
  metrics: [string, string][];
  stack: string[];
  links?: { label: string; href: string }[];
  /** A line under `where`, for a card that is a job (title, dates, place). */
  role?: string;
  /** Zackary's quote renders as a block right after this card. */
  quote?: true;
};

export const WORK: WorkItem[] = [
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
  {
    title: "leadlens",
    where: "My own project",
    lead: "Reads a job posting and tells you whether the AI role is real, dressed up, or a scam.",
    detail:
      "I hand-checked 72 postings, then measured it against them. It scored a perfect 100%, which was the problem: my own notes were leaking the answers into the test. I took them out and published the lower score.",
    metrics: [
      ["9 of 11", "dressed-up AI roles caught"],
      ["0", "real jobs wrongly flagged"],
    ],
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
    stack: ["next.js", "postgres"],
    links: [
      { label: "Try it ↗", href: "https://present-ai-007.vercel.app/" },
      { label: "See the code ↗", href: "https://github.com/Manveen07/PresentAI" },
    ],
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
