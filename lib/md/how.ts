// The page /how-i-build as markdown, served at /how-i-build.md, top to bottom in page order.
// The strings already use markdown's inline syntax, so they print as is; links to this site's pages point at their
// markdown copies, like the other copies. tests/how.test.mjs checks every block and number against the built page.

import { HOW, PATTERNS, FAILURES, TESTING, PIPELINE_STEPS, CLAY, LIVE, HOW_END } from "@/data/how";
import { ME } from "@/data/portfolio";
import { abs, mdHref } from "@/lib/site";
import { para, list, link, pen } from "@/lib/md/format";

/** Site links to their markdown copies; files (resume.pdf) and anchors to their full address. */
const md = (s: string) => s.replace(/\]\(([/#][^)]*)\)/g, (_, href: string) => `](${href.startsWith("#") ? abs(`/how-i-build${href}`) : mdHref(href)})`);
const href = (h: string) => (h.startsWith("#") ? abs(`/how-i-build${h}`) : mdHref(h));

export function howMarkdown(): string {
  return [
    `# ${HOW.headline}`,
    para(`*${HOW.title}*`),
    para(HOW.lede),
    list(HOW.proofs.map(([n, label]) => `**${n}** ${label}`)),
    para(`${md(HOW.hardest)} ${link(HOW.hardestLink.label.replace(/\s*[↓→↗]$/, ""), href(HOW.hardestLink.href))}`),
    para(md(HOW.privacy)),
    list(HOW.heroLinks.map((l) => link(l.label.replace(/\s*[↓→↗]$/, ""), href(l.href)))),
    "## Patterns GTM teams ask for",
    para(PATTERNS.intro),
    list(PATTERNS.items.map((t) => `**${t.lead}** ${md(t.text)}`)),
    "## Three failures I fixed",
    para(FAILURES.intro),
    ...FAILURES.stories.flatMap((s) => [
      `### ${s.title}`,
      para(s.result),
      para(`**What broke:** ${md(s.broke)}`),
      para(`**How I found it:** ${md(s.found)}`),
      para(`**How I proved the fix:** ${md(s.tested)}`),
      para(`**What it changed:** ${md(s.changed)}`),
    ]),
    "## How I test a workflow",
    para(TESTING.intro),
    TESTING.items.map((t, i) => `${i + 1}. **${t.lead}** ${md(t.text)}`).join("\n"),
    "## The whole pipeline",
    para(PIPELINE_STEPS.intro),
    para(`Drawing: ${PIPELINE_STEPS.label}`),
    para(pen(PIPELINE_STEPS.note)),
    "### Each step, and the check that stops bad output",
    PIPELINE_STEPS.steps.map((s, i) => `${i + 1}. **${s.name}${s.gate ? " (gate)" : ""}.** ${s.what} Check: ${s.check}`).join("\n"),
    "## Clay, in depth",
    para(CLAY.intro),
    list(CLAY.items.map(md)),
    "## See it running",
    para(LIVE.intro),
    list(LIVE.items.map((l) => `${link(l.label.replace(/\s*[↓→↗]$/, ""), href(l.href))}: ${l.text}`)),
    "## Write to me",
    para(HOW_END.ask),
    para(link(ME.email, `mailto:${ME.email}`)),
    para(ME.hours),
    para(`${link("Home", mdHref("/"))} · ${link("Writing", mdHref("/writing"))}`),
  ]
    .join("\n\n")
    .concat("\n");
}
