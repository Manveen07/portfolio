"use client";

import { useEffect } from "react";

/** Marks <html> with `pen-live` once React runs on the page (3 Nov 2026, code review). The inline head script sets
    `pen-js` before any bundle loads, and the figures that play once in view hide their words until they play. If the
    bundle never runs (a script that failed to load), nothing would ever play them, so app/globals.css shows those words
    after 5 seconds on any page without `pen-live`. On a working page this lands first and that never happens. */
export default function PenLive() {
  useEffect(() => {
    document.documentElement.classList.add("pen-live");
  }, []);
  return null;
}
