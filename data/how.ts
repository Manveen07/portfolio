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
//
// v2.1 (2 Nov, his feedback on the live page; the fixes are the session's calls, not his picks). The habit card: "i
// think this is not related to my gtm work maybe you can reword this so it aligns with gtm", so the habit is now a
// day-job one, the email check replayed before switching, and its story moved out of the skills click to sit behind
// the card's own click (told once). The skills rows: "i was not sure what we are going for in this", so each skill is
// now one plain sentence of what he did, with its number, and the gaps are one "Not yet" line under the rows.

export const HOW = {
  title: "How I build GTM systems",
  // 2 Nov: the h1 names the AI edge; the held-list card under it is the one past miss that proves it. It holds only
  // because the sub line says plainly, on the same screen, that 40 of the 82 AI steps he built have no test (the eval
  // inventory, 31 Oct, its count line). Review (Karpathy): the h1 was contradicted a screen later and limited three
  // screens later; review (Hormozi): a tool list is the "person that uses claude" line. The tools are named below
  // (Claude Code in the agents section, Clay, n8n and Python in the skill rows); New Delhi is in Say hi.
  // 2 Nov (his call, "we want to have our ai edge"): the line stays under the h1, said as a measurement he made
  // ("I counted": the inventory ran on 31 Oct). Round 4 (2 Nov): two lines, the role and then home's 82-step line, which
  // says what an AI step is (all 4 round 3 readers asked); each line is 30 words or fewer. Round 5 (2 Nov): the line
  // says where the 82 steps are (data/portfolio.ts HERO, the same sentence).
  // Round 6 (2 Nov, 2 of 3 jurors): a kicker above the h1, so the page doesn't read as the home page reloaded (the h1
  // is the same on both pages; three round 5 readers thought the link was broken). The nav link's own words.
  kicker: "How I build",
  headline: "I build AI agents for outbound and measure what they get wrong.",
  // 3 Nov (his ask, "i just want us to not look weak"): the step count left the first screen; it is the skills row
  // "Testing AI steps", said from what is done (the 31 Oct eval inventory).
  sub: ["GTM engineer at an outbound agency since November 2025."] as [string],
} as const;

// ── Me and my agents: what runs each day, where a person approves ──
// SOURCES.md row 33 and the day-job follow-up step (line 13: "daily 09:00 IST since 16 Oct"). Never "every morning"
// (one run folder, 19 Oct, is missing), and since 2 Nov never "daily" (the 1 and 2 Nov runs failed: the sending tool
// answered 401, "Plan expired"), never "I approve" or the approver's name, never Slack buttons or cards (none since
// 26 Oct), no quality claim: the drafts have no graded test yet, and the page says so.
// Step 6 (review, 2 Nov): email goes out through the sending tool after the approval, and LinkedIn through a
// computer-use agent from the approval sheet, so the person never sends by hand. It sits in the lower row after the
// gate, and its name says who sends.
export type AgentStep = { name: string; lane: "agents" | "person" | "tool"; gate?: true };

export const AGENTS: { label: string; note: string; lanes: { agents: string; person: string }; steps: AgentStep[]; lines: [string, string] } = {
  label:
    "How the follow-up agents work, in order. Agents: 1 a lead replies with interest, 2 the agent reads the thread, 3 it drafts the next message, 4 a rule check runs. A person: 5 edits and approves each draft, circled in red as the gate. 6 Then the sending tool sends it.",
  // His own words for how he works (voice notes, line 18): "i ike to check first asess what happend and then come up
  // with plans and i put gaurdrails so same thing does not happen twice". Cut in round 2 (2 Nov: 3 of 4 round 1 readers
  // flagged it as a slogan) without his yes; back in round 6 (2 Nov), his keep or cut asked. 3 Nov: reworded at his
  // ask (was "check first, then a guardrail so it doesn't happen twice"); step 5 is the drawing's gate, where a person
  // edits and approves.
  note: "if step 5 catches a mistake, I add a check for it",
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
    "Since 16 Oct my Claude Code agents have drafted follow-ups to leads who replied with interest to our outbound.",
    // "a graded test on my agents' drafts" is in the skills section's Not yet line, and the sub line says 40 steps have
    // no test.
    "A person edits and approves each draft before it sends.",
  ],
};

