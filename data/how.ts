// The page /how-i-build, rewritten 2 Nov 2026 (design: the 2 Nov design doc, kept outside this public repo because
// it names private folders).
// Manveen, 2 Nov: "i want this page to be able to show how we work and we are some other gtm or some person that uses
// claude i want to be able to show our edge and make sure tis page is easily undersatnble and helps us in building
// social proof"; "make sure it has my personality and it;s visual and they undersatnd our ai edge and stand out";
// "they understand my skills".
//
// Rules for every string here:
// - The day job is described in plain words only. Never the employer's name or any client's, no code, prompts,
//   workflow exports, IDs or screenshots. tests/how.test.mjs fails the build if a name or an internal path slips in.
// - Every number has a row in his private claims table (outside this public repo) and passes claims_check.py
//   --strict-numbers on the whole markdown copy before it ships. Comments name the row ("SOURCES.md row 34"), never a
//   private folder.
// - A habit is told as one past event, never as "when X, I always Y": two Claygent segments ran with a failed gate.
// - No dashes, no superlatives, no bold inside prose. Inline links as [text](url); a link on this site starts with "/".
//
// Word budget (decision 2, 2 Nov): the design measured about 864 visible words and its section 15 gives a cut order for
// about 700. Manveen's main ask is "easily undersatnble", so all six steps are applied, keeping every skills gap and
// every caveat the design's section 12.3 requires: (1) the email story moved into the skills click, with a skill row
// of its own; (2) the habit's eyebrow folded into its heading; (3) the hero links went; (4) Tender Radar's line got
// shorter; (5) the level pills went; (6) the drawings habit is on the home page only (its card is there).
//
// 2 Nov, after five reviews (hiring manager, Karpathy, Hormozi, truth, voice): truth fixes first, then what a
// 30-second reader can't parse, then his voice. To stay near the budget with the longer truth lines: the sub line's
// tool list gave way to the 82-step line (so the skills row says only the 40), the agents section's "I haven't graded
// the drafts yet" lives in the skills row only, and the privacy line lost its call offer (Say hi has one).

export const HOW = {
  title: "How I build GTM systems",
  // 2 Nov: the h1 names the AI edge; the held-list card under it is the one past miss that proves it. It holds only
  // because the sub line says plainly, on the same screen, that 40 of the 82 AI steps he built have no test (the eval
  // inventory, 31 Oct, its count line). Review (Karpathy): the h1 was contradicted a screen later and limited three
  // screens later; review (Hormozi): a tool list is the "person that uses claude" line. The tools are named below
  // (Claude Code in the agents section, Clay, n8n and Python in the skill rows); New Delhi is in Say hi.
  // 2 Nov (his call, "we want to have our ai edge"): the line stays under the h1, said as a measurement he made
  // ("I counted": the inventory ran on 31 Oct).
  headline: "I build AI agents for outbound and measure what they get wrong.",
  sub: "GTM engineer at an outbound agency since November 2025. I counted my 82 AI steps: 11 have a solid test, 31 a partial one, 40 none yet.",
} as const;

// ── Me and my agents: what runs each day, where a person approves ──
// SOURCES.md row 33 and the day-job follow-up step (line 13: "daily 09:00 IST since 16 Oct"). Never "every morning"
// (one run folder, 19 Oct, is missing), never "I approve" or the approver's name, never Slack buttons or cards (none
// since 26 Oct), no quality claim: the drafts have no graded test yet, and the page says so.
// Step 6 (review, 2 Nov): email goes out through the sending tool after the approval, and LinkedIn through a
// computer-use agent from the approval sheet, so the person never sends by hand. It sits in the lower row after the
// gate, and its name says who sends.
export type AgentStep = { name: string; lane: "agents" | "person" | "tool"; gate?: true };

export const AGENTS: { label: string; note: string; lanes: { agents: string; person: string }; steps: AgentStep[]; lines: [string, string] } = {
  label:
    "How the follow-up agents work, in order. Agents: 1 a lead replies with interest, 2 the agent reads the thread, 3 it drafts the next message, 4 a rule check runs. A person: 5 edits and approves each draft, circled in red as the gate. 6 Then the sending tool sends it.",
  // His own words for how he works (voice notes, line 18): "i ike to check first asess what happend and then come up
  // with plans and i put gaurdrails so same thing does not happen twice".
  note: "check first, then a guardrail so it doesn't happen twice",
  lanes: { agents: "agents", person: "a person" },
  steps: [
    { name: "positive reply", lane: "agents" },
    { name: "reads thread", lane: "agents" },
    { name: "drafts reply", lane: "agents" },
    { name: "rule check", lane: "agents" },
    { name: "edits, approves", lane: "person", gate: true },
    { name: "sent by the tool", lane: "tool" },
  ],
  lines: [
    "Since 16 Oct my Claude Code agents have run daily, drafting follow-ups to leads who replied with interest to our outbound.",
    // "I haven't graded the drafts yet" is the AI agents skill row's gap, and the sub line says 40 steps have no test.
    "A person edits and approves each draft before it sends.",
  ],
};

