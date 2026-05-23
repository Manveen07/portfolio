"use client";

// Shared client hooks. All used in section components for reveal-on-scroll,
// count-up, the clock in the navbar, and scroll-spy navigation.

import { useEffect, useRef, useState, type RefObject } from "react";

type InViewOpts = { threshold?: number; once?: boolean };

export function useInView<T extends HTMLElement = HTMLDivElement>(
  opts: InViewOpts = { threshold: 0.12, once: true },
): [RefObject<T | null>, boolean] {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setSeen(true);
            el.classList.add("in");
            if (opts.once !== false) io.disconnect();
          } else if (opts.once === false) {
            setSeen(false);
            el.classList.remove("in");
          }
        });
      },
      { threshold: opts.threshold ?? 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return [ref, seen];
}

export function useCountUp(
  target: number,
  ref: RefObject<HTMLElement | null>,
  duration = 1400,
): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const el = ref?.current;
    if (!el) {
      setVal(target);
      return;
    }
    let raf = 0;
    let started = false;
    let t0 = 0;
    const tick = (ts: number) => {
      if (!t0) t0 = ts;
      const k = Math.min(1, (ts - t0) / duration);
      const e = 1 - Math.pow(1 - k, 3);
      setVal(Math.round(target * e * 10) / 10);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting && !started) {
            started = true;
            raf = requestAnimationFrame(tick);
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [target, ref, duration]);
  return val;
}

export function useClock(): Date {
  const [t, set] = useState<Date>(() => new Date());
  useEffect(() => {
    const id = setInterval(() => set(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export function useScrolled(threshold = 16): boolean {
  const [s, set] = useState(false);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        set(window.scrollY > threshold);
        raf = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return s;
}

export function useScrollSpy(ids: string[]): string {
  const [active, set] = useState(ids[0]);
  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!els.length) return;
    const seen = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.intersectionRatio));
        let best = ids[0];
        let bestR = 0;
        for (const [id, r] of seen.entries()) {
          if (r > bestR) {
            best = id;
            bestR = r;
          }
        }
        if (bestR > 0) set(best);
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return active;
}
