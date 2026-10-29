// The page /how-i-build as markdown, served at /how-i-build.md, top to bottom in page order: what shows first, then
// what each click opens. Each chart is written out as the sentence its aria-label reads, so nothing is only a picture.
// tests/how.test.mjs checks every block and number against the built page.

import { HOW, FAILURES, TESTING, PIPELINE_STEPS, CLAY, VISUAL } from "@/data/how";
import { ME } from "@/data/portfolio";
import { abs, mdHref } from "@/lib/site";
import { para, list, link, pen } from "@/lib/md/format";
import { claygentLabel, identityLabel, bounceLabel } from "@/components/HowCharts";

/** Site links to their markdown copies; anchors on this page to their full address. */
const href = (h: string) => (h.startsWith("#") ? abs(`/how-i-build${h}`) : mdHref(h));
const md = (s: string) => s.replace(/\]\(([/#][^)]*)\)/g, (_, h: string) => `](${href(h)})`);
const bare = (s: string) => s.replace(/\s*[↓→↗]$/, "");

const CHART: Record<string, () => string> = { claygent: claygentLabel, identity: identityLabel, bounces: bounceLabel };

export function howMarkdown(): string {
  const K = VISUAL.kickers;
  return [
    `# ${HOW.headline}`,
    para(`*${HOW.title}*`),
    list(VISUAL.tiles.map(([n, label]) => `**${n}** ${label}`)),
    para(`Drawing: ${PIPELINE_STEPS.label}`),
    para(pen(PIPELINE_STEPS.note)),
    para(VISUAL.pipelineCaption),
    `### ${VISUAL.stepsSummary}`,
    PIPELINE_STEPS.steps.map((s, i) => `${i + 1}. **${s.name}${s.gate ? " (gate)" : ""}.** ${s.what} Check: ${s.check}`).join("\n"),
    list(VISUAL.heroLinks.map((l) => link(bare(l.label), href(l.href)))),
    `## ${K.patterns}`,
    list(VISUAL.patterns.map((t) => `${link(t.head, href(t.href))}: ${t.line}`)),
    `## ${K.failures}`,
    ...FAILURES.stories.flatMap((s) => {
      const v = VISUAL.stories[s.id as keyof typeof VISUAL.stories];
      return [
        `### ${v.head}`,
        para(`Chart: ${CHART[s.id]()}`),
        para(v.caption),
        `#### ${VISUAL.readStory}`,
        para(`**What broke:** ${md(s.broke)}`),
        para(`**How I found it:** ${md(s.found)}`),
        para(`**How I proved the fix:** ${md(s.tested)}`),
        para(`**What it changed:** ${md(s.changed)}`),
      ];
    }),
    `## ${K.testing}`,
    [
      ...VISUAL.gates.map((g, i) => `${i + 1}. **${"href" in g && g.href ? link(g.head, href(g.href)) : g.head}** ${g.line}`),
      `${VISUAL.gates.length + 1}. **${VISUAL.live.head}** ${VISUAL.live.line}`,
      `${VISUAL.gates.length + 2}. **${link(VISUAL.after.head, href(VISUAL.after.href))}** ${VISUAL.after.line}`,
    ].join("\n"),
    `### ${VISUAL.gatesSummary}`,
    TESTING.items.map((t, i) => `${i + 1}. **${t.lead}** ${md(t.text)}`).join("\n"),
    `## ${K.clay}`,
    list(VISUAL.clay.map(([n, line]) => `**${n}** ${line}`)),
    `### ${VISUAL.clayDetails}`,
    list(CLAY.items.map(md)),
    `## ${K.live}`,
    list(VISUAL.live_items.map((l) => `${link(bare(l.label), href(l.href))}: ${l.text}`)),
    para(VISUAL.privacy),
    `## ${K.contact}`,
    para(VISUAL.ask),
    para(link(ME.email, `mailto:${ME.email}`)),
    para(ME.hours),
    para(`${link("Home", mdHref("/"))} · ${link("Writing", mdHref("/writing"))}`),
  ]
    .join("\n\n")
    .concat("\n");
}
