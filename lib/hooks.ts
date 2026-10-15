"use client";

import { useEffect, useRef, type RefObject } from "react";
import { shouldReveal } from "./reveal";

/** Adds `.in` once the element is well into view (see shouldReveal). CSS draws the pen mark. */
export function useReveal<T extends HTMLElement = HTMLElement>(): RefObject<T | null> {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        // Several ratio steps, so an element taller than the screen still reports as it fills the viewport.
        if (entries.some((e) => e.isIntersecting && shouldReveal(e.intersectionRatio, e.intersectionRect.height, e.rootBounds?.height ?? window.innerHeight))) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.75, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}