// ── Habits, with receipts: two of his own public projects, scored on his own labels ──
// The eval inventory (31 Oct) line 10 names the leadlens labels as his; SOURCES.md row 26 records his 1 Nov yes that
// the drawing-proof labels are his. leadlens: "needs a re-run", never clean; "two more", never "2 more"; "posts",
// never "real job posts". drawing-proof: "labelled before its first run", never "held-out" or "test set"; the 7 are
// real text in the wrong box, never "invented". champion-move-checker is rules code with AI-written labels, so it sits
// in the Python skill row, not here.
export type Habit = {
  id: string;
  /** Where it comes from, in small mono above the heading (folded into the heading for now: cut 2). */
  eyebrow?: string;
  head: string;
  exhibit: { struck?: string; circled: string; rest?: string };
  cap: string;
  checked: string;
  link: { href: string; label: string };
};

export const HABITS: Habit[] = [
  {
    id: "habit-perfect-score",
    // Review (2 Nov): "my fake AI job judge" read as a fake judge, and the caption never said why 11 of 11 was
    // suspicious. The heading is the eyebrow's own words; the caption's first line is his, from the post.
    head: "A perfect score from my AI judge for fake AI job posts made me suspicious",
    exhibit: { struck: "11 of 11 caught", circled: "9 of 11", rest: ", needs a re-run" },
    cap: "My own notes in the test data were giving it the answers. With them cut, no false alarms on the same 72 posts. A later audit found two more leaks.",
    checked: "checked against: my labels",
    link: { href: "/writing/schema-as-eval-spec", label: "The write-up ↗" },
  },
  // Cut 6 (2 Nov): the drawing-proof row ("7 wrong of 419 values, 23 drawings", labelled before its first run) is on the
  // home page as its proof card, and its correction stays in the log below.
];

// ── Three failures, each: what broke, how I found it, how I proved the fix, what it changed ──
export type Story = {
  id: string;
  broke: string;
  found: string;
  tested: string;
  changed: string;
};

