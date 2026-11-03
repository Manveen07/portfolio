"use client";

// Wrapper for hand-drawn SVG sketches. Server HTML shows everything drawn; once JS
// runs, `pen-js` hides the red `.mark` paths until the sketch scrolls into view,
// then they draw once. Reduced motion and no-JS readers always see them.
// The reading is also text in the page, visually hidden (3 Nov, the AI-friendly audit): tools that turn a page into
// text for an AI drop both the SVG and the aria-label, so a drawing's words never reached them. Screen readers still
// read the label once: a role="img" element's children are presentational.

import type { ReactNode } from "react";
import { useReveal } from "@/lib/hooks";

export default function Sketch({ label, children }: { label: string; children: ReactNode }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="sketch" role="img" aria-label={label}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}
