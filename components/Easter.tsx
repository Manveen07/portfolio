"use client";

/* Hidden extras. None announce themselves; all reward poking around.

   1. Type "batman"      → NIGHT SHIFT: the panel drops to a cold blue,
                            lamps dim, and a signal sweeps the page.
   2. Type "unattended"  → the footer serial-plate hint pays off.
   3. Console greeting   → for whoever opens devtools first.
   4. Idle 90s           → one lamp blinks SOS.
   5. Tab away and back  → the title bar notices you left.

   The joke is the shape, not the property: no logos, no quoted dialogue.
*/

import { useEffect, useState } from "react";

function Toast({ children, onDone }: { children: React.ReactNode; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 7000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div
      className="panel"
      style={{
        position: "fixed",
        left: "50%",
        bottom: 28,
        transform: "translateX(-50%)",
        zIndex: 60,
        padding: "14px 20px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        animation: "poweron .4s cubic-bezier(.2,.8,.2,1) both",
        maxWidth: "min(92vw, 580px)",
      }}
    >
      <span className="lamp warn pulse" />
      <span className="mono" style={{ fontSize: 12, lineHeight: 1.55, color: "var(--text)" }}>
        {children}
      </span>
    </div>
  );
}

/* The signal, built the way the animated series stages it: a searchlight
   throws from off-screen at the lower left, the beam widens as it travels,
   and the disc it lands on carries the silhouette as an absence of light
   rather than a drawn object. Geometry written for this page. */
function Signal() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        animation: "signal-in 7s ease-in-out both",
      }}
    >
      <svg
        viewBox="0 0 900 500"
        preserveAspectRatio="xMaxYMin slice"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <defs>
          <radialGradient id="sig-disc">
            <stop offset="0%" stopColor="#f2f7ff" stopOpacity="0.55" />
            <stop offset="52%" stopColor="#9dc3ff" stopOpacity="0.24" />
            <stop offset="100%" stopColor="#5b7fb8" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="sig-shaft" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#9dc3ff" stopOpacity="0.20" />
            <stop offset="55%" stopColor="#9dc3ff" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#9dc3ff" stopOpacity="0" />
          </linearGradient>
          <mask id="sig-cut">
            <rect width="900" height="500" fill="white" />
            <g transform="translate(560,60) scale(1.15)">
              <path fill="black" d="M 12 118 C 44 108, 68 112, 86 122 C 88 108, 92 100, 98 96 L 100 62 L 110 92 C 114 88, 126 88, 130 92 L 140 62 L 142 96 C 148 100, 152 108, 154 122 C 172 112, 196 108, 228 118 C 214 130, 206 144, 204 160 L 186 140 L 172 168 L 156 146 L 140 176 C 132 168, 126 172, 120 186 C 114 172, 108 168, 100 176 L 84 146 L 68 168 L 54 140 L 36 160 C 34 144, 26 130, 12 118 Z" />
            </g>
          </mask>
          <filter id="sig-soft">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        {/* the shaft: narrow at the lamp, widening toward the disc */}
        <path d="M 0 500 L 22 500 L 700 150 L 640 92 Z" fill="url(#sig-shaft)" filter="url(#sig-soft)" />
        <path d="M 4 500 L 12 500 L 676 128 L 656 108 Z" fill="#cfe2ff" opacity="0.07" filter="url(#sig-soft)" />

        {/* the disc, with the silhouette cut out of the light */}
        <g mask="url(#sig-cut)">
          <circle cx="698" cy="198" r="150" fill="url(#sig-disc)" />
        </g>
        <circle cx="698" cy="198" r="150" fill="none" stroke="#9dc3ff" strokeOpacity="0.14" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

export default function Easter() {
  const [night, setNight] = useState(false);
  const [signal, setSignal] = useState(false);
  const [toast, setToast] = useState<React.ReactNode>(null);

  // Console greeting.
  useEffect(() => {
    const y = "color:#ffd60a;font:700 13px/1.5 monospace";
    const d = "color:#8a9099;font:400 12px/1.6 monospace";
    console.log("%c ┌─ PANEL 01 ──────────────────────────────┐", y);
    console.log("%c You opened the console. Of course you did.", d);
    console.log("%c Every number on this page is a real one.", d);
    console.log("%c The run history comes from GitHub Actions.", d);
    console.log("%c The panel runs a night shift. It answers to", d);
    console.log("%c the name of a certain caped detective.", d);
    console.log("%c manveen9650@gmail.com", y);
    console.log("%c └─────────────────────────────────────────┘", y);
  }, []);

  // Typed sequences.
  useEffect(() => {
    let typed = "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key.length !== 1) return;
      typed = (typed + e.key.toLowerCase()).slice(-12);

      if (typed.endsWith("batman")) {
        typed = "";
        setNight((n) => !n);
        setSignal(true);
        setTimeout(() => setSignal(false), 6000);
      }

      if (typed.includes("unattended")) {
        typed = "";
        setToast(
          <>
            You found the serial plate and typed the word. That is exactly the kind of persistence
            I automate for.{" "}
            <a href="mailto:manveen9650@gmail.com?subject=unattended" style={{ color: "var(--yellow)" }}>
              Email me the word →
            </a>
          </>,
        );
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Idle → SOS.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const arm = () => {
      clearTimeout(timer);
      document.documentElement.removeAttribute("data-idle");
      timer = setTimeout(() => document.documentElement.setAttribute("data-idle", "1"), 90000);
    };
    const events = ["pointermove", "keydown", "scroll", "pointerdown"] as const;
    events.forEach((ev) => window.addEventListener(ev, arm, { passive: true }));
    arm();
    return () => {
      clearTimeout(timer);
      events.forEach((ev) => window.removeEventListener(ev, arm));
    };
  }, []);

  // Title bar notices you left.
  useEffect(() => {
    const original = document.title;
    const onVis = () => {
      document.title = document.hidden ? "still running without you…" : original;
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      document.title = original;
    };
  }, []);

  // Night shift paints through a root attribute; CSS owns the look.
  useEffect(() => {
    if (night) {
      document.documentElement.setAttribute("data-night", "1");
      setToast(
        <>
          <b style={{ color: "#9dc3ff" }}>Night shift.</b> The systems on this page run at 3am
          whether anyone is watching. Type it again for the lights.
        </>,
      );
    } else {
      document.documentElement.removeAttribute("data-night");
    }
  }, [night]);

  return (
    <>
      {signal && <Signal />}
      {toast && <Toast onDone={() => setToast(null)}>{toast}</Toast>}
    </>
  );
}