// Cut 1 (2 Nov): the email identity story moved into the skills click (EMAILS below), so two stories show here.
export const FAILURES: { stories: Story[] } = {
  stories: [
    {
      // His recorded walkthrough of the fix (slides 3 to 7); SOURCES.md rows 13 and 14 (24,506 sent to Claygent, 16,728
      // of them passed; never beside 17,056, which includes 328 added later from another provider). The eval
      // inventory (31 Oct) sections 1, 3 and 5: only 10 of the 25 tuning rows carry his labels, and the 30 he
      // labelled himself were labelled after reading the model's answers. Segments 2 and 3 missed the quote bar (87.5%
      // and 78.6%) and still ran, because the production run never checked the gate's exit code.
      // Review (2 Nov, Karpathy and truth): the final prompt's answers were scored three times with identical counts and
      // credits, and on the first scoring no segment cleared both sets; 1, 4 and 5 cleared only after borderline labels
      // became toss-ups (the gold files' "toss-up, flipped between rounds"). The written bar has a fourth check, no good
      // company lost (the gate is "pass and not lost"). Calibration agreement partly used a cheap AI judge's key, so the
      // bar says "the labels". Segment 5's 30 later rows: all 18 good kept, 27 of the 29 it decided matched on the first
      // scoring (the other two now toss-ups). The quote-in-saved-page check and the routing to a person were another
      // route's (the API fit check), not Claygent's: cut. "Fix it once, fixed everywhere" was a slogan: cut.
      // 2 Nov: "Reading wasn't the problem. The rules were." is a staged contrast; the design swaps it for one line.
      // 2 Nov: the lead finder didn't run every day (two killed runs, one paused task), so "every day" is out.
      id: "claygent",
      broke:
        "Before we pay to find anyone's email, Claygent decides if the company's a fit. It ran in our lead finder, the job that found new people for each client. For one segment, systems integrators, it kept saying no to exactly the companies we wanted. It could read the sites fine, since every yes quoted the company's own site.",
      found:
        "Before the big run on the whole market, I tested it on 25 companies. It threw out four good ones I'd labelled by hand: an engineering firm that sets up factory control systems, two business-software partners, and a distributor that builds its own control panels. They all do the work. None of them call themselves integrators. So I read every row where Claygent and I disagreed. The prompt was a rulebook: yes if the site says this, no if it says that. Claygent followed it to the letter, so the website's wording decided the answer, not the business. The prompt's rules were the problem.",
      tested:
        "I rewrote it as a briefing, the way you'd brief a new SDR: what we look for, good signs, the usual not-a-fit cases, past calls as examples. Five hard rules stayed, like quote their own site for every yes. First question: does it still throw out good companies? On the 25 I tuned it on, it kept all four (it had better), but it said no to one more I'd marked good, a borderline one. Then 30 more companies, every one labelled by me: it kept all 18 good ones and matched my labels on 27 of the 29 it decided. I labelled those 30 after reading its answers, though, so it isn't a blind test; the next one gets labelled before it runs. The bar I'd written down: no good company thrown out, 80% agreement with the labels, at most 20% sent to a person for review, and 90% of yeses backed by a quote. This segment, like two others, only cleared it after I changed borderline companies' labels to toss-ups, with the same answers from the model, so I don't count those passes as proof.",
      changed:
        "Then the big run, across five segments: it checked 24,506 companies, and 16,728 passed. Not every segment had passed its bar. Two ran with one check short (quotes behind 87.5% and 78.6% of yeses, under the 90% bar), because nothing in the run stopped on a failed gate. Making it stop is the next fix. The same check ran on new companies the lead finder brought in. The prompt's a shared template now: one file for what's common, each segment adds its own question and edge cases, and a script builds all five prompts, so a fix to the shared file reaches every segment.",
    },
    {
      // SOURCES.md rows 11, 12, 21, 22 and 31: 505,461 of the agency's sends; Mimecast 5.1%, Barracuda 2.4%, Google 0.5%
      // (one decimal, as row 21 writes them); 28% of 34,044 cut; 2,800+ skipped in the first 9 days. Row 31: his leads
      // 2.74% of 8,649 before 16 Sep, 0.73% of 2,047 after; a teammate's lists loaded without the screen 2.26% then
      // 2.09%; with gateway leads out of both periods his 1.31% then 0.49%. So "after", never "because".
      // Review (2 Nov, truth): the hard blocks win over any client list (the mail-server check's own policy); a client's
      // list of allowed servers decides only the rest.
      id: "bounces",
      broke:
        "Some campaigns were bouncing way too much, even with verified addresses. When I actually read the bounce messages, a lot of them were the company's security gateway turning us away. The address was fine.",
      found:
        "So I split 505,461 of our sends by the receiving company's mail server. Mimecast domains bounced 5.1%. Barracuda 2.4%. Google 0.5%.",
      tested:
        "Now a DNS check (a free lookup of which mail server a company uses) runs before any paid email lookup and skips the servers that bounce. The order's pinned in tests, because a company can put a security gateway in front of its Microsoft mail, and then the gateway is the one that decides. On the 34,044-company market it cut 28% before a single credit was spent, and in the first 9 days of daily runs it skipped 2,800+ people before a paid lookup. It's a trade-off: most mail to those servers still lands, but bounces put the sending domains at risk, so those servers are always skipped; each client's list of allowed servers decides the rest.",
      changed:
        "Bounces on the lists I built went from 2.74% (8,649 leads) to 0.73% (2,047 leads) after the check went in. A teammate's lists, loaded without it, went from 2.26% to 2.09% over the same weeks. With gateway leads taken out of both periods, mine still went from 1.31% to 0.49%. Not all of that drop is this one check, so I say after, not because.",
    },
  ],
};

