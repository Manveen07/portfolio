// All copy for the home page, and the words of the three posts drawn by components (DRAWINGS, WRONG, NAMESAKE).
// Components read from here; edit words here.
// Rules for every string: spec section 5 (no dashes, no sales words, Manveen's
// own phrasing where spec 5a has it). Every figure needs a source: see
// docs/superpowers/specs/2026-10-13-claims.md.

// Types only (erased when it runs, so the tests can load this file on its own): NAMESAKE's story is prose blocks.
import type { Block } from "./posts";

// ── Identity ─────────────────────────────────────────────────────────
export const ME = {
  name: "Manveen Singh",
  // 1 Nov (proof cards review, fix 1; his yes needed before merge): "GTM engineer", his own words from the live
  // /how-i-build headline, shown as the home hero's kicker. Was "automation engineer".
  role: "GTM engineer",
  location: "Delhi, India",
  // 2 Nov (verify loop round 3): the same promise as /how-i-build's Say hi (data/how.ts CONTACT.where). The round 2
  // founder read the old line ("UK working hours are my afternoon and evening, US mornings my evening") as limited US
  // overlap. Manveen, 29 Oct: "yeah sure" to US hours.
  hours: "Delhi, India. I can work US or UK hours.",
  email: "manveen9650@gmail.com",
  github: "https://github.com/Manveen07",
  // His profile, given 23 Oct 2026. linkedin.com/in/Manveen (used until then) is not his.
  linkedin: "https://www.linkedin.com/in/manveen-singh-b9b7672a0",
  calendly: "https://calendly.com/manveen9650/30min",
  resume: "/resume.pdf",
} as const;

// ── Off the clock: footer line, from Manveen's own answers (13 Oct) ──
export const OFF_CLOCK = "Hunter x Hunter theory videos, Peacemaker, Elden Ring, Sekiro, Doom, The Weeknd.";

// ── The line above the hero's h1: the role. 1 Nov to 2 Nov it also carried the AI edge ("GTM engineer · I build AI
// agents and measure what they get wrong"); since the verify loop's round 2 (2 Nov) that line is the h1 itself. ──
export const HERO_KICKER = "GTM engineer";

// ── Hero (2 Nov, verify loop round 2). All 4 blind readers of round 1 said the home first screen never named outbound or
// the AI edge, and asked for the /how-i-build h1 here, so it is the h1, word for word (data/how.ts, HOW.headline). Cut in
// round 2, as the session decided: "So now I build the thing, and the test for the thing." and the "nerd word for this:
// deterministic" note. Round 3 (2 Nov): his first clause of the approved 15 Oct story stays word for word; the rest ("got
// good at it, and noticed the same missing piece everywhere: almost nobody measures whether the automation is right",
// flagged as AI-sounding by 4 of 4 round 2 readers) gave way to the measured line /how-i-build shows under its h1 (the
// eval inventory of 31 Oct: 82 AI steps, 11 solid, 31 partial, 40 none), joined to his clause by ", and counted" (as two
// sentences, the h1 and both opened with "I", which voice_check flags, §7). 28 words. His version A headline, its answer
// and the week sketch moved, not removed: they open /working-with-me (WEEK_JOB below).
// Round 4 (2 Nov): all 4 round 3 readers asked what an "AI step" is, so the line says it where it first appears (the
// eval inventory of 31 Oct counts model steps only and leaves rules out), as two blocks of 30 words or fewer; the second
// opens with "Of", so the h1 and the first block are the only two "I" openings in a row. /how-i-build's sub line ends
// with the same sentence (data/how.ts HOW.sub).
// Round 5 (2 Nov): all 4 round 4 readers still asked "82 steps of what?", and 3 read "40 none yet" as half the work
// untested before they read it as honesty, so the line says where the steps are: the eval inventory of 31 Oct counts 35
// in the agency's day-job tools, 20 in its earlier pipelines and 27 in his own projects (its sections 2a, 2b and 2c). It
// opens with "Across", so the h1 and the first block stay the only "I" openings in a row. 28 words.
// Round 6 (2 Nov, the jury on round 5): his approved 15 Oct story is back under the h1, word for word, as two blocks
// (29 and 12 words). Rounds 2 and 3 cut it on reader flags without his yes, against his rule (his wording beats a
// reader's opinion: move, never remove); claims row 57, "his own words approved 15 Oct". The 82-step line stays on
// /how-i-build only (data/how.ts HOW.sub). The second block opens with "So", so the h1 and the first block stay the only
// two "I" openings in a row. His keep or cut on each restored line is asked in a list kept outside this public repo.
// 3 Nov: the second block is reworded at his ask (was "So now I build the thing, and the test for the thing."); the
// missing piece is the measuring the first block names. ──
export const HERO = {
  headline: "I build AI agents for outbound and measure what they get wrong.",
  how: [
    "I spent a year automating lead-finding for an outbound agency, got good at it, and noticed the same missing piece everywhere: almost nobody measures whether the automation is right.",
    // 3 Nov evening, his yes: four of four blind readers flagged "So now I build that missing piece too." as
    // AI-written; the missing piece is the measuring the first block names, so it says what it is.
    "So now I build the checks too.",
  ],
} as const;

