// All copy & structural data for the portfolio sections.
// Edit values here and the relevant components will re-render with new content.

import { T } from "@/lib/tokens";

// ── Identity ─────────────────────────────────────────────────────────
export const ME = {
  name: "Manveen Singh",
  handle: "manveen.singh",
  role: "AI/ML Engineer",
  subrole: "sys.engineer",
  location: "Remote / Delhi, India",
  email: "manveen9650@gmail.com",
  github: "https://github.com/Manveen07",
  linkedin: "https://linkedin.com/in/Manveen",
  calendly: "https://calendly.com/manveen9650/30min",
  resume: "/resume.pdf",
  version: "v2.4.1",
} as const;

// ── Nav ──────────────────────────────────────────────────────────────
export const NAV_IDS = [
  "top", "about", "pipeline", "ops", "agents",
  "stack", "experience", "contact",
] as const;

export const NAV_LABELS: Record<(typeof NAV_IDS)[number], string> = {
  top: "system",
  about: "about",
  pipeline: "pipeline",
  ops: "work",
  agents: "agents",
  stack: "stack",
  experience: "logs",
  contact: "contact",
};

export const NAV_VISIBLE: (typeof NAV_IDS)[number][] = [
  "top", "about", "pipeline", "ops", "stack", "contact",
];

// ── Services (what I sell) ──────────────────────────────────────────
export type Service = { code: string; name: string; sub: string };

export const SERVICES: Service[] = [
  { code: "S-01", name: "Lead enrichment & GTM pipelines", sub: "multi-source ingestion, scoring, CRM sync" },
  { code: "S-02", name: "Document & resume parsing",       sub: "NLP extraction, ranking, vector-DB search" },
  { code: "S-03", name: "Multi-agent workflow systems",    sub: "LLM agents that retry, escalate, audit" },
  { code: "S-04", name: "Internal-tool automation",        sub: "Slack · email · n8n · scheduled jobs" },
  { code: "S-05", name: "Build + ongoing maintenance",     sub: "ship it, then keep it running (retainer)" },
];

// ── DAG ──────────────────────────────────────────────────────────────
export type DagNode = {
  id: string; x: number; y: number;
  label: string; sub: string;
  kind: "in" | "out" | "work" | "agent";
  tag: string; live?: boolean;
};

export const DAG_NODES: DagNode[] = [
  { id: "trg", x:   30, y: 130, label: "TRIGGER",   sub: "webhook · cron · event",   kind: "in",    tag: "T-01" },
  { id: "col", x:  220, y:  40, label: "COLLECT",   sub: "apollo · crm · sheets",    kind: "work",  tag: "C-02", live: true },
  { id: "scr", x:  220, y: 220, label: "SCRAPE",    sub: "serp · linkedin · web",    kind: "work",  tag: "C-03", live: true },
  { id: "nor", x:  430, y: 130, label: "NORMALIZE", sub: "pandas · pydantic",        kind: "work",  tag: "N-04", live: true },
  { id: "enr", x:  640, y:  40, label: "ENRICH",    sub: "llm · embeddings · agent", kind: "agent", tag: "E-05", live: true },
  { id: "val", x:  640, y: 220, label: "VALIDATE",  sub: "schema · golden tests",    kind: "agent", tag: "V-06" },
  { id: "rnk", x:  850, y: 130, label: "RANK",      sub: "vector-rank · k=24",       kind: "agent", tag: "S-07" },
  { id: "rt",  x: 1060, y:  40, label: "ROUTE",     sub: "slack · email · ticket",   kind: "work",  tag: "R-08" },
  { id: "sch", x: 1060, y: 220, label: "SCHEDULE",  sub: "calendly · gcal",          kind: "work",  tag: "R-09" },
  { id: "log", x: 1270, y: 130, label: "LEDGER",    sub: "postgres · audit",         kind: "out",   tag: "L-10" },
];

export const DAG_EDGES: [string, string][] = [
  ["trg", "col"], ["trg", "scr"],
  ["col", "nor"], ["scr", "nor"],
  ["nor", "enr"], ["nor", "val"],
  ["enr", "rnk"], ["val", "rnk"],
  ["rnk", "rt"],  ["rnk", "sch"],
  ["rt",  "log"], ["sch", "log"],
];

export const HOT_EDGES = new Set(["trg-col", "trg-scr", "col-nor", "scr-nor", "nor-enr"]);

