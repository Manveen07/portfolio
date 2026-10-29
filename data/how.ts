// The page /how-i-build: how Manveen builds and tests GTM systems. Written 29 Oct 2026 (tracker 2026-10-29/t64).
// Manveen, 29 Oct: "I want to have a complete way to showcase my skills in a way that is not a wall of text or
// jargon", "We want to showcase our skills and how good we are at Clay and everything", "not cocky".
//
// Rules for every string here:
// - The day job is described in plain words only. Never the employer's name or any client's, no code, prompts,
//   workflow exports, IDs or screenshots. tests/how.test.mjs fails the build if a name slips in.
// - Day-job numbers come only from the resume (new 10x engineer\money\applications\resume\SOURCES.md), the
//   Claygent story's numbers from the Loom transcript he recorded (money\applications\frontier-clay-ops\
//   LOOM-TRANSCRIPT.md), his own projects' numbers from money\upwork\CAN-CLAIM.md and this site.
// - No dashes, no superlatives ("expert", "world-class", "10x"), inline syntax as in components/Prose.tsx:
//   **bold** and [text](url). A link to a page on this site starts with "/".

export const HOW = {
  title: "How I build GTM systems",
  // The niche line. Three drafts, a Hormozi view (picked B for naming Clay) and a fresh hiring-manager reader
  // (picked A, edited to this). Record and alternatives: new 10x engineer\money\applications\PITCH.md.
  // 29 Oct, later: the merged line (A's "tested like software", B's "act on what they can prove, hold the rest").
  headline: "GTM engineer. My workflows act on what they can prove, hold the rest for a person, and get tested like software before they touch a real lead.",
} as const;


// ── Three failures, each: what broke, how I found it, how I proved the fix, what it changed ──
export type Story = {
  id: string;
  title: string;
  /** The result in one line: what shows before the reader opens the story. */
  result: string;
  broke: string;
  found: string;
  tested: string;
  changed: string;
};

