// /llms.txt (the llmstxt.org format, checked 22 Oct 2026) and /llms-full.txt.
// Manveen's words come first (data/llms-intro.ts); every section after them is generated from the site's data.

import { ME, PIPELINE, JOBS, OWN_WORK, DRAWINGS as D, WRONG, type WorkItem } from "@/data/portfolio";
import { POSTS } from "@/data/posts";
import { RESUME } from "@/data/resume";
import { LLMS_INTRO } from "@/data/llms-intro";
import type { PipelineData } from "@/lib/pipeline";
import { fmtCount } from "@/lib/runs";
import { abs, mdHref } from "@/lib/site";
import { para, list, link, fmtLongDate } from "@/lib/md/format";
import { homeMarkdown } from "@/lib/md/home";
import { resumeMarkdown } from "@/lib/md/resume";
import { postMarkdown } from "@/lib/md/posts";

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
  return `${link(w.title, home)}: ${where}. ${w.lead}${nums.length ? ` Numbers: ${nums.join("; ")}.` : ""}`;
}

export function llmsTxt(pipe: PipelineData): string {
  const failed = pipe.history.filter((r) => !r.ok).length;
  const radar =
    `${link("Tender Radar", home)}: ${PIPELINE.intro} Numbers: ${pipe.totalRuns} mornings it has started on its own since ${PIPELINE.firstRun}; ` +
    `last ${pipe.history.length} days, ${pipe.history.length - failed} finished and ${failed} failed; sorts for ${pipe.clientProfiles} trades; ` +
    `${pipe.noticesRead} notices on file; ${pipe.bid} worth bidding and ${pipe.maybe} worth a look out of ${fmtCount(pipe.checks)} checks.`;
  const drawing = `${link("drawing-proof", home)}: ${D.lede} Numbers: ${D.marks.map(([n, l]) => `${n} ${l}`).join("; ")}.`;
  const wrong = `${link(WRONG.kicker, home)}: ${WRONG.lede} ${WRONG.pins.map((p) => `${p.date}, ${p.title}`).join("; ")}.`;
  const outside = [...JOBS, ...OWN_WORK].flatMap((w) => (w.links ?? []).filter((l) => /^https?:/.test(l.href)).map((l) => ({ ...l, title: w.title })));

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
      `${link("Home page", home)}: the whole home page as markdown, in page order: what I build, Tender Radar running every morning with its numbers, two jobs and my own projects, drawing-proof, things AI got confidently wrong, how working with me goes, contact`,
      `${link("Writing", mdHref("/writing"))}: every post, newest first`,
      `${link("Everything in one file", abs("/llms-full.txt"))}: the resume, the home page and every post, inline`,
    ]),
    "## Projects and work",
    list([radar, ...JOBS.map(workLine), ...OWN_WORK.map(workLine), drawing, wrong]),
    "## Writing",
    list(POSTS.map((p) => `${link(p.title, mdHref(`/writing/${p.slug}`))}: ${p.summary} (${fmtLongDate(p.date)})`)),
    "## Optional",
    list([
      `${link("Tender Radar code", PIPELINE.repo)}: the public showcase repo`,
      `${link("Tender Radar video", PIPELINE.loom)}: watch it work, under 5 minutes`,
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
export function llmsFullTxt(pipe: PipelineData): string {
  const sources = [
    { url: abs("/resume.md"), md: resumeMarkdown() },
    { url: home, md: homeMarkdown(pipe) },
    ...POSTS.map((p) => ({ url: mdHref(`/writing/${p.slug}`), md: postMarkdown(p) })),
  ];
  return [
    intro(`${ME.name}: everything on manveen.me in one file`),
    para(`What follows, in order: the resume, the home page and every post, each with the address it comes from. The short index is ${link("llms.txt", abs("/llms.txt"))}.`),
    ...sources.map((s) => `---\n\nSource: ${s.url}\n\n${s.md.trim()}`),
  ]
    .join("\n\n")
    .concat("\n");
}