// ── Five things I do (3 Nov 2026): a short strip in the home hero, after the link down and the hours line, that plays
// once when it comes into view (components/sketches/FiveHabits.tsx), his pick of the animation mockups that day ("sure
// ggo with 2"). His aim for it, 2 and 3 Nov: show how he works, visually, so a reader sees the difference without being
// told ("without stating it like we are better"). One step each, each with an example from a different change, every
// line already on the site in its own words:
// 1. data/how.ts NERD.clay: "Claygent prompts live as code: one shared template, five segments, built by a script".
// 2. data/how.ts SKILLS, skill-checking: "My agents' company picks matched a second Claude session on 43 of 50, under
//    my 90% bar; I held the list until a fix passed 47 of 50 new ones". The 86% is the held-list card's (data/proof.ts:
//    "agrees on 43 (86%)", "my bar: 90% agreement"). "until a fix passed", never "a second pass and a new 50", which
//    reads as resampling until it passed. Review (3 Nov, truth): the line names whose picks and who reviewed (it said
//    "a review agrees", which read as an independent review), in the row's past tense.
// 3. data/how.ts HABITS, the email match check, in the card's own fuller words ("On all 2,376 past provider emails ... I
//    ran old and new side by side"): home has no email match card, so "match rules" and "provider emails" say what was
//    replayed (review, 3 Nov). Its caveat goes with it, in the caption, in the card's words ("no one has checked yet
//    whether the 77 are the right people").
// 4. data/how.ts SKILLS, skill-n8n: "On 14 Oct I put error alerts on 40 live workflows" (the n8n row, so "n8n").
// 5. JOBS below, the Precise Leads points: "A merge once put emails on the wrong people; now the list check blocks one
//    address on two people." Its second half is NERD.testing's plainer telling ("blocks a list where one address sits on
//    two people"), with "email": 3 of 4 readers found "one address on two people" cryptic (3 Nov). 3 Nov evening, his yes: the
//    JOBS point says "one email address" too.
// Step 2's caveats travel with it in the caption, all three of the held-list card's limit (that session wrote the
// rubric, the dropped companies were never sampled, fifty is a small sample): master pins them together. Never "Every
// change runs the same loop": these are four different changes, and two Claygent segments ran past a failed gate.
// 3 Nov, the four blind readers: the heading "Five habits, each with a real example", the eyebrow's "as an engineer" and
// the step name "a mistake becomes a check" (a habit told as a rule, wording the site retired on 2 Nov) read as
// AI-written, so the heading says it plainly and step 5 is an action like the other four. `keys` are set in ink, darker
// than the rest of their line; `stamp` is the strip's one red mark, after its line. tests/site.test.mjs holds each line
// to its source.
export type HabitStep = {
  name: string;
  /** The example, one short line each, in the order they appear. */
  lines: string[];
  /** Words in a line set in ink (the numbers a skimmer should catch). */
  keys?: string[];
  /** The red stamp, after line `line`. */
  stamp?: { line: number; word: string };
};

export const FIVE_HABITS: { id: string; eyebrow: string; head: string; steps: HabitStep[]; notes: string[]; replay: string } = {
  id: "five-habits",
  eyebrow: "how I work on outbound",
  head: "Five things I do, and a time I did each",
  steps: [
    {
      name: "build it in code",
      lines: ["Claygent prompts live as code: one shared template, five segments, built by a script"],
      keys: ["built by a script"],
    },
    {
      name: "check a sample against my bar",
      lines: ["my agents' company picks matched a second Claude session on 43 of 50; my bar is 90%", "86%, under the bar:", "until a fix passed 47 of 50 new ones"],
      keys: ["43 of 50", "90%", "86%", "47 of 50"],
      stamp: { line: 1, word: "held" },
    },
    {
      name: "replay old data before switching",
      lines: ["I ran old and new match rules on all 2,376 past provider emails: 77 more passed and no old pass was lost"],
      keys: ["2,376 past provider emails", "77 more passed"],
    },
    {
      name: "ship, then watch the runs",
      lines: ["on 14 Oct I put error alerts on 40 live n8n workflows"],
      keys: ["40 live n8n workflows"],
    },
    {
      name: "turn a mistake into a check",
      lines: ["a merge once put emails on the wrong people", "now the list check blocks a list where one email address sits on two people"],
      keys: ["one email address sits on two people"],
    },
  ],
  notes: [
    "step 2: the second Claude session also wrote the rubric · neither sample included companies the agents dropped · fifty is a small sample",
    "step 3: no one has checked yet whether the 77 are the right people",
  ],
  replay: "replay",
};

// ── Manveen's own words (approved 15 Oct, version A), keep the phrasing. The home hero until 2 Nov; since round 2 of the
// verify loop they open "How working with me goes", above the week sketch, where its ask ("Tell me one task you repeat
// every week") answers them. Since round 3 (2 Nov) that section is its own page, /working-with-me, word for word and
// linked from the footer: all 4 round 2 readers asked whether he wants a job or clients, and his target until 3 Jan is
// GTM engineer roles. ──
export const WEEK_JOB = {
  headline: "Every week has a job that's the same clicks, in the same order.",
  answer: "I make it run by itself,",
  marked: "the same way every time.",
  // Round 6 (2 Nov): the red-pen note beside "the same way every time" is back beside its line. It was cut in round 2
  // when this line left the home page, instead of moving with it (claims row 57: his own words approved 15 Oct).
  nerdNote: "nerd word for this: deterministic. Same input, same result, every time.",
} as const;

/** Path under /public plus its pixel size. Set to null to hide the photo. */
export const PHOTO: { src: string; alt: string; width: number; height: number } | null = {
  src: "/me.jpg",
  alt: "Manveen Singh",
  width: 264,
  height: 330,
};

// ── Tender Radar: prose only. Numbers come from lib/pipeline.ts ──────
// (GitHub at request time when GITHUB_TOKEN is set, else the committed
// data/pipeline-snapshot.json; refresh it with `npm run refresh-snapshot`).
// Off the home page since round 6 (2 Nov, the round 5 jury's blocker): its AI step has failed on every new notice since
// September (a suspended API key: the 1 Nov run ended "success" with 8,274 403 errors, and the classified total has stood
// at 3,671 since 3 Sep) while the runs showed green, so the section's 64 and 8 were 3 Sep numbers. components/Proof.tsx
// stays for when the classifier runs again and a failed classify step fails the run. The repo and the video links stay
// in llms.txt; the intro sentences are his wording.
export const PIPELINE = {
  firstRun: "4 July 2026",
  // Two paragraphs since 2 Nov (verify loop round 2): as one block it was 36 words, over the 30-word cap. His wording.
  intro: [
    "Government contract notices for cleaning, security and facilities work are spread across several UK websites.",
    "I wanted one script to read all of them every morning and sort out which ones each trade should bid on.",
  ],
  // 2 Nov: the bars' pen note ("every bar is a morning nobody pressed a button") is cut: 2 of 4 round 1 readers flagged it
  // as AI-sounding. Round 4 (2 Nov): the sketch's note ("every number here comes from the same run as the bars below")
  // is cut too: the round 3 recruiter read it as a note to an auditor, and the run and save times sit under the bars.
  outage:
    "Its worst stretch was about three weeks, from 21 July to 11 August, when a data-format change broke the morning run and nothing told me.",
  loom: "https://www.loom.com/share/ed073589208c4e24a7543ba30b9d24dc",
  repo: "https://github.com/Manveen07/tender-radar-showcase",
} as const;

