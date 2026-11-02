// The page /how-i-build as markdown, served at /how-i-build.md, top to bottom in page order: what shows first, then
// what each click opens. Each chart and drawing is written out as the sentence its aria-label reads, and the red pen
// is written out (what is struck, what is circled), so nothing is only a picture. tests/how.test.mjs checks every block
// and number against the built page.

import { HOW, AGENTS, HABITS, FAILURES, EMAILS, PIPELINE_STEPS, SKILLS, NERD, LIVE, CONTACT, VISUAL, logSummary, shortDate, type Story } from "@/data/how";
import { ME } from "@/data/portfolio";
import { PROOF } from "@/data/proof";
import { abs, mdHref } from "@/lib/site";
import { para, list, link, pen } from "@/lib/md/format";
import { claygentLabel, identityLabel, bounceLabel } from "@/components/HowCharts";
import { proofMarkdown } from "@/lib/md/proof";

/** Site links to their markdown copies; anchors on this page to their full address. */
const href = (h: string) => (h.startsWith("#") ? abs(`/how-i-build${h}`) : mdHref(h));
const md = (s: string) => s.replace(/\]\(([/#][^)]*)\)/g, (_, h: string) => `](${href(h)})`);
const bare = (s: string) => s.replace(/\s*[↑↓→↗]$/, "");
/** A sentence ends once: no full stop after one that already ends in punctuation. */
const stop = (s: string) => (/[.!?]$/.test(s) ? s : `${s}.`);

const CHART: Record<string, () => string> = { claygent: claygentLabel, identity: identityLabel, bounces: bounceLabel };

/** A story's chart, caption and four parts, under a heading of `level`. */
const story = (s: Story, level: number, click: boolean) => {
  const v = VISUAL.stories[s.id as keyof typeof VISUAL.stories];
  return [
    `${"#".repeat(level)} ${v.head}`,
    para(`Chart: ${CHART[s.id]()}`),
    para(v.caption),
    ...(click ? [`${"#".repeat(level + 1)} ${VISUAL.readStory}`] : []),
    para(`**What broke:** ${md(s.broke)}`),
    para(`**How I found it:** ${md(s.found)}`),
    para(`**How I proved the fix:** ${md(s.tested)}`),
    para(`**What it changed:** ${md(s.changed)}`),
  ];
};

export function howMarkdown(): string {
  const K = VISUAL.kickers;
  return [
    `# ${HOW.headline}`,
    para(`*${HOW.title}*`),
    para(HOW.sub),
    proofMarkdown(PROOF["held-list"], "full", { level: 2, links: false, href }),
    ...(VISUAL.heroLinks.length ? [list(VISUAL.heroLinks.map((l) => link(bare(l.label), href(l.href))))] : []),

    `## ${K.agents}`,
    para(`Drawing: ${AGENTS.label}`),
    para(pen(AGENTS.note)),
    ...AGENTS.lines.map(para),

    `## ${K.habits}`,
    ...HABITS.flatMap((h) => {
      const x = h.exhibit;
      const shown = `${x.struck ? `${x.struck} → ` : ""}${x.circled}${x.rest ?? ""}`;
      const marks = `${x.struck ? ` Struck through in red: ${x.struck}.` : ""} Circled in red: ${x.circled}.`;
      return [
        `### ${h.head}`,
        ...(h.eyebrow ? [para(`*${h.eyebrow}*`)] : []),
        para(`${shown}.${marks}`),
        para(h.cap),
        para(`${h.checked} · ${link(h.link.label, href(h.link.href))}`),
      ];
    }),

    `## ${K.failures}`,
    ...FAILURES.stories.flatMap((s) => story(s, 3, true)),

    `## ${K.skills}`,
    list(
      SKILLS.map((s) => {
        const proof = s.proof ? `: ${stop(`${md(s.proof)}${s.to ? ` (${link(s.to.aria, href(s.to.href))})` : ""}`)}` : ".";
        return `**${s.title}**${proof} Gap: ${s.gap}`;
      }),
    ),
    `### ${NERD.summary}`,
    para(`Drawing: ${PIPELINE_STEPS.label}`),
    para(pen(PIPELINE_STEPS.note)),
    para(NERD.caption),
    PIPELINE_STEPS.steps.map((s, i) => `${i + 1}. **${s.name}${s.gate ? " (gate)" : ""}.** ${s.what} Check: ${s.check}`).join("\n"),
    ...story(EMAILS, 4, false),
    `#### ${NERD.testingHead}`,
    list(NERD.testing.map(md)),
    `#### ${NERD.clayHead}`,
    list(NERD.clay.map(md)),

    `## ${K.live}`,
    list(
      LIVE.items.map(
        (l) => `${link(l.label, href(l.href))}: ${l.code ? `\`${l.code}\` ` : ""}${l.text}${l.extra ? ` ${link(l.extra.label, href(l.extra.href))}` : ""}`,
      ),
    ),
    para(LIVE.privacy),
    `### ${logSummary()}`,
    list(LIVE.log.map((e) => `${shortDate(e.date)}: ${e.text}${e.link ? ` ${link(e.link.label, href(e.link.href))}` : ""}`)),

    `## ${K.contact}`,
    para(CONTACT.ask),
    para(link(ME.email, `mailto:${ME.email}`)),
    para(CONTACT.where),
    para(CONTACT.results),
    para(
      [link("LinkedIn", ME.linkedin), link("GitHub", ME.github), link("Résumé (PDF)", abs("/resume.pdf")), link("Home", mdHref("/")), link("Writing", mdHref("/writing"))].join(" · "),
    ),
  ]
    .join("\n\n")
    .concat("\n");
}
