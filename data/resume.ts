// The resume, as data: public/resume.pdf (made 22 Oct 2026), line for line. Nothing is added and nothing is
// left out: tests/ai.test.mjs checks every line and link of data/resume-pdf.txt (the PDF's text, written by
// scripts/resume-text.py) against this file, and every string here against the PDF. A new PDF fails the tests
// until its text is re-extracted and this file matches it.
//
// It feeds /resume.md, /resume.json (JSON Resume), /llms.txt, /llms-full.txt and the home page's JSON-LD.
// No imports, so the tests can load it directly.

export type ResumeLink = { label: string; href: string };

export type ResumeJob = {
  org: string;
  /** As printed on the PDF. */
  dates: string;
  /** The same dates as YYYY-MM, for /resume.json. No end date: still there. */
  start: string;
  end?: string;
  title: string;
  location: string;
  bullets: string[];
};

export type ResumeProject = {
  name: string;
  stack: string[];
  links: ResumeLink[];
  date: string;
  bullets: string[];
};

/** Where the data knowingly differs from public/resume.pdf, with the source. The PDF test swaps these in. */
export const PDF_OVERRIDES: { pdf: string; data: string; source: string }[] = [];

export const RESUME = {
  pdf: "/resume.pdf",
  /** The PDF's own creation date (its metadata), so a reader knows how fresh it is. */
  updated: "2026-10-22",
  name: "Manveen Singh",
  /** The line under the name: "AI & GTM Automation Engineer · Clay, n8n, Python, LLM workflows". */
  role: "AI & GTM Automation Engineer",
  focus: "Clay, n8n, Python, LLM workflows",
  location: "New Delhi, India (remote)",
  phone: "+91 9289644633",
  links: [
    { label: "manveen9650@gmail.com", href: "mailto:manveen9650@gmail.com" },
    { label: "linkedin.com/in/Manveen", href: "https://www.linkedin.com/in/Manveen" },
    { label: "github.com/Manveen07", href: "https://github.com/Manveen07" },
    { label: "manveen.me", href: "https://manveen.me/" },
  ] as ResumeLink[],
  /** Section headings, as printed. */
  headings: { experience: "Experience", projects: "Projects", education: "Education", skills: "Skills" },
  experience: [
    {
      org: "Precise Leads",
      dates: "Nov. 2025 – Present",
      start: "2025-11",
      title: "GTM Automation Engineer (outbound agency), full-time",
      location: "New Delhi, India · Remote",
      bullets: [
        "Built and run an always-on lead finder for 3 accounts: 31 Clay workflows post new people to n8n by webhook; a daily Python job screens mail servers, runs a Claygent ICP check and an email waterfall, and writes leads to client sheets. First 10 days: 2,205 new people found, 1,000+ delivered with verified emails.",
        "Mapped a 34,044-company market through Clay for 0 data credits, cut 28% with a DNS mail-server check, and qualified 24,506 companies with Claygent at ~0.18 credits each (17,056 fits), after rewriting the shared prompt template that rejected good fits on wording and testing it on hand labels.",
        "Found 15,514 decision-makers at 8,639 companies and 12,030 verified emails (78% find rate) through a cost-ordered waterfall (Tomba, LeadMagic, AI Ark, Clay, BounceBan) with per-provider caps and a spend ledger.",
        "Measured bounce rates by mail server across 505,461 sends (Mimecast 5.1%, Barracuda 2.4%, Google 0.5%) and built the result into the pipeline: risky servers are skipped before any paid lookup, 2,800+ people in the first 9 days.",
        "Built unattended Claude Code agents: a weekly review that ranks searches by lead quality and replies and swaps weak ones, and a cold-email writer whose LLM judge checks each claim against the research (95.5% supported, none contradicted, 300-email test set). Pipeline repo: 870+ tests.",
      ],
    },
    {
      org: "Caprae Capital Partners",
      // Dates and title per LinkedIn; the PDF matches since 27b3186 (22 Oct 2026).
      dates: "Aug. 2025 – Jan. 2026",
      start: "2025-08",
      end: "2026-01",
      title: "AI/ML Intern, internship",
      location: "Remote (Glendale, US)",
      bullets: [
        "Built data pipelines that normalized financial records for the firm's internal data engine, with validation that kept malformed ones out.",
        "Led a team of 3 building a recruitment automation platform: embeddings-based candidate ranking, an AI-scored video interview tool, and n8n automation of intake, scoring and scheduling.",
      ],
    },
  ] as ResumeJob[],
  projects: [
    {
      name: "drawing-proof",
      stack: ["Python", "Gemini", "structured outputs", "evals"],
      links: [],
      date: "2026",
      bullets: [
        "Reads engineering-drawing PDFs into a quote sheet with the source text for every value, and flags what the drawing doesn't state instead of guessing. Hand-checked on 23 public drawings: 7 wrong of 419 values.",
      ],
    },
    {
      name: "leadlens",
      stack: ["Python", "Pydantic", "LLM-as-judge"],
      links: [{ label: "write-up", href: "https://manveen.me/writing/schema-as-eval-spec" }],
      date: "2026",
      bullets: [
        "LLM classifier for AI-engineering job posts. Fixed failure modes through the output schema instead of prompt rules, and caught answer leakage in my own eval, then published the lower, honest score.",
      ],
    },
    {
      name: "Personal AI ops",
      stack: ["Claude Code", "n8n", "Python", "Gmail and Slack APIs"],
      links: [],
      date: "2026",
      bullets: [
        "Scheduled agents I run for myself: a Slack inbound monitor that reads 312 community channels plus Reddit and LinkedIn every day (an LLM judge went through 4,705 threads in one run) and emails me the few opportunities worth acting on; an Upwork alert judge that labels every job alert and drafts proposals for the good ones; and a task tracker with Slack buttons.",
      ],
    },
    {
      name: "Tender Radar",
      stack: ["Python", "LLM classification", "GitHub Actions"],
      links: [{ label: "source", href: "https://github.com/Manveen07/tender-radar-showcase" }],
      date: "2026",
      bullets: ["UK public-sector tender finder: pulls new notices, an LLM scores fit per client, and each client gets a digest."],
    },
  ] as ResumeProject[],
  education: [
    {
      school: "Maharaja Surajmal Institute of Technology",
      gpa: "GPA 8.6/10",
      degree: "Bachelor of Technology in Computer Science",
      dates: "Nov. 2022 – Aug. 2026",
      start: "2022-11",
      end: "2026-08",
      /** The degree split for /resume.json. */
      studyType: "Bachelor of Technology",
      area: "Computer Science",
      score: "8.6/10",
    },
  ],
  skills: [
    {
      name: "GTM & data",
      keywords: ["Clay (workflows, Claygent, Audiences, API/CLI, webhooks)", "n8n", "Smartlead", "HubSpot", "BounceBan", "LeadMagic", "AI Ark", "web scraping"],
    },
    {
      name: "AI & LLM",
      keywords: ["Claude Code agents", "prompt and agent design", "structured outputs", "evals and LLM-as-judge", "embeddings"],
    },
    { name: "Languages", keywords: ["Python", "TypeScript/JavaScript", "SQL"] },
    {
      name: "Backend & tools",
      keywords: ["FastAPI", "Next.js", "Node.js", "PostgreSQL", "Docker", "Git", "CI/CD", "PyTorch", "scikit-learn"],
    },
  ],
};