export const FAILURES: { intro: string; stories: Story[] } = {
  intro: "Each one: what broke, how I found it, and how I proved the fix before it went live. Open any of them.",
  stories: [
    {
      // LOOM-TRANSCRIPT.md slides 3 to 7; resume bullet 2 and SOURCES.md (24,506 sent to Claygent, 17,056 fits).
      id: "claygent",
      title: "A Claygent fit check kept rejecting the companies we wanted",
      result: "4 of 4 good companies rejected. After the rewrite, on 30 companies it had never seen: none lost.",
      broke:
        "Before we pay to find anyone's email, Claygent (Clay's AI step that reads a company's website) decides if the company's a fit. It runs in our lead finder, the daily job that finds new people for each client. For one segment, systems integrators, it kept saying no to exactly the companies we wanted. And every answer looked reasonable, because each yes quoted the company's own site.",
      found:
        "Before the big run on the whole market, I hand-labelled 25 companies and ran it on them. It threw out all four good ones: an engineering firm that sets up factory control systems, a business-software partner, and a distributor that builds its own control panels. They all do the work. None of them call themselves integrators. So I read every row where Claygent and I disagreed. The prompt was a rulebook: yes if the site says this, no if it says that. Claygent followed it to the letter, so the website's wording decided the answer, not the business. Reading wasn't the problem. The rules were.",
      tested:
        "I rewrote it as a briefing, the way you'd brief a new SDR: what we look for, good signs, the usual not-a-fit cases, past calls as examples. Five hard rules stayed, like quote their own site for every yes. First question: does it still throw out good companies? On the same 25 (the set I tuned it on, so it had better) it agreed 25 of 25 with no good company lost. The real test was 30 companies it had never seen: also 100%, none lost. Then it still had to clear the gate: 80% agreement with my labels, at most 20% sent to a person for review, and 90% of yeses backed by a quote.",
      changed:
        "Only then did the big run start: it checked 24,506 companies, and 17,056 passed. In the daily runs, a yes whose quote a script can't find on the saved page goes to a person. The prompt's a shared template now: one file for what's common, each segment adds its own question and edge cases, and a script builds all five prompts. Fix it once, fixed everywhere. The same check runs every day on each new company the lead finder brings in.",
    },
    {
      // SOURCES.md last row: A/B on 2,376 past emails, 77 more accepted, 0 earlier passes lost; 70 of 123 unique
      // refusals pass after the fix (0 of 154 before). The rules in plain words, from the identity audit (gtm, read
      // for accuracy only; nothing copied).
      id: "identity",
      title: "The email identity check was refusing real people's emails",
      result: "Old and new checks replayed on 2,376 past emails: the new one accepted 77 more and lost none.",
      broke:
        "When a provider hands back an email, a check asks: is this really the same person, at the same company? It was rejecting real people: folks who go by a short version of their name, put their department in their address, or work somewhere whose parent company owns the mail domain. And every wrong rejection costs twice: you throw away a result you paid for, then pay the next provider to look again.",
      found:
        "I pulled every email it had refused in past runs, 154 of them (123 distinct addresses), and ran them back through: zero passed. Read in a row, a lot were obviously the right person, and the same few patterns kept showing up.",
      tested:
        "One rule per pattern, each one writing down why it let a match through: short names, a department tag, the spelling on the person's LinkedIn, website evidence that two domains are one company. Then two checks before switching anything. On the refusals I'd pulled, 70 of the 123 distinct addresses now pass, each with its reason, and 53 stay refused. On all 2,376 past provider emails, a wider set, I ran old and new side by side: the new one accepted 77 more and didn't lose a single old pass.",
      changed:
        "It still doesn't guess. If no website shows that two domains belong together, the email stays refused. An uncertain match gets held back, not sent.",
    },
    {
      // Resume bullet 4 and SOURCES.md rows: 505,461 sends; Mimecast 5.1%, Barracuda 2.4%, Google 0.5%; 28% cut of
      // 34,044; 2,800+ skipped in the first 9 days; bounces on his lists 2.7% to 0.7%, unscreened lists 2.1%
      // (caveat in SOURCES.md: not all of the drop is the screen, so "after", never "because").
      id: "bounces",
      title: "Some mail servers bounced our emails, however good the address",
      result: "505,461 sends grouped by mail server. Bounces on the lists I built fell from 2.7% to 0.7% after.",
      broke:
        "Some campaigns were bouncing way too much, even with verified addresses. When I actually read the bounce messages, a lot of them were the company's security gateway turning us away. The address was fine.",
      found:
        "So I split 505,461 of our sends by the receiving company's mail server. Mimecast domains bounced 5.1%. Barracuda 2.4%. Google 0.5%.",
      tested:
        "Now a DNS check (a free lookup of which mail server a company uses) runs before any paid email lookup and skips the servers that bounce. The order's pinned in tests, because a company can put a security gateway in front of its Microsoft mail, and then the gateway is the one that decides. On the 34,044-company market it cut 28% before a single credit was spent, and in the first 9 days of daily runs it skipped 2,800+ people before a paid lookup. It's a trade-off: most mail to those servers still lands, but bounces put the sending domains at risk, so skipping is the default and each client's list of allowed servers can change it.",
      changed:
        "Bounces on the lists I built went from 2.7% (8,649 leads) to 0.7% (2,047 leads) after the check went in, while lists loaded without it stayed at 2.1%. Not all of that drop is this one check, so I say after, not because.",
    },
  ],
};

// ── How I test: one line each, a link where there is something public ──
// 1: LOOM-TRANSCRIPT.md (25 hand labels, 30 unseen; the gate). 2: SOURCES.md identity A/B. 3: CAN-CLAIM.md "His own
// build, testing" (149 tests, Ran 149 tests OK 24 Oct) and the public repo's README (45 tests, a stand-in).
// 4: the home page's Precise Leads card ("when someone spots a new kind of mistake, it becomes a check that runs before
// anything goes out") and SOURCES.md (95.5% supported, none contradicted, 300-email test set). 5: resume bullet 3
// ("per-provider caps and a spend ledger"). 6: things-ai-got-confidently-wrong, 11 Aug note; the home page bars.
export const TESTING = {
  intro: "The same habits on every workflow, whether it's Clay, n8n or plain Python.",
  items: [
    {
      lead: "Answer a small set by hand first.",
      text: "Before an AI step runs at scale, I label 25 to 30 real cases myself, score it against my answers, and write the go-live gate down before the run. [How I caught my own test cheating](/writing/schema-as-eval-spec)",
    },
    {
      lead: "Replay the past before switching.",
      text: "A new rule runs side by side with the old one on real history, like the 2,376 past emails above, and only replaces it if it loses nothing.",
    },
    {
      lead: "Test the workflow itself, like code.",
      text: "My own n8n task tracker has 149 automated tests: the JavaScript inside each n8n step is tested in Node exactly as n8n runs it, recorded Slack clicks are replayed against the webhook, and deploys run from a script. [The write-up](/writing/149-tests-for-a-few-slack-buttons), and [a public version with 45 tests](https://github.com/Manveen07/n8n-workflow-tests) you can run.",
    },
    {
      // From the gtm repo's tests and lessons (read 29 Oct for accuracy; no numbers or names taken).
      lead: "Turn every real incident into a test.",
      text: "The pipeline's 870+ tests are mostly real cases: replays of stored data, old-versus-new runs on past results, and a test for each mistake that reached a draft. One that paid off: a merge once matched rows by position and put email addresses on the wrong people. Now list QA blocks any list where one address sits on two people, and a test pins it.",
    },
    {
      lead: "Check every email before it goes out.",
      text: "Each one is checked claim by claim against the research behind it, and a fresh AI reader with no context reads it cold, as the prospect would. On a 300-email test set, 95.5% of the claims were supported and none contradicted; in live runs, a draft with a name or number the research doesn't back fails the gate. When someone spots a new kind of mistake, it becomes a check.",
    },
    {
      lead: "Cap the spend.",
      text: "Every paid provider has a cap and every lookup goes into a spend ledger, so a run stops and asks before it goes over.",
    },
    {
      lead: "Watch the run, not only the tests.",
      text: "My Tender Radar once passed 12 of 12 tests and still crashed every morning for three weeks, because no test opened the new files. Now its daily runs [sit on my home page](/#proof) as bars, red when one fails. They show this month's gap too: on nine mornings since 17 October a tender portal stopped answering, and the whole run stopped with it. On 29 October I made each source fail on its own, with tests; the next mornings show whether it holds. [The three-week story](/writing/things-ai-got-confidently-wrong)",
    },
  ],
} as const;