// ── The reference: Zackary Beckham's signed letter (11 Jan 2026; he signs as Chief Operations Officer, Caprae Capital
// Partners). Never publish the letter PDF or the email address on it. It renders in the Work section as one plain line
// right after the card marked `reference: true`. Round 4 (2 Nov): the quoted excerpt ("…produced clear and maintainable
// technical documentation, and effectively communicated complex engineering concepts to non-technical stakeholders.")
// is cut: all 4 round 3 readers flagged it as AI-sounding, and every other line of the letter is as generic. The
// reference stays, as a line (moved, not removed). ──
export const REFERENCE =
  "Zackary Beckham, COO of Caprae Capital Partners, wrote me a signed letter of recommendation (11 Jan 2026). Full letter on request.";

// The last line of the Work section, before the resume link.
export const NOW_LINE = "B.Tech Computer Science, MSIT Delhi, 2026.";

// ── Work: jobs, newest first (Precise Leads, then Caprae and its reference), in the Work section right under the
// held-list card. "Built on my own" (PresentAI, after Tender Radar) left the home page in round 4 (2 Nov): three round 3
// readers called it a broken side project, and the cto stopped reading there. Its code stays on his GitHub profile.
// Order matters; tests/site.test.mjs pins it.
export type WorkItem = {
  title: string;
  where: string;
  /** Optional since round 4 (2 Nov): Caprae's detail line says what the system does, so it has no lead. */
  lead?: string;
  /** Optional: leadlens has none; its story is the caught-my-own-test proof card (1 Nov). */
  detail?: string;
  /** Short lines under the detail, one thing each (2 Nov: the Precise Leads paragraph was 101 words, the cap is 30). */
  points?: string[];
  metrics: [string, string][];
  stack: string[];
  links?: { label: string; href: string }[];
  /** A line under `where`, for a card that is a job (title, dates, place). */
  role?: string;
  /** Zackary's reference renders as one line right after this card. */
  reference?: true;
  /** A real 2x2 score (spec 3.2). Counts are against hand labels; see claims row 43. */
  scorecard?: { caught: number; missed: number; falseAlarms: number; leftAlone: number; caption: string };
  /** A real screenshot under /public (spec 3.3), with its true pixel size. */
  shot?: { src: string; alt: string; width: number; height: number };
  /** A red margin note beside the card (wide screens) or under it (phones). None since 1 Nov; the quote has its own. */
  note?: string;
};

export const JOBS: WorkItem[] = [
  {
    // 2 Nov (verify loop round 2): was "Outbound, built end to end" (a reader flagged it as AI-sounding).
    title: "Outbound pipeline",
    where: "At Precise Leads",
    // Title and start date from public/resume.pdf ("Precise Leads, Nov. 2025 to Present"). The rest was rewritten
    // 15 Oct from his own repos (gtm, precise-automator, infra-bot, slack message exporter); claims rows 77 to 81.
    // 1 Nov: "a check that runs before anything goes out" narrowed to drafts he uploads himself, as on /how-i-build:
    // ticked rows reach the sending tool through n8n without the check (new 10x engineer money\applications\bustem\
    // NOTES.md line 11, jury round 1: "ticked rows reach Smartlead through n8n ungated").
    role: "GTM automation engineer · Nov 2025 → now · remote",
    // 2 Nov (verify loop round 2): the 101-word paragraph (all 4 readers called it a wall; one sentence was 42 words) is a
    // lead and short points, the same facts. The agency reader said the inbox bot and the sequence tool were buried.
    // Round 3 (2 Nov): the old lead ("Finds the companies worth writing to and the right person at each, then writes
    // emails that only say what the research found.", flagged by 2 round 2 readers) is cut, and 34,044 prints once, on
    // its tile, so the old detail's first sentence and its quote rule are the lead.
    // Round 5 (2 Nov): the agency reader's edge sentence left out the AI two rounds running, so the lead says "The AI
    // step" ("The prompt" until then) and the first point is his Claude Code follow-up agents, in /how-i-build's checked
    // words (data/how.ts AGENTS; SOURCES.md row 33: "since 16 Oct", "approves each draft before it sends"; never "daily"
    // or "every morning"). "asks for a quote" stays: two segments ran with quotes behind only 87.5% and 78.6% of yeses.
    // The mistake point gave its generic wording ("When someone spots a new kind of mistake, it becomes a check that runs
    // before upload.", flagged by the round 4 cto) for the example /how-i-build tells in How I test (NERD.testing[1]: the
    // list check now blocks a list where one address sits on two people). Points stay at 20 words or fewer.
    // Round 6 (2 Nov, 2 of 3 jurors): "Each new kind of mistake becomes a check before upload, like blocking a list with
    // one address on two people." (3 of 4 round 5 readers flagged it; "each new kind" was a habit told as a rule) is the
    // past event itself, from the same NERD.testing[1] line. 19 words.
    lead: "I built the agency's outbound pipeline. The AI step that sorts companies asks for a quote from the company's own website behind every yes.",
    points: [
      "Since 16 Oct my Claude Code agents have drafted follow-ups to interested leads; a person approves each before it sends.",
      "Each draft I upload myself is checked claim by claim against the research.",
      "A merge once put emails on the wrong people; now the list check blocks one email address on two people.",
      // 3 Nov (his ask): was "I also built the Slack bot that buys and warms up the sending inboxes.", untrue as written
      // (the bot's checked inventory: a teammate started it, a person places every order, and Smartlead does the
      // warming). The bot's git history: 365 of its 386 commits are his, the health scores and the order code all his.
      // 22 of the 365 are his pull-request merges, so the line says "are mine", never "I wrote" (the truth review, 3 Nov).
      // 18 words; /how-i-build's The inbox fleet tells the rest.
      "365 of our inbox bot's 386 commits are mine: daily health scores for every inbox, and orders a person approves.",
      "I built the tool that turns a client's sequence into a ready campaign.",
      "My daily scan of five sales-tool Slack communities passes likely buyers to the sales team.",
    ],
    // Round 3 (2 Nov): the "0 contradicted claims in 300 drafted emails, scored by an AI judge with no human check" tile
    // is out (claims row 81: all 4 round 2 readers said its caveat cancels it). In its place a number that stands on its
    // own: one email batch, never a find rate (SOURCES.md rows 17 and 18; claims row 82a), "in one batch" beside it.
    // "claude code" joins the stack: the follow-up drafts are his Claude Code agents' (data/how.ts AGENTS), and the round
    // 2 founder's edge sentence never said AI.
    // 3 Nov (his ask, "you can decide on these"): the bounce result and its control lead the tiles, the outcome every
    // blind reader asked for that has a public source (SOURCES.md row 31; the /how-i-build bounce story).
    metrics: [
      ["2.74% → 0.73%", "bounces on my lists after the mail-server screen; a teammate's lists without it: 2.26% → 2.09%"],
      ["12,030", "verified emails for 15,514 decision-makers, in one batch"],
      ["34,044", "companies sorted in four days"],
    ],
    stack: ["claude code", "python", "typescript", "clay", "smartlead", "n8n"],
  },
  {
    title: "Resume screening, automated",
    where: "At Caprae Capital Partners",
    // Title and dates come from the signed letter (11 Jan 2026); "US, remote" from the resume.
    role: "Machine Learning Intern · Aug 2025 → Jan 2026 · US, remote",
    reference: true,
    // Round 4 (2 Nov): the lead ("Reads incoming resumes, ranks the candidates, and books the interviews.", flagged by the
    // round 3 cto) is cut; the detail says the same thing concretely. The tiles "10h → 3h" (screening per week) and
    // "5 → 1.5" (days to a shortlist) are cut too: the cto found them the only numbers with no source beside them. Their
    // claims row (29, his own Feb 2026 draft) was never settled, the resume sources table cites this site's own copy, and
    // the letter has no numbers: self-reported only.
    // Round 5 (2 Nov): the four-verb chain ("The system reads each one, scores it against the role, writes the shortlist
    // and schedules the calls.", flagged by the round 4 cto) is one first-person line of what he built, and "A recruiting
    // team spent about ten hours a week reading resumes by hand." is cut: its number has the same unsettled, self-reported
    // source as the tiles. Ranking against the role, the shortlist and the scheduling are the resume's and his drafts'
    // (claims row 30).
    detail: "I built a screener that ranks each incoming resume against the role and books calls with the shortlist.",
    metrics: [],
    stack: ["python", "embeddings", "slack"],
  },
];

