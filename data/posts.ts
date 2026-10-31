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
    // Written 25 Oct 2026 (Manveen: "create a good blog make sure it quirky and it is usefull as a social proff and
    // not boring for viewer"). Paths are under C:\Users\Manveen\Desktop\new_things_to_mess_araound\ ; D = daily-log.
    // Every number, and where it comes from:
    // - 149 tests, 59 / 28 / 20 / 25 / 17: `python3 -m unittest tests.test_n8n_js tests.test_n8n_workflows
    //   tests.test_n8n_replay tests.test_n8n_notify tests.test_n8n_deploy` in D, "Ran 149 tests ... OK", 24 Oct 2026;
    //   per file: `grep -c "def test_"` (js 59, workflows 28, replay 20, deploy 25, notify 17).
    // - 2 workflows, 37 nodes: D\n8n\workflows\tasks-clicks.json (15 nodes) and notify-manveen.json (22).
    // - Under a second, one new event file, wrong secret fails: D\docs\LEDGER.md runbook, "pass = 200, empty body,
    //   under 1 s, `events repo: <file> found`; with `--bad-sig`: not found".
    // - The five layers: the docstrings of D\tests\test_n8n_js.py, test_n8n_workflows.py, test_n8n_replay.py,
    //   test_n8n_deploy.py (test_an_error_that_echoes_a_secret_is_redacted, test_a_second_run_updates_by_name) and
    //   test_n8n_notify.py (test_the_page_shows_one_button_and_changes_nothing).
    // - The scheduler week: new 10x engineer\money\upwork\HARD-PARTS.md item 14, "an expired Gmail login once let runs
    //   report success for a week while sending nothing" (30 Sep to 6 Oct 2026); the message ID and health check fix.
    // - "emails to prospective clients": the scheduler sends his own outreach (CAN-CLAIM email scheduler line; ROADMAP-2026-10
    //   review-offer wave). No count of the emails lost is claimed.
    // - Slack's 3 seconds: docs.slack.dev/interactivity/handling-user-interaction, "reply to the HTTP POST request with
    //   an HTTP 200 OK response. This must be sent within 3 seconds of receiving the payload" (checked 25 Oct 2026).
    slug: "149-tests-for-a-few-slack-buttons",
    title: "149 tests for a few Slack buttons",
    cardTitle: "How I test an n8n workflow before it goes live",
    line: "My task tracker is a few Slack buttons and two n8n workflows. It has 149 tests, because of one week of green ticks.",
    date: "2026-10-25",
    readMins: 3,
    tags: ["n8n", "testing", "automation"],
    summary:
      "My task tracker is a few Slack buttons and two n8n workflows. It has 149 tests. That's because my email scheduler once said Success every day for a week and sent nothing.",
    body: [
      {
        t: "p",
        s: "My task tracker lives in Slack. Every task has buttons: done, snooze, blocked. A click goes to an n8n webhook, a web address n8n listens on, which checks the click really came from Slack, writes it to a GitHub repo and updates the card, all in under a second. Behind those buttons sit two n8n workflows with 37 nodes between them.",
      },
      {
        t: "p",
        s: "They have 149 tests. That's four tests a node, which sounds like a lot until you've had a week like the one below.",
      },
      { t: "h2", s: "A week of green ticks" },
      {
        t: "p",
        s: "My email scheduler is an n8n workflow too. For a week, every run ended like this:",
      },
      { t: "exhibit", before: "Status: ", marked: "Success", pen: "circle", scribble: "0 emails sent" },
      {
        t: "p",
        s: "A Gmail login had expired. Every node ran, so n8n was telling the truth. Nothing in the workflow treated \"no email went out\" as a failure, so for a week my emails to prospective clients just didn't go, and nobody noticed, including me.",
      },
      {
        t: "p",
        s: "Now an email only counts as sent when Gmail hands back a message ID and it's saved next to the row, and a health check counts the overdue ones. The tracker I built after that got tested like software, in five layers.",
      },
      { t: "h2", s: "1. The JavaScript doesn't live in n8n" },
      {
        t: "p",
        s: "n8n's Code node is a fine place to write code and a bad place to keep it. Mine lives in plain files, and the build pastes it into the workflow. **59 tests** run that exact code outside n8n first: a good Slack signature passes, a bad, missing or old one is refused, every button goes to the right action, and clicks from anyone but me are dropped.",
      },
      { t: "h2", s: "2. The workflow file gets checked too" },
      {
        t: "p",
        s: "**28 tests** read the workflow JSON as it sits in git: nodes in the right order, only node types I expect, and credentials referred to by name, never by value. One of them compares every Code node with what the build makes from the tested files, so the workflow can't quietly drift away from the code I tested.",
      },
      { t: "h2", s: "3. Real clicks, replayed" },
      {
        t: "p",
        s: "A script takes a recorded Slack click, signs it the way Slack does and fires it at the live webhook. A pass means the webhook answers OK in under a second and exactly one new event file lands in the repo. Slack gives a button 3 seconds to get an answer, so under one leaves room. The same click signed with the wrong secret has to fail, and the replay script has **20 tests** of its own.",
      },
      { t: "h2", s: "4. Deploys come from a script" },
      {
        t: "p",
        s: "One command creates or updates both workflows and their credentials. Run it twice and the second run updates by name, so there's never a \"My workflow (copy)\". Credentials come from a private settings file and are never printed, even when an error from the server tries to echo one back. **25 tests.**",
      },
      { t: "h2", s: "5. Email links a robot can't press" },
      {
        t: "p",
        s: "The tracker also emails me, and some of those emails have buttons. Email security scanners open links to check them before you do, so if opening a link did the thing, a robot would press every button. Each of my links is signed and opens a confirm page. Opening the page changes nothing; only its button writes the event. **17 tests.**",
      },
      { t: "exhibit", before: "GET /confirm → ", marked: "changes nothing", pen: "underline", scribble: "robots click links too" },
      { t: "h2", s: "What I'd steal from this" },
      {
        t: "ul",
        items: [
          "Keep Code-node JavaScript in files and test it outside n8n.",
          "Count a real result, a message ID or a written file, never the word \"Success\".",
          "Keep the workflow JSON in git and test it there.",
          "Make every link in an email safe to open.",
          "Deploy with a script you can run twice.",
        ],
      },
      {
        t: "p",
        s: "149 tests is a lot for a few buttons. It's still cheaper than another week of Success with nothing sent.",
      },
      {
        t: "p",
        s: "*Same lesson, other project:* in my post [Things AI got confidently wrong](/writing/things-ai-got-confidently-wrong), 12 tests passed while a morning run crashed for three weeks, because none of them opened the new files.",
      },
    ],
  },
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
    // - 31 Oct note, the two later leaks: new 10x engineer\ROADMAP-2026-10.md line 35, "Few-shots jd_046, jd_064 inside
    //   the 72 scored; judge_v2.py:90 and :136-139 show the judge the classifier's verdict". Title changed the same day
    //   (was "...and why the lower score is the one I trust"; Manveen: "i agree to 3").
    slug: "schema-as-eval-spec",
    title: "How I caught my own AI test cheating",
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
        s: "*Added 26 Sep:* my answer key caught me out in the drawing test too, the other way round: in [Marking the AI's homework](/writing/marking-the-ais-homework), two of my labels were wrong and the AI was right. The answer key needs marking as well.",
      },
      {
        t: "p",
        s: "*Added 31 Oct:* a later audit found two more leaks in the same test. Two of the worked examples I showed the judge were among the 72 it was scored on, and the judge could see the classifier's verdict before giving its own. So the 9 needs a re-run too, and I don't count it as clean yet. Same lesson, one level down: check what the model can see that a real input never would.",
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