// ── The email check, told in the skills click (cut 1, 2 Nov): its chart and its four parts, open with the click ──
export const EMAILS: Story = {
  // SOURCES.md row 32: old and new replayed on 2,376 past emails, 77 more accepted, 0 earlier passes lost; 70 of 123
  // unique refusals pass after the fix (0 of 154 before). The rules in plain words, from the day-job identity
  // audit (read for accuracy only; nothing copied). Review (2 Nov, truth): a shared brand name also passes a match
  // (the audit's brand-word rule passed 6 domains no website confirmed), so "website" alone was wrong.
  id: "identity",
  broke:
    "When a provider hands back an email, a check asks: is this really the same person, at the same company? It was rejecting real people: people who go by a short version of their name, put their department in their address, or work somewhere whose parent company owns the mail domain. And every wrong rejection costs twice: you throw away a result you paid for, then pay the next provider to look again.",
  found:
    "I pulled every email it had refused in past runs, 154 of them (123 distinct addresses), and ran them back through: zero passed. Read in a row, a lot were obviously the right person, and the same few patterns kept showing up.",
  tested:
    "One rule per pattern, each one writing down why it let a match through: short names, a department tag, the spelling on the person's LinkedIn, a shared brand name, website evidence that two domains are one company. Then two checks before switching anything. On the refusals I'd pulled, 70 of the 123 distinct addresses now pass, each with its reason, and 53 stay refused. On all 2,376 past provider emails, a wider set, I ran old and new side by side: the new one accepted 77 more and didn't lose a single old pass.",
  changed:
    "It still doesn't guess: if neither a website nor a shared brand name links two domains, the email stays refused.",
};

// ── The pipeline in plain words, behind the skills click. What each step does and the check on what comes out. ──
// From the day-job repo's step folders (read 29 Oct for accuracy only; no names, numbers or wording copied).
// `gate`: circled in red on the drawing. 2 Nov: three step names in plain words (fit check, list check, wording
// variants; they were "qualify", "list QA" and "spintax"). Review (2 Nov, truth): the fit check's quote check is the
// calibration bar (a yes quotes the company's own site), not a script reading a saved page (that was the API route);
// undecided rows were re-read by Claude readers. Wording variants aim for at least 50 combinations per email.
export type Step = { name: string; what: string; check: string; gate?: true };

export const PIPELINE_STEPS: { label: string; note: string; steps: Step[] } = {
  // 1 Nov: "Nothing moves on until its check passes" is retired: ticked rows reach a running campaign without these
  // gates, and the Claygent gate's result was never checked by the production run. The note says only what a gate
  // does to what passes through it.
  label:
    "The pipeline in twelve steps, in order: strategy, client context, find companies, fit check, research signals, find people, find emails, list check, write copy, wording variants, launch, follow-up. Fit check, find emails, list check and launch are circled as gates.",
  note: "circled: a gate. What fails its check is held back.",
  steps: [
    { name: "strategy", what: "Picks the campaigns worth running from past reply data.", check: "Each test changes one thing, and the rule for the winner is written before the data comes in." },
    { name: "client context", what: "Writes down what the client sells, who to reach, and who to leave alone.", check: "A checker blocks a brief with open questions, a sender who isn't a real person, or no approval." },
    { name: "find companies", what: "Maps the market with Clay's search first, and pays only to fill measured gaps.", check: "Every new search is judged on a sample before it runs at scale; a search that finds too few fits is dropped." },
    { name: "fit check", what: "A free mail-server check first, then a Claygent fit check reads each company's own site.", check: "On labelled samples, 90% of yeses must quote the company's own site; rows it can't decide are re-read.", gate: true },
    { name: "research signals", what: "Finds a reason to write now: hiring, news, changes on the site.", check: "Right company, the exact words, a recent date; paid sources are capped." },
    { name: "find people", what: "Finds the decision makers at each company.", check: "A title needs both the right seniority and the right function, and people who've left are dropped." },
    // 1 Nov: "multi-provider", never "cheapest first" (the 12,030 batch ran one provider first; SOURCES.md row 19).
    { name: "find emails", what: "A waterfall of providers, with a cap on each.", check: "The address must match the person at that company, and be verified.", gate: true },
    { name: "list check", what: "Reads the whole list before anything uses it.", check: "Blocks duplicates, one address on two people, do-not-contact, recent contact and shared addresses like info@; a person reads a sample.", gate: true },
    { name: "write copy", what: "Writes emails that only say what the research found.", check: "Every name and number is traced to the research, and a blind reader must be able to say what's on offer." },
    { name: "wording variants", what: "Writes a few versions of each line, so the same email doesn't go out word for word to everyone.", check: "Every combination is checked, and a separate judge drops any variant that changes the meaning." },
    { name: "launch", what: "Builds the campaign in the sending tool as a draft, never started by the script.", check: "Needs a passed list check and every email rendered and read clean before upload.", gate: true },
    { name: "follow-up", what: "Drafts replies to the people who answer.", check: "The drafts are checked, and a person approves each one before it's sent." },
  ],
};

