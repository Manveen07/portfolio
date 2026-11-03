// Small helpers for the figures that play once in view (3 Nov 2026): the free check on /how-i-build
// (components/sketches/FreeCheckFirst.tsx) and what runs on its own (components/sketches/OnItsOwn.tsx). useReveal adds
// `.in`; app/globals.css plays CSS keyframes from it, each part at its own delay. No timers.

import type { CSSProperties } from "react";

/** CSS custom properties in seconds ("--at: 1.5s"), for the animation delays in app/globals.css. */
export const secs = (v: Record<string, number | undefined>) =>
  Object.fromEntries(Object.entries(v).flatMap(([k, s]) => (s === undefined ? [] : [[k, `${+s.toFixed(2)}s`]]))) as CSSProperties;

/** Plays a revealed figure again: drop `.in`, read the layout so the browser forgets the finished animations, add it back. */
export function replay(el: HTMLElement | null) {
  if (!el) return;
  el.classList.remove("in");
  el.getBoundingClientRect();
  el.classList.add("in");
}