// ── Streaming log pool ──────────────────────────────────────────────
export type LogEntry = [string, string, string, string];
export const LOG_POOL: LogEntry[] = [
  ["T-01", "webhook.received", "inbound:lead.created", T.text],
  ["C-02", "apollo.fetch()",   "→ 142 records",        T.warn],
  ["C-03", "serp.scrape()",    "→ 89 records",         T.warn],
  ["N-04", "normalize()",      "231 → 219 valid",      T.text],
  ["E-05", "llm.enrich()",     "batch=231 · 4.2s",     T.accent],
  ["V-06", "schema.ok",        "✓ 219 / 231",          T.accent],
  ["S-07", "vector.rank()",    "top-k=24",             T.accent],
  ["R-08", "slack.notify()",   "#gtm-warm-leads",      T.warn],
  ["L-10", "pg.commit",        "✓ 24 rows",            T.text],
  ["AGT-01", "lead-enricher",  "finished · 4.2s",      T.accent],
  ["AGT-04", "crm-syncer",     "pushed 87 → hubspot",  T.accent],
  ["Q-11", "queue.drain",      "23 → 0",               T.text],
  ["M-00", "metrics.flush",    "✓ to prom",            T.dim],
  ["H-12", "health.check",     "all green",            T.accent],
];

// ── Agents ──────────────────────────────────────────────────────────
export type Agent = {
  id: string; name: string; model: string;
  task: string;
  status: "running" | "idle" | "queued";
  lat: number | null;
};

export const AGENTS: Agent[] = [
  { id: "AGT-01", name: "lead-enricher",  model: "gpt-4o-mini",  task: "enriching ACME Corp · 31 records", status: "running", lat: 4.2 },
  { id: "AGT-02", name: "resume-parser",  model: "claude-haiku", task: "ranking 24 inbound CVs",            status: "running", lat: 2.1 },
  { id: "AGT-03", name: "data-validator", model: "pydantic-llm", task: "schema check · payroll batch",      status: "idle",    lat: null },
  { id: "AGT-04", name: "crm-syncer",     model: "n8n-runner",   task: "pushing 87 leads → hubspot",        status: "running", lat: 0.8 },
  { id: "AGT-05", name: "slack-router",   model: "rule-engine",  task: "routing #gtm-warm-leads",           status: "queued",  lat: null },
  { id: "AGT-06", name: "doc-reader",     model: "claude-opus",  task: "analyzing Q1 founder updates",      status: "running", lat: 11.3 },
  { id: "AGT-07", name: "embed-indexer",  model: "bge-large",    task: "indexing 1,240 chunks",             status: "running", lat: 0.4 },
  { id: "AGT-08", name: "audit-logger",   model: "rule-engine",  task: "no inbound events",                 status: "idle",    lat: null },
];

// ── Experience ──────────────────────────────────────────────────────
export type Role = {
  co: string; role: string; span: string; loc: string;
  mission: string; execution: string[]; impact: string[];
};

export const ROLES: Role[] = [
  {
    co: "Precise Leads",
    role: "GTM Automation Engineer",
    span: "Nov 2025 – Present",
    loc: "Remote",
    mission: "Increase GTM velocity by reducing human bottlenecks and operational overhead.",
    execution: [
      "Automating lead enrichment workflows and structuring CRM sync.",
      "Integrating APIs for high-volume data processing.",
      "Built a high-intent inbound discovery engine and scalable backend systems for immediate action.",
    ],
    impact: [
      "Reduced manual research time by 40%.",
      "Delivered faster outreach cycles and higher data quality.",
      "Improved overall GTM efficiency by replacing manual work with intelligent systems.",
    ],
  },
  {
    co: "Caprae Capital Partners",
    role: "AI / ML Intern",
    span: "Jun 2025 – Dec 2025",
    loc: "Remote · Glendale, US",
    mission: "Automate the candidate lifecycle and normalize high-volume financial data.",
    execution: [
      "Spearheaded the ground-up development of a proprietary recruitment ecosystem.",
      "Engineered an AI-driven resume parsing and ranking system.",
      "Architected candidate scoring models powered by advanced embeddings.",
    ],
    impact: [
      "Eliminated 100% of manual administrative friction in the hiring process.",
      "Reduced screening time and drastically increased candidate throughput.",
      "Improved candidate ranking consistency using systematic AI scoring logic.",
    ],
  },
];

export const EDUCATION = {
  degree: "B.Tech, Computer Science",
  school: "Maharaja Surajmal Institute of Technology",
  span: "Nov 2022 – Aug 2026",
  gpa: "8.7",
};

// ── Stack ───────────────────────────────────────────────────────────
export type StackGroup = { k: string; items: string[] };