// ── What I can do, and what I can't yet: one row per skill, a receipt and a gap at the same size ──
// No bars, no percentages, no "expert" (no source backs a level number). Cut 5 (2 Nov): the level pills went; the
// receipts say where the work ran ("our sends", "one sync", the public repo), and the SQL row claims nothing. "Daily"
// only where it is true today (the follow-up agents); the lead finder has been paused since 27 Oct. The order is what
// screeners test first and what pays: the AI work, then Clay, emails, bounce data, CRM, n8n, Python, SQL.

export type Skill = {
  id: string;
  title: string;
  /** The receipt: a number with its n, or a link to the receipt higher up the page. Inline [text](url) links. */
  proof?: string;
  /** An arrow-only link after the receipt, with the words a screen reader says for it. */
  to?: { href: string; aria: string };
  gap: string;
};

export const SKILLS: Skill[] = [
  // SOURCES.md row 33.
  { id: "skill-agents", title: "AI agents", proof: "Daily since 16 Oct, with a person approving each draft", to: { href: "#agents", aria: "how the agents work, above" }, gap: "No graded test on the drafts yet." },
  // The eval inventory (31 Oct), line 7 and its count line: 82 steps, 11 solid, 31 partial, 40 none. Decision 1 (2 Nov):
  // published with no fallback; since the reviews it is the sub line under the h1, so this gap says the 40 only.
  // Review (Hormozi): the receipt names the held list instead of "the receipts above".
  { id: "skill-evals", title: "Measuring AI steps", proof: "[The list I held, above ↑](#held-list)", gap: "40 of my 82 AI steps have no test yet." },
  // SOURCES.md rows 11 and 13; the gap from the Claygent loop's history (review, 2 Nov: on the final prompt's first
  // scoring no segment cleared both sets; 1, 4 and 5 did after relabels, 2 and 3 never) and the eval inventory (n2 and
  // n3 ran 8 Oct with the gate failed; its exit code was never checked in production). SOURCES.md row 14 still says
  // "2 of 5" and needs the same correction.
  { id: "skill-clay", title: "Lists in Clay", proof: "34,044 companies mapped for 0 data credits, then Claygent checked 24,506", to: { href: "#claygent", aria: "the Claygent story, above" }, gap: "No segment cleared my full bar until I relabelled borderline companies; then three did. The other two still ran: the run never checked the gate." },
  // Cut 1 (2 Nov): the email story's row. SOURCES.md row 32 (the replay); the gap is the audit's open item: real
  // parent-company emails stay refused when neither homepage states the link (review: say the limit plainly).
  { id: "skill-emails", title: "Finding emails", proof: "[2,376 past emails replayed before a switch ↓](#identity)", gap: "It still refuses a real person when nothing links the two domains." },
  // SOURCES.md row 21. Bounces only, never replies; no sender setup shown.
  { id: "skill-bounces", title: "Bounce data", proof: "[505,461 of our sends by mail server ↑](#bounces)", gap: "I measure bounces. I can't show sender setup yet." },
  // SOURCES.md's HubSpot section (2 Nov); past tense (review, 2 Nov): nothing has come in since 2 Oct.
  { id: "skill-crm", title: "CRM", proof: "One sync: reply events went into HubSpot through n8n.", gap: "Salesforce: not yet." },
  // SOURCES.md row 74: 40 is the 14 Oct count. The gap says the design limit of failure alerts.
  { id: "skill-n8n", title: "n8n", proof: "Error alerts on 40 live workflows (the 14 Oct count).", gap: "Alerts catch failed runs, and miss wrong answers." },
  // The public README (snapshot of 31 Oct, lines 9 and 27 to 29): 60 tests, a release gate in CI, three blind sets of
  // 31 scored once before any fix (23, 25 and 20 of 31). Rules code with AI-written labels on made-up data. Review (2
  // Nov): "sets that failed it" read as the sets failing; the checker failed its own gate on each.
  { id: "skill-python", title: "Python and tests", proof: "[champion-move-checker](#live-champion): 60 tests, and a CI gate it failed on three blind sets of 31 first time (74%, 81%, 65%).", gap: "AI agents wrote the labels, on made-up data." },
  { id: "skill-sql", title: "SQL", gap: "Nothing to show yet." },
];

