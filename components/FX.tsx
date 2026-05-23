"use client";

/* Global interaction layer:
   - CursorGlow: jade halo that follows the pointer + tiny <x,y> coord readout.
   - ScrollProgress: thin top bar + a mono percent indicator in the bottom corner.
   - TabTitleRotator: cycles the browser tab title with fake activity when hidden.
   All three respect prefers-reduced-motion. */

import { useEffect, useState } from "react";
import { T } from "@/lib/tokens";
import { useMouse, useReducedMotion } from "@/lib/effects";

function CursorGlow() {
  const { x, y } = useMouse();
  const [supports, setSupports] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    // Skip on touch devices — pointermove from touch is jarring.
    setSupports(window.matchMedia("(pointer: fine)").matches);
  }, []);

  if (!supports || reduced) return null;
  const hidden = x < 0 || y < 0;

  return (
    <>
      <div
        aria-hidden
        style={{
          position: "fixed",
          left: x,
          top: y,
          width: 360,
          height: 360,
          marginLeft: -180,
          marginTop: -180,
          pointerEvents: "none",
          zIndex: 40,
          opacity: hidden ? 0 : 1,
          background: `radial-gradient(circle at center, rgba(125,217,154,0.10) 0%, rgba(125,217,154,0.04) 28%, transparent 60%)`,
          mixBlendMode: "screen",
          transition: "opacity .25s ease",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "fixed",
          left: x,
          top: y,
          width: 14,
          height: 14,
          marginLeft: -7,
          marginTop: -7,
          pointerEvents: "none",
          zIndex: 41,
          opacity: hidden ? 0 : 0.85,
          border: `1px solid ${T.accent}`,
          borderRadius: 2,
          boxShadow: `0 0 12px rgba(125,217,154,0.35)`,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 42,
          fontFamily: T.mono,
          fontSize: 10,
          color: T.dim2,
          letterSpacing: "0.08em",
          padding: "4px 8px",
          border: `1px solid ${T.line2}`,
          background: "rgba(10,13,12,0.7)",
          backdropFilter: "blur(4px)",
          pointerEvents: "none",
          opacity: hidden ? 0 : 1,
          transition: "opacity .25s ease",
        }}
      >
        ⌖ <span style={{ color: T.accent }}>{String(Math.round(x)).padStart(4, "0")}</span>
        <span style={{ color: T.dim2 }}>,</span>
        <span style={{ color: T.accent }}>{String(Math.round(y)).padStart(4, "0")}</span>
      </div>
    </>
  );
}

function ScrollProgress() {
  const [p, set] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const ratio = max > 0 ? h.scrollTop / max : 0;
      set(Math.max(0, Math.min(1, ratio)));
      raf = 0;
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const pct = Math.round(p * 100);
  const filled = Math.round(p * 12);
  const bar = "█".repeat(filled) + "░".repeat(12 - filled);

  return (
    <>
      <div
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: 2,
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${T.accent2}, ${T.accent})`,
          zIndex: 60,
          transition: reduced ? "none" : "width .12s linear",
          boxShadow: `0 0 8px rgba(125,217,154,0.45)`,
        }}
      />
      <div
        aria-hidden
        style={{
          position: "fixed",
          left: 16,
          bottom: 16,
          zIndex: 42,
          fontFamily: T.mono,
          fontSize: 10,
          color: T.dim,
          letterSpacing: "0.08em",
          padding: "4px 8px",
          border: `1px solid ${T.line2}`,
          background: "rgba(10,13,12,0.7)",
          backdropFilter: "blur(4px)",
          pointerEvents: "none",
        }}
      >
        <span style={{ color: T.dim2 }}>[</span>
        <span style={{ color: T.accent }}>{bar}</span>
        <span style={{ color: T.dim2 }}>] </span>
        <span style={{ color: T.text }}>{String(pct).padStart(2, "0")}%</span>
      </div>
    </>
  );
}

function TabTitleRotator() {
  useEffect(() => {
    const original = document.title;
    const lines = [
      "[ok] pipeline.dag idle",
      "agt-04 finished · 4.2s",
      "[run] vector.rank()",
      "manveen.singh — back soon",
      "[idle] 0 events queued",
      "schema.ok · 219/231",
    ];
    let i = 0;
    let id: ReturnType<typeof setInterval> | null = null;

    const start = () => {
      if (id) return;
      id = setInterval(() => {
        document.title = lines[i % lines.length];
        i += 1;
      }, 2400);
    };
    const stop = () => {
      if (id) {
        clearInterval(id);
        id = null;
      }
      document.title = original;
    };

    const onVis = () => (document.hidden ? start() : stop());
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      stop();
    };
  }, []);
  return null;
}

export default function FX() {
  return (
    <>
      <CursorGlow />
      <ScrollProgress />
      <TabTitleRotator />
    </>
  );
}
