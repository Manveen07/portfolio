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
  headline: "GTM engineer who builds outbound systems like software: tested before they touch a real lead, monitored after, fixed when they break.",
  // SOURCES.md: 870+ tests (G/runs/_accounting_domain_first_2026-10-19/STATUS.md); resume bullet 1 (Clay, n8n, Python).
  lede: "At my day job I built an outbound agency's pipeline end to end in Clay, n8n and Python: it finds the companies, checks they fit, finds the right people and their verified emails, and writes the emails.",
  // SOURCES.md rows: "15,514 decision-makers ... 12,030 verified emails", "78% find rate", "34,044 companies, 0 data credits".
  proofs: [
    ["12,030", "verified emails found for 15,514 decision makers, a 78% find rate"],
    ["34,044", "companies mapped through Clay for 0 data credits"],
    ["870+", "automated tests on the pipeline"],
  ] as [string, string][],
  // LOOM-TRANSCRIPT.md slides 3 and 6. The full story is the first item under #failures. Each arrow sits after a
  // no-break space, so it never wraps onto a line of its own.
  hardest:
    "**The hardest failure I've fixed:** a Claygent fit check rejected all four good companies in 25 I'd hand-labelled. I rewrote it and scored it on good companies lost before it went live: none in the same 25, none in 30 it had never seen.",
  // Round A1 (29 Oct): the link opened a section of closed stories. It now points at the story, and a small script
  // in the page opens a <details> when the address names it.
  hardestLink: { label: "How I found it and proved the fix ↓", href: "#claygent" },
  // CAN-CLAIM.md "Day-job builds": describe only; never name the employer or clients, never show their work.
  privacy:
    "Built at my day job since November 2025. The code, prompts and client data stay private; on a call I can show the workflows on screen with names blurred. The main numbers are on my [resume](/resume.pdf).",
  heroLinks: [
    { label: "Tested n8n workflow, public repo ↗", href: "https://github.com/Manveen07/n8n-workflow-tests" },
    // Round A1: the home page's hero is about freelance automation, so this link goes to the video, not /#proof.
    { label: "Tender Radar at work, under 5 min ↗", href: "https://www.loom.com/share/ed073589208c4e24a7543ba30b9d24dc" },
  ],
} as const;

