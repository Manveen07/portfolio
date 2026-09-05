"use client";

/* Ambient motion that costs nothing to notice and nothing to ignore.

   A soft light follows the pointer across whichever panel it is over —
   the way a torch would move over a real console. One listener, two CSS
   variables, no per-panel React state. Touch devices never see it. */

import { useEffect } from "react";

export default function Ambient() {
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;

    let raf = 0;
    let target: HTMLElement | null = null;
    let x = 0;
    let y = 0;

    const onMove = (e: PointerEvent) => {
      const panel = (e.target as HTMLElement | null)?.closest?.(".panel") as HTMLElement | null;
      if (panel !== target) {
        target?.style.removeProperty("--mx");
        target?.style.removeProperty("--my");
        target = panel;
      }
      if (!target) return;
      const r = target.getBoundingClientRect();
      x = ((e.clientX - r.left) / r.width) * 100;
      y = ((e.clientY - r.top) / r.height) * 100;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        target?.style.setProperty("--mx", `${x.toFixed(1)}%`);
        target?.style.setProperty("--my", `${y.toFixed(1)}%`);
        raf = 0;
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
