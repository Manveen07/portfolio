"use client";

/* Hidden extras. None of these announce themselves; all of them reward
   someone who pokes at the page.

   1. Konami code            → "MAINTENANCE MODE": every lamp goes red, the
                                belts reverse, the page tilts a half-degree.
   2. Type "unattended"      → the footer serial-plate hint pays off.
   3. Console greeting       → for the people who open devtools first.
   4. Idle for 90s           → one lamp blinks the SOS pattern. That's it.
   5. Tab away and back      → the title bar notices you left.
*/

import { useEffect, useState } from "react";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

function Toast({ children, onDone }: { children: React.ReactNode; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 6000);
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
        maxWidth: "min(92vw, 560px)",
      }}
    >
      <span className="lamp warn pulse" />
      <span className="mono" style={{ fontSize: 12, lineHeight: 1.5, color: "var(--text)" }}>
        {children}
      </span>
    </div>
  );
}

export default function Easter() {
  const [maintenance, setMaintenance] = useState(false);
  const [toast, setToast] = useState<React.ReactNode>(null);

  // 3. Console greeting.
  useEffect(() => {
    const y = "color:#ffd60a;font:700 13px/1.5 monospace";
    const d = "color:#8a9099;font:400 12px/1.6 monospace";
    console.log("%c ┌─ PANEL 01 ─────────────────────────────┐", y);
    console.log("%c You opened the console. Of course you did.", d);
    console.log("%c Everything on this page is a real number.", d);
    console.log("%c The run history is read from GitHub Actions.", d);
    console.log("%c ↑↑↓↓←→←→ B A does something.", d);
    console.log("%c manveen9650@gmail.com", y);
    console.log("%c └────────────────────────────────────────┘", y);
  }, []);

  // 1 + 2. Key sequences.
  useEffect(() => {
    let konami: string[] = [];
    let typed = "";

    const onKey = (e: KeyboardEvent) => {
      // Konami
      konami = [...konami, e.key].slice(-KONAMI.length);
      if (konami.length === KONAMI.length && konami.every((k, i) => k.toLowerCase() === KONAMI[i].toLowerCase())) {
        setMaintenance((m) => !m);
        konami = [];
      }

      // "unattended"
      if (e.key.length === 1) {
        typed = (typed + e.key.toLowerCase()).slice(-12);
        if (typed.includes("unattended")) {
          typed = "";
          setToast(
            <>
              You found the serial plate and typed the word. That is exactly the kind of
              persistence I automate for.{" "}
              <a href="mailto:manveen9650@gmail.com?subject=unattended" style={{ color: "var(--yellow)" }}>
                Email me the word →
              </a>
            </>,
          );
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 4. Idle → one lamp blinks SOS.
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

  // 5. Title bar notices you left.
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

  // Maintenance mode paints itself through a root attribute; CSS owns the look.
  useEffect(() => {
    if (maintenance) {
      document.documentElement.setAttribute("data-maintenance", "1");
      setToast(
        <>
          <b style={{ color: "var(--yellow)" }}>MAINTENANCE MODE.</b> Every lamp red, belts
          reversed. This is what the panel looks like at 3am when something breaks. Press the code
          again to bring it back up.
        </>,
      );
    } else {
      document.documentElement.removeAttribute("data-maintenance");
    }
  }, [maintenance]);

  return toast ? <Toast onDone={() => setToast(null)}>{toast}</Toast> : null;
}