// ── Before I change a rule (the habit row; "One habit, with receipts" until 2 Nov): one past event from the day job, the
// old number struck and the new one circled ──
// v2.1 (2 Nov). Manveen, on the leadlens card that stood here: "i think this is not related to my gtm work maybe you
// can reword this so it aligns with gtm". The session's call: the habit is replaying past data before switching a
// rule, and its receipt is the email identity check, told once, here (it was a story inside the skills click). The
// leadlens story left this page; it stays in the corrections log below and in its post.
// SOURCES.md row 32 and the identity audit of 13 Oct (line 11): the check had refused 154 provider emails (123
// distinct) in 21 runs, and 0 passed on replay; after one rule per pattern, 70 of the 123 pass, each with a recorded
// reason, and 53 stay refused. Old and new side by side on all 2,376 past provider emails: 77 gained, 0 earlier passes
// lost. "Costs twice": the audit's cost line and the email step's own lesson (a refused correct email is billed, then
// the next provider bills again for the same person). Never "A/B" (a replay of past emails; the 31 Oct jury), and the
// heading tells one past event, never "I replay the past" as a standing rule. The limit line: the side-by-side
// compares the new rules with the old ones and holds no labels, so it can't say whether the 77 are the right people,
// and the audit records no check of them (the recovered emails it verified were checked for delivery only).

// The four parts behind the card's click. Its id ("identity") keeps old links to #identity working: OpenOnHash opens
// the click. The rules in plain words, from the day-job identity audit (read for accuracy only; nothing copied).
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

export type Habit = {
  id: string;
  head: string;
  /** Struck in red, an arrow, then circled in red with the words that belong to the circled number. */
  exhibit: { struck?: string; circled: string; rest?: string };
  /** Two or three short lines under the exhibit; the last says what the check can't show. */
  lines: string[];
  checked: string;
  link?: { href: string; label: string };
  /** The four parts, behind a "How it actually went" click on the card. */
  story?: Story;
};

export const HABITS: Habit[] = [
  {
    id: "habit-replay",
    // Reviews (2 Nov): "email check" read as an email verifier, so "email match check" (is this the person, at this
    // company?). The cost names both payments (find-emails SKILL.md: "its hit is billed, then the next provider bills
    // again"). Line 2 has an actor and names the 2,376 as a wider set than the 123, so 70 and 77 don't read as a typo.
    // The limit covers the circled 70 as well as the 77 ("all 2,376" and "those 123" keep the two sets apart): the rules were written from those 123 refusals, after2.csv
    // and ab_old_new.py hold no labels, and the audit (line 17) says the brand-word rule passed 6 domains no website
    // confirmed.
    // Round 3 (2 Nov): all 4 round 2 readers stumbled on "email match check" (match what?), so the head says what it
    // matches (email_identity.py: "Does an email belong to this person at this company?") in the same 16 words; "before
    // changing it" gave way, as the label right above says "Before I change a rule". "real people" is the story's own
    // wording ("It was rejecting real people"). The limit: the cto read "neither run shows the new passes are the right
    // people" as contradicting the head. The 70 are in-sample ("The rules came from those 123"), and nobody checked the
    // 77 (the audit records delivery checks only); one word shorter. Round 4 (2 Nov): said in the first person (the round
    // 3 founder flagged it), the caveat still beside its numbers.
    // Round 5 (2 Nov): the exhibit was "0 of 123 passed → 70 of 123 pass"; all 4 round 4 readers needed two reads, and
    // the struck 0 was true by construction (these were the check's own refusals). Now "123 refused → 70 of them pass
    // the new rules": the same fact (the identity audit, line 11: "After the fix: 70 of 123 unique refusals pass").
    head: "Our email match check (right person, right company) refused real people, so I re-ran its refusals",
    exhibit: { struck: "123 refused", circled: "70 of them", rest: " pass the new rules" },
    lines: [
      "Each wrong refusal costs twice: we paid for that email, then pay the next provider.",
      "Before switching, I ran old and new rules on all 2,376 past emails: 77 more passed and no old pass was lost.",
      "I built the rules from those 123, and no one has checked yet whether the 77 are the right people.",
    ],
    checked: "checked against: the old rules' answers",
    story: EMAILS,
  },
];

// ── Two failures, each: what broke, how I found it, how I proved the fix, what it changed ──
export type Story = {
  id: string;
  broke: string;
  found: string;
  tested: string;
  changed: string;
};

// Cut 1 (2 Nov): the email identity story left the failures; since v2.1 it is the habit card's story (EMAILS above).
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