// OWN_WORK (Built on my own: PresentAI, with its screenshot and "See the code ↗") left the home page in round 4 (2 Nov):
// three round 3 readers asked why a broken side project was there, and the cto stopped reading at it. PresentAI stays on
// his GitHub profile (github.com/Manveen07/PresentAI); public/work/presentai.png is kept for a later use.

// ── drawing-proof: an AI reads engineering drawings, marked against my own labels (added 22 Oct) ──
// A home page block until later on 22 Oct, now the post /writing/marking-the-ais-homework (data/posts.ts).
// Manveen: "these are the blogs"; "I want my website to be not filled with balls of text".
// Manveen's pick on 22 Oct ("make sure they're quirky"): the red pen marks the AI's answers like homework.
// Paths below are under C:\Users\Manveen\Desktop\new_things_to_mess_araound\new 10x engineer\projects\drawing-proof\.
// Every figure is from out/EVAL.md, "drawing-proof v1: evaluation", 26 Sep 2026, model gemini-3-flash-preview,
// the only model that finished all 23 drawings that day (claims rows 84 to 92). The 13 Oct Claude run is left out.
export const DRAWINGS = {
  // 22 Oct, a fresh reader's notes: the tool's name left the title ("Marking the AI's homework · drawing-proof" until then).
  title: "Marking the AI's homework",
  // EVAL.md line 3: "23 real public drawings, hand-labelled before the tool ever ran on them." "A price quote", not
  // "a quote": on this page "quote" also means the text a value was read from.
  lede: "Can an AI fill in a price quote from an engineering drawing? I answered 23 real drawings myself first, then marked its work.",
  // What it fills in: EVAL.md "The honest email claim" and the per-field table (part number, revision, material,
  // finish, tolerances, BOM rows), each value with the exact text it came from (the evidence column). The last
  // sentence is the lesson, said early: EVAL.md "Every wrong value", "the quote is genuine but it landed in the wrong field".
  what: "It reads the drawing (a PDF) and fills in the part number, revision, material, finish, tolerances and every line of the parts list. Each value comes with the exact text it was read from. That proves the text is on the drawing, not that it went in the right box.",
  // A crop of the real sheet, rendered 22 Oct with pymupdf at 340 dpi from data/drawings/machined-rod-harmonic-analyzer.pdf,
  // clip (962, 641) to (1189, 757) pt: the right half of the title block. Pixels untouched; the red marks are an SVG on top.
  shot: {
    src: "/work/rod-titleblock.png",
    alt: "The title block of the pinion lift rod drawing: PART pinion-lift-rod, DWG. NO. MHA-060, REV v32, scale 1:1, unit mm.",
    width: 1073,
    height: 549,
  },
  // EVAL.md wrong value #3 (machined-rod): label MHA-060, tool said "pinion-lift-rod", "Took the title block's PART (name)
  // cell instead of DWG. NO." out/records/gemini-3-flash-preview/machined-rod-harmonic-analyzer.json: part_number
  // "pinion-lift-rod", evidence "PART pinion-lift-rod"; drawing_number "MHA-060" read right; call.seconds 205.3,
  // tokens_out 64013 (one of the 6 runs that hit the output cap; 2 of those 6 had a wrong value, this is one of them).
  caption: "Circled: what it wrote in the part number box, with \"PART pinion-lift-rod\" quoted as its proof. Underlined: the part number.",
  shotNote: "that's its name, not its part number. It thought for 205 seconds to get here.",
  // EVAL.md headline table, gemini-3-flash-preview column: wrong values 7 (1.7%) of 419 fields scored; correct when
  // the drawing states the value 316 / 326; left blank when it does not 89 / 93; BOM / cut-list fields 194 / 194,
  // plus 1 header row read as a part. The sums, from EVAL.md "Per field" (verified output) and
  // out/EVAL-tables-gemini-3-flash-preview.md "wrong values (7)":
  // - 326 + 93 = 419. ALL row: 316 correct, 89 correct_absent, 1 partial, 1 missed_flagged, 5 missed_silent, 7 wrong.
  // - Of the 326 (a label exists): 316 right, 3 wrong (hole count 36, part number MHA-060, revision 8-21),
  //   5 missed_silent, 1 missed_flagged, 1 partial = the 10 it didn't get.
  // - Of the 93 (label None): 89 left blank, 4 wrong (the BOM header row, two tightest tolerances, the March 2015
  //   revision). 3 + 4 = the 7 wrong; 7 wrong + 7 missed or half right = 14 = (326 - 316) + (93 - 89).
  // - "Flagged": EVAL.md "Misses", the stair material: "The verifier couldn't find that string in the PDF text, so it
  //   blanked the value and flagged it." "Half right": the one partial (stock, structural).
  // - The 194 are inside the 419: bom.part_number 53 + bom.description 42 + bom.qty 67 + bom.material 20 +
  //   bom.length 12 = 194 rows of the per-field table, all correct. The header row is bom.extra_row, n 1, wrong:
  //   wrong value #1, one of the 4 in the 93.
  marks: [
    ["7 of 419", "answers wrong (1.7%)"],
    ["316 of 326", "right, where the drawing gives the value"],
    ["89 of 93", "left blank, where it doesn't"],
    ["194 of 194", "parts list fields right"],
  ] as [string, string][],
  // How the four numbers fit, from the sums above. A fresh reader couldn't tell the 194 were inside the 419, or what
  // "flagged" meant (22 Oct).
  sums: "419 boxes in all: 326 where the drawing has an answer, 93 where it doesn't. The 194 parts list fields are in there too. Of the 326 with an answer it got 316: 3 wrong, 6 left blank (once with a note saying it wasn't sure), 1 half right. Of the 93 with no answer it made up 4, one of them the parts list's own header row, read as a part. 3 + 4 = the 7 wrong.",
  // EVAL.md "Every wrong value": "All 7 quote real text from the sheet: the quote is genuine but it landed in the wrong
  // field." "It also means the verifier (value must appear in its own quote and in the PDF text) could not catch them.
  // Raw and verified wrong counts are identical." Wrong value #2: hole_count label 36, tool said 20.
  wrongLine: "All 7 wrong answers quote real text from the sheet. The text is there. It just went in the wrong box, like the rod above, or got counted wrong (20 holes, where the drawing has 36). My own checker, which makes sure every value is in its quote and on the page, passed all 7. A quote proves the text exists, not that it went in the right box. So check the box.",
  // The method of the whole post, said plainly at its end: EVAL.md line 3 (labelled before the tool ran) and "Every wrong value".
  // "Red pen optional": the post's own joke (the red marks on the crop), Manveen's "make sure they're quirky".
  lesson: "Before you trust an AI that reads your documents, answer a small batch yourself and mark its work. Red pen optional.",
  // EVAL.md caveats: "One labeller (me), no second reviewer"; "all CAD exports, no scans"; "All 23 were clean CAD PDFs,
  // and 22 of them have a usable text layer" (the Eaton sheet was read from the image alone, so "with a text layer" is
  // not said of all 23). Scans untested: verdict, "Scanned, faxed or photographed drawings: unknown."
  finePrint: "One person labelled them: me. All 23 are clean CAD exports, no scans, so scanned drawings are untested. Marked 26 Sep 2026.",
  // EVAL.md caveats: "Two labels were corrected after the first run, both because the model was right and I was wrong."
  finePrintNote: "it marked me back twice: two of my labels were wrong, and it was right.",
  // data/SOURCES.md: machined-rod-harmonic-analyzer.pdf, "CC BY-SA marked in the title block; repo LICENSE file is MIT".
  // The title block reads "© 2026 Pedro Paulo Vezza Campos" and a CC BY-SA badge with no version number.
  credit: {
    by: "Pedro Paulo Vezza Campos",
    project: "harmonic-analyzer",
    projectHref: "https://github.com/pedropaulovc/harmonic-analyzer",
    licence: "CC BY-SA",
    licenceHref: "https://creativecommons.org/licenses/by-sa/4.0/",
  },
  // pyproject.toml dependencies: google-genai, pymupdf, pydantic.
  stack: ["python", "gemini", "pymupdf", "pydantic"],
} as const;

