// Blog / writing content. Block-based so we render without any markdown dep.
// Inline syntax supported by the renderer: **bold**, `code`, *italic*, [text](url).

import { DRAWINGS, WRONG, type Pin } from "./portfolio";

export type Block =
  | { t: "h2"; s: string }
  | { t: "p"; s: string }
  | { t: "code"; lang: string; s: string }
  | { t: "quote"; s: string }
  | { t: "ul"; items: string[] }
  | { t: "table"; head: string[]; rows: string[][] }
  /** A line in mono with the red pen on it and a scribble beside it, like the confidently-wrong notes. */
  | ({ t: "exhibit"; scribble: string } & Pin["exhibit"]);

/** A post drawn by its own component instead of prose blocks. Its words stay in data/portfolio.ts;
    app/writing/[slug]/page.tsx picks the component and lib/md/posts.ts writes its markdown copy. */
export type PostComponent = "drawing-proof" | "confidently-wrong";

export type Post = {
  slug: string;
  title: string;
  /** Plain-English title for the homepage card. Falls back to `title`. */
  cardTitle?: string;
  /** Plain-English summary for the writing index. Falls back to `summary`. */
  cardSummary?: string;
  /** One line for the home page's writing list. Falls back to `cardSummary`. */
  line?: string;
  date: string;       // ISO
  /** A word for the date, where it shows: "Marked" gives "Marked 26 Sep 2026". Without one: "14 June 2026". */
  dateLabel?: string;
  readMins: number;
  tags: string[];
  summary: string;    // card + meta description
  body: Block[] | { component: PostComponent };
};

