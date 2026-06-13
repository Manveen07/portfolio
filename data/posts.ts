// Blog / writing content. Block-based so we render without any markdown dep.
// Inline syntax supported by the renderer: **bold**, `code`, *italic*, [text](url).

export type Block =
  | { t: "h2"; s: string }
  | { t: "p"; s: string }
  | { t: "code"; lang: string; s: string }
  | { t: "quote"; s: string }
  | { t: "ul"; items: string[] }
  | { t: "table"; head: string[]; rows: string[][] };

export type Post = {
  slug: string;
  title: string;
  date: string;       // ISO
  readMins: number;
  tags: string[];
  summary: string;    // card + meta description
  body: Block[];
};

export const POSTS: Post[] = [
  {
    slug: "schema-as-eval-spec",
    title: "Schema-as-eval-spec: killing LLM failure modes by construction",
    date: "2026-06-14",
    readMins: 6,
    tags: ["llm", "evals", "pydantic", "llm-as-judge"],
    summary:
      "I built an LLM job-posting classifier, watched it fail in three specific ways, and fixed each one by changing the output schema — not the prompt. Here's the pattern, with the numbers.",
    body: [
      {
        t: "p",
        s: "I've been building **leadlens** — an LLM classifier that reads an AI-engineering job posting and tells me whether it's a real role, what the stack is, whether it's remote-friendly, and whether it's worth applying to. I'm a final-year CS student aiming at remote AI-engineering roles, so the tool is also a dogfood: the thing that helps me find jobs is itself the portfolio piece.",
      },
      {
        t: "p",
        s: "Along the way I kept hitting the same shape of problem — and kept solving it the same way. This post is that pattern, with real numbers from a 20-posting golden set.",
      },
      { t: "h2", s: "The naive instinct that doesn't work" },
      {
        t: "p",
        s: 'When an LLM does something wrong, the reflex is to add a line to the prompt: *"Don\'t hardcode confidence."* *"Don\'t miss scams."* *"Be thorough."*',
      },
      {
        t: "p",
        s: "It mostly doesn't work. Instructions are suggestions; the model drifts back. What *does* work is making the wrong behaviour **impossible to express** — by changing the output schema so the model has to expose the dimension it was hiding in. I started calling this **schema-as-eval-spec**: every recurring failure mode gets a schema field that forces the model to declare itself, which makes the failure measurable and usually kills it by construction.",
      },
      { t: "p", s: "Here are the three times it worked." },
      { t: "h2", s: "Failure 1 — Hardcoded confidence" },
      {
        t: "p",
        s: "leadlens returned a `confidence` value per classification. Reading the outputs, every single one was `0.95`. The model wasn't reasoning about confidence — it was emitting a number that *sounds* confident. A 0.95 on an obvious role and a 0.95 on a garbage one tell you nothing.",
      },
      {
        t: "p",
        s: 'The prompt fix would be: "actually think about your confidence." (Useless.) The schema fix:',
      },
      {
        t: "code",
        lang: "python",
        s: 'confidence_reasoning: str = Field(\n    min_length=100,\n    description="Quote specific evidence from the description before any score.",\n)',
      },
      {
        t: "p",
        s: "`min_length=100` means the model literally cannot return an answer without first typing 100 characters of evidence. You can't default your way through a justification you're forced to write. The hardcoded 0.95 disappeared because the structure made it impossible.",
      },
      { t: "h2", s: "Failure 2 — Thin extraction that looked like success" },
      {
        t: "p",
        s: 'leadlens extracts `core_stack` — the frameworks named in a posting. Sometimes it came back empty. But "empty" was ambiguous: did the *posting* name no frameworks (model did its job), or did the model *miss* frameworks that were there (real failure)? Both looked identical — `[]`.',
      },
      {
        t: "code",
        lang: "python",
        s: 'core_stack: list[str] = Field(...)\nstack_unspecified: bool = Field(\n    description="True if the source named no frameworks; False if it did.",\n)',
      },
      {
        t: "p",
        s: 'Now an empty `core_stack` with `stack_unspecified=True` means "nothing to find" — fine. Empty with `False` means "the model missed something" — a bug I can see and count. The boolean turned an invisible failure into a measurable one.',
      },
      { t: "h2", s: "Failure 3 — The judge that under-called scams" },
      {
        t: "p",
        s: 'The most interesting one. AI job boards are full of "AI" postings that aren\'t real engineering roles — partnership-not-a-job pitches, equity-only-no-salary asks, "AI Customer Success Manager" titles with zero engineering. leadlens kept under-calling these.',
      },
      {
        t: "p",
        s: "So I built a second LLM as a **judge** whose only job is to flag scams, using critique-shadowing: it writes a 2–3 sentence critique *before* the verdict (`min_length` again — same pattern), then a binary `yes`/`no`. Then I did the part most demos skip: I calibrated it against my own hand-labels.",
      },
      {
        t: "p",
        s: 'Why not measure accuracy? Only 3 of my 20 postings are scams. A lazy judge that says "not a scam" to everything scores **85% raw agreement** — and catches zero scams. Accuracy lies under class imbalance. So I measured **TPR** (of real scams, how many caught?) and **TNR** (of real roles, how many correctly cleared?) separately.',
      },
      {
        t: "p",
        s: "**v1:** TPR 1.0, TNR 0.882. It caught all 3 scams but wrongly flagged 2 real startup roles — it over-fired on \"vague\" and \"founding engineer\" language. **v2:** I added two few-shot examples (one real scam, one real-but-sketchy-looking role) and one rule — *vague + a real product is not a scam*. Re-ran:",
      },
      {
        t: "table",
        head: ["Version", "TPR", "TNR", "False positives"],
        rows: [
          ["v1", "1.0", "0.882", "2"],
          ["v2", "1.0", "1.0", "0"],
        ],
      },
      {
        t: "p",
        s: "Both false positives flipped to correct. No scam slipped.",
      },
      {
        t: "quote",
        s: "1.0 on 20 examples is encouraging, not solved. Twenty is a small set; at 100 postings I fully expect TNR to dip and need another iteration. The method is proven — measure, find the failing cases, fix with examples + a rule, re-measure — but the number needs a bigger golden set before I'd trust it. I'd rather say that than wave a 100% around.",
      },
      { t: "h2", s: "The pattern, stated plainly" },
      {
        t: "p",
        s: "Every recurring failure had the same fix shape: **a schema field that forces the model to expose the dimension the failure was hiding in.**",
      },
      {
        t: "ul",
        items: [
          "Hardcoded confidence → `min_length` reasoning field.",
          "Invisible thin extraction → a `_unspecified` boolean.",
          "Ungrounded judge verdicts → critique-before-verdict.",
        ],
      },
      {
        t: "p",
        s: 'The schema stops being just an output format and becomes the eval spec — it defines what "good" looks like and makes "bad" measurable. That reframing is the most useful thing I learned building this.',
      },
      { t: "h2", s: "What's next" },
      {
        t: "p",
        s: "leadlens runs locally at ~$0.00085 per posting. Next I'm deploying it (FastAPI + Modal), wiring real tracing (Langfuse), and scaling the golden set from 20 to 100 real postings — which is where the judge's 1.0 will get its real test.",
      },
      {
        t: "p",
        s: "Code: [github.com/Manveen07/new-10x-engineer](https://github.com/Manveen07/new-10x-engineer)",
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
