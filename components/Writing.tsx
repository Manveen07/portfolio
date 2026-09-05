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

      <div className="grid-split" style={{ display: "grid", gridTemplateColumns: "300px minmax(0, 1fr)", gap: 12 }}>
        {/* Lead plate: what this section is for */}
        <div className="panel on" style={{ padding: "24px 26px", display: "flex", flexDirection: "column", gap: 16 }}>
          <span className="serial">P-04 · NOTES</span>
          <span className="engr">Line 04 · writing</span>
          <div className="cond h-panel" style={{ lineHeight: 0.9, fontWeight: 700 }}>
            Notes from
            <br />
            <span style={{ color: "var(--yellow)" }}>the bench.</span>
          </div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--dim)" }}>
            What I tried, what broke, what fixed it. The parts a demo skips. Written so you do not
            need to read code to follow it.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: "auto" }}>
            <span className="lamp on" />
            <span className="lbl">new post with each system that ships</span>
          </div>
        </div>

        {/* Posts */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {POSTS.map((p, i) => (
            <Link
              key={p.slug}
              className="panel on bay"
              href={`/writing/${p.slug}`}
              style={{
                padding: "28px 32px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                animationDelay: `${0.1 + i * 0.1}s`,
              }}
            >
              <span className="serial">P-04 · POST-{String(i + 1).padStart(2, "0")}</span>

              <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                <span className="lbl" style={{ color: "var(--yellow)" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mono" style={{ fontSize: 12, color: "var(--dim)" }}>
                  {fmtDate(p.date)} · {p.readMins} min read
                </span>
                <span style={{ flexGrow: 1 }} />
                <span style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {p.tags.slice(0, 3).map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </span>
              </div>

              <div className="cond h-bay" style={{ lineHeight: 0.92, fontWeight: 700, textTransform: "none", maxWidth: "22ch" }}>
                <span className="title">{p.cardTitle ?? p.title}</span>
              </div>

              <p className="intro" style={{ fontSize: 15, maxWidth: "70ch" }}>
                {p.cardSummary ?? p.summary}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  paddingTop: 14,
                  borderTop: "1px solid var(--bevel)",
                  flexWrap: "wrap",
                }}
              >
                <span className="lbl" style={{ color: "var(--yellow)" }}>
                  read the post →
                </span>
                <span style={{ flexGrow: 1 }} />
                <span className="lbl">plain english · no code needed</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
