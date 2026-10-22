"use client";

// A picture with red pen marks drawn over it. Same mechanism as the sketches: the server HTML has the
// marks drawn; `pen-js` hides the red `.mark` paths until the picture scrolls into view, then they draw
// once. Readers without JS, or with reduced motion, always see them.

import type { ReactNode } from "react";
import { useReveal } from "@/lib/hooks";

export default function Marked({ children }: { children: ReactNode }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="marked">
      {children}
    </div>
  );
}
