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

/* The signal itself: a hard-edged spotlight that sweeps once, drawn
   rather than imported — a circle, a beam, and a bat-shaped notch cut
   from the middle. Original geometry. */
function Signal() {
  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 55,
        pointerEvents: "none",
        display: "grid",
        placeItems: "start end",
        padding: "clamp(40px, 8vh, 110px) clamp(24px, 6vw, 90px)",
        animation: "signal-in 7s ease-in-out both",
      }}
    >
      <svg viewBox="0 0 240 240" width="min(22vmin, 168px)" height="min(22vmin, 168px)" style={{ filter: "drop-shadow(0 0 44px rgba(160,200,255,.35))", opacity: 0.85 }}>
        <defs>
          <radialGradient id="beam">
            <stop offset="0%" stopColor="#dbe9ff" stopOpacity="0.7" />
            <stop offset="62%" stopColor="#9dc3ff" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#5b7fb8" stopOpacity="0" />
          </radialGradient>
          <mask id="cut">
            <rect width="240" height="240" fill="white" />
            {/* wings, body, ears — one path, drawn for this page */}
            <path
              fill="black"
              d="M120 96c4 0 7 4 8 9 6-4 10-11 10-19 4 6 6 13 6 20 14-11 30-16 48-14-8 5-13 12-15 21 11-4 21-3 30 3-12 1-21 7-27 17-5 9-13 15-23 17-7 2-13 0-17-5-4-5-8-8-12-8s-8 3-12 8c-4 5-10 7-17 5-10-2-18-8-23-17-6-10-15-16-27-17 9-6 19-7 30-3-2-9-7-16-15-21 18-2 34 3 48 14 0-7 2-14 6-20 0 8 4 15 10 19 1-5 4-9 8-9z"
            />
          </mask>
        </defs>
        <circle cx="120" cy="120" r="112" fill="url(#beam)" mask="url(#cut)" />
        <circle cx="120" cy="120" r="112" fill="none" stroke="#9dc3ff" strokeOpacity="0.22" strokeWidth="1.5" />
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