// ── What I can do: one row per skill, the skill in a hiring manager's words and one plain sentence of what I did ──
// v2.1 (2 Nov). Manveen, on the rows with a receipt and a gap each: "i was not sure what we are going for in this".
// The session's call: one sentence per skill, with its number, readable on its own (no arrow-only links; a link sits at
// the end of a full sentence), and the gaps said once, in one "Not yet" line under the rows. No bars, no levels, no
// "expert". No "daily": the lead finder has been paused since 27 Oct, and the follow-up agents' 1 and 2 Nov runs failed
// (the sending tool's 401, "Plan expired"), so no row leans on a daily run. Order: the AI work first, then Clay, emails, deliverability, n8n, CRM, Python.

export type Skill = {
  id: string;
  /** The skill, the way a hiring manager writes it in a job post. */
  title: string;
  /** One plain sentence of what he did, with its number. An inline [text](url) link sits at its end. */
  line: string;
};

export const SKILLS: Skill[] = [
  // SOURCES.md row 33 and the follow-up step (line 13: "daily 09:00 IST since 16 Oct"; the 16 Oct run has drafts).
  // Never "every morning". Review (2 Nov, truth): the approval is a gate ("approves each draft before it sends"), not a
  // claim that a person has approved every draft: the run logs list cards waiting unapproved since 23 Oct.
  { id: "skill-agents", title: "AI agents", line: "My Claude Code agents have drafted follow-ups since 16 Oct; each send needs a person's yes." },
  // SOURCES.md row 34 (the held list, told in full by the card after these rows): agreement with a separate Claude review,
  // never hand labels; 43 of 50 under the 90% bar, then a second pass and a new sample of 50 at 47. Reviews (2 Nov):
  // the hero card's terms ("Claude agents pick"), never "fit check", the Claygent step's name on this page; and the
  // fix is named (EVALS 3a: "until a fix passed 50 fresh rows at 47 of 50"), so it can't read as resampling. Round 4
  // (2 Nov): "a second Claude session", as on the card; "matched" keeps the row at 30 words.
  { id: "skill-checking", title: "Checking AI output", line: "My agents' company picks matched a second Claude session on 43 of 50, under my 90% bar; I held the list until a fix passed 47 of 50 new ones." },
  // SOURCES.md rows 11 and 13 and the credits row (about 0.18 each). "checked 24,506", never "qualified"; never beside
  // 17,056. Round 5 (2 Nov): 3 of 4 round 4 readers asked how a map costs 0 credits, so the row says why (SOURCES.md
  // row 11: "70,508 rows in 382 queries, search quota only"). 23 words.
  // 3 Nov (his ask): the eval inventory's count, said from what is done; the first screen no longer carries it.
  // the 31 Oct eval inventory: 42 of 82 have some known-answer test, 11 solid. An AI step is a place where a model
  // decides or writes something (rules with no model are left out). 25 words.
  { id: "skill-testing", title: "Testing AI steps", line: "42 of my 82 AI steps, the places where an AI decides or writes something, have a test so far; 11 of them are solid." },
  { id: "skill-clay", title: "Clay", line: "I mapped a 34,044-company market for 0 data credits, because Clay's search spends search quota; Claygent checked 24,506 at about 0.18 credits each." },
  // SOURCES.md rows 17 and 18: one batch, never a rate; "multi-provider", never "cheapest first".
  { id: "skill-emails", title: "Finding emails", line: "My multi-provider waterfall found verified emails for 12,030 of 15,514 decision-makers (78%) in one batch." },
  // SOURCES.md row 31 and his claims-checked LinkedIn line: his lists 2.74% then 0.73%, said to one decimal as the
  // résumé does, "after", never "because" (with gateway leads out of both periods his drop is 1.31% to 0.49%). The
  // inbox checks: the capabilities index (the DNS auth checker, the daily setup audit with its warm-up checks, the
  // placement testing suite), his own commits from July to November.
  { id: "skill-deliverability", title: "Deliverability", line: "After I screened out high-bounce mail servers, bounces on my lists went from 2.7% to 0.7%; I built DNS, inbox placement and warm-up checks." },
  // SOURCES.md row 74: 40 is the 14 Oct count (the error workflow was linked that day). The public repo's README: 45
  // tests.
  { id: "skill-n8n", title: "n8n", line: "On 14 Oct I put error alerts on 40 live workflows; my public n8n repo runs 45 tests." },
  // SOURCES.md's HubSpot section (2 Nov): "a reply-event sync into HubSpot through n8n", past tense (nothing has come
  // in since 2 Oct); never "HubSpot admin" or CRM work beyond it.
  { id: "skill-crm", title: "CRM", line: "I built a reply-event sync into HubSpot through n8n." },
  // The public README (snapshot of 31 Oct, line 9): 60 tests and a release gate in CI. Rules code with AI-written labels
  // on made-up data, so it backs no claim about AI steps; its README says so itself.
  { id: "skill-python", title: "Python and tests", line: "My public Python repo has 60 tests and a release gate in CI: [champion-move-checker](https://github.com/Manveen07/champion-move-checker)." },
];

