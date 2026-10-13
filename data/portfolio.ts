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
      "It works out the story first, then writes the slides and the speaker notes. The free plan makes 3 decks a month, so you can try it right now. PowerPoint export is on the paid plan.",
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
// Real entries only. Dates from the projects' own records. Newest first. Add
// one whenever something real breaks; never pad it.
export const BROKE_INTRO = "When something I built breaks, I write it down. Here's the list, and what I changed each time.";

export type Incident = { when: string; system: string; broke: string; changed: string };

export const INCIDENTS: Incident[] = [
  {
    when: "2026-08",
    system: "demo pipeline",
    broke: "Rendering videos in parallel cut one down to 39 seconds over an 80-second narration.",
    changed: "One at a time now, with a length check before anything is sent.",
  },
  {
    when: "2026-07",
    system: "tender radar",
    broke: "A data-format change silently stopped the morning run. Nobody noticed for about three weeks.",
    changed: "Fixed it. A failed run now leaves a visible trace instead of dying quietly.",
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
