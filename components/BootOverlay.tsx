"use client";

/* Power-on sequence. Reads like a machine checking itself before it hands
   you the panel — same vocabulary as the rest of the site, not a spinner.
   Auto-clears in ~1.6s; click to skip. Shown once per tab. */

import { useEffect, useRef, useState } from "react";

const LINES: [string, string][] = [
  ["power", "ok"],
  ["panel 01", "ok"],
  ["line 01 · tender radar", "running"],
  ["counters", "75 · 342 · 7"],
  ["mode", "unattended"],
  ["night shift", "standing by"],
];

export default function BootOverlay() {
  const [done, setDone] = useState(true);
  const [shown, setShown] = useState<number>(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let seen = false;
    try {
      seen = sessionStorage.getItem("pf-booted") === "1";
    } catch {
      // storage blocked — just play it
    }
    if (reduced || seen) return;

    try {
      sessionStorage.setItem("pf-booted", "1");
    } catch {
      // non-fatal
    }

    // Flip on the next frame, not synchronously inside the effect, so React
    // paints the initial frame first and never cascades a render.
    const start = requestAnimationFrame(() => setDone(false));

    const id = setInterval(() => {
      setShown((n) => {
        if (n + 1 >= LINES.length) clearInterval(id);
        return n + 1;
      });
    }, 190);
    const t = setTimeout(() => setDone(true), 1600);

    return () => {
      cancelAnimationFrame(start);
      clearInterval(id);
      clearTimeout(t);
    };
  }, []);

  if (done && shown === 0) return null;

  return (
    <div
      onClick={() => setDone(true)}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        opacity: done ? 0 : 1,
        pointerEvents: done ? "none" : "auto",
        transition: "opacity .45s ease .05s",
      }}
    >
      <div
        className="panel"
        style={{
          padding: "clamp(24px, 3vw, 40px) clamp(24px, 3.5vw, 52px)",
          display: "flex",
          flexDirection: "column",
          gap: 22,
          maxWidth: 560,
          width: "100%",
        }}
      >
        <span className="serial">P-00 · POWER ON</span>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span className="lamp on boot" />
          <span className="cond" style={{ fontSize: "clamp(26px, 3vw, 38px)", fontWeight: 800, letterSpacing: "-0.01em" }}>
            Manveen Singh
          </span>
        </div>

        <div className="mono" style={{ fontSize: 12, lineHeight: 2, color: "var(--dim)" }}>
          {LINES.slice(0, shown).map(([label, value], i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "baseline",
                animation: "poweron .3s cubic-bezier(.2,.8,.2,1) both",
              }}
            >
              <span style={{ color: "var(--green)" }}>[ok]</span>
              <span style={{ color: "var(--dim)" }}>{label}</span>
              <span style={{ flexGrow: 1, borderBottom: "1px dotted var(--bevel-hi)", opacity: 0.7, minWidth: 20, transform: "translateY(-4px)" }} />
              <span style={{ color: "var(--text)" }}>{value}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, borderTop: "1px solid var(--bevel)", paddingTop: 16 }}>
          <span className="belt" style={{ height: 6 }} />
          <span className="engr" style={{ textAlign: "center" }}>
            click anywhere to skip
          </span>
        </div>
      </div>
    </div>
  );
}
