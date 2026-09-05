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
  /** Plain-English title for the homepage card. Falls back to `title`. */
  cardTitle?: string;
  /** Plain-English summary for the homepage card. Falls back to `summary`. */
  cardSummary?: string;
  date: string;       // ISO
  readMins: number;
  tags: string[];
  summary: string;    // card + meta description
  body: Block[];
};

export const POSTS: Post[] = [
  {
    slug: "schema-as-eval-spec",
    title: "Schema-as-eval-spec: killing LLM failure modes by construction (and catching my eval cheating)",
    cardTitle: "How I caught my own AI test cheating, and why the lower score is the one I trust",
    cardSummary:
      "I built an AI that grades job postings. It scored perfectly on my tests. That was the problem. This is what was wrong, how I fixed it, and why “fix the rules, not the prompt” works.",
    date: "2026-06-14",
    readMins: 7,
    tags: ["llm", "evals", "pydantic", "llm-as-judge"],
    summary:
      "I built an LLM job-posting classifier, fixed three failure modes by changing the output schema instead of the prompt, then discovered my own evaluation was leaking the answer. The second part taught me more than the first.",
    body: [
      {
        t: "p",
        s: "I've been building **leadlens** — an LLM classifier that reads an AI-engineering job posting and decides whether it's a real role, what kind, and whether it's worth applying to. I'm a final-year CS student aiming at remote AI-engineering work, so the tool doubles as dogfood: the thing that helps me find jobs is the portfolio piece.",
      },
      {
        t: "p",
        s: "Two things happened building it that were worth more than the tool itself. First, a pattern for fixing model failures. Second, the more uncomfortable lesson — my evaluation was quietly cheating, and I almost shipped the result.",
      },
      { t: "h2", s: "Part 1 — Fix failures in the schema, not the prompt" },
      {
        t: "p",
        s: 'When an LLM misbehaves, the reflex is to add a line to the prompt: *"don\'t hardcode confidence," "don\'t miss scams," "be thorough."* It mostly doesn\'t hold — instructions are suggestions, and the model drifts back.',
      },
      {
        t: "p",
        s: "What worked instead was making the bad behaviour **impossible to express**, by changing the output schema so the model has to surface the thing it was hiding. I started calling it **schema-as-eval-spec**: every recurring failure gets a schema field that forces the model to declare itself, which both kills the failure and makes it measurable.",
      },
      { t: "p", s: "Three times this worked:" },
      {
        t: "p",
        s: "**Hardcoded confidence.** The classifier returned a `confidence` value that was always the same number — it wasn't reasoning, it was defaulting. The fix wasn't \"please reason about confidence.\" It was a `confidence_reasoning` field with a minimum length, so the model literally cannot answer without first writing out the evidence. You can't default through a justification you're forced to produce.",
      },
      {
        t: "code",
        lang: "python",
        s: 'confidence_reasoning: str = Field(\n    min_length=100,\n    description="Quote specific evidence from the description before any score.",\n)',
      },
      {
        t: "p",
        s: '**Invisible thin extraction.** It pulls the frameworks a posting names into `core_stack`. Sometimes that came back empty — but "empty" was ambiguous: did the posting name nothing, or did the model miss something that was there? Both looked identical. Adding a `stack_unspecified: bool` companion split the two apart, turning an invisible failure into a countable one.',
      },
      {
        t: "p",
        s: "**Ungrounded judge verdicts.** For catching fake \"AI\" roles I built a second LLM as a judge. Same trick: it must write a critique *before* the verdict, never after. The order is the discipline — a verdict with no reasoning in front of it is where calibration quietly breaks.",
      },
      {
        t: "p",
        s: 'The reframing is the takeaway: the schema stops being a formatting detail and becomes the spec for what "good" means. Most of my fixes were schema edits, not prompt edits.',
      },
      { t: "h2", s: "Part 2 — My evaluation was cheating" },
      { t: "p", s: "Here's the part I didn't expect." },
      {
        t: "p",
        s: 'To trust the scam-detecting judge, I built a small hand-labelled set, then grew it — more postings, more variety, more of the genuinely tricky cases (sales roles with "AI" in the title, gig "AI trainer" work, partnership pitches with no salary). I expected the judge to start failing as the set got harder. It didn\'t. It kept scoring suspiciously well.',
      },
      {
        t: "p",
        s: "That should have made me happy. It made me uneasy. A judge that aces every case usually means the test is too easy, not that the judge is brilliant.",
      },
      {
        t: "p",
        s: 'So I read my own evaluation data line by line — which is the one eval habit that actually pays off. And the problem was obvious in hindsight: **I\'d written the answer into the input.** My job descriptions had editorial notes baked in — phrases like "zero technical AI work" or "this is a sales role, not engineering." The judge wasn\'t judging a raw posting. It was reading my hint and repeating it back. The headline score was measuring my own annotations, not the model.',
      },
      {
        t: "p",
        s: 'I stripped every one of those tells out of the descriptions, leaving only what a real posting would actually say, and ran it again. The score dropped. The judge started missing the subtlest cases — a "Director of Partnerships" at a real AI company, a coding-heavy gig that\'s really piecework annotation. Exactly the cases where a human skimming fast would also be fooled.',
      },
      {
        t: "p",
        s: "The lower number is the honest one. The high number was never real — it was the eval grading its own crib notes.",
      },
      { t: "h2", s: "Why this is the better lesson" },
      {
        t: "p",
        s: "A failure mode you can fix with a schema field is satisfying but tidy. A failure mode in your *measurement* is the dangerous one, because it doesn't look like a failure — it looks like success. If I'd trusted the first result, I'd have shipped a judge I believed was near-perfect and watched it fall apart on real job boards, with no idea why.",
      },
      {
        t: "p",
        s: "The fix for the model was a schema. The fix for the eval was reading the data and being willing to make my own numbers look worse. The second one was harder and mattered more.",
      },
      { t: "h2", s: "What's next" },
      {
        t: "p",
        s: "The judge now misses the genuinely ambiguous cases — partnership-flavoured roles at real AI companies, coding gig work that isn't really a job. Those are the frontier, and the next iteration targets them with worked examples of exactly those shapes. The classifier itself is the weaker link — it still over-trusts the word \"AI\" in a title — so that's next too.",
      },
      {
        t: "p",
        s: "leadlens runs for a fraction of a cent per posting. Cost was never the constraint. Honesty about what the evaluation is actually measuring was.",
      },
      {
        t: "p",
        s: "The code is in a private repo until leadlens goes live. The production system built on the same pattern is public: [tender-radar-showcase](https://github.com/Manveen07/tender-radar-showcase).",
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
