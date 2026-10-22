// The home page as markdown (/index.md), in page order, built from the same data the components render.
// tests/ai.test.mjs reads the built page and this file side by side: every block of text, every alt text and
// aria-label, and every word drawn in a sketch must appear here, and every number here must be on the page.
// So when a component's wording changes, change it here too, or the tests fail.

import { POSTS } from "@/data/posts";
import { ME, HERO, PHOTO, PIPELINE, QUOTE, NOW_LINE, JOBS, OWN_WORK, DRAWINGS as D, WRONG, PILOT, OFF_CLOCK, type WorkItem, type Pin } from "@/data/portfolio";
import type { PipelineData } from "@/lib/pipeline";
import { fmtDay, runLine } from "@/lib/runs";
import { radarText, RADAR_SOURCES, WEEK, PILOT_DRAWN } from "@/lib/sketch-text";
import { abs, mdHref, SITE } from "@/lib/site";
import { para, list, link, image, fmtLongDate } from "@/lib/md/format";

/** A red margin note on the page. */
const pen = (s: string) => `*Red pen:* ${s}`;

/** The words of the week sketch, as drawn. */
function weekDrawing(): string {
  const rows = WEEK.days.map((d) => `${d}: ${WEEK.task}`).join("; ");
  return `*Drawing:* ${WEEK.label} Drawn as ${WEEK.days.length} rows (${rows}), each crossed out in red, bracketed, with "${WEEK.red.join(" ")}" written beside them in red.`;
}

function radarDrawing(pipe: PipelineData): string {
  const t = radarText({ trades: pipe.clientProfiles, checks: pipe.checks, bid: pipe.bid, maybe: pipe.maybe });
  return [
    `*Drawing:* ${t.label}`,
    `Drawn as ${RADAR_SOURCES.length} boxes (${RADAR_SOURCES.join(", ")}) with arrows into a box that says "${t.script.join(" ")}", then a box that says "${t.checked} ${t.forTrades}, ${t.look}, ${t.worth}", with "${t.worth}" circled in red. Under it in red: "${t.under.join(" ")}"`,
  ].join("\n");
}

function pilotDrawing(): string {
  const steps = PILOT_DRAWN.map((s) => `${s.title}: ${s.lines.join(" ")}${s.dim.length ? ` (in grey: ${s.dim.join(" ")})` : ""}`).join("; ");
  return `*Drawing:* ${PILOT.sketchLabel} Drawn as a timeline: ${steps}. The red pen circles "every miss logged, you see the list".`;
}

function entry(w: WorkItem): string {
  const out: string[] = [`#### ${w.title}`, para([w.where, w.role].filter(Boolean).join(" · ")), para(w.lead)];
  if (w.detail) out.push(para(w.detail));
  if (w.scorecard) {
    const s = w.scorecard;
    out.push(para(s.caption));
    out.push(list([`**${s.caught}** caught`, `**${s.missed}** missed`, `**${s.falseAlarms}** false alarms (circled in red)`, `**${s.leftAlone}** left alone`]));
  }
  if (w.shot) out.push(para(image(w.shot.alt, abs(w.shot.src))));
  if (w.metrics.length) out.push(list(w.metrics.map(([n, label]) => `**${n}** ${label}`)));
  out.push(para(`built with ${w.stack.join(", ")}`));
  if (w.links) out.push(list(w.links.map((l) => link(l.label, mdHref(l.href)))));
  if (w.note) out.push(para(pen(w.note)));
  if (w.quote) {
    out.push(
      [
        `> “${QUOTE.before}${QUOTE.marked}”`,
        ">",
        `> ${QUOTE.name}, ${QUOTE.title}, ${QUOTE.company}`,
        `> ${QUOTE.source}`,
      ].join("\n"),
    );
    out.push(para(pen(QUOTE.penNote)));
  }
  return out.join("\n\n");
}

function pin(p: Pin): string {
  const e = p.exhibit;
  return [
    `### ${p.date} · ${p.title}`,
    para(`\`${e.before}${e.marked}${e.after ?? ""}\` ${p.scribble} (the red pen ${e.pen === "underline" ? "underlines" : "circles"} \`${e.marked}\`)`),
    para(p.what),
    para(`**What I check now:** ${p.now}`),
  ].join("\n\n");
}

