"use client";

// Deep links into a closed click (2 Nov): when the address names something inside a <details> (a corrections-log entry,
// a part of the nerd details), open it and bring the target into view, on load and on every hash change. Without a hash
// it does nothing; without JavaScript the click still opens by hand. Scrolling follows html{scroll-behavior}, so it is
// instant under reduced motion.

import { useEffect } from "react";

export default function OpenOnHash() {
  useEffect(() => {
    const open = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      let opened = false;
      for (let d = target.closest("details"); d; d = d.parentElement?.closest("details") ?? null) {
        if (!d.open) {
          d.open = true;
          opened = true;
        }
      }
      if (opened) target.scrollIntoView();
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, []);
  return null;
}