// ── The same patterns, for builds GTM teams ask for (round A1: the near matches were buried in the stories) ──
// 1: the identity story below (SOURCES.md). 2: the qualify step and the email checks (LOOM-TRANSCRIPT.md; the home page's
// Precise Leads card). 3: CAN-CLAIM.md "Day-job n8n builds he may talk about" (the Slack approval flow, Manveen 23 Oct).
export const PATTERNS = {
  intro: "Most GTM engineering asks come down to three patterns. Each one is already running in my work:",
  items: [
    {
      lead: "Hold uncertain matches.",
      text: "My email identity check passes a match only with a recorded reason; when nothing shows two domains belong together, it stays refused instead of guessed. The same rule fits a champion or job-change tracker. [The story](#identity)",
    },
    {
      lead: "Every fact with its source.",
      text: "Every Claygent yes carries a quote that a script finds in the saved page, and every email is checked claim by claim against its research. The same check fits account briefs built from call notes and the CRM. [How I test](#testing)",
    },
    {
      lead: "People correct it where they work.",
      text: "I built an n8n flow where AI drafts the next reply, code checks it, and it lands in Slack with Send, Edit, Snooze and Stop buttons, so a person approves every message. [How I test Slack buttons](/writing/149-tests-for-a-few-slack-buttons)",
    },
  ],
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
      result: "4 of 4 good companies rejected. After the rewrite: 25 of 25 agreed, then 30 unseen companies, none lost.",
      broke:
        "Before we pay to find anyone's email, Claygent (an AI step inside Clay that reads a company's website) decides whether the company fits. For one segment, systems integrators, it kept saying no to companies we wanted. On 25 companies I'd labelled by hand it rejected all four good ones: an engineering firm that sets up factory control systems, a business-software partner and a distributor that builds its own control panels. They all do the work. None of them call themselves integrators.",
      found:
        "I read every row where Claygent and my labels disagreed. The prompt was a rulebook: yes if the site says this, no if it says that. Claygent followed it to the letter, so the website's wording decided the answer, not the business. It could read the sites fine, since every yes quoted the company's own site. The rules were the problem.",
      tested:
        "I rewrote it as a briefing: what we look for, good signs, the usual not-a-fit cases and past calls as examples, with five hard rules kept, such as quote their own site for every yes. I scored it first on good companies lost, because that was the failure. On the same 25 it agreed 25 of 25 with no good company lost. On 30 it had never seen: also 100%, none lost. On top of that it had to pass a gate: 80% agreement with my labels, at most 20% sent to a person for review, and 90% of yeses backed by a quote.",
      changed:
        "It then qualified 24,506 companies. The prompt is now a shared template: one file holds what's common, each segment adds its own question and edge cases, and a script builds all five prompts, so a fix lands everywhere at once. The same check runs every day on each new company the lead finder brings in.",
    },
    {
      // SOURCES.md last row: A/B on 2,376 past emails, 77 more accepted, 0 earlier passes lost; 70 of 123 unique
      // refusals pass after the fix (0 of 154 before). The rules in plain words, from the identity audit (gtm, read
      // for accuracy only; nothing copied).
      id: "identity",
      title: "The email identity check was refusing real people's emails",
      result: "Old and new checks replayed on 2,376 past emails: the new one accepted 77 more and lost none.",
      broke:
        "When a provider returns an email, a check asks: is this really the same person, at the same company? It was refusing correct addresses from people who go by a short form of their name, add a department to their address, or work at a company whose parent owns the mail domain. Every wrong refusal costs twice: the paid result we throw away, then the next provider's lookup.",
      found:
        "I pulled every email the check had refused in past runs, 154 of them (123 distinct addresses), and put them back through it: none passed. Read in a row, many were plainly the right person, and the same few patterns came up again and again.",
      tested:
        "I added a rule for each pattern, each one recording why it passed a match: short names, a department tag, the spelling on the person's LinkedIn profile, and website evidence that two domains belong to one company. Then I ran the old and new checks side by side on all 2,376 past emails. The new one accepted 77 more and lost none of the old passes. Of the 123 distinct refusals, 70 now pass, each with its reason, and the other 53 stay refused.",
      changed:
        "A match still never passes on a guess. When no website shows that two domains belong together, the email stays refused, so an uncertain match is held back instead of sent.",
    },
    {
      // Resume bullet 4 and SOURCES.md rows: 505,461 sends; Mimecast 5.1%, Barracuda 2.4%, Google 0.5%; 28% cut of
      // 34,044; 2,800+ skipped in the first 9 days; bounces on his lists 2.7% to 0.7%, unscreened lists 2.1%
      // (caveat in SOURCES.md: not all of the drop is the screen, so "after", never "because").
      id: "bounces",
      title: "Some mail servers bounced our emails, however good the address",
      result: "505,461 sends grouped by mail server. Bounces on the lists I built fell from 2.7% to 0.7% after.",
      broke:
        "Some campaigns bounced too much even with verified addresses. Reading the bounce messages, many were the receiving company's security gateway refusing us, not a bad address. No email verifier catches that.",
      found:
        "I grouped 505,461 of our sends by the receiving company's mail server. Domains behind Mimecast bounced 5.1%, Barracuda 2.4%, Google 0.5%.",
      tested:
        "A DNS check (a free lookup of which mail server a company uses) now runs before any paid email lookup and skips the servers that bounce. The order is pinned in tests: a company can put a security gateway in front of its Microsoft mail, and then the gateway decides, so it is checked first. On the 34,044-company market it cut 28% before a credit was spent, and in the first 9 days of daily runs it skipped 2,800+ people before a paid lookup.",
      changed:
        "Bounces on the lists I built fell from 2.7% (8,649 leads) to 0.7% (2,047 leads) after the check went in, while lists loaded without it stayed at 2.1%. Not all of that drop is this one check, so I say after, not because.",
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
      lead: "Check every email before it goes out.",
      text: "Each one is checked claim by claim against the research behind it, and a fresh AI reader with no context reads it cold, as the prospect would. On a 300-email test set, 95.5% of the claims were supported and none contradicted. When someone spots a new kind of mistake, it becomes a check.",
    },
    {
      lead: "Cap the spend.",
      text: "Every paid provider has a cap and every lookup goes into a spend ledger, so a run stops and asks before it goes over.",
    },
    {
      lead: "Watch the run, not only the tests.",
      text: "My Tender Radar once passed 12 of 12 tests and still crashed every morning for three weeks, because no test opened the new files. Now its daily runs [sit on my home page](/#proof) as bars, red when one fails. They show this month's gap too: on nine mornings since 17 October a tender portal stopped answering, and the whole run stopped with it. One slow source should only cost that source. [The three-week story](/writing/things-ai-got-confidently-wrong)",
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
    { name: "qualify", what: "A Claygent fit check reads each company's own site.", check: "Every yes needs a quote that a script finds in the saved page, or it goes to review.", gate: true },
    { name: "research signals", what: "Finds a reason to write now: hiring, news, changes on the site.", check: "Right company, the exact words, a recent date; paid sources are capped." },
    { name: "find people", what: "Finds the decision makers at each company.", check: "A title needs both the right seniority and the right function, and people who've left are dropped." },
    { name: "find emails", what: "A mail-server check, then a waterfall of providers, cheapest first.", check: "The address must match the person at that company, and be verified.", gate: true },
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

// ── Things you can open. Every link here is checked by new 10x engineer\money\showcase\tools\linkcheck.py. ──
export const LIVE = {
  intro: "The day-job work stays private. These are mine, and they're live:",
  items: [
    { href: "https://github.com/Manveen07/tender-radar-showcase", label: "Tender Radar ↗", text: "reads UK public tenders every morning and sorts which are worth a bid; the code is public, and its daily runs are on my home page." },
    { href: "https://www.loom.com/share/ed073589208c4e24a7543ba30b9d24dc", label: "Tender Radar, the video ↗", text: "watch it work, under 5 minutes." },
    { href: "https://github.com/Manveen07/n8n-workflow-tests", label: "n8n-workflow-tests ↗", text: "a small n8n workflow with 45 tests you can run: Code nodes, the workflow file, a replayed Slack click and the deploy." },
    { href: "/writing/149-tests-for-a-few-slack-buttons", label: "149 tests for a few Slack buttons", text: "how I test an n8n workflow before it goes live." },
    { href: "/writing/schema-as-eval-spec", label: "How I caught my own AI test cheating", text: "an eval that scored 100% because my notes leaked the answers." },
    { href: "/writing/marking-the-ais-homework", label: "Marking the AI's homework", text: "23 drawings answered by hand, then the AI's work marked against them." },
    { href: "/resume.pdf", label: "Resume (PDF)", text: "jobs, dates and the main numbers." },
  ],
} as const;

// ── The end of the page ──
export const HOW_END = {
  ask: "Building something like this, or fixing one that broke? Write to me.",
} as const;