export const POSTS: Post[] = [
  {
    // Was the home page's "Marking the AI's homework" block until 22 Oct, when Manveen moved it here:
    // "these are the blogs". Dated the day it was marked: out/EVAL.md, 26 Sep 2026 (the fine print says so too).
    slug: "marking-the-ais-homework",
    title: DRAWINGS.title,
    date: "2026-09-26",
    dateLabel: "Marked",
    readMins: 2,
    tags: ["evals", "llm", "engineering drawings"],
    summary: DRAWINGS.lede,
    body: { component: "drawing-proof" },
  },
  {
    // Was the home page's pinned notes until 22 Oct. Dated by its newest note, 19 Sep 2026; each note keeps its own date.
    slug: "things-ai-got-confidently-wrong",
    title: WRONG.title,
    // The lede's second sentence, word for word: under this title on the home page, "Pinned here" would point nowhere.
    line: "Each one came back sounding sure of itself, and each one changed what I check.",
    date: "2026-09-19",
    dateLabel: "Last entry",
    readMins: 2,
    tags: ["llm", "evals", "lessons"],
    summary: WRONG.lede,
    body: { component: "confidently-wrong" },
  },
  {
    // Trimmed 22 Oct to its best part, the eval that leaked its own answers (Manveen: "Trim to its best part, with
    // real numbers"). Part 1, the schema fixes, is cut: the 0.95 story is the 25 May note in the confidently-wrong post.
    // Paths are under C:\Users\Manveen\Desktop\new_things_to_mess_araound\new 10x engineer\ ; P = projects\business-classification-pipeline.
    // Every number, and where it comes from:
    // - 72 postings, 11 fakes, 61 real: P\data\golden-jds.jsonl at commit a587f972 (13 Jun 2026), 72 rows; 11 have
    //   expected_category "ai_washed" (judge_v2.py golden_label: ai_washed is "yes"), 61 do not.
    // - Before, 11 of 11 and no false alarms: commit a587f972, "Judge v2 held TPR/TNR 1.0 on 72 -- which was suspicious";
    //   PROGRESS.md and P\failure-taxonomy.md at b399e59f, "honest TPR fell 1.0 → 0.818". The before run's outputs were
    //   not kept; the commit message is the record.
    // - 31 sentences: commit a587f972, "clean_descriptions.py strips 31 such sentences, leaving only real posting text".
    // - After, 9 of 11 and still 0 false alarms of 61: P\data\judge-v2-outputs.jsonl at a587f972 against the labels
    //   above gives 9 caught, 2 missed, 0 false alarms, 61 left alone (recounted 22 Oct; the leadlens card's scorecard).
    //   Commit: "TPR dropped 1.0 -> 0.818, TNR held 1.0".
    // - The two that got through: jd_032, GC AI, "Director of Partnerships (Legal AI)"; jd_034, DataAnnotation,
    //   "AI Data Quality Specialist - AI Trainer". Commit: "Two scams now slip (GC partnerships role; DataAnnotation
    //   coding-gig) = the ambiguous frontier."
    // - The tells: P\clean_descriptions.py docstring, the golden JDs had "meta-commentary baked into the description
    //   field ("Judge must catch this", "Non-AI control", "tests whether...", "Edge case: ...")"; its LEAK_MARKERS list
    //   includes "judge must", "non-ai control", "edge case". "The editorial meta belongs in expected_category /
    //   is_edge_case (the label side), never the input side."
    // - "Crib notes": Manveen's own words, commit a587f972, "the high score was the eval grading its own crib notes".
    slug: "schema-as-eval-spec",
    title: "How I caught my own AI test cheating, and why the lower score is the one I trust",
    // The first two sentences of the summary, word for word.
    line: "My AI judge caught all 11 fake AI jobs in my test. My own notes in the test data were giving it the answers.",
    date: "2026-06-14",
    readMins: 2,
    tags: ["llm", "evals", "llm-as-judge"],
    summary:
      "My AI judge caught all 11 fake AI jobs in my test. My own notes in the test data were giving it the answers. Without them, it caught 9.",
    body: [
      {
        t: "p",
        s: "leadlens is my tool that reads an AI job posting and says whether the job is real. Part of it is a judge: a second model that hunts for the fakes. A sales job with \"AI\" in the title. Gig work dressed up as engineering. A \"partnership opportunity\" with no salary.",
      },
      {
        t: "p",
        s: "To test the judge, I labelled 72 postings by hand: 11 fakes, 61 real jobs.",
      },
      { t: "h2", s: "11 out of 11" },
      {
        t: "p",
        s: "It caught all 11 fakes and didn't call a single real job fake. Perfect, on a set I'd just made harder on purpose. A perfect score on a hard test usually means the test is broken, so I read the test data, line by line.",
      },
      {
        t: "p",
        s: "The answers were in it. I'd written each posting's description myself, and my notes to myself had come along for the ride: \"Non-AI control\", \"Edge case:\", and my favourite:",
      },
      { t: "exhibit", before: "", marked: "Judge must catch this", pen: "underline", scribble: "that's my handwriting" },
      {
        t: "p",
        s: "The judge wasn't judging the posting. It was reading my note and agreeing with me.",
      },
      { t: "h2", s: "9 out of 11" },
      {
        t: "p",
        s: "I cut 31 sentences that were my notes rather than the advert's, and ran the same judge on the same 72. It caught 9 of the 11 fakes, still with no false alarms. The two that got through were a Director of Partnerships at a legal AI company, and an \"AI trainer\" gig that is really piecework. Both sit right on the line.",
      },
      {
        t: "p",
        s: "9 is lower, and closer to the truth. 11 was my test grading its own crib notes.",
      },
      {
        t: "p",
        s: "So now the answer goes in the label and nowhere else. And if your AI aces your own test, read the test before you believe the score.",
      },
      {
        t: "p",
        s: "My own answer key caught me out in the drawing test too, the other way round: in [Marking the AI's homework](/writing/marking-the-ais-homework), two of my labels were wrong and the AI was right. The answer key needs marking as well.",
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

/** Every post, newest first: the order of the writing index, the home page list and llms.txt. */
export const NEWEST_FIRST: Post[] = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));

const LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** A post's date as every page and markdown copy shows it: "14 June 2026", or with its label, "Marked 26 Sep 2026".
    Built by hand: en-GB's short month for September is "Sept" in current ICU. */
export function postDate(p: Post): string {
  const [y, m, d] = p.date.split("-").map(Number);
  return p.dateLabel ? `${p.dateLabel} ${d} ${SHORT[m - 1]} ${y}` : `${d} ${LONG[m - 1]} ${y}`;
}
