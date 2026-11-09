// The page /how-i-build as markdown, served at /how-i-build.md, top to bottom in page order: what shows first, then
// what each click opens. Each chart and drawing is written out as the sentence its aria-label reads, and the red pen
// is written out (what is struck, what is circled), so nothing is only a picture. tests/how.test.mjs checks every block
// and number against the built page.

import { HOW, AGENTS, SPLIT, HABITS, HELD, FAILURES, PIPELINE_STEPS, SKILLS, SKILLS_NOT_YET, NERD, FREE_CHECK, INBOX, LIVE, CONTACT, VISUAL, logSummary, shortDate, stageHead, type Story } from "@/data/how";
import { ME, PHOTO } from "@/data/portfolio";
import { PROOF } from "@/data/proof";
import { abs, mdHref } from "@/lib/site";
import { para, list, link, image, pen } from "@/lib/md/format";
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

/** components/sketches/OnItsOwn.tsx (3 Nov): the click under the agents lines, both columns in the order they play (the
    page shows them all; the motion only reveals them), the red written out (its one red is the person's head), then the
    caption. */
function onItsOwn(): string[] {
  return [
    `### ${VISUAL.clicks[SPLIT.id]}`,
    ...AGENTS.lines.map(para),
    `#### ${SPLIT.heads.bots}`,
    list(SPLIT.bots),
    `#### ${SPLIT.heads.person}`,
    para(`*The "${SPLIT.heads.person}" head is in red on the page.*`),
    list(SPLIT.person.map((c) => `**${c.call}**${c.why ? `: ${c.why}` : ""}`)),
    para(SPLIT.note),
  ];
}

/** components/sketches/FreeCheckFirst.tsx (3 Nov): the funnel under Clay in depth, each row's name, line and number, the
    red cut written out, each caveat beside its number, then the bounce row. Since 3 Nov late, lib/md/home.ts prints it
    in the Precise Leads entry too, where the page draws it. There its head is bold, not a heading (review, 3 Nov: as
    ##### it put the entry's tile and stack under the funnel for an agent that splits the file by headings; on the page
    the head sits inside its figure). */
export function freeCheck(head: "heading" | "bold" = "heading"): string[] {
  const F = FREE_CHECK;
  const cut = F.rows.find((r) => r.cut);
  const R = F.result;
  return [
    head === "bold" ? para(`**${F.head}**`) : `##### ${F.head}`,
    para(`Drawn as bars, each to scale of the first row's ${F.rows[0].value}${cut ? `; the ${cut.value} cut is hatched in red` : ""}.`),
    F.rows.map((r, i) => `${i + 1}. **${r.name}** (${r.sub}): ${r.value}${r.note ? `. ${r.note}` : ""}`).join("\n"),
    para(`**${R.name}** (${R.sub}): ${R.lines.join("; ")}. ${R.note}`),
  ];
}

/** A failure's chart, caption and four parts, under a heading of `level`, its click a level below. */
const story = (s: Story, level: number) => {
  const v = VISUAL.stories[s.id as keyof typeof VISUAL.stories];
  return [
    `${"#".repeat(level)} ${v.head}`,
    para(`Chart: ${CHART[s.id]()}`),
    para(v.caption),
    ...v.lines.map(para),
    para(v.checked),
    ...(v.limit ? [para(v.limit)] : []),
    `${"#".repeat(level + 1)} ${VISUAL.clicks[s.id]}`,
    ...parts(s),
  ];
};

/** A red-pen line written out: what shows, then what is struck and what is circled. */
const penLine = (x: { struck?: string; circled: string; rest?: string }) => {
  const shown = `${x.struck ? `${x.struck} → ` : ""}${x.circled}${x.rest ?? ""}`;
  const marks = `${x.struck ? ` Struck through in red: ${x.struck}.` : ""} Circled in red: ${x.circled}.`;
  return para(`${shown}.${marks}`);
};

/** 9 Nov: the held list, the first story, in the shape the page draws it; the card in full under its click. */
const held = () => [
  `### ${HELD.head}`,
  penLine(HELD.exhibit),
  para(HELD.caught),
  para(HELD.checked),
  para(HELD.limit),
  `#### ${VISUAL.clicks["held-list"]}`,
  proofMarkdown(PROOF["held-list"], "full", { level: 5, links: false, href }),
];

export function howMarkdown(): string {
  const K = VISUAL.kickers;
  return [
    // 3 Nov (the AI-friendly audit): the photo opens the page, as on it, and the title line says whose page this is and
    // where it lives, as a post's copy does: handed to a model on its own, this copy never named him.
    PHOTO ? para(image(PHOTO.alt, abs(PHOTO.src))) : "",
    para(`*${HOW.kicker}*`),
    `# ${HOW.headline}`,
    para(`*${HOW.title}*. By ${ME.name}. Web page: ${abs("/how-i-build")}`),
    ...HOW.sub.map(para),
    ...(VISUAL.heroLinks.length ? [list(VISUAL.heroLinks.map((l) => link(bare(l.label), href(l.href))))] : []),

    `## ${K.failures}`,
    // 9 Nov (his pick, "Proof first"): the first section, the held list first.
    ...held(),
    ...FAILURES.stories.flatMap((s) => story(s, 3)),

    `## ${K.skills}`,
    list(SKILLS.map((s) => `**${s.title}**: ${md(s.line)}`)),
    para(`${SKILLS_NOT_YET.label} ${SKILLS_NOT_YET.text}`),
    `### ${NERD.summary}`,
    para(`Drawing: ${PIPELINE_STEPS.label}`),
    para(pen(PIPELINE_STEPS.note)),
    para(NERD.caption),
    PIPELINE_STEPS.steps.map((s, i) => `${i + 1}. **${s.name}${s.gate ? " (gate)" : ""}.** ${s.what} Check: ${s.check}`).join("\n"),
    `#### ${NERD.testingHead}`,
    list(NERD.testing.map(md)),
    `#### ${NERD.clayHead}`,
    // 3 Nov: the free check figure sits under the heading, before the list, as on the page.
    ...freeCheck(),
    list(NERD.clay.map(md)),

    `## ${K.habits}`,
    ...HABITS.flatMap((h) => {
      return [
        `### ${h.head}`,
        penLine(h.exhibit),
        ...h.lines.map(para),
        para(h.link ? `${h.checked} · ${link(h.link.label, href(h.link.href))}` : h.checked),
        ...(h.story ? [`#### ${VISUAL.clicks[h.story.id]}`, ...parts(h.story)] : []),
      ];
    }),

    `## ${K.agents}`,
    para(`Drawing: ${AGENTS.label}`),
    para(pen(AGENTS.note)),
    // 9 Nov: the two lines sit inside the click, before its columns, as on the page.
    ...onItsOwn(),

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
    para(CONTACT.results),
    para(CONTACT.where),
    para(
      [link("LinkedIn", ME.linkedin), link("GitHub", ME.github), link("Résumé (PDF)", abs("/resume.pdf")), link("Home", mdHref("/")), link("Writing", mdHref("/writing"))].join(" · "),
    ),
  ]
    .filter(Boolean)
    .join("\n\n")
    .concat("\n");
}
