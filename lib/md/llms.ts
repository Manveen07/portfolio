// /llms.txt (the llmstxt.org format, checked 22 Oct 2026) and /llms-full.txt.
// Manveen's words come first (data/llms-intro.ts); every section after them is generated from the site's data.

import { ME, PIPELINE, JOBS, DRAWINGS as D, WRONG, NAMESAKE, PILOT, FREELANCE, FIVE_HABITS, REFERENCE, type WorkItem } from "@/data/portfolio";
import { NEWEST_FIRST, postDate, type Post } from "@/data/posts";
import { RESUME } from "@/data/resume";
import { LLMS_INTRO } from "@/data/llms-intro";
import { abs, mdHref } from "@/lib/site";
import { para, list, link } from "@/lib/md/format";
import { homeMarkdown } from "@/lib/md/home";
import { resumeMarkdown } from "@/lib/md/resume";
import { postMarkdown } from "@/lib/md/posts";
import { howMarkdown } from "@/lib/md/how";
import { workingMarkdown } from "@/lib/md/working";
import { HOW, HELD, LIVE, CONTACT, VISUAL, SPLIT, NERD, INBOX, FREE_CHECK, logSummary, shortDate } from "@/data/how";
import { PROOF } from "@/data/proof";

const lc = (s: string) => `${s.charAt(0).toLowerCase()}${s.slice(1)}`;
/** A link label without its drawn arrow. */
const bare = (s: string) => s.replace(/\s*[↑↓→↗]$/, "");

/** What llms-full.txt holds, in its order. Its own intro says this, and so do llms.txt's Pages list and howToRead in
    data/llms-intro.ts; tests/ai.test.mjs holds the three together (3 Nov: two of them still said "the resume, the home
    page and every post" from 22 Oct, before /how-i-build and /working-with-me were added). */
const FULL_HOLDS = `the resume, the home page, ${lc(HOW.title)}, ${lc(PILOT.head)} and every post`;

/** H1, the blockquote summary, then Manveen's paragraphs: the part of both files he writes. */
function intro(title: string): string {
  return [`# ${title}`, `> ${LLMS_INTRO.summary}`, ...LLMS_INTRO.details.map(para), ...LLMS_INTRO.howToRead.map(para)].join("\n\n");
}

const home = mdHref("/");

/** The free check figure's numbers as sentences, in its order, each caveat beside its number. 3 Nov, late: on the home
    page the figure takes the place of the bounce tile and the 34,044 tile, so the job's line carries them from here. */
function freeCheckNumbers(): string {
  const F = FREE_CHECK;
  const R = F.result;
  const rows = F.rows.map((r) => `${r.name} (${r.sub}): ${r.value}.${r.note ? ` ${r.note}` : ""}`);
  return [`${F.head}.`, ...rows, `${R.name} (${R.sub}): ${R.lines.join("; ")}.`, R.note].join(" ");
}

/** One line per piece of work: what it is, then its numbers as the page states them. */
function workLine(w: WorkItem): string {
  const nums = w.scorecard
    ? [`${w.scorecard.caption} ${w.scorecard.caught} caught, ${w.scorecard.missed} missed, ${w.scorecard.falseAlarms} false alarms, ${w.scorecard.leftAlone} left alone`]
    : w.metrics.map(([n, label]) => `${n} ${label}`);
  const numbers = [w.freeCheck ? freeCheckNumbers() : "", nums.length ? `${nums.join("; ")}.` : ""].filter(Boolean).join(" ");
  const where = [w.where, w.role].filter(Boolean).join(", ");
  // 3 Nov (the AI-friendly audit): the job's points too (the Claude Code agents, the inbox bot's commits), and the
  // reference line under the card: an agent working from this file alone saw only the counts.
  const points = w.points?.length ? ` ${w.points.join(" ")}` : "";
  const reference = w.reference ? ` ${REFERENCE}` : "";
  return `${link(w.title, home)}: ${where}. ${w.lead ?? w.detail ?? ""}${points}${numbers ? ` Numbers: ${numbers}` : ""}${reference}`;
}

