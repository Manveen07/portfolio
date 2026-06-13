"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useScrolled, useScrollSpy, useClock } from "@/lib/hooks";
import { NAV_IDS, NAV_LABELS, NAV_VISIBLE, ME } from "@/data/portfolio";
import { T } from "@/lib/tokens";

function Dot({ size = 6, color = T.accent, glow = false, className = "" }: {
  size?: number; color?: string; glow?: boolean; className?: string;
}) {
  return (
    <span
      className={`pf-pulse ${className}`}
      style={{
        width: size, height: size, borderRadius: 9999, background: color,
        display: "inline-block", flex: "0 0 auto",
        boxShadow: glow ? `0 0 8px ${color}` : "none",
      }}
    />
  );
}

const GLITCH_POOL = "MWVNX#@/\\$%";

function LogoMark() {
  const [ch, setCh] = useState("M");
  const idRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => () => { if (idRef.current) clearInterval(idRef.current); }, []);

  const glitch = () => {
    if (idRef.current) return;
    let ticks = 0;
    idRef.current = setInterval(() => {
      ticks++;
      if (ticks > 6) {
        setCh("M");
        if (idRef.current) clearInterval(idRef.current);
        idRef.current = null;
        return;
      }
      setCh(GLITCH_POOL[Math.floor(Math.random() * GLITCH_POOL.length)]);
    }, 45);
  };

  return (
    <span
      onMouseEnter={glitch}
      style={{
        width: 30, height: 30, border: `1px solid ${T.line2}`,
        display: "grid", placeItems: "center",
        fontFamily: T.sans, fontWeight: 600, fontSize: 14, color: T.accent,
        cursor: "pointer", userSelect: "none",
        transition: "border-color .2s ease, background .2s ease",
      }}
      onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.borderColor = T.accent; }}
      onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.borderColor = T.line2; }}
    >
      {ch}
    </span>
  );
}

export default function Nav() {
  const scrolled = useScrolled(20);
  const active = useScrollSpy([...NAV_IDS]);
  const clock = useClock();
  const hh = String(clock.getHours()).padStart(2, "0");
  const mn = String(clock.getMinutes()).padStart(2, "0");
  const pathname = usePathname();
  // On sub-routes (e.g. /writing/[slug]) the homepage anchors don't exist, so
  // point them back to the homepage with the hash.
  const onHome = pathname === "/";
  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  return (
    <nav className={`pf-nav ${scrolled ? "scrolled" : ""}`}>
      <div className="pf-nav-inner">
        <a
          href={href("top")}
          onClick={() => window.dispatchEvent(new Event("pf-logo-click"))}
          style={{ display: "flex", alignItems: "center", gap: 12, padding: 0, cursor: "pointer" }}
        >
          <LogoMark />
          <span style={{ lineHeight: 1.1 }}>
            <span style={{ fontFamily: T.sans, fontSize: 13, color: T.text, fontWeight: 500, display: "block" }}>
              {ME.handle}
            </span>
            <span style={{
              fontFamily: T.mono, fontSize: 10, color: T.dim,
              letterSpacing: "0.1em", textTransform: "uppercase", display: "block",
            }}>
              {ME.subrole}
            </span>
          </span>
        </a>

        <div className="pf-nav-links" style={{ display: "flex", gap: 4, marginLeft: 40 }}>
          {NAV_VISIBLE.map((id, i) => (
            <a
              key={id}
              href={href(id)}
              className={`pf-nav-link ${onHome && active === id ? "active" : ""}`}
            >
              <span className="pf-nav-bracket">[{String(i).padStart(2, "0")}]</span>
              {NAV_LABELS[id]}
            </a>
          ))}
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: 10, alignItems: "center" }}>
          <span className="pf-nav-clock" style={{
            fontFamily: T.mono, fontSize: 10, color: T.dim, letterSpacing: "0.1em",
            display: "inline-flex", alignItems: "center", gap: 8,
          }}>
            <Dot size={5} />
            {hh}:{mn} IST
          </span>
          <a className="pf-btn" href={ME.resume} target="_blank" rel="noopener">
            resume.pdf <span style={{ color: T.accent }}>↗</span>
          </a>
          <a className="pf-btn pf-btn-primary" href={ME.calendly} target="_blank" rel="noopener">
            execute_pipeline <span>→</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
