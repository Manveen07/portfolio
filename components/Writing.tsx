"use client";

import Link from "next/link";
import { POSTS } from "@/data/posts";
import { TAG } from "@/data/portfolio";
import { useReveal } from "@/lib/hooks";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function Writing() {
  const ref = useReveal<HTMLElement>();

  return (
    <section
      id="writing"
      ref={ref}
      className="rise"
      style={{ padding: "40px var(--gutter) 8px", display: "flex", flexDirection: "column", gap: 20 }}
    >
      <div className="step">
        <span className="n">4</span>
        <span className="tag"><span>{TAG.writing}</span></span>
        <span className="t">How I think</span>
        <span className="rule" />
        <span className="lbl">
          {POSTS.length} post{POSTS.length === 1 ? "" : "s"} · more as the work ships
        </span>
      </div>

      {POSTS.map((p, i) => (
        <Link
          key={p.slug}
          className="panel on"
          href={`/writing/${p.slug}`}
          style={{
            padding: "30px 34px",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 360px",
            gap: 40,
            alignItems: "center",
            animationDelay: `${i * 0.1}s`,
          }}
        >
          <span className="serial">P-04 · POST-{String(i + 1).padStart(2, "0")}</span>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <span className="mono" style={{ fontSize: 12, color: "var(--dim)" }}>
              {fmtDate(p.date)} · {p.readMins} min read
            </span>
            <div className="cond h-bay" style={{ lineHeight: 0.92, fontWeight: 700, textTransform: "none" }}>
              {p.cardTitle ?? p.title}
            </div>
            <p className="intro" style={{ fontSize: 15 }}>
              {p.cardSummary ?? p.summary}
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end", textAlign: "right" }}>
            <span className="lbl" style={{ color: "var(--yellow)" }}>
              read the post →
            </span>
            <span className="lbl">plain english, no code needed</span>
          </div>
        </Link>
      ))}
    </section>
  );
}
