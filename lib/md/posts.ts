// The writing pages as markdown: /writing.md (the list) and /writing/<slug>.md (each post).
// Post bodies already use markdown's inline syntax (**bold**, *italic*, `code`, [text](url)), so blocks print as is.

import { POSTS, type Block, type Post } from "@/data/posts";
import { ME } from "@/data/portfolio";
import { abs, mdHref } from "@/lib/site";
import { para, list, link, fmtLongDate } from "@/lib/md/format";

function block(b: Block): string {
  switch (b.t) {
    case "h2":
      return `## ${b.s}`;
    case "p":
      return para(b.s);
    case "code":
      return ["```" + b.lang, b.s, "```"].join("\n");
    case "quote":
      return `> ${b.s}`;
    case "ul":
      return list(b.items);
    case "table":
      return [`| ${b.head.join(" | ")} |`, `| ${b.head.map(() => "---").join(" | ")} |`, ...b.rows.map((r) => `| ${r.join(" | ")} |`)].join("\n");
  }
}

/** The line under a post's title, as the page shows it. */
export const postMeta = (p: Post) => `${fmtLongDate(p.date)} · ${p.readMins} min read · ${p.tags.join(", ")}`;

export function postMarkdown(p: Post): string {
  const others = POSTS.filter((o) => o.slug !== p.slug);
  return [
    `# ${p.title}`,
    para(`${postMeta(p)}. By ${ME.name}. Web page: ${abs(`/writing/${p.slug}`)}`),
    `> ${p.summary}`,
    ...p.body.map(block),
    "---",
    para(
      `More: ${others.map((o) => link(o.cardTitle ?? o.title, mdHref(`/writing/${o.slug}`))).join(" · ")}${others.length ? " · " : ""}${link("all writing", mdHref("/writing"))} · ${link("the home page", mdHref("/"))}`,
    ),
  ]
    .join("\n\n")
    .concat("\n");
}

export function writingMarkdown(): string {
  return [
    `# Writing | ${ME.name}`,
    para("What I tried, what broke, what fixed it."),
    ...POSTS.map((p) =>
      [
        `## ${link(p.cardTitle ?? p.title, mdHref(`/writing/${p.slug}`))}`,
        para(`${fmtLongDate(p.date)} · ${p.readMins} min read`),
        para(p.cardSummary ?? p.summary),
        para(`Full title: ${p.title}`),
      ].join("\n\n"),
    ),
    "---",
    para(link("The home page", mdHref("/"))),
  ]
    .join("\n\n")
    .concat("\n");
}
