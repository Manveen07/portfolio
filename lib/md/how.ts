// The page /how-i-build as markdown, served at /how-i-build.md, top to bottom in page order: what shows first, then
// what each click opens. Each chart and drawing is written out as the sentence its aria-label reads, and the red pen
// is written out (what is struck, what is circled), so nothing is only a picture. tests/how.test.mjs checks every block
// and number against the built page.

import { HOW, AGENTS, HABITS, FAILURES, PIPELINE_STEPS, SKILLS, SKILLS_NOT_YET, NERD, INBOX, LIVE, CONTACT, VISUAL, logSummary, shortDate, stageHead, type Story } from "@/data/how";
import { ME } from "@/data/portfolio";
import { PROOF } from "@/data/proof";
import { abs, mdHref } from "@/lib/site";
import { para, list, link, pen } from "@/lib/md/format";
import { claygentLabel, bounceLabel } from "@/components/HowCharts";
import { proofMarkdown } from "@/lib/md/proof";

/** Site links to their markdown copies; anchors on this page to their full address. */
const href = (h: string) => (h.startsWith("#") ? abs(`/how-i-build${h}`) : mdHref(h));
const md = (s: string) => s.replace(/\]\(([/#][^)]*)\)/g, (_, h: string) => `](${href(h)})`);
const bare = (s: string) => s.replace(/\s*[↑↓→↗]$/, "");
const CHART: Record<string, () => string> = { claygent: claygentLabel, bounces: bounceLabel };

/** A story's four parts, as its click opens them. */
const parts = (s: Story) => [
  para(`**What broke:** ${md(s.broke)}`),
  para(`**How I found it:** ${md(s.found)}`),
  para(`**How I proved the fix:** ${md(s.tested)}`),
  para(`**What it changed:** ${md(s.changed)}`),
];

/** A failure's chart, caption and four parts, under a heading of `level`, its click a level below. */
const story = (s: Story, level: number) => {
  const v = VISUAL.stories[s.id as keyof typeof VISUAL.stories];
  return [`${"#".repeat(level)} ${v.head}`, para(`Chart: ${CHART[s.id]()}`), para(v.caption), `${"#".repeat(level + 1)} ${VISUAL.clicks[s.id]}`, ...parts(s)];
};

export function howMarkdown(): string {
  const K = VISUAL.kickers;
  return [
    para(`*${HOW.kicker}*`),
    `# ${HOW.headline}`,
    para(`*${HOW.title}*`),
    ...HOW.sub.map(para),
    ...(VISUAL.heroLinks.length ? [list(VISUAL.heroLinks.map((l) => link(bare(l.label), href(l.href))))] : []),

    `## ${K.agents}`,
    para(`Drawing: ${AGENTS.label}`),
    para(pen(AGENTS.note)),
    ...AGENTS.lines.map(para),

    `## ${K.skills}`,
    list(SKILLS.map((s) => `**${s.title}**: ${md(s.line)}`)),
    para(`${SKILLS_NOT_YET.label} ${SKILLS_NOT_YET.text}`),
    // Round 5 (2 Nov): the held-list card sits behind its own click under the rows, as on the page.
    `### ${VISUAL.clicks["held-list"]}`,
    proofMarkdown(PROOF["held-list"], "full", { level: 4, links: false, href }),
    `### ${NERD.summary}`,
    para(`Drawing: ${PIPELINE_STEPS.label}`),
    para(pen(PIPELINE_STEPS.note)),
    para(NERD.caption),
    PIPELINE_STEPS.steps.map((s, i) => `${i + 1}. **${s.name}${s.gate ? " (gate)" : ""}.** ${s.what} Check: ${s.check}`).join("\n"),
    `#### ${NERD.testingHead}`,
    list(NERD.testing.map(md)),
    `#### ${NERD.clayHead}`,
    list(NERD.clay.map(md)),

    // 3 Nov: the inbox fleet, after the skills and their clicks, as on the page; the drawing as its reading.
    `## ${K.fleet}`,
    para(INBOX.lead),
    para(`Drawing: ${INBOX.label}`),
    para(pen(INBOX.note)),
    para(INBOX.caption),
    para(INBOX.credit),
    `### ${INBOX.summary}`,
    INBOX.stages.map((s, i) => `${i + 1}. **${stageHead(s)}** ${s.detail}`).join("\n"),
    para(INBOX.never),

    `## ${K.habits}`,
    ...HABITS.flatMap((h) => {
      const x = h.exhibit;
      const shown = `${x.struck ? `${x.struck} → ` : ""}${x.circled}${x.rest ?? ""}`;
      const marks = `${x.struck ? ` Struck through in red: ${x.struck}.` : ""} Circled in red: ${x.circled}.`;
      return [
        `### ${h.head}`,
        para(`${shown}.${marks}`),
        ...h.lines.map(para),
        para(h.link ? `${h.checked} · ${link(h.link.label, href(h.link.href))}` : h.checked),
        ...(h.story ? [`#### ${VISUAL.clicks[h.story.id]}`, ...parts(h.story)] : []),
      ];
    }),

    `## ${K.failures}`,
    ...FAILURES.stories.flatMap((s) => story(s, 3)),

    `## ${K.live}`,
    list(
      LIVE.items.map(
        (l) =>
          `${link(l.label, href(l.href))}${l.code || l.text ? `: ${l.code ? `\`${l.code}\` ` : ""}${l.text ?? ""}` : ""}${l.extra ? ` ${link(l.extra.label, href(l.extra.href))}` : ""}`,
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