// The gaps, said once, under the rows. Salesforce: his profile ("No Salesforce."); SQL: his profile lists PostgreSQL,
// and the knowledge map's gaps line says "SQL unproven at work", so "SQL at work"; the drafts: the follow-up writer has
// no graded test (SOURCES.md row 33).
export const SKILLS_NOT_YET = { label: "Not yet:", text: "Salesforce, SQL at work, and a graded test on my agents' drafts." };

// ── The click under the skills: the pipeline drawing, how he tests, Clay in depth ──
// v2.1 (2 Nov): the email story and its one-line twin in How I test left this click; the habit card tells it once.
// 2 Nov: present-tense "every"/"each" claims scoped to what a source backs (the builder check): tests for mistakes that
// reached a draft, a list check that blocks a list, each paid provider in his pipeline.
export const NERD = {
  // Round 4 (2 Nov): the click's own three sub-heads ("The pipeline, and nerd details" until then; a round 3 reader
  // flagged it).
  summary: "The pipeline, how I test, and Clay in depth",
  caption: "Built at my day job, an outbound agency, since November 2025.",
  testingHead: "How I test",
  clayHead: "Clay in depth",
  testing: [
    // SOURCES.md row 79 and the public README (45 tests, a stand-in for the private one).
    "My own n8n task tracker has 149 automated tests: the JavaScript inside each n8n step is tested in Node exactly as n8n runs it, recorded Slack clicks are replayed against the webhook, and deploys run from a script. [The write-up](/writing/149-tests-for-a-few-slack-buttons), and [a public version with 45 tests](https://github.com/Manveen07/n8n-workflow-tests).",
    // SOURCES.md row 25: "full suite 872 passed, 6 skipped", 19 Oct. Never "870+" as today's count.
    "My day-job pipeline's test suite passed 872 tests on 19 Oct, in a private repo. They include replays of stored data, old-versus-new runs on past results, and tests for mistakes that reached a draft. One that paid off: a merge once matched rows by position and put email addresses on the wrong people, and now the list check blocks a list where one address sits on two people.",
    // Said of campaigns he uploads himself: ticked rows reach the sending tool without these checks. The eval inventory
    // rates the fresh-reader gates "accuracy unmeasured", so the line says so (review, 2 Nov).
    "On campaigns I upload myself, each email's names and numbers are traced to the research behind it, and a fresh AI reader with no context reads it cold, as the prospect would. My scripts can't upload, start or resume a campaign until that check passes. That reader has no known-answer test yet.",
    // Resume bullet 3 ("per-provider caps and a spend ledger").
    "Each paid provider in my pipeline has a cap and every lookup goes into a spend ledger, so a run stops and asks before it goes over.",
    // things-ai-got-confidently-wrong, 11 Aug note. 2 Nov: the October outage line is out until it has a claims-table
    // row. Round 6 (2 Nov): the bars left the home page (its runs showed green while its AI step failed on every new
    // notice since September, a suspended API key), so the line says that instead of pointing at them.
    "My Tender Radar once passed 12 of 12 tests and still crashed every morning for three weeks, because no test opened the new files. From September its AI step failed on every new notice and no run went red for it, so it came off my home page. [The three-week story](/writing/things-ai-got-confidently-wrong)",
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
// n8n-workflow-tests line 9 (45 tests); tender-radar-showcase line 56 (the three weeks it crashed, 21 July to 11
// August). His GitHub profile README, line 3 (read 2 Nov).
export type LiveItem = { id: string; href: string; label: string; code?: string; text?: string; extra?: { href: string; label: string } };
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
      // 2 Nov: no "each morning" (the builder check: nine mornings failed in October). Review (2 Nov): "Its Limits list"
      // read as a broken phrase; the README's section is called Limits. Verify loop round 2 (2 Nov): the morning count is
      // out ("104 mornings, 4 July to 15 Oct" from the README beside the home page's live count: all 4 readers flagged
      // the two numbers as disagreeing).
      text: "UK tenders; its AI step has been down since September, and its README lists an earlier three-week crash.",
      extra: { href: "https://www.loom.com/share/ed073589208c4e24a7543ba30b9d24dc", label: "Its 5-minute video ↗" },
    },
    {
      // Round 4 (2 Nov): the link only. Its gloss ("where I've measured it, each project says how often it's wrong",
      // from the profile README) was flagged as AI-sounding by 3 of 4 round 3 readers; the repos above show it.
      id: "live-profile",
      href: "https://github.com/Manveen07",
      label: "My GitHub profile ↗",
    },
  ],
  // Review (2 Nov, truth): no screen share of day-job tools, so no demo offer; Say hi offers the call.
  privacy: "Day-job code stays private.",
  // Where he corrected his own public claims, newest first. A new entry goes in the same commit as the correction it
  // records; tests/how.test.mjs warns when the newest is more than 21 days old. The two 1 Nov entries carry no commit
  // link: that commit's diff shows old comments with internal folder names (decision 4).
  log: [
    {
      // Round 6 (2 Nov, the round 5 jury's blocker): the 1 Nov run ended "success" with 8,274 403 errors (a suspended
      // key), and the classified total has stood at 3,671 since 3 Sep. The session's wording.
      id: "log-2026-11-03-tender-radar",
      date: "2026-11-03",
      text: "Took Tender Radar off my home page: its AI step had been failing on every new notice since September (a suspended API key), and no run went red for it.",
    },
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
/** The log's summary line names its newest entry, so a reader can see it is kept up. Round 5 (2 Nov): "Where I
    corrected myself (newest: …)" until then (the round 4 founder flagged it). */
export const logSummary = () => `My corrections log (last entry ${shortDate(LIVE.log[0].date)})`;

// ── Say hi ──
// 2 Nov: "our process stops at the reply, so there's no meetings number" is cut (decision 3); the hours line says
// where he is (home keeps its own hours line).
// Round 5 (2 Nov): the ask without the question (data/portfolio.ts SAY_HI.ask, held equal by a test).
export const CONTACT = {
  ask: "If you're hiring a GTM engineer, email me about the role.",
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
      // Round 3 (2 Nov): "After, not because:" is cut (two round 2 readers flagged it, two called it cryptic); the
      // teammate's bars carry the control, and the story behind the click still says "after, not because". Round 5 (2 Nov):
      // "Not all of the drop is the screen." read as a tagline to the round 4 recruiter; the line now says what the
      // teammate's bars show (SOURCES.md row 31: "a teammate's unscreened uploads 2.26% then 2.09%", "so not all of the
      // drop is the screen").
      after: "The teammate's list fell a little too, so the screen isn't the whole cause.",
    },
  },
  // Each click says what it opens (round 6, 2 Nov, 2 of 3 jurors: "How it actually went" on all six read as a template,
  // and nothing told a reader which one was worth opening). His phrase starts the label where it fits. Keyed by the
  // story's id or the card's slug.
  clicks: {
    "held-list": "How the held list actually went",
    identity: "How the re-run actually went",
    claygent: "How the Claygent rewrite went",
    bounces: "How the mail-server split went",
    "caught-my-own-test": "How the leadlens test actually went",
    "labelled-drawings": "How the drawing test actually went",
  } as Record<string, string>,
  // The rail on wide screens, read top to bottom as one story.
  kickers: {
    agents: "Me and my agents",
    // Verify loop round 2 (2 Nov): was "One habit, with receipts" (4 of 4 round 1 readers flagged it as a slogan); now a
    // plain label for what the row shows.
    habits: "Before I change a rule",
    // Cut 1: two stories show here; the third, the email check, is the habit card's (v2.1). Round 5 (2 Nov): "Two times it
    // broke" until then; the round 4 agency reader called the bounce chart under it his strongest deliverability proof,
    // and the old label undersold it.
    failures: "What broke, and what I changed",
    // v2.1 (2 Nov): the gaps are one "Not yet" line under the rows, so the kicker names what he can do.
    skills: "What I can do",
    live: "Check it yourself",
    contact: "Say hi",
  },
};
