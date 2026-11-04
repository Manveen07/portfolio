import type { ReactNode } from "react";

/** Hyphenated words stay whole when a line wraps ("do-" / "not-contact", "mail-" / "server", seen 3 Nov in Edge at 1440
    and 390). Each one becomes a `.nw` span, which app/globals.css draws as one unbreakable box, so text-wrap: balance
    weighs it as a single word. One helper for the two figures that play once in view: components/sketches/OnItsOwn.tsx
    (which keeps its counts and dates whole first) and components/sketches/FreeCheckFirst.tsx (review, 3 Nov late: the
    two had their own copies). */
export function whole(s: string): ReactNode {
  const parts = s.split(/([\w,.']+(?:-[\w']+)+)/);
  return parts.map((p, k) => (k % 2 ? <span key={k} className="nw">{p}</span> : p));
}