/** /how-i-build's line: the h1, then its sections in page order, read off its markdown copy so a new section shows up
    here by itself, with the clicks under each in brackets (3 Nov: the hand-written list predated The inbox fleet and
    both of that day's clicks, and had the sections out of order). */
function howLine(): string {
  const K = VISUAL.kickers;
  const clicks: Record<string, string[]> = {
    [K.agents]: [VISUAL.clicks[SPLIT.id]],
    [K.skills]: [NERD.summary],
    // 9 Nov, late: How I test's own click.
    [K.testing]: [VISUAL.clicks["how-i-test"]],
    [K.habits]: [VISUAL.clicks.identity],
    [K.failures]: [VISUAL.clicks["held-list"], VISUAL.clicks.claygent, VISUAL.clicks.bounces],
    [K.fleet]: [INBOX.summary],
  };
  const sections = [...howMarkdown().matchAll(/^## (.+)$/gm)].flatMap(([, h]) => {
    if (h === K.live) return [h, logSummary()];
    return [clicks[h] ? `${h} (${clicks[h].map(lc).join("; ")})` : h];
  });
  return `for hiring managers: ${HOW.headline} In page order: ${sections.join("; ")}.`;
}

/** The held list, the lead proof on the home page and /how-i-build, in one sentence (data/how.ts HELD.line, the skills
    row's words until 9 Nov) with the card's caveat. */
function heldListLine(): string {
  const card = PROOF["held-list"];
  return `${link(card.title, mdHref("/how-i-build"))}: ${HELD.line} ${card.limit ?? ""}`.trim();
}

/** The repos /how-i-build's Check it yourself leads with, in its words (a repo with a command or a line; the profile
    link is under Contact). Tender Radar is last, with its own caveat. */
