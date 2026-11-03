// /llms.txt (the llmstxt.org format, checked 22 Oct 2026) and /llms-full.txt.
// Manveen's words come first (data/llms-intro.ts); every section after them is generated from the site's data.

import { ME, PIPELINE, JOBS, DRAWINGS as D, WRONG, NAMESAKE, PILOT, FREELANCE, type WorkItem } from "@/data/portfolio";
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
import { HOW, LIVE } from "@/data/how";

/** The corrections log's entry for Tender Radar, word for word (round 6, 2 Nov). */
const LOG_RADAR = LIVE.log.find((e) => e.id === "log-2026-11-03-tender-radar")?.text ?? "";

/** H1, the blockquote summary, then Manveen's paragraphs: the part of both files he writes. */
function intro(title: string): string {
  return [`# ${title}`, `> ${LLMS_INTRO.summary}`, ...LLMS_INTRO.details.map(para), ...LLMS_INTRO.howToRead.map(para)].join("\n\n");
}

const home = mdHref("/");

/** One line per piece of work: what it is, then its numbers as the page states them. */
function workLine(w: WorkItem): string {
  const nums = w.scorecard
    ? [`${w.scorecard.caption} ${w.scorecard.caught} caught, ${w.scorecard.missed} missed, ${w.scorecard.falseAlarms} false alarms, ${w.scorecard.leftAlone} left alone`]
    : w.metrics.map(([n, label]) => `${n} ${label}`);
  const where = [w.where, w.role].filter(Boolean).join(", ");
  return `${link(w.title, home)}: ${where}. ${w.lead ?? w.detail ?? ""}${nums.length ? ` Numbers: ${nums.join("; ")}.` : ""}`;
}

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

export function llmsTxt(): string {
  // Round 6 (2 Nov): Tender Radar is off the home page, so its line links the code and says why, with no run numbers.
  const radar = `${link("Tender Radar", PIPELINE.repo)}: ${PIPELINE.intro.join(" ")} ${LOG_RADAR}`;
  const outside = JOBS.flatMap((w) => (w.links ?? []).filter((l) => /^https?:/.test(l.href)).map((l) => ({ ...l, title: w.title })));

  return [
    intro(ME.name),
    "## Resume",
    list([
      `${link("Resume (markdown)", abs("/resume.md"))}: every line of the PDF resume: ${RESUME.role}, ${RESUME.experience.map((j) => j.org).join(" and ")}, projects, education, skills. Updated ${RESUME.updated}.`,
      `${link("Resume (JSON)", abs("/resume.json"))}: the same resume in the JSON Resume schema (jsonresume.org)`,
      `${link("Resume (PDF)", abs(RESUME.pdf))}: the original file`,
    ]),
    "## Pages",
    list([
      `${link("Home page", home)}: the whole home page as markdown, in page order: what I build and what I measured, how I check my AI (a proof card: what broke, the check, the measured result), two jobs, AI checks on my own projects, the three newest posts, contact`,
      `${link("Writing", mdHref("/writing"))}: every post, newest first`,
      `${link(HOW.title, mdHref("/how-i-build"))}: for hiring managers: ${HOW.headline} How my Claude Code agents work and where a person approves, my own AI check with the number that went wrong, an email match check I re-ran on past data before switching it, failures from the day job, what I can do and what not yet, links you can check, and where I corrected myself`,
      `${link(PILOT.head, mdHref(FREELANCE.href))}: for freelance automation: ${PILOT.sketchLabel.charAt(0).toLowerCase()}${PILOT.sketchLabel.slice(1)}`,
      `${link("Everything in one file", abs("/llms-full.txt"))}: the resume, the home page and every post, inline`,
    ]),
    "## Projects and work",
    list([radar, ...JOBS.map(workLine)]),
    "## Writing",
    list(NEWEST_FIRST.map((p) => `${link(p.title, mdHref(`/writing/${p.slug}`))}: ${p.summary}${postFacts(p)} (${postDate(p)})`)),
    "## Optional",
    list([
      `${link("Tender Radar code", PIPELINE.repo)}: the public showcase repo`,
      // Round 6 (2 Nov): "watch it work" until then; the AI step the video shows has failed on every new notice since
      // September (data/how.ts LIVE.log, 2 Nov).
      `${link("Tender Radar video", PIPELINE.loom)}: a walkthrough, under 5 minutes`,
      ...outside.map((l) => `${link(`${l.title}: ${l.label.replace(/\s*[↗→]$/, "")}`, l.href)}`),
      `${link("GitHub", ME.github)}: Manveen's GitHub profile`,
      `${link("LinkedIn", ME.linkedin)}: Manveen's LinkedIn profile`,
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
    para(`What follows, in order: the resume, the home page, how I build GTM systems, how working with me goes and every post, each with the address it comes from. The short index is ${link("llms.txt", abs("/llms.txt"))}.`),
    ...sources.map((s) => `---\n\nSource: ${s.url}\n\n${s.md.trim()}`),
  ]
    .join("\n\n")
    .concat("\n");
}