/** components/Writing.tsx: the newest post and the way to the rest. */
function latestWriting(): string[] {
  const p = [...POSTS].sort((a, b) => b.date.localeCompare(a.date))[0];
  if (!p) return [];
  return [
    "## Writing",
    `### ${link(p.cardTitle ?? p.title, mdHref(`/writing/${p.slug}`))}`,
    para(`${fmtLongDate(p.date)} · ${p.readMins} min read`),
    para(p.line ?? p.cardSummary ?? p.summary),
    para(link("All writing →", mdHref("/writing"))),
  ];
}

export function homeMarkdown(pipe: PipelineData): string {
  const failed = pipe.history.filter((r) => !r.ok);
  const failedDays = failed.length ? `Days that failed: ${failed.map((r) => fmtDay(r.date)).join(", ")}.` : "None failed.";
  return [
    `# ${ME.name} | ${ME.role}`,
    para(
      `The home page of ${SITE}/ as markdown, in page order, generated from the site's data on every build. ` +
        `Resume: ${link("resume.md", abs("/resume.md"))}, ${link("resume.json", abs("/resume.json"))}, ${link("resume.pdf", abs(ME.resume))}. ` +
        `Everything in one file: ${link("llms-full.txt", abs("/llms-full.txt"))}.`,
    ),

    `## ${HERO.headline}`,
    PHOTO ? para(image(PHOTO.alt, abs(PHOTO.src))) : "",
    para(`${HERO.answer} ${HERO.marked}`),
    para(pen(HERO.nerdNote)),
    para(weekDrawing()),
    ...HERO.how.map(para),
    para(ME.hours),

    "## Running right now · Tender Radar",
    para(PIPELINE.intro),
    para(radarDrawing(pipe)),
    para(pen(PIPELINE.sketchNote)),
    para(`**${pipe.totalRuns}** mornings it has started on its own since ${PIPELINE.firstRun}.`),
    para(`*Chart:* Last ${pipe.history.length} days: ${pipe.history.length - failed.length} finished, ${failed.length} failed. ${failedDays}`),
    para(`One bar per day, last ${pipe.history.length}. Black finished, red failed. ${runLine(pipe.lastRun, pipe.live, pipe.asOf)}`),
    para(pen(PIPELINE.penNote)),
    para(`It sorts for ${pipe.clientProfiles} trades, from cleaning and security to pest control, and has ${pipe.noticesRead} notices on file.`),
    para(PIPELINE.outage),
    list([link("Watch it work (under 5 min) ↗", PIPELINE.loom), link("See the code ↗", PIPELINE.repo)]),

    "## Work, and who vouches for it",
    "### Jobs",
    ...JOBS.map(entry),
    "### Built on my own",
    ...OWN_WORK.map(entry),
    para(`${NOW_LINE} ${link("Full resume ↗", abs(ME.resume))} (as text: ${link("resume.md", abs("/resume.md"))})`),

    `## ${D.kicker}`,
    para(D.lede),
    para(D.what),
    para(image(D.shot.alt, abs(D.shot.src))),
    para(pen(D.shotNote)),
    para(D.caption),
    list(D.marks.map(([n, label]) => `**${n}** ${label}`)),
    para(D.wrongLine),
    para(D.finePrint),
    para(pen(D.finePrintNote)),
    para(`built with ${D.stack.join(", ")}`),
    para(
      `Drawing © 2026 ${D.credit.by}, from his ${link(D.credit.project, D.credit.projectHref)} project, marked ${link(D.credit.licence, D.credit.licenceHref)}. Cropped, and shared under the same licence; the red pen is mine.`,
    ),

    `## ${WRONG.kicker}`,
    para(WRONG.lede),
    ...WRONG.pins.map(pin),

    ...latestWriting(),

    "## How working with me goes",
    para(PILOT.opener),
    PILOT.steps.map((s, i) => `${i + 1}. ${s}`).join("\n"),
    para(pilotDrawing()),
    para(pen(PILOT.note)),
    para(PILOT.ask),
    para(`Email: ${link(ME.email, `mailto:${ME.email}`)}`),
    para(link(PILOT.calendar, ME.calendly)),

    "---",
    para(`**Off the clock:** ${OFF_CLOCK}`),
    para(
      `Hiring? ${link("Resume", abs(ME.resume))} · ${link("LinkedIn", ME.linkedin)} · ${link("GitHub", ME.github)} · ${link("Writing", mdHref("/writing"))} · ${link(ME.email, `mailto:${ME.email}`)}`,
    ),
    para(`${ME.location} · © 2026 ${ME.name}`),
  ]
    .filter(Boolean)
    .join("\n\n")
    .concat("\n");
}
