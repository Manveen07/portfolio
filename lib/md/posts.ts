// The writing pages as markdown: /writing.md (the list) and /writing/<slug>.md (each post).
// Post bodies already use markdown's inline syntax (**bold**, *italic*, `code`, [text](url)), so blocks print as is.
// The posts drawn by components (drawing-proof, the confidently-wrong notes, the namesake game) are written out from the same
// data the components render; tests/ai.test.mjs checks every block, alt text and number against the built page.

import { NEWEST_FIRST, postDate, type Block, type Post, type PostComponent } from "@/data/posts";
import { ME, DRAWINGS as D, WRONG, NAMESAKE as N, type Pin } from "@/data/portfolio";
import { abs, mdHref } from "@/lib/site";
import { para, list, link, image, pen } from "@/lib/md/format";

/** A red-pen exhibit as the page shows it: the words as code, the scribble, and which part the pen marks. */
const exhibit = (e: Pin["exhibit"], scribble: string) =>
  para(`\`${e.before}${e.marked}${e.after ?? ""}\` ${scribble} (the red pen ${e.pen === "underline" ? "underlines" : "circles"} \`${e.marked}\`)`);

/** Links to this site's pages point at their markdown copies, like the rest of the copy. */
const mdLinks = (s: string) => s.replace(/\]\((\/[^)]*)\)/g, (_, href: string) => `](${mdHref(href)})`);

function block(b: Block): string {
  switch (b.t) {
    case "h2":
      return `## ${b.s}`;
    case "p":
      return para(mdLinks(b.s));
    case "exhibit":
      return exhibit(b, b.scribble);
    case "code":
      return ["```" + b.lang, b.s, "```"].join("\n");
    case "quote":
      return `> ${mdLinks(b.s)}`;
    case "ul":
      return list(b.items.map(mdLinks));
    case "table":
      return [`| ${b.head.join(" | ")} |`, `| ${b.head.map(() => "---").join(" | ")} |`, ...b.rows.map((r) => `| ${r.join(" | ")} |`)].join("\n");
  }
}

/** components/Drawings.tsx, top to bottom. */
function drawingProof(): string[] {
  return [
    para(D.what),
    para(image(D.shot.alt, abs(D.shot.src))),
    para(pen(D.shotNote)),
    para(D.caption),
    list(D.marks.map(([n, label]) => `**${n}** ${label}`)),
    para(D.sums),
    para(D.wrongLine),
    para(D.lesson),
    para(D.finePrint),
    para(pen(D.finePrintNote)),
    para(`built with ${D.stack.join(", ")}`),
    para(
      `Drawing © 2026 ${D.credit.by}, from his ${link(D.credit.project, D.credit.projectHref)} project, marked ${link(D.credit.licence, D.credit.licenceHref)}. Cropped, and shared under the same licence; the red pen is mine.`,
    ),
  ];
}

/** One note of components/Wrong.tsx. */
function pin(p: Pin): string {
  return [
    `## ${p.date} · ${p.title}`,
    exhibit(p.exhibit, p.scribble),
    para(p.what),
    para(`**What I check now:** ${p.now}`),
  ].join("\n\n");
}

/** components/Namesake.tsx, top to bottom (3 Nov): the game with every case and the checker's call (the page shows a
    call once it is picked), the README's gate output whole with the red stamp written out, then the prose. */
function namesake(): string[] {
  return [
    para(`*${N.eyebrow}*`),
    `## ${N.head}`,
    para(N.intro),
    para(`*${N.howToPlay}*`),
    list(N.cases.map((c) => `${N.tags.crm} ${c.crm} · ${N.tags.signal} ${c.signal} · ${N.tags.call} **${c.call}**, ${c.why}`)),
    para(N.gate.intro),
    ["```text", N.gate.lines, "```"].join("\n"),
    para(`*On the page ${N.gate.stamped} is stamped in red.* ${N.gate.rule}`),
    ...N.after.map(block),
  ];
}

const COMPONENT_MD: Record<PostComponent, () => string[]> = {
  "drawing-proof": drawingProof,
  "confidently-wrong": () => WRONG.pins.map(pin),
  "champion-namesake": namesake,
};

/** The line under a post's title, as the page shows it. */
export const postMeta = (p: Post) => `${postDate(p)} · ${p.readMins} min read · ${p.tags.join(", ")}`;

export function postMarkdown(p: Post): string {
  const others = NEWEST_FIRST.filter((o) => o.slug !== p.slug);
  return [
    `# ${p.title}`,
    para(`${postMeta(p)}. By ${ME.name}. Web page: ${abs(`/writing/${p.slug}`)}`),
    `> ${p.summary}`,
    ...(Array.isArray(p.body) ? p.body.map(block) : COMPONENT_MD[p.body.component]()),
    "---",
    ...(others.length ? ["## More writing", list(others.map((o) => `${link(o.cardTitle ?? o.title, mdHref(`/writing/${o.slug}`))}, ${postDate(o)}`))] : []),
    para(`${link("all writing", mdHref("/writing"))} · ${link("the home page", mdHref("/"))}`),
  ]
    .join("\n\n")
    .concat("\n");
}

export function writingMarkdown(): string {
  return [
    `# Writing | ${ME.name}`,
    para("What I tried, what broke, what fixed it."),
    ...NEWEST_FIRST.map((p) =>
      [
        `## ${link(p.cardTitle ?? p.title, mdHref(`/writing/${p.slug}`))}`,
        para(`${postDate(p)} · ${p.readMins} min read`),
        para(p.cardSummary ?? p.summary),
        ...(p.cardTitle ? [para(`Full title: ${p.title}`)] : []),
      ].join("\n\n"),
    ),
    "---",
    para(link("The home page", mdHref("/"))),
  ]
    .join("\n\n")
    .concat("\n");
}