const repoLines = () =>
  LIVE.items.filter((l) => l.code || l.text).map((l) => `${link(bare(l.label), l.href)}: ${l.code ? `\`${l.code}\` ` : ""}${l.text ?? ""}`);

/** What a post's line adds after its summary: drawing-proof's scores, the dates and titles of the notes, the gate's two
    runs from the champion-move-checker README with its caveat, and the blind sets' first runs (review, 3 Nov: the line
    gave only 29/29 = 100%, which the careful matcher gets by construction, so an agent would have quoted it alone). */
function postFacts(p: Post): string {
  if (Array.isArray(p.body)) return "";
  if (p.body.component === "drawing-proof") return ` Numbers: ${D.marks.map(([n, l]) => `${n} ${l}`).join("; ")}.`;
  if (p.body.component === "champion-namesake") {
    const [naive, mine] = NAMESAKE.gate.lines.split("\n").filter((l) => l.startsWith("agreement")).map((l) => l.replace(/^agreement with labels\s+/, ""));
    const blind = NAMESAKE.after.flatMap((b) => (b.t === "ul" ? b.items : [])).flatMap((s) => /^\*\*holdout-\d:\*\* (\d+\/\d+)/.exec(s)?.[1] ?? []);
    const runs = `${blind.slice(0, -1).join(", ")} and ${blind[blind.length - 1]}`;
    return ` Numbers: the naive version ${naive}, ${NAMESAKE.gate.stamped}; this one ${mine}, PASS, on dev cases it passes by construction; blind first runs ${runs}, all ${NAMESAKE.gate.stamped}.`;
  }
  return ` ${WRONG.pins.map((n) => `${n.date}, ${n.title}`).join("; ")}.`;
}

/** The corrections log's entries about a post (/how-i-build, Check it yourself), dated, so a number the log has since
    qualified never travels without it (3 Nov: the leaked-eval post's line gave "it caught 9" and not that a 31 Oct
    audit says the 9 needs a re-run). */
function corrections(p: Post): string {
  return LIVE.log
    .filter((e) => e.link?.href === `/writing/${p.slug}`)
    .map((e) => ` Corrections log, ${shortDate(e.date)}: ${e.text}`)
    .join("");
}

export function llmsTxt(): string {
  // Round 6 (2 Nov): Tender Radar is off the home page. Its line led Projects and work with the old intro ("every
  // morning") and the corrections log's entry until 3 Nov; now it is /how-i-build's Check it yourself line, after the
  // jobs, the held list and the two repos that section leads with.
  const outside = JOBS.flatMap((w) => (w.links ?? []).filter((l) => /^https?:/.test(l.href)).map((l) => ({ ...l, title: w.title })));

  return [
    intro(ME.name),
    "## Resume",
    list([
      `${link("Resume (markdown)", abs("/resume.md"))}: every line of the PDF resume: ${RESUME.role}, ${RESUME.experience.map((j) => j.org).join(" and ")}, projects, education, skills. Updated ${RESUME.updated}.`,
      `${link("Resume (JSON)", abs("/resume.json"))}: the same resume in the JSON Resume schema (jsonresume.org)`,
      `${link("Resume (PDF)", abs(RESUME.pdf))}: the original file`,
    ]),
    // 3 Nov (the AI-friendly audit): email, LinkedIn and GitHub have their own section. Under Optional, which
    // llmstxt.org defines as links an agent can skip when it needs a shorter context, an agent trimming its context
    // dropped the profiles a recruiter's tool wants first.
    "## Contact",
    list([
      `${link("Email", `mailto:${ME.email}`)}: ${CONTACT.ask}`,
      `${link("LinkedIn", ME.linkedin)}: Manveen's LinkedIn profile`,
      `${link("GitHub", ME.github)}: Manveen's GitHub profile`,
    ]),
    "## Pages",
    list([
      `${link("Home page", home)}: the whole home page as markdown, in page order: what I build and what I measured, ${lc(FIVE_HABITS.head)}, how I check my AI (a proof card: what broke, the check, the measured result), two jobs, AI checks on my own projects, the three newest posts, contact`,
      // Second since 3 Nov: the page written for hiring managers.
      `${link(HOW.title, mdHref("/how-i-build"))}: ${howLine()}`,
      `${link("Writing", mdHref("/writing"))}: every post, newest first`,
      `${link(PILOT.head, mdHref(FREELANCE.href))}: for freelance automation: ${lc(PILOT.sketchLabel)}`,
      `${link("Everything in one file", abs("/llms-full.txt"))}: ${FULL_HOLDS}, inline`,
    ]),
    "## Projects and work",
    list([...JOBS.map(workLine), heldListLine(), ...repoLines()]),
    "## Writing",
    list(NEWEST_FIRST.map((p) => `${link(p.title, mdHref(`/writing/${p.slug}`))}: ${p.summary}${postFacts(p)}${corrections(p)} (${postDate(p)})`)),
    "## Optional",
    list([
      // 3 Nov: the code's link is under Projects and work; GitHub and LinkedIn moved up to Contact.
      // Round 6 (2 Nov): "watch it work" until then; the AI step the video shows has failed on every new notice since
      // September (data/how.ts LIVE.log, 2 Nov).
      `${link("Tender Radar video", PIPELINE.loom)}: a walkthrough, under 5 minutes`,
      ...outside.map((l) => `${link(`${l.title}: ${l.label.replace(/\s*[↗→]$/, "")}`, l.href)}`),
      `${link("Calendar", ME.calendly)}: pick a time for a call`,
    ]),
  ]
    .join("\n\n")
    .concat("\n");
}

// llms-full.txt is not part of the llms.txt spec. It is a widely used convention beside it (documentation
// platforms publish one next to llms.txt): the same site with every linked page inline, for an agent that
// would rather read one file than follow links.
export function llmsFullTxt(): string {
  const sources = [
    { url: abs("/resume.md"), md: resumeMarkdown() },
    { url: home, md: homeMarkdown() },
    { url: mdHref("/how-i-build"), md: howMarkdown() },
    { url: mdHref(FREELANCE.href), md: workingMarkdown() },
    ...NEWEST_FIRST.map((p) => ({ url: mdHref(`/writing/${p.slug}`), md: postMarkdown(p) })),
  ];
  return [
    intro(`${ME.name}: everything on manveen.me in one file`),
    para(`What follows, in order: ${FULL_HOLDS}, each with the address it comes from. The short index is ${link("llms.txt", abs("/llms.txt"))}.`),
    ...sources.map((s) => `---\n\nSource: ${s.url}\n\n${s.md.trim()}`),
  ]
    .join("\n\n")
    .concat("\n");
}
