import type { ReactNode } from "react";
import { keep } from "@/lib/text";

// One story in /how-i-build's first section, "What broke, and what I changed" (9 Nov 2026, his pick "Proof first"): the
// held list, Claygent, the mail servers, each in the same shape so a reader learns it once: the heading, the picture
// (a red-pen line or a chart), its caption, one or two short lines, what it was checked against, the limit at body size,
// then the click with the whole story. No box: the habit card further down keeps the wash. Words in data/how.ts.

export default function StoryCard({
  id,
  head,
  picture,
  caption,
  lines,
  checked,
  limit,
  click,
}: {
  id: string;
  head: string;
  picture: ReactNode;
  caption?: string;
  lines: string[];
  checked: string;
  limit?: string;
  click: ReactNode;
}) {
  return (
    <article id={id} className="storycard">
      <h3 className="h3">{keep(head)}</h3>
      {picture}
      {caption && <p className="cap">{caption}</p>}
      {lines.map((l) => (
        <p key={l} className="habit-cap">
          {keep(l)}
        </p>
      ))}
      <p className="habit-tag story-tag">{checked}</p>
      {/* 9 Nov, late ("we should not undersell"): the limit at caption size, under the tag; still on view. */}
      {limit && <p className="cap story-limit">{keep(limit)}</p>}
      {click}
    </article>
  );
}