// ── Things AI got confidently wrong: pinned notes (added 22 Oct) ──
// A home page block until later on 22 Oct, now the post /writing/things-ai-got-confidently-wrong (data/posts.ts).
// Manveen, 22 Oct: "make sure their quirky" and "have distriibuted date and last one in september". Each date is the
// day the mistake was caught, from a dated file or commit; nothing from October. The block teaches, it never pitches.
// Paths are under C:\Users\Manveen\Desktop\new_things_to_mess_araound\new 10x engineer\ (claims rows 93 to 100).
export type Pin = {
  /** ISO date for <time>, and the date as shown. */
  iso: string;
  date: string;
  title: string;
  /** The AI's own words or data, in mono. `marked` gets the red pen. */
  exhibit: { before: string; marked: string; after?: string; pen: "circle" | "tight" | "underline" };
  /** The red scribble beside the exhibit. */
  scribble: string;
  what: string;
  now: string;
};

export const WRONG: { title: string; lede: string; pins: Pin[] } = {
  title: "Things AI got confidently wrong",
  lede: "Pinned here so I don't forget them. Each one came back sounding sure of itself, and each one changed what I check.",
  pins: [
    {
      // notes/week-1-saturday-notes-v2.md, "Open-coding 50 traces (Mon 2026-05-25)": "0.95 confidence | 50/50 |
      // Definitive hardcoded default", "Hard failure (label ≠ ground_truth) 0/50"; commit 0baea8bc, 25 May 2026.
      // The 50 traces (month-1/test files/traces.json at 6cb8d6e8): every output has "confidence": 0.95.
      // The fix: projects/business-classification-pipeline/leadlens_v01.py, confidence_reasoning Field(min_length=100),
      // "No score without reasoning." Already told on this site in the post /writing/schema-as-eval-spec.
      iso: "2026-05-25",
      date: "25 May 2026",
      title: "0.95, fifty times",
      exhibit: { before: '"confidence": ', marked: "0.95", pen: "circle" },
      scribble: "on all 50 of them",
      what: "A classifier I was building gave all 50 of its answers the same confidence, 0.95. The answers were fine. The number meant nothing: it was filling in a box.",
      // No after-number: the week-1 notes (and commit 0baea8bc) record the 50/50 at 0.95 and the planned fix
      // ("Reasoning-before-confidence"), not how the scores spread once it was in. So the line claims what the
      // min_length=100 field does, not that the number became trustworthy (a fresh reader's note, 22 Oct).
      now: "a score the model writes is just more text. Mine now has to write out its reasons first, 100 characters at least, before it's allowed a score. That stops it filling in the box blind. It doesn't make the number right by itself.",
    },
    {
      // client-hunting/BUG-STALE-TENDER-JUL7.md: "15 leads total got this same dead-tender pitch ... all fired 2026-07-07";
      // "the tender closed 1 August 2025"; "deadline_hint": "" in the stored record; the classifier prompt "DOES instruct
      // the LLM to skip tenders 'with a deadline already passed' but with nothing in deadline_hint to check, it had no
      // signal". Fix the same day, commit b51d9167 (7 Jul 2026): "a hard code filter (not just the LLM instruction)
      // drops unknown/unverified/expired tenders from the digest regardless of what the model said."
      iso: "2026-07-07",
      date: "7 Jul 2026",
      title: "A blank deadline, read as fine",
      exhibit: { before: '"deadline_hint": ', marked: '""', pen: "circle" },
      scribble: "it closed in Aug 2025",
      what: "I emailed 15 businesses about a cleaning tender my pipeline called live. It had closed eleven months earlier. The prompt said to skip anything past its deadline, but the deadline was blank, so the model had nothing to check.",
      now: "rules that matter live in code, not in the prompt. A plain filter now drops any tender with a past or unknown deadline, whatever the model says.",
    },
    {
      // Commit c6327322 (20 Jul 2026, co-authored by Claude): three new trades (pest, grounds, electrical-testing),
      // message "tests (12/12)". Its test_radar.py has 12 tests and none reads profiles/*.yaml or FirmProfile.
      // Commit f6eff1e6 (11 Aug 2026): the three profiles had staff_count as an int and lacked two required fields;
      // "crashing on FirmProfile validation since ~20 July". Claims row 11: scheduled runs failed on all 22 days,
      // 21 Jul to 11 Aug. The bars: the home page's Tender Radar section, last 40 scheduled runs, red when one failed
      // (row 13). "Higher up this page" until the notes became a post on 22 Oct.
      // Rewritten 22 Oct for a reader who isn't an engineer (a fresh reader's notes). What Tender Radar is: its
      // README, "Scans public UK tenders, classifies bid / maybe / skip for a small B2B service firm"; the scheduled
      // run is daily (row 11). What broke, from f6eff1e6: the three new profiles/*.yaml (each describes a sample firm
      // in the trade) "were missing the required security_clearance and insurance fields" (and two had staff_count as
      // an int), so the daily job crashed "on FirmProfile validation". The 40: data/pipeline-snapshot.json history.
      iso: "2026-08-11",
      date: "11 Aug 2026",
      title: "12 of 12, and down for three weeks",
      exhibit: { before: "", marked: "tests (12/12)", pen: "underline" },
      scribble: "none of them opened the new files",
      // Round 6 (2 Nov): "sorts out" is past ("until September"): its AI step has failed on every new notice since then
      // (a suspended API key: gh run 41304264801 of 1 Nov ended "success" with 8,274 403 errors), and the bars this note
      // pointed at left the home page. His lesson line ("So I watch the run, not the tests.") stays; the September truth
      // follows it, with no claim of a fix (a failed classify step does not fail the run yet).
      what: "Tender Radar is my script that reads UK government tender notices every morning and, until September, sorted out which ones were worth a bid. An AI helped me add three trades to it, each with a little file describing a sample firm. Its commit said the tests passed, 12 of 12. The new files were missing two details the script insists on, so the morning run crashed on them every day for three weeks. None of the 12 tests had opened them.",
      now: "a passing test only vouches for what it opens. So I watch the run, not the tests. From September its AI step failed on every new notice and no run went red for it, so its bars came off my home page.",
    },
    {
      // Commit 7abe5472 (19 Sep 2026): "Two OpenCode runs produced confident write-ups whose quotes did not support
      // them - a 'POD matching' lead whose only 'POD' was inside 'chiropody' ... a duty here counts only when its regex
      // hit AND the sentence it hit is stored beside the label. No sentence, no duty, no row." client-hunting/tools/
      // discover.py (LinkedIn job adverts, point 2) and tools/clay_duties.py: "\b keeps 'POD' from matching inside
      // 'chiropody', which it did once." OpenCode is an AI coding agent.
      iso: "2026-09-19",
      date: "19 Sep 2026",
      title: "POD matching, allegedly",
      exhibit: { before: "chiro", marked: "pod", after: "y", pen: "tight" },
      scribble: "feet, not freight",
      what: "An AI agent reading job adverts for me wrote up a firm as one that matches proof of delivery paperwork, POD for short. The only POD in the advert it quoted was inside the word chiropody.",
      now: "no sentence, no claim. A lead only counts if the exact sentence behind it is saved next to it, and POD has to be a whole word.",
    },
  ],
};