// ── The pipeline in plain words. What each step does and the check that stops bad output. ──
// From the gtm repo's step folders (read 29 Oct for accuracy only; no names, numbers or wording copied).
// `gate`: circled in red on the drawing.
export type Step = { name: string; what: string; check: string; gate?: true };

export const PIPELINE_STEPS: { intro: string; label: string; note: string; steps: Step[] } = {
  intro: "Twelve steps, each one a script or a Clay workflow with its own check. Circled steps are gates: nothing moves on until the check passes.",
  label:
    "The pipeline in twelve steps, in order: strategy, client context, find companies, qualify, research signals, find people, find emails, list QA, write copy, spintax, launch, follow-up. Qualify, find emails, list QA and launch are circled as gates.",
  note: "circled: a gate. Nothing moves on until its check passes.",
  steps: [
    { name: "strategy", what: "Picks the campaigns worth running from past reply data.", check: "Each test changes one thing, and the rule for the winner is written before the data comes in." },
    { name: "client context", what: "Writes down what the client sells, who to reach, and who to leave alone.", check: "A checker blocks a brief with open questions, a sender who isn't a real person, or no approval." },
    { name: "find companies", what: "Maps the market with Clay's search first, and pays only to fill measured gaps.", check: "Every new search is judged on a sample before it runs at scale; a search that finds too few fits is dropped." },
    { name: "qualify", what: "A free mail-server check first, then a Claygent fit check reads each company's own site.", check: "Every yes needs a quote that a script finds in the saved page, or it goes to review.", gate: true },
    { name: "research signals", what: "Finds a reason to write now: hiring, news, changes on the site.", check: "Right company, the exact words, a recent date; paid sources are capped." },
    { name: "find people", what: "Finds the decision makers at each company.", check: "A title needs both the right seniority and the right function, and people who've left are dropped." },
    { name: "find emails", what: "A waterfall of providers, cheapest first.", check: "The address must match the person at that company, and be verified.", gate: true },
    { name: "list QA", what: "Reads the whole list before anything uses it.", check: "Blocks duplicates, one address on two people, do-not-contact, recent contact and shared addresses like info@; a person reads a sample.", gate: true },
    { name: "write copy", what: "Writes emails that only say what the research found.", check: "Every name and number is traced to the research, and a blind reader must be able to say what's on offer." },
    { name: "spintax", what: "Wording variants, so no two sends read the same.", check: "Every combination is checked, and a separate judge drops any variant that changes the meaning." },
    { name: "launch", what: "Builds the campaign in the sending tool as a draft, never started by the script.", check: "Needs a passed list QA and every email rendered and read clean before upload.", gate: true },
    { name: "follow-up", what: "Drafts replies to the people who answer.", check: "The drafts are checked, and a person approves each one before it's sent." },
  ],
};

