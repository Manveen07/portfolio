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
        "Run the Clay lead system behind client campaigns: 31 Clay searches pull new leads daily for 3 accounts, Claygent checks ICP fit, a waterfall finds and verifies emails, and n8n loads approved leads into Smartlead.",
        "Fixed a Claygent prompt that rejected real fits because of how they describe themselves: rewrote the shared template behind 5 segment prompts and tested it against hand labels. Wrongly rejected fits fell from 4 of 4 to 0, and it matched my labels on 30 unseen rows. A cheaper model, switched in the same round, cut cost from 1.0 to 0.19 Clay credits a row.",
        "Moved a company-website lookup and an \"already contacted\" check ahead of paid email finding; on one search, cost per email found fell from 4.6 credits to 1.0.",
        "Built a weekly Claude Code review that ranks every search by lead quality and positive replies, and swaps in a new search only if 70%+ of a 30-lead sample rates good.",
        "Built a daily scan of Slack communities that flags buying-intent posts and sends them to a sheet, Slack and Clay.",
        "Built a cold-email writer whose LLM judge checks every claim against the source research: 95.5% of claims supported and none contradicted across 300 emails; the judge scored 100% on a 20-email labeled set.",
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
        "Built data pipelines for the firm's internal data engine that normalized financial records, with validation that kept malformed ones out of the database.",
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
        "Reads engineering-drawing PDFs into a quote sheet, with the source text for every value; anything the drawing doesn't state is left blank and flagged instead of guessed.",
        "Hand-checked on 23 public drawings: 7 wrong values out of 419, and all 194 parts-list and cut-list values right.",
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
      keywords: ["Clay (Find-leads, workflows, Claygent, Audiences, CLI/API)", "n8n", "Smartlead", "HubSpot", "BounceBan", "LeadMagic", "Apollo", "web scraping"],
    },
    {
      name: "AI & LLM",
      keywords: ["Claude Code", "prompt and agent design", "structured outputs", "evals and LLM-as-judge", "embeddings"],
    },
    { name: "Languages", keywords: ["Python", "TypeScript/JavaScript", "SQL"] },
    {
      name: "Backend & tools",
      keywords: ["FastAPI", "Next.js", "Node.js", "PostgreSQL", "Docker", "Git", "CI/CD", "PyTorch", "scikit-learn"],
    },
  ],
};
