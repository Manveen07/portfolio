// A proof card (components/ProofCard.tsx) as markdown, for /index.md and /how-i-build.md: the same words in the order
// the page shows them, with the red pen written out (what is struck, what is circled, the notes). tests/ai.test.mjs and
// tests/how.test.mjs hold this copy to the built page.

import { stepLine, type ProofCard, type ProofStep } from "@/data/proof";
import { para, list, link, pen } from "@/lib/md/format";

/** A step's sub, then what the pen does to it: the circled words, the note under it. */
const marked = (s: ProofStep, note = true) =>
  `${s.sub}${s.circle ? `. Circled in red: ${s.circle}` : ""}${note && s.note ? `. ${pen(s.note)}` : ""}`;

export function proofMarkdown(
  c: ProofCard,
  density: "full" | "compact",
  opts: { level: 2 | 3; links: boolean; href: (h: string) => string },
): string {
  const out = [
    `${"#".repeat(opts.level)} ${c.title}`,
    para(`*${c.eyebrow}*`),
    [`*${c.before.label}* (struck through in red):`, list(c.before.lines)].join("\n"),
    para(pen(c.before.note)),
  ];
  if (density === "full") {
    out.push(c.steps.map((s, i) => `${i + 1}. **${s.name}** ${marked(s)}`).join("\n"));
  } else {
    const check = c.steps[c.compact.check];
    const result = c.steps[c.compact.result];
    out.push(list([stepLine(check), `**${result.name}**: ${marked(result, false)}`]));
    if (result.note) out.push(para(pen(result.note)));
  }
  out.push(para(pen(`circled: ${c.circledLabel}`)), para(c.footer));
  if (c.limit) out.push(para(c.limit));
  if (opts.links && c.links.length) out.push(list(c.links.map((l) => link(l.label, opts.href(l.href)))));
  return out.join("\n\n");
}
