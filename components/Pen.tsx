"use client";

// Red-pen marks. Server HTML has them drawn; the `pen-js` class set in
// app/layout.tsx hides them until useReveal adds `.in`, so readers without
// JS, or with reduced motion, always see them.

import type { ReactNode } from "react";
import { useReveal } from "@/lib/hooks";

/** A hand-drawn ellipse around its children. `tight` hugs letters inside a word (no side padding). */
export function Circle({ children, tight }: { children: ReactNode; tight?: boolean }) {
  const ref = useReveal<HTMLSpanElement>();
  return (
    <span ref={ref} className={tight ? "pen pen-circle tight" : "pen pen-circle"}>
      {children}
      <svg viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">
        <path pathLength={1} d="M8,32 C6,10 40,2 70,6 C96,10 98,40 80,52 C58,64 14,58 9,38" />
      </svg>
    </span>
  );
}

/** A red underline under a run of text. */
export function Underline({ children }: { children: ReactNode }) {
  const ref = useReveal<HTMLSpanElement>();
  return (
    <span ref={ref} className="pen">
      <span className="pen-under">{children}</span>
    </span>
  );
}