// ── Spot the namesake: the post about champion-move-checker (3 Nov 2026) ──
// His pick of the 3 Nov animation mockups: option 2 on home, "other can be in their respected blogs", so option 3 (the
// visitor calls three champion moves, then the real gate output plays) is this post. The repo had no write-up on the
// site, only a link in the skills row and the "things you can check" list. Every case, number and line below is from
// its public README (github.com/Manveen07/champion-move-checker, read 3 Nov at commit c7ac598fc568, "README: correct
// the blind-set bound"), in its words or close to them; the data in it is made up, and the page says so.
// components/Namesake.tsx draws it, lib/md/posts.ts prints the same words, tests/site.test.mjs holds them.
export type NamesakeCall = "MATCH" | "HOLD" | "NO_MATCH";
export type NamesakeCase = { crm: string; signal: string; call: NamesakeCall; why: string };

export const NAMESAKE: {
  title: string;
  lede: string;
  id: string;
  eyebrow: string;
  head: string;
  intro: string;
  tags: { crm: string; signal: string; call: string };
  picks: { call: NamesakeCall; label: string }[];
  howToPlay: string;
  verdict: { same: string; differ: string };
  cases: NamesakeCase[];
  gate: { id: string; intro: string; run: string; replay: string; lines: string; stamped: string; rule: string };
  after: Block[];
} = {
  title: "A champion tracker that can say it isn't sure",
  // README line 3: "When a past champion changes jobs, this finds them at the new company. When it isn't sure it's the
  // same person, it holds the match for a person instead of guessing."
  lede: "When a past champion changes jobs, my checker finds them at the new company. When it isn't sure it's them, it holds the match for a person instead of guessing.",
  id: "spot-the-namesake",
  // The README's sample run: `python -m champion run data` (15 champions, 22 job-change signals), "made-up data".
  eyebrow: "made-up data, three cases from my public repo's sample run",
  head: "Spot the namesake",
  intro: "A past champion changed jobs. Is it really them? Make your call on each one, then see the checker's.",
  tags: { crm: "in the CRM:", signal: "signal:", call: "the checker:" },
  // README "What it decides": MATCH, HOLD, NO_MATCH. The buttons say them in plain words.
  picks: [
    { call: "MATCH", label: "match" },
    { call: "HOLD", label: "hold" },
    { call: "NO_MATCH", label: "not a match" },
  ],
  // Markdown only: the page has the buttons this sentence describes.
  howToPlay: "On the page you pick match, hold or not a match for each case, and your pick shows the checker's call and whether it is the same as yours.",
  // 3 Nov, all four blind readers: a pick never said whether it matched the checker's. Both lines are in the server HTML
  // under every call; CSS shows the one that fits once a pick is made (data-result), so no word exists only in JavaScript.
  verdict: { same: "you picked the same", differ: "you picked differently" },
  // README "What it decides", the sample run's table: rows 1, 4 and 7. Review (3 Nov): all four blind readers called the
  // game unfair, because case 1's answer rested on evidence the signal never showed, so its signal carries the profile
  // URL the way the README's row 2 does ("Anna Kowalski at Orbitly, same profile URL"). Case 3's reason spells out the
  // README's "(the real one, now at Proseware, is an alert)": four readers asked where Proseware came from (the sample
  // run's 22 signals include the real Priya Raman's move).
  cases: [
    { crm: "Robert Chen, Northwind Travel", signal: "Bob Chen, now CFO at Fabrikam, same profile URL as the CRM's", call: "MATCH", why: "same profile URL as the CRM record" },
    { crm: "James Smith, Woodgrove", signal: "two James Smiths, both ex-Woodgrove", call: "HOLD", why: "2 signals look like James Smith: a person picks" },
    { crm: "Priya Raman, Contoso", signal: "Priya Raman, a designer at Litware, never at Contoso", call: "NO_MATCH", why: "a namesake; the real Priya Raman is in another signal, now at Proseware, and that one is an alert" },
  ],
  gate: {
    id: "the-gate",
    // README "How it's tested": "29 dev cases (cases/dev.jsonl), written and labelled while building ... The careful
    // matcher passes them by construction, so they prove little on their own." Review (3 Nov, truth): the 29/29 = 100%
    // showed without that caveat, so it sits right above the output.
    intro: "Then the real gate output from the README, on the 29 cases written and labelled while building. Mine passes them by construction, so they prove little on their own.",
    run: "run the gate",
    replay: "replay",
    // README lines 10 to 18, the code block under the badge, exactly (its spacing kept).
    lines: [
      "$ python -m champion gate cases/dev.jsonl --matcher naive      # the naive version",
      "agreement with labels  8/29 = 28%",
      "  wrong alerts          12       must be 0",
      "  lost moves             9       must be 0",
      "BLOCKED",
      "",
      "$ python -m champion gate cases/dev.jsonl                      # this one",
      "agreement with labels  29/29 = 100%",
      "PASS",
    ].join("\n"),
    // The one red on the page: the naive version's verdict, stamped.
    stamped: "BLOCKED",
    // README "How it's tested", the release gate, word for word.
    rule: "A matcher ships only with 0 wrong alerts, 0 lost moves, needless holds on at most 20% of signals, and no alert on a name alone.",
  },
  // The story under the game, as prose blocks (components/Prose.tsx draws them; lib/md/posts.ts prints them).
  after: [
    { t: "h2", s: "Why I built it" },
    // README "Why this exists", near word for word; the session line is README line 7 ("built in one session (about 90
    // minutes, 29 Oct 2026) with Claude Code"). "29 Oct" with no year: the post is dated 3 November 2026.
    { t: "p", s: "A GTM engineer hiring post asked for a champion tracker that holds uncertain matches. I can't share my day-job code, so I built a small public one on made-up data." },
    { t: "p", s: "I built it the way I build the real ones: labelled cases first, then a gate that has to block the naive version, then fixes until it passes." },
    // Review (3 Nov): "It took one session" read as the testing alone; the README's 90 minutes is the whole build.
    { t: "p", s: "Then I tested it on cases the code had never seen. The whole build took one session with Claude Code, about 90 minutes, on 29 Oct." },
    { t: "h2", s: "What the naive version gets wrong" },
    // README "The failure it's built around", split into short paragraphs.
    { t: "p", s: "The naive version says: same name, different company, so they moved. It's in the repo on purpose. On 29 labelled signals it agreed with 8." },
    { t: "p", s: "It would have told account owners that 12 people had moved when they were namesakes or hadn't moved, like a designer in Chennai who shares a champion's name." },
    { t: "p", s: "It read \"Litware Inc.\" and \"Litware\" as two companies. And it silently dropped 9 real moves: Bob for Robert, José written Jose, a new surname after marriage." },
    // 3 Nov: all four blind readers flagged "A name alone is never proof" as AI-written; the release gate's own words
    // ("no alert on a name alone") say the same plainly.
    { t: "p", s: "The fix weighs evidence, strongest first, and never alerts on a name alone: every alert rests on the same profile URL or the old company in their history." },
    { t: "h2", s: "Three blind test sets" },
    // README's table at the top and "What the blind tests caught": first runs 23/31, 25/31, 20/31, all BLOCKED; after
    // fixing what each found, 28/31, 27/31, 25/31. holdout-1's two lost moves (Yevgenia and Evgeniya); holdout-2's wrong
    // alert (the new job started nine months before the champion last replied from the old company) and its lost move
    // (Becky for Rebecca); holdout-3's 10 needless holds (32%, over the 20% budget), the LLP and K.K. suffixes and its
    // lost move (Shcherbinina and Scherbinina). "fitted, not proof" and "only the first-run numbers count as blind".
    { t: "p", s: "A separate AI agent wrote each set of 31 signals from the decision rules only, never the code. All three were BLOCKED on their first run." },
    {
      t: "ul",
      items: [
        "**holdout-1:** 23/31 = 74%. Two lost moves, one of them \"Yevgenia\" and \"Evgeniya\" Kharitonova, read as two people. Now 28/31.",
        "**holdout-2:** 25/31 = 81%. A lost move, \"Becky\" for \"Rebecca\", and a wrong alert: the new job started before the champion's last reply from the old company. Now 27/31.",
        "**holdout-3:** 20/31 = 65%. \"LLP\" and \"K.K.\" company suffixes, Shcherbinina and Scherbinina (a lost move), and 10 needless holds: 32%, over my 20% budget. Now 25/31.",
      ],
    },
    // 3 Nov: all four blind readers flagged "fitted, not proof" as AI-written; README line 29's own words ("The after-fix
    // scores are fitted to the sets") keep the caveat whole.
    { t: "p", s: "Those later scores come after I fixed what each set caught, so they are fitted to that set. Only the first runs count as blind." },
    { t: "h2", s: "Why it holds so much" },
    // README "What the misses say", word for word but the first sentence's order. Review (3 Nov, truth): "That's on
    // purpose" said the misses were deliberate (holdout-3 was BLOCKED for them); the README says the design leans that way.
    { t: "p", s: "Across the 93 blind signals on first runs: 1 wrong alert, 4 lost moves, and the rest of the misses were extra holds. The design leans towards holding on purpose." },
    { t: "quote", s: "A wrong alert costs a champion's trust; a hold costs a reviewer a click." },
    { t: "p", s: "holdout-3 shows the price: a third of its signals held for no reason." },
    { t: "h2", s: "What it can't claim" },
    // README "Limits" (made-up data) and "How it's tested" (who labelled the blind sets; too few to claim a rate, the
    // line corrected 31 Oct 2026, the README commit above).
    { t: "p", s: "Made-up data. Real job-change data is messier: missing fields, stale profiles, many more namesakes." },
    { t: "p", s: "The blind labels come from AI agents, not people, and the agents had similar briefs, so they can share blind spots." },
    { t: "p", s: "1 wrong alert in 93 blind signals is too few to claim a rate. Real labelled data would give one." },
    { t: "h2", s: "Run it yourself" },
    // README line 7 ("Python 3.11+, nothing to install") and "Run it"; "How I'd run it in Clay" is a README section.
    { t: "p", s: "It's on GitHub: [champion-move-checker](https://github.com/Manveen07/champion-move-checker). Python 3.11+, nothing to install. The README has the rules, the blind sets and how I'd run it in Clay." },
    { t: "code", lang: "shell", s: "python -m champion gate cases/dev.jsonl --matcher naive" },
    { t: "p", s: "It prints BLOCKED. Drop `--matcher naive` and it prints PASS." },
  ],
};

