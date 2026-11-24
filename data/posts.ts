// Blog / writing content. Block-based so we render without any markdown dep.
// Inline syntax supported by the renderer: **bold**, `code`, *italic*, [text](url).

import { DRAWINGS, WRONG, NAMESAKE, type Pin } from "./portfolio";

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
export type PostComponent = "drawing-proof" | "confidently-wrong" | "champion-namesake";

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
    // Written 24 Nov 2026 (Manveen, ~01:00 IST: "once your are done we should write a detaied blog with public repo").
    // All synthetic data. Paths are under C:\Users\Manveen\Desktop\new_things_to_mess_araound\new 10x engineer\projects\
    // inbound-routing\ (R = README.md). Every number, and where it comes from (blog-claims.json in that folder holds
    // the exact quote for each, checked by money/upwork/tools/claims_check.py --strict-numbers):
    // - 300 leads, 134 decisions, 38 first touches, 36 deal outcomes, 214 / 66 / 54 / 16, 74% (167/225), 30 hours,
    //   2,858 HubSpot calls, the SQL recount, the planted record, 0 writes: R "Result, 24 Nov 2026 (feature 8)".
    // - Score bands 0-44 / 45-69 / 70+ (107/43/3/7%, 133/111/32/29%, 60/60/31/52%): funnel-report.html, "Conversion by
    //   score band". Fisher p < 0.001; win rate "not enough data", 70+ n=22, 0-44 n=2, need 10: R feature 8 info lines.
    // - 87 unit tests: R files table ("node --test runs all six test files: 87"); re-run 24 Nov, 87 pass.
    // - 7 queues, score 0-100 (fit 60, intent 40), SLAs 1 h / 1 h / 4 h / 24 h / 48 h, routing_reason, upsert by email:
    //   RULES.md "Queues", "Score", "Rules a real CRM forces on you".
    // - 35 company records for 17 domains, company first, oldest record, company_matches: RULES.md; 20 leads posted
    //   twice: R "Result, 22 Nov 2026" (40 posts). The same-second race merged by the hygiene run: R feature 7.
    // - Blind review 18 of 20, 19 of 20 after the L13 fix, AI labels: R "Blind review of the routing"; L13 is Chloe,
    //   office manager, 40 staff (leads.csv); L08 is a student (thesis).
    // - Watchdog +5 h: 12 escalated, 3 not, second run 0 new: R feature 5. Speed to lead from task creation: RULES.md.
    // - Recycle +90 / +180 days, closed lost: RULES.md "Rep decisions". Lifecycle vs decision field: R feature 6.
    // - 44 companies, "the oldest 100", same hour, restored 44/44, two-layer fix, unit test: R feature 7 and RULES.md.
    //   Reset guard and the gmail lead: R feature 8. Archive restorable 90 days: RULES.md "Data hygiene".
    // - Live checks 13/13, 13/13, 15/15, 20/20, 15/15; 300/300 routed = offline: R per feature.
    // - Limits (100 per run, 1,000 leads, wall-clock SLA, one shared key, failure alerts next): R "Known limits", PLAN.md.
    // Repo link: the public copy Manveen asked for, github.com/Manveen07/hubspot-n8n-inbound-crm.
    slug: "an-inbound-crm-on-hubspot-and-n8n",
    title: "Inbound routing, SLAs and hygiene on HubSpot and n8n, tested with 300 made-up leads",
    cardTitle: "Inbound lead routing I built on HubSpot and n8n",
    line: "Routing, SLAs, rep handoff, nightly cleanup and a funnel report, tested live with 300 made-up leads.",
    date: "2026-11-24",
    readMins: 7,
    tags: ["hubspot", "n8n", "revops"],
    summary:
      "I built inbound lead handling on top of HubSpot with n8n and tested it on synthetic data: 300 made-up leads and simulated rep decisions, sent through the live workflows. The weekly report counted 214 leads that reached a sales queue, 66 that a rep accepted, 54 deals and 16 won.",
    body: [
      {
        t: "p",
        s: "Everything here is built on made-up data, in a free HubSpot portal and a self-hosted n8n. None of it has run in production. It has 87 unit tests, and every feature was tested live before the next one started. The most useful lesson came from a mistake: scope every batch job by a filter that names your own records, never by \"first N\".",
      },
      { t: "h2", s: "What an inbound CRM has to get right" },
      {
        t: "p",
        s: "A form lead has to reach the right person fast, with a reason they can read, and without a second copy of the contact or company. Later, the data has to be clean enough to report on.",
      },
      {
        t: "table",
        head: ["What it has to do", "What I built", "Live test"],
        rows: [
          ["Scoring and routing", "A 0-100 score, 7 queues, one owner per company", "300 of 300 leads routed live the same as the offline rules"],
          ["Attribution", "First and last touch from UTM tags, cleaned", "13 of 13 checks"],
          ["Speed to lead", "A watchdog that escalates late follow-ups", "13 of 13 checks"],
          ["Lead handoff", "Rep accept or reject, with a required reason", "15 of 15 checks"],
          ["Data hygiene", "A nightly cleanup job and a data dictionary", "20 of 20 checks"],
          ["Reporting", "A weekly funnel report", "15 of 15 checks, equal to a separate SQL recount"],
        ],
      },
      { t: "h2", s: "How it works" },
      {
        t: "p",
        s: "**Routing.** A form posts to an n8n webhook. It scores the lead from 0 to 100: up to 60 for fit (size, seniority, title) and up to 40 for intent (which form, plus a buying signal like \"budget\"). Then a fixed list of checks picks the queue, and the first match wins.",
      },
      {
        t: "p",
        s: "The 7 queues are enterprise, mid-market and SMB AE (account executive, the rep who sells), SDR (the rep who qualifies first), partnerships, nurture and disqualified. The score only sets the task's priority. Every routed contact gets a `routing_reason`, so a rep can see why the lead landed with them.",
      },
      {
        t: "p",
        s: "Each queue with a person behind it gets a first follow-up task, due by the queue's SLA (service-level agreement: here, how fast someone must make first contact). That's 1 hour for enterprise and mid-market, 4 for SMB, 24 for SDR and 48 for partnerships. AE leads also open a deal, and a repeat form opens no second task or deal.",
      },
      {
        t: "p",
        s: "**Attribution.** UTM tags are the parameters on a link that say where a click came from, like `utm_source=google`. Each contact keeps a first touch, the channel that first brought them in, written once and never overwritten, and a last touch, rewritten on every form. Messy values are cleaned into a short list, so `fb` becomes `meta`.",
      },
      {
        t: "p",
        s: "A CSV import skips that cleaning, so a weekly count of values outside the list should be 0. It's a cheap check for any CRM.",
      },
      {
        t: "p",
        s: "**SLA watchdog.** A second workflow raises each overdue follow-up task to high priority once, and records speed to lead: minutes from the form to the completed task. A test run can move its clock forward. At 5 hours ahead, the 12 tasks with a 1 or 4 hour SLA escalated, the 3 with 24 or 48 hours didn't, and a second run changed nothing.",
      },
      {
        t: "p",
        s: "Measure speed to lead from the task's creation time. A months-old contact who fills in a new form adds months if you use the contact's create date.",
      },
      {
        t: "p",
        s: "**Rep accept or reject.** A reject needs a reason from a fixed list, and the reason decides where the lead goes. Not the buyer goes back to the SDR. Bad timing goes to nurture with a recycle date 90 days out, no budget or too small with 180 days, and spam is disqualified. An open deal on a rejected lead is closed lost with the reason.",
      },
      {
        t: "p",
        s: "Lifecycle stage can't tell you whether a rep accepted a lead. HubSpot's default setting moves a contact to \"opportunity\" as soon as a deal is linked, and my first live check of this feature failed on exactly that. Count handoffs with a decision field.",
      },
      {
        t: "p",
        s: "**Nightly hygiene.** A cleanup job maps job titles to seniority and function, turns country names into ISO codes (\"United Kingdom\" becomes GB) and merges duplicate companies. It also moves nurture leads to SDR on their recycle date and counts missing fields. It writes only what differs, so a second run straight after makes 0 changes.",
      },
      {
        t: "p",
        s: "Merges keep the oldest company and archive the copies, since archived records stay restorable for 90 days and HubSpot's own merge can't be undone. A data dictionary lists every custom field and what broken looks like.",
      },
      {
        t: "p",
        s: "**Funnel report.** A weekly, read-only report. Its numbers are further down.",
      },
      {
        t: "p",
        s: "The webhooks need a shared-secret header: without it, a request gets a 401 and nothing is written. The watchdog, the cleanup job and the report have schedules, all switched off on purpose. Switched on, the first two would edit HubSpot with nobody watching.",
      },
      { t: "h2", s: "HubSpot made two of every company" },
      {
        t: "p",
        s: "The first live run posted 20 made-up leads to the webhook, twice. It failed one check: 35 company records for 17 domains. HubSpot has a default setting that creates a company for every new email domain the moment a contact is saved. My workflow saved the contact first and then made its own company, so every domain got two.",
      },
      {
        t: "p",
        s: "The fix was to write the company first, so HubSpot links the contact to it. The lookup also takes the oldest record for a domain and returns `company_matches`, how many it found, so a duplicate shows up in every response.",
      },
      {
        t: "p",
        s: "If that auto-create setting is on in your portal, write companies first. If your automation owns companies, switch the setting off. One case is still open: two people from a brand-new company who submit in the same second can each make a company. That happened in a later live test, and the nightly job merged the pair.",
      },
      { t: "h2", s: "A reviewer who never saw my rules" },
      {
        t: "p",
        s: "To test the rules, a fresh AI reviewer that had never seen them or the code routed the same 20 leads, from the lead table and a one-line meaning per queue. The rules agreed with it on 18 of 20. These are AI labels, not hand labels.",
      },
      {
        t: "p",
        s: "The first miss was an office manager at a 40-person company whose message said her boss asked her to find out more. My rules sent her to nurture, and the reviewer said SDR. The reviewer was right: someone gathering facts for a decision-maker should hear from a person. I added a check that sends that case to the SDR, never to an AE, and agreement went to 19 of 20.",
      },
      {
        t: "p",
        s: "The second was a student writing a thesis. The reviewer disqualified him and my rules put him in nurture. I kept mine on purpose: nurture opens no task, so it costs nothing, and students become buyers.",
      },
      { t: "h2", s: "My cleanup job edited 44 companies it shouldn't have" },
      {
        t: "p",
        s: "The first live run of the nightly job went wrong. To find duplicate companies, it read the oldest 100 companies in the portal. My test portal also holds more than 100 companies from outside this project. So the demo companies fell outside the batch, the job found 0 duplicates, and it changed the country on 44 of those other companies from \"United States\" to \"US\".",
      },
      {
        t: "p",
        s: "I put all 44 back to their exact old values the same hour and read each one back. Then I fixed it in two layers. The job now looks only at companies linked to contacts the routing touched, plus their same-domain copies. And the planning step refuses to write any company outside example.com, with a unit test that plants a non-demo company and checks it's left alone.",
      },
      {
        t: "p",
        s: "Scoping by a filter is the first guard. A second one sits at the write, so a bad read can't become a bad write. My reset job got the same treatment: it stops before archiving anything if a search returns a record that isn't on its list. After a rewrite, its first run did stop, over one made-up lead with a gmail address, and nothing was archived.",
      },
      { t: "h2", s: "The funnel, and does the score work?" },
      {
        t: "p",
        s: "300 synthetic leads went through the live routing webhook, then 134 simulated rep decisions through the live decision webhook. 38 completed follow-ups and 36 closed deals went in through test-only inputs on the watchdog and report workflows.",
      },
      {
        t: "p",
        s: "Here an MQL (marketing-qualified lead) is a lead that reached a sales queue, AE or SDR, and an SQL (sales-qualified lead) is one a rep accepted. The run counted 300 leads, 214 MQLs, 66 SQLs, 54 deals and 16 won. 74% of first follow-up tasks were done inside their SLA (167 of 225 with a result, partnership tasks included). The misses are tasks left open, because the report's clock was set 30 hours after the last lead.",
      },
      {
        t: "p",
        s: "The question I most wanted answered was whether the lead score predicts anything.",
      },
      {
        t: "table",
        head: ["Score band", "Leads", "MQL", "SQL", "Accepted"],
        rows: [
          ["0-44", "107", "43", "3", "7%"],
          ["45-69", "133", "111", "32", "29%"],
          ["70+", "60", "60", "31", "52%"],
        ],
      },
      {
        t: "p",
        s: "For rep acceptance, yes on this data: 52% of 70+ MQLs were accepted against 7% in the 0-44 band, and a one-sided Fisher exact test gives p < 0.001. For win rate the report says \"not enough data\". The bottom band closed only 2 deals, and the report wants 10 in each band before it gives a p-value, so a small sample can't produce a confident answer.",
      },
      {
        t: "p",
        s: "There's a caveat. I made the simulated reps likelier to accept high scores. So this shows the report can detect an effect when there is one, and says nothing about whether this score works on real leads.",
      },
      {
        t: "p",
        s: "To check the report itself, I wrote an independent recount in SQL from the generator's ground truth, and the numbers matched. A planted non-demo record was left out, a second run gave identical numbers, and the report made 0 writes. The whole run took 2,858 HubSpot API calls.",
      },
      { t: "h2", s: "What it doesn't do" },
      {
        t: "ul",
        items: [
          "It has only seen made-up data, on a free portal with one user, so queues are a field, not separate reps.",
          "SLA hours are wall-clock, so nights and weekends count.",
          "The webhook key is one shared secret, and a browser form can't hide it. A real site would post through its own server.",
          "The cleanup job reads at most 100 contacts and 100 companies per run, and says so when it hits the cap.",
          "Failure alerts are the next feature, and they aren't built yet.",
        ],
      },
      { t: "h2", s: "The code" },
      {
        t: "p",
        s: "The workflows, the rules and the tests are public: [github.com/Manveen07/hubspot-n8n-inbound-crm](https://github.com/Manveen07/hubspot-n8n-inbound-crm).",
      },
    ],
  },
  {
    // Written 3 Nov 2026: option 3 of his animation mockups that day ("other can be in their respected blogs"), the
    // write-up his public repo champion-move-checker didn't have on the site. Its words and their sources are
    // NAMESAKE in data/portfolio.ts (the repo's README at commit c7ac598fc568).
    slug: "a-champion-tracker-that-can-say-it-isnt-sure",
    title: NAMESAKE.title,
    date: "2026-11-03",
    readMins: 3,
    tags: ["python", "testing", "gtm"],
    summary: NAMESAKE.lede,
    body: { component: "champion-namesake" },
  },
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
    // Round 4 (2 Nov): two round 3 readers flagged "Things AI got confidently wrong" as AI-sounding. The lists say how
    // many: the post pins exactly four, dated 25 May, 7 Jul, 11 Aug and 19 Sep (tests/site.test.mjs holds the count).
    // The post's own title stays.
    cardTitle: "Four AI mistakes I caught",
    // Its line under this title on the home page. Until 2 Nov the lede's second sentence ("Each one came back sounding
    // sure of itself, and each one changed what I check."), which a round 1 reader flagged as AI-sounding; now one of
    // the post's own notes (11 Aug, "12 of 12, and down for three weeks"), in the words /how-i-build uses for it.
    line: "Tender Radar passed 12 of 12 tests and still crashed every morning for three weeks.",
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
