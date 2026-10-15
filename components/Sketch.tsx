"use client";

// Wrapper for hand-drawn SVG sketches. Server HTML shows everything drawn; once JS
// runs, `pen-js` hides the red `.mark` paths until the sketch scrolls into view,
// then they draw once. Reduced motion and no-JS readers always see them.

import type { ReactNode } from "react";
import { useReveal } from "@/lib/hooks";

export default function Sketch({ label, children }: { label: string; children: ReactNode }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="sketch" role="img" aria-label={label}>
      {children}
    </div>
  );
}