// ── The contact section (2 Nov, verify loop round 2) ──────────────────
// All 4 round 1 readers asked whether he wants a job or clients (home ended on the pilot, /how-i-build on "Hiring a GTM
// engineer?"). His target is GTM engineer roles, the freelance pilot second, so the section opens with /how-i-build's
// ask under /how-i-build's label, word for word (data/how.ts CONTACT.ask and VISUAL.kickers.contact; a test holds them
// equal). Round 3 (2 Nov): all 4 round 2 readers still asked, so the pilot left home for /working-with-me (FREELANCE
// below), and Say hi ends the way /how-i-build's does: the ask, the address, the hours line (CONTACT.where), the links.
// Round 5 (2 Nov): "Hiring a GTM engineer? Tell me about the role." lost its question (the round 4 recruiter flagged it);
// the same ask, the job first.
export const SAY_HI = {
  kicker: "Say hi",
  ask: "If you're hiring a GTM engineer, email me about the role.",
} as const;

// ── The freelance pilot's page, /working-with-me (round 3, 2 Nov): its rail label, and the one link to it, in the
// footer of every page. The label is the session's wording. ──
export const FREELANCE = {
  kicker: "Freelance automation",
  link: "Freelance: automation projects",
  href: "/working-with-me",
} as const;

// ── How working with me goes: the page /working-with-me since round 3 (2 Nov), word for word ──
export const PILOT = {
  head: "How working with me goes",
  opener:
    "On the first call you tell me what wastes the most time. If it isn't a real problem, I'll say so and we won't build it.",
  steps: [
    "If it is, I quote a fixed price for a pilot before any work starts.",
    "The pilot runs on a month of your real requests. Every miss gets logged, and you see the list, not just a score.",
    "If you keep it, a monthly fee covers me looking after it.",
  ],
  // 2 Nov (verify loop round 2) cut "not just a score" from the step above and the timeline's pen note below (3 of 4
  // readers flagged it). Round 6 (2 Nov): both are back, word for word: his own offer terms (claims row 56) and the
  // approved red-pen design of 14 Oct, cut on reader flags without his yes. voice_check flags "not just" as a staged
  // contrast; his keep or cut is asked.
  note: "you see every miss, not just a score",
  // The section's end: no button, just the address and, small, the calendar (one Calendly link on the page).
  ask: "Tell me one task you repeat every week. I'll reply within a day and say whether it can run by itself.",
  calendar: "or pick a time on my calendar",
  sketchLabel:
    "A call about what wastes your time, then a fixed quote, then a month on your real requests with every miss logged, then you decide whether to keep it.",
} as const;
