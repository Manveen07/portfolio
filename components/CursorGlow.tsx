"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf: number;
    let mx = -200;
    let my = -200;
    let cx = -200;
    let cy = -200;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const tick = () => {
      cx += (mx - cx) * 0.12;
      cy += (my - cy) * 0.12;
      if (glow.current) {
        glow.current.style.transform = `translate(${cx - 200}px, ${cy - 200}px)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={glow}
      className="fixed top-0 left-0 w-[400px] h-[400px] pointer-events-none z-[2] hidden md:block"
      style={{
        background: "radial-gradient(circle, rgba(0,229,255,0.045) 0%, rgba(0,255,136,0.02) 30%, transparent 65%)",
        filter: "blur(2px)",
        willChange: "transform",
      }}
    />
  );
}
