// The page /working-with-me as markdown, served at /working-with-me.md, top to bottom in page order: the freelance pilot
// word for word, each drawing written out as the sentence its aria-label reads, and the red pen written out.
// tests/ai.test.mjs holds it to the built page (every block, drawn word and number). Until round 3 of the verify loop
// (2 Nov) these lines were the end of /index.md (lib/md/home.ts).

import { ME, WEEK_JOB, PILOT, FREELANCE } from "@/data/portfolio";
import { WEEK, PILOT_DRAWN } from "@/lib/sketch-text";
import { mdHref } from "@/lib/site";
import { para, link, pen } from "@/lib/md/format";

/** The words of the week sketch, as drawn. */
function weekDrawing(): string {
  const rows = WEEK.days.map((d) => `${d}: ${WEEK.task}`).join("; ");
  return `*Drawing:* ${WEEK.label} Drawn as ${WEEK.days.length} rows (${rows}), each crossed out in red, bracketed, with "${WEEK.red.join(" ")}" written beside them in red.`;
}

function pilotDrawing(): string {
  const steps = PILOT_DRAWN.map((s) => `${s.title}: ${s.lines.join(" ")}${s.dim.length ? ` (in grey: ${s.dim.join(" ")})` : ""}`).join("; ");
  return `*Drawing:* ${PILOT.sketchLabel} Drawn as a timeline: ${steps}. The red pen circles "every miss logged, you see the list".`;
}

export function workingMarkdown(): string {
  return [
    `# ${PILOT.head}`,
    para(`*${FREELANCE.kicker}*`),
    para(`${WEEK_JOB.headline} ${WEEK_JOB.answer} ${WEEK_JOB.marked}`),
    para(pen(WEEK_JOB.nerdNote)),
    para(weekDrawing()),
    para(PILOT.opener),
    PILOT.steps.map((s, i) => `${i + 1}. ${s}`).join("\n"),
    para(pilotDrawing()),
    para(pen(PILOT.note)),
    para(PILOT.ask),
    para(`Email: ${link(ME.email, `mailto:${ME.email}`)}`),
    para(link(PILOT.calendar, ME.calendly)),
    para(link("← Home", mdHref("/"))),
  ]
    .join("\n\n")
    .concat("\n");
}