export const STACK: StackGroup[] = [
  { k: "Core Languages",   items: ["Python", "C", "JavaScript", "SQL", "TypeScript"] },
  { k: "Frameworks",       items: ["Next.js", "React", "Tailwind CSS", "FastAPI"] },
  { k: "AI & ML",          items: ["LLM Integration", "Prompt Engineering", "Embeddings", "Vector Search", "Transformer Models", "Vision Transformers"] },
  { k: "Data & Libraries", items: ["PostgreSQL", "ETL Pipelines", "Pandas", "Scikit-learn", "Data Normalization"] },
  { k: "Automation & DB",  items: ["n8n", "Process Automation", "Lead Enrichment", "CRM Automation"] },
  { k: "Tools",            items: ["Docker", "Background Workers", "Deployment Pipelines", "Git"] },
];

// ── Ops · Mission reports ───────────────────────────────────────────
export type Op = {
  tag: string;
  role: string;
  title: string;
  blurb: string;
  challenge: string;
  solution: string;
  stack: string[];
  impact: [string, string][];
  link: string | null;          // source / repo
  demo?: string | null;         // live deployment, if public
};

export const OPS: Op[] = [
  {
    tag: "OPS-001",
    role: "Lead engineer — architecture · AI · automation",
    title: "AI-Powered Recruitment Automation",
    blurb: "Modular AI recruitment system: NLP resume parsing, embeddings-based ranking over a vector DB, and an automation layer for shortlists and interview scheduling.",
    challenge: "Recruiters were spending 5–10 hours per week manually screening resumes, leading to slow time-to-shortlist, inconsistent evaluation, and recruiter fatigue.",
    solution: "Built a modular system with a Resume Ingestion Pipeline (NLP parsing), an AI Ranking Engine (embeddings + vector DB scoring candidates), and an Automation Layer to auto-generate shortlist reports and schedule interviews.",
    stack: ["Python", "FastAPI", "spaCy / LLM", "Embeddings + Vector DB", "PostgreSQL", "Celery", "Slack API", "Docker"],
    impact: [
      ["10h → 3h", "screening / week"],
      ["3×",       "candidate throughput"],
      ["5d → 1.5d","time-to-shortlist"],
      ["↑",        "ranking consistency"],
    ],
    link: null,
  },
  {
    tag: "OPS-002",
    role: "Architect & builder",
    title: "PresentAI — Automated Presentation Agent",
    blurb: "Text-to-slide agent: structured slide flow, speaker-notes generation, and automated PPT export. Founders go from idea to first draft in under a minute.",
    challenge: "Founders and PMs waste hours structuring slide decks, writing content, formatting layouts, and rewriting messy meeting notes.",
    solution: "Built an automated presentation agent that executes text-to-slide conversion. Implemented structured slide flow, speaker-notes generation, and automated PPT export based on LLM abstractions.",
    stack: ["Next.js", "Tailwind CSS", "Prisma", "Zustand", "PostgreSQL", "Gen AI", "python-pptx", "React DnD", "Clerk"],
    impact: [
      ["2h → 15m", "deck creation"],
      ["<60s",     "first draft"],
      ["↑",        "pitch iteration"],
    ],
    link: "https://github.com/Manveen07/PresentAI",
    demo: "https://present-ai-007.vercel.app/",
  },
  {
    tag: "OPS-003",
    role: "GTM Automation Engineer",
    title: "Lead Enrichment & GTM Automation",
    blurb: "Multi-source lead ingestion and an API enrichment layer. CRM sync, Slack notifications, lead scoring, and automated data validation.",
    challenge: "Lead enrichment was entirely manual, creating bottlenecks in outreach, poor data fidelity, and high bounce rates.",
    solution: "Developed multi-source lead ingestion and an API enrichment layer. Orchestrated CRM syncing, Slack notifications, lead scoring, and automated data validation.",
    stack: ["Python", "n8n", "Web Scraping", "REST APIs", "CRM Integrations", "PostgreSQL"],
    impact: [
      ["8h → 2h", "enrichment / week"],
      ["+30–50%", "qualified leads"],
      ["−40%",    "outreach delay"],
      ["↑",       "CRM consistency"],
    ],
    link: null,
  },
  {
    tag: "OPS-004",
    role: "Machine Learning Engineer",
    title: "AsanaBot — Real-Time Yoga Pose Analysis",
    blurb: "Domain-specific applied ML and vision: real-time yoga pose classification with corrective feedback.",
    challenge: "Need for specialized, real-time guidance in physical yoga posture correction with instant feedback.",
    solution: "Built AsanaBot using Vision Transformers and MediaPipe for accurate, real-time yoga pose classification and corrective feedback. Implemented efficient video processing and pose detection algorithms.",
    stack: ["Python", "Vision Transformers", "MediaPipe", "OpenCV", "NLP"],
    impact: [
      ["real-time", "visual guidance"],
      ["high",      "pose accuracy"],
      ["instant",   "corrective signals"],
      ["efficient", "video processing"],
    ],
    link: "https://github.com/Manveen07/AsanaBot",
  },
];

