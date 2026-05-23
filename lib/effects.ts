"use client";

/* Shared interaction hooks used to add tactile flavor across the site.
   - useMouse: tracks pointer position with rAF-throttling. Returns x,y in px.
   - useTilt: gives a transform string for a 3D tilt that follows the cursor.
   - useScramble: progressively decodes a target string when an element scrolls
     into view. Uses monospace so layout doesn't shift.
   - useReducedMotion: respects the OS-level setting so we never thrash. */

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";

export function useReducedMotion(): boolean {
  const [v, set] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    set(mq.matches);
    const h = () => set(mq.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return v;
}

export function useMouse(): { x: number; y: number } {
  const [p, set] = useState({ x: -1, y: -1 });
  useEffect(() => {
    let raf = 0;
    let lastX = 0;
    let lastY = 0;
    const onMove = (e: PointerEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        set({ x: lastX, y: lastY });
        raf = 0;
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  return p;
}

export function useTilt<T extends HTMLElement>(max = 4): {
  ref: RefObject<T | null>;
  style: CSSProperties;
  reset: () => void;
} {
  const ref = useRef<T>(null);
  const [t, set] = useState({ rx: 0, ry: 0, lift: 0 });
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    let raf = 0;
    let lx = 0, ly = 0;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      lx = ((e.clientX - cx) / (r.width / 2)) * max;
      ly = ((e.clientY - cy) / (r.height / 2)) * max;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        set({ rx: -ly, ry: lx, lift: 1 });
        raf = 0;
      });
    };

    const onLeave = () => set({ rx: 0, ry: 0, lift: 0 });

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [max, reduced]);

  return {
    ref,
    style: {
      transform: `perspective(900px) rotateX(${t.rx}deg) rotateY(${t.ry}deg) translateZ(${t.lift * 6}px)`,
      transition: t.lift ? "transform .08s linear" : "transform .35s cubic-bezier(.22,1,.36,1)",
      willChange: "transform",
    },
    reset: () => set({ rx: 0, ry: 0, lift: 0 }),
  };
}

/* Reveal a target string by scrambling through random characters first.
   Preserves character class so digits stay digits, arrows stay arrows, etc.
   This keeps layout stable while the value resolves. */
const DIGITS = "0123456789";
const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function randCharFor(orig: string): string {
  if (/[0-9]/.test(orig)) return DIGITS[Math.floor(Math.random() * DIGITS.length)];
  if (/[a-z]/.test(orig)) return LOWER[Math.floor(Math.random() * LOWER.length)];
  if (/[A-Z]/.test(orig)) return UPPER[Math.floor(Math.random() * UPPER.length)];
  return orig;
}

export function useScramble<T extends HTMLElement>(
  target: string,
  duration = 700,
): { ref: RefObject<T | null>; value: string } {
  const ref = useRef<T>(null);
  const [v, set] = useState<string>(target);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!ref.current) return;
    if (reduced) {
      set(target);
      return;
    }

    let started = false;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !started) {
            started = true;
            const t0 = performance.now();
            const len = target.length;
            const tick = (now: number) => {
              const k = Math.min(1, (now - t0) / duration);
              const reveal = Math.floor(k * len);
              let out = "";
              for (let i = 0; i < len; i++) {
                const ch = target[i];
                if (i < reveal) out += ch;
                else out += randCharFor(ch);
              }
              set(out);
              if (k < 1) requestAnimationFrame(tick);
              else set(target);
            };
            requestAnimationFrame(tick);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.35 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [target, duration, reduced]);

  return { ref, value: v };
}