// ── Clay, in depth: SOURCES.md and resume bullets 1 to 3; LOOM-TRANSCRIPT.md (Audiences, webhooks, the template). ──
export const CLAY = {
  intro: "Clay is where most of this starts. What I build in it and around it, in plain words:",
  items: [
    "**31 Clay workflows across 3 accounts** run every day. Each finds new people for one of those accounts, writes them to Clay Audiences (Clay's saved lists) so nobody is found twice, and posts them to n8n by webhook.",
    "**Search before spend.** I mapped a 34,044-company market from Clay's search for 0 data credits, then qualified 24,506 of them with Claygent at about 0.18 credits each.",
    "**Claygent prompts as code.** A shared template, built by a script, scored against my own hand labels, and live only after it passes the gate.",
    "**Clay and n8n both ways.** Clay posts each new person to n8n for the daily job; n8n sends a company into Clay by webhook and gets its lookalikes back.",
    "**A cost-ordered email waterfall** with a cap per provider: the next provider runs only on a miss, and every address is verified.",
    // LOOM-TRANSCRIPT.md, the HubSpot line. Round A1: the page never mentioned a CRM. The gap is said plainly.
    "**The CRM side.** Reply events from the sending tool update HubSpot contact properties through n8n, like last reply date, campaign and lead category. I haven't run Salesforce in production yet.",
  ],
} as const;