// ── The click under the skills: the pipeline drawing, how he tests, Clay in depth ──
// 2 Nov: present-tense "every"/"each" claims scoped to what a source backs (the builder check): tests for mistakes that
// reached a draft, a list check that blocks a list, each paid provider in his pipeline.
export const NERD = {
  summary: "The pipeline, and nerd details",
  caption: "Built at my day job, an outbound agency, since November 2025.",
  testingHead: "How I test",
  clayHead: "Clay in depth",
  testing: [
    // SOURCES.md row 32 (the identity replay). Review (2 Nov): one past event, never "I replay the past" as a habit.
    "Before I switched the email check, I ran the old and new rules side by side on all 2,376 past emails, and the new one went in once it lost nothing.",
    // SOURCES.md row 79 and the public README (45 tests, a stand-in for the private one).
    "My own n8n task tracker has 149 automated tests: the JavaScript inside each n8n step is tested in Node exactly as n8n runs it, recorded Slack clicks are replayed against the webhook, and deploys run from a script. [The write-up](/writing/149-tests-for-a-few-slack-buttons), and [a public version with 45 tests](https://github.com/Manveen07/n8n-workflow-tests).",
    // SOURCES.md row 25: "full suite 872 passed, 6 skipped", 19 Oct. Never "870+" as today's count.
    "My day-job pipeline's test suite passed 872 tests on 19 Oct, in a private repo. They include replays of stored data, old-versus-new runs on past results, and tests for mistakes that reached a draft. One that paid off: a merge once matched rows by position and put email addresses on the wrong people, and now the list check blocks a list where one address sits on two people.",
    // Said of campaigns he uploads himself: ticked rows reach the sending tool without these checks. The eval inventory
    // rates the fresh-reader gates "accuracy unmeasured", so the line says so (review, 2 Nov).
    "On campaigns I upload myself, each email's names and numbers are traced to the research behind it, and a fresh AI reader with no context reads it cold, as the prospect would. My scripts can't upload, start or resume a campaign until that check passes. That reader has no known-answer test yet.",
    // Resume bullet 3 ("per-provider caps and a spend ledger").
    "Each paid provider in my pipeline has a cap and every lookup goes into a spend ledger, so a run stops and asks before it goes over.",
    // things-ai-got-confidently-wrong, 11 Aug note; the home page bars. 2 Nov: the October outage line is out until it
    // has a claims-table row. Review (2 Nov): the bars are the snapshot of 15 Oct, refreshed by hand, so past tense.
    "My Tender Radar once passed 12 of 12 tests and still crashed every morning for three weeks, because no test opened the new files. Its runs to 15 Oct [sit on my home page](/#proof) as bars, red when one failed. [The three-week story](/writing/things-ai-got-confidently-wrong)",
  ],
  clay: [
    // SOURCES.md row 9 (31 loops enabled across 3 accounts); the lead finder in the past tense, paused 27 Oct. 2 Nov: no
    // "every day" (the builder check: two runs were killed and one task paused, so a day was missed).
    "31 Clay workflows across 3 accounts found new people on a schedule until 27 Oct, when the searches were paused to save search quota. Each served one account, wrote its people to Clay Audiences (Clay's saved lists) so nobody was found twice, and posted them to n8n by webhook.",
    // SOURCES.md rows 11, 12, 13 and 15. 24,506 is what went to Claygent, not what the mail-server cut left (24,492), so
    // the two are told as two facts. "checked 24,506", never "qualified"; never beside 17,056.
    "I mapped a 34,044-company market from Clay's search for 0 data credits, and a free mail-server check cut 28% of it. Claygent checked 24,506 companies at about 0.18 credits each, and 16,728 passed.",
    // SOURCES.md rows 17 and 18: one batch, never a rate. "multi-provider", never "cheapest first".
    "In one batch, verified emails for 12,030 of 15,514 decision makers (78%), from a multi-provider waterfall with a cap per provider.",
    "Claygent prompts live as code: one shared template, five segments, built by a script, and tested against companies I labelled by hand, after reading its misses, before the 24,506-company run.",
    // Review (2 Nov, truth): the Clay lookalike workflow is live, its n8n caller a prototype, so "I built a Clay
    // workflow"; the line before already says Clay posted people to n8n.
    "I built a Clay workflow that takes a company from n8n by webhook and posts its lookalikes back.",
    // SOURCES.md's HubSpot section (2 Nov). Past tense: nothing received since 2 Oct. "No Salesforce" (his profile).
    "Reply events from the sending tool updated HubSpot contact properties through n8n: last reply date, campaign and lead category. I haven't used Salesforce yet.",
  ],
};

