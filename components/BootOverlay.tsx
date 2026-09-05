"use client";

/* Power-on sequence. Reads like a machine checking itself before it hands
   you the panel — the same vocabulary as the rest of the page, not a
   loading spinner. Auto-clears in ~1.5s; click to skip. Shown once per
   tab so navigating back to the homepage doesn't replay it. */

import { useEffect, useRef, useState } from "react";

const LINES = [
  "power ......................... ok",
  "panel 01 ...................... ok",
  "line 01 · tender radar ........ running",
  "counters ...................... 75 · 342 · 7",
  "mode .......................... unattended",
];

export default function BootOverlay() {
  const [done, setDone] = useState(true);
  const [shown, setShown] = useState<string[]>([]);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    // Respect both reduced-motion and a boot we've already played this tab.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem("pf-booted") === "1";
    } catch {
      // Private mode / storage blocked — just show it.
    }
    if (reduced || seen) return;

    setDone(false);
    try {
      sessionStorage.setItem("pf-booted", "1");
    } catch {
      // Non-fatal.
    }

    let i = 0;
    const id = setInterval(() => {
      setShown((prev) => [...prev, LINES[i]]);
      i += 1;
      if (i >= LINES.length) clearInterval(id);
    }, 190);
    const t = setTimeout(() => setDone(true), 1500);

    return () => {
      clearInterval(id);
      clearTimeout(t);
    };
  }, []);

  if (done && shown.length === 0) return null;

  return (
    <div
      onClick={() => setDone(true)}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        opacity: done ? 0 : 1,
        pointerEvents: done ? "none" : "auto",
        transition: "opacity .45s ease .05s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span className="lamp on boot" />
        <span className="cond" style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.01em" }}>
          Manveen Singh
        </span>
      </div>

      <div className="mono" style={{ fontSize: 12, lineHeight: 1.9, color: "var(--dim)", minWidth: 300 }}>
        {shown.map((l, i) => (
          <div key={i} style={{ animation: "poweron .3s cubic-bezier(.2,.8,.2,1) both" }}>
            <span style={{ color: "var(--green)" }}>[ok]</span>&nbsp;&nbsp;{l}
          </div>
        ))}
      </div>

      <span className="engr">click anywhere to skip</span>
    </div>
  );
}