// ── Visual-first version (29 Oct, later). Manveen: "i want it to be more visual people don't have that much intrest
// to read wall of text we want it to be easily consumable". Pictures and numbers carry the page; the words above are
// the captions' sources and sit behind "Read the story" / "How each gate works" clicks. Same sources as above.
// Voice, same day: "no that makes it human i want it edgey i don't want it to be safe make everything casual". So the
// captions talk like he does to a peer: short, contractions, honest about what was annoying. Facts unchanged.
export const VISUAL = {
  // Three big tiles under the niche line (SOURCES.md rows).
  tiles: [
    ["12,030", "verified emails for 15,514 decision makers (78%)"],
    ["34,044", "companies mapped in Clay, 0 data credits"],
    ["870+", "automated tests guarding the pipeline"],
  ] as [string, string][],
  pipelineCaption: "Built at my day job, an outbound agency, since November 2025.",
  stepsSummary: "What each step won't let through",
  heroLinks: [
    { label: "Hardest failure ↓", href: "#claygent" },
    { label: "45-test toy n8n repo ↗", href: "https://github.com/Manveen07/n8n-workflow-tests" },
  ],
  // Three tiles: what GTM teams ask for, and where the closest version runs (the PATTERNS words, cut to one line).
  patterns: [
    // Visual round 1: each tile carries its number and links to where it's shown. The Slack flow is a day-job build
    // (CAN-CLAIM.md, "Day-job n8n builds he may talk about"), so it says so; the link is labelled as his own tracker.
    { num: "0 lost", head: "Replay before switching", line: "+77 on 2,376 past emails; unsure ones stay refused.", href: "#identity", link: "the story ↓" },
    // Manveen, 29 Oct: "300 test emails; maybe a better number". His own freelance run instead (no employer data):
    // money/applications/key-outreach/pipeline/STATUS.md, "76 two-email sequences" (152 emails), "NoGood failed
    // grounding" and "Powills failed grounding", both fixed, "0 failed checks"; the checker matched a human on
    // "124 / 124" claims (cold-outbound-eval-public/eval/CALIBRATION-REPORT.md). Names stay off the page.
    { num: "152", head: "Receipts for every claim", line: "emails in a 50-agency work sample, every fact sourced. The check blocked 2 till I fixed them.", note: "My checker matched a human on 124 of 124 claims.", href: "#testing", link: "how I check ↓" },
    { num: "Approve first", head: "Fix it in Slack", line: "Day-job AI drafts wait in Slack for Send, Edit, Snooze or Stop.", href: "/writing/149-tests-for-a-few-slack-buttons", link: "my Slack button tests →" },
  ],
  // One picture and one caption per story; the full story stays in FAILURES behind a click.
  stories: {
    claygent: {
      head: "The hardest one: a fit check that said no to every good company",
      caption: "Caught on hand labels before the 24,506-company run. It graded website copy, not businesses.",
      // LOOM-TRANSCRIPT.md: "rejected all four of the good ones"; "Same 25 companies: 100% agreement, no good company
      // lost"; "Then 30 it had never seen: also 100%, none lost". How many of the 30 were good isn't published, so
      // the third row shows agreement, not good companies.
      rows: [
        // Visual round 3: the 4 good ones are inside the tuning set, so that row is greyed too; the unseen 30 is the result.
        // Visual round 1: one measure per comparison. Good companies kept, before and after (the same 25: "no good
        // company lost", so 4 of 4); then agreement, the tuning set greyed and labelled, the unseen 30 as the result.
        { label: "Good ones kept, before", n: 4, filled: 0, value: "0 of 4", kind: "bad" },
        { label: "Kept after (tuned set)", n: 4, filled: 4, value: "4 of 4", kind: "tuned" },
        { label: "Agrees, 30 it never saw", n: 30, filled: 30, value: "30 of 30, none lost", kind: "main" },
        { label: "Agrees, the 25 I tuned on", n: 25, filled: 25, value: "25 of 25", kind: "tuned" },
      ],
    },
    identity: {
      head: "The email check that kept rejecting real people",
      caption: "Replayed before switching. Still refuses what it can't explain.",
      // SOURCES.md: "A/B on 2,376 past emails", "77 more accepted, 0 earlier passes lost".
      tiles: [
        ["2,376", "past emails replayed"],
        ["+77", "more accepted"],
        ["0", "earlier passes lost"],
      ] as [string, string][],
    },
    bounces: {
      head: "Mail servers that bounce you anyway",
      caption: "505,461 sends by receiving server. Red ones are skipped before paid lookups.",
      // Resume bullet 4: "Mimecast 5.1%, Barracuda 2.4%, Google 0.5%". The scale runs to the largest value.
      bars: [
        { label: "Google", value: 0.5, skipped: false },
        { label: "Barracuda", value: 2.4, skipped: true },
        { label: "Mimecast", value: 5.1, skipped: true },
      ],
      // SOURCES.md: his leads before 16 Sep 2.74%, from 16 Sep 0.73%; a teammate's unscreened uploads 2.09% after.
      result: [
        { label: "My lists, before", value: 2.7, skipped: false },
        { label: "My lists, after", value: 0.7, skipped: false },
        { label: "Lists without the check", value: 2.1, skipped: false },
      ],
      after: "After, not because: not all of it is the check.",
    },
  },
  readStory: "How it actually went",
  // Section labels (the rail on wide screens).
  kickers: {
    patterns: "What GTM teams ask for",
    failures: "Three times it broke",
    testing: "Before it touches a real lead",
    clay: "Clay and friends",
    live: "Stuff you can actually click",
    contact: "Say hi",
  },
  // The gates a workflow passes before it touches a real lead, then what happens after (TESTING, cut to a line each).
  gates: [
    { head: "Label it by hand first", line: "25 to 30 real cases, by me", href: "/writing/schema-as-eval-spec" },
    { head: "Write the bar down", line: "before the run, not after" },
    { head: "Replay the past", line: "old vs new on real history" },
    { head: "Automated tests", line: "870+ on the pipeline, 149 on my n8n tracker", href: "/writing/149-tests-for-a-few-slack-buttons" },
    { head: "Claim check, fresh eyes", line: "every email vs its research" },
    { head: "Spend caps", line: "runs stop and ask first" },
  ],
  live: { head: "A real lead", line: "only now" },
  after: { head: "Then watch it", line: "Tender Radar: 9 red mornings in Oct, fixed 29 Oct.", href: "/#proof" },
  gatesSummary: "The long version",
  // Clay depth as tiles (CLAY above, cut to a line each).
  clay: [
    ["31", "Clay workflows, 3 accounts, daily, no dupes"],
    ["5", "Claygent prompts, one template, built by a script"],
    ["2-way", "Clay and n8n by webhook: people out, lookalikes back"],
    ["HubSpot", "reply events synced by n8n. Salesforce: not yet."],
  ] as [string, string][],
  clayDetails: "Nerd details",
  live_items: [
    { href: "https://github.com/Manveen07/tender-radar-showcase", label: "Tender Radar ↗", text: "UK tenders, sorted daily" },
    { href: "https://www.loom.com/share/ed073589208c4e24a7543ba30b9d24dc", label: "Its 5-minute video ↗", text: "Tender Radar running" },
    // Public, CI green, 60 tests (gh api + gh run list, 29 Oct). Built for the "hold uncertain matches" ask.
    { href: "https://github.com/Manveen07/champion-move-checker", label: "champion-move-checker ↗", text: "holds unsure matches. 60 tests, CI green." },
    { href: "https://github.com/Manveen07/n8n-workflow-tests", label: "n8n-workflow-tests ↗", text: "45 tests you can run" },
    { href: "/writing/schema-as-eval-spec", label: "The time my own eval cheated", text: "it scored 100%. It shouldn't have." },
  ],
  privacy: "Day-job code stays private; I'll demo it on a call.",
  ask: "Hiring? Let's talk.",
} as const;