// ── Check it yourself: what to click, and what you'll see ──
// The public READMEs, as snapshotted 29 to 31 Oct: champion-move-checker lines 12 to 16 ("8/29", BLOCKED);
// n8n-workflow-tests line 9 (45 tests); tender-radar-showcase lines 35 and 56 (104 mornings since 4 July, as saved 15
// Oct; the three weeks it crashed, 21 July to 11 August). His GitHub profile README, line 3 (read 2 Nov).
export type LiveItem = { id: string; href: string; label: string; code?: string; text: string; extra?: { href: string; label: string } };
export type LogEntry = { id: string; date: string; text: string; link?: { href: string; label: string } };

export const LIVE: { items: LiveItem[]; privacy: string; log: LogEntry[] } = {
  items: [
    {
      id: "live-champion",
      href: "https://github.com/Manveen07/champion-move-checker",
      label: "champion-move-checker ↗",
      code: "python -m champion gate cases/dev.jsonl --matcher naive",
      text: "prints BLOCKED: a plain name match gets 8 of 29.",
    },
    {
      id: "live-n8n",
      href: "https://github.com/Manveen07/n8n-workflow-tests",
      label: "n8n-workflow-tests ↗",
      code: "npm test",
      text: "runs 45 tests on a small n8n workflow.",
    },
    {
      id: "live-radar",
      href: "https://github.com/Manveen07/tender-radar-showcase",
      label: "Tender Radar ↗",
      // 2 Nov: no "each morning" (the builder check: nine mornings failed in October). Cut 4: shorter, the dates kept.
      // Review (2 Nov): "Its Limits list" read as a broken phrase; the README's section is called Limits.
      text: "UK tenders. It started on its own 104 mornings, 4 July to 15 Oct; its README lists a three-week crash.",
      extra: { href: "https://www.loom.com/share/ed073589208c4e24a7543ba30b9d24dc", label: "Its 5-minute video ↗" },
    },
    {
      id: "live-profile",
      href: "https://github.com/Manveen07",
      label: "My GitHub profile ↗",
      text: "where I've measured it, each project says how often it's wrong",
    },
  ],
  // Review (2 Nov, truth): no screen share of day-job tools, so no demo offer; Say hi offers the call.
  privacy: "Day-job code stays private.",
  // Where he corrected his own public claims, newest first. A new entry goes in the same commit as the correction it
  // records; tests/how.test.mjs warns when the newest is more than 21 days old. The two 1 Nov entries carry no commit
  // link: that commit's diff shows old comments with internal folder names (decision 4).
  log: [
    {
      // The reviews of 2 Nov: the live page said one segment (5) cleared only after a relabel; segments 1 and 4 did too.
      id: "log-2026-11-02-claygent",
      date: "2026-11-02",
      text: "Corrected my Claygent story. It said one segment cleared my bar only after a relabel; three did.",
    },
    {
      id: "log-2026-11-02-headline",
      date: "2026-11-02",
      text: "Rewrote this page's headline again. \"Hold the rest for a person\" read as something my workflows always do, and two Claygent segments had run with a failed gate.",
    },
    {
      id: "log-2026-11-01-claygent-rows",
      date: "2026-11-01",
      text: "Took two rows off my Claygent chart: one was scored against a cheap AI model's answers instead of my labels, and the other had my labels on only 10 of its 25 rows.",
    },
    {
      id: "log-2026-11-01-headline",
      date: "2026-11-01",
      text: "Rewrote this page's headline. It said more than my tests could back: two Claygent segments had run with a failed gate.",
    },
    {
      id: "log-2026-10-31-leaks",
      date: "2026-10-31",
      text: "A later audit found two more leaks in my leadlens test, so its 9 of 11 needs a re-run.",
      link: { href: "/writing/schema-as-eval-spec", label: "the note" },
    },
    {
      id: "log-2026-10-31-rate",
      date: "2026-10-31",
      // c7ac598 took out the pooled wrong-alert bound ("up to about 5%"), not the per-set scores.
      text: "Took a wrong-alert rate out of champion-move-checker's README: too few blind cases to claim one.",
      link: { href: "https://github.com/Manveen07/champion-move-checker/commit/c7ac598fc568649740da1d30ab8d559c0b06ec76", label: "c7ac598 ↗" },
    },
    {
      id: "log-2026-09-26-answer-key",
      date: "2026-09-26",
      text: "Two of my own labels in the drawing test were wrong, and the AI was right.",
      link: { href: "/writing/marking-the-ais-homework", label: "the post" },
    },
  ],
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "2 Nov" from "2026-11-02", the way the log shows a date. */
export const shortDate = (iso: string) => `${Number(iso.slice(8, 10))} ${MONTHS[Number(iso.slice(5, 7)) - 1]}`;
/** The log's summary line names its newest entry, so a reader can see it is kept up. */
export const logSummary = () => `Where I corrected myself (newest: ${shortDate(LIVE.log[0].date)})`;

// ── Say hi ──
// 2 Nov: "our process stops at the reply, so there's no meetings number" is cut (decision 3); the hours line says
// where he is (home keeps its own hours line).
export const CONTACT = {
  ask: "Hiring a GTM engineer? Tell me about the role.",
  where: "I'm in New Delhi and can work US or UK hours.",
  results: "I'll walk you through campaign results on a call.",
};

// ── What the page draws, and its section labels ──
// Manveen, 29 Oct: "people don't have that much intrest to read wall of text we want it to be easily consumable", and
// "i want it edgey i don't want it to be safe make everything casual", "not cocky". Pictures and numbers carry the
// page; the long words sit behind clicks.
export const VISUAL = {
  // The share card (app/how-i-build/opengraph-image.tsx): the h1, then the miss circled. The caveat travels with the
  // number (SOURCES.md row 34). Review (2 Nov, Karpathy): the reviewer was the Claude session that wrote the rubric.
  share: ["43 of 50", "agreed with the Claude session that wrote the rubric, under my 90% bar, so I held the list"] as [string, string],
  // Cut 3 (2 Nov): the hero's links down the page ("What I can do", "Check it yourself") went; the rail does the job.
  heroLinks: [] as { label: string; href: string }[],
  stories: {
    claygent: {
      head: "Claygent, Clay's AI step that reads websites, said no to the good companies",
      caption: "Grey rows are ones I tuned on, or labelled after seeing its answers.",
      // The four good ones are his labels in the tuning set; the r4 and r6 runs answer "fit" for all four after the
      // rewrite. The last row is segment 5's 30 later rows he labelled: 18 good, all 18 answered "fit". He labelled
      // them after reading the model's answers, so the caveat sits in the row's own label (2 Nov), and both rows after
      // the fix are greyed, not highlighted. Retired 1 Nov: "30 of 30, none lost" and "25 of 25".
      rows: [
        { label: "Good ones kept, before", n: 4, filled: 0, value: "0 of 4", kind: "bad" },
        { label: "Same 4, after", n: 4, filled: 4, value: "4 of 4", kind: "tuned" },
        { label: "30 more, labelled after its answers", n: 18, filled: 18, value: "18 of 18 good ones", kind: "tuned" },
      ],
    },
    identity: {
      head: "The email check that refused real people",
      caption: "Replayed on past emails before switching. It still refuses what it can't explain.",
      tiles: [
        ["2,376", "past emails replayed"],
        ["+77", "more accepted"],
        ["0", "earlier passes lost"],
      ] as [string, string][],
    },
    bounces: {
      head: "Mail servers that bounce you anyway",
      caption: "505,461 of our sends by receiving server. Red ones get skipped before any paid lookup.",
      // `shown` is printed exactly as the claims table writes it (one decimal for the servers, two for the lists); the
      // width is value / 5.1, one scale for both groups.
      bars: [
        { label: "Google", value: 0.5, shown: "0.5%", skipped: false },
        { label: "Barracuda", value: 2.4, shown: "2.4%", skipped: true },
        { label: "Mimecast", value: 5.1, shown: "5.1%", skipped: true },
      ],
      resultHead: "Bounce rate before and after 16 Sep: my lists, and a teammate's that skipped the screen",
      result: [
        { label: "Mine, before (8,649 leads)", value: 2.74, shown: "2.74%", skipped: false },
        { label: "Mine, after (2,047 leads)", value: 0.73, shown: "0.73%", skipped: false },
        { label: "Teammate's, before", value: 2.26, shown: "2.26%", skipped: false },
        { label: "Teammate's, after", value: 2.09, shown: "2.09%", skipped: false },
      ],
      after: "After, not because: not all of the drop is the screen.",
    },
  },
  readStory: "How it actually went",
  // The rail on wide screens, read top to bottom as one story.
  kickers: {
    agents: "Me and my agents",
    habits: "One habit, with receipts",
    // Cut 1: two stories show here; the third, the email check, is in the skills click.
    failures: "Two times it broke",
    skills: "What I can do, and what I can't yet",
    live: "Check it yourself",
    contact: "Say hi",
  },
};
