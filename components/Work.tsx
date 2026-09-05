"use client";

import Link from "next/link";
import { BAYS, type Bay } from "@/data/portfolio";
import { useReveal } from "@/lib/hooks";

function BayLinks({ links }: { links: NonNullable<Bay["links"]> }) {
  return (
    <div
      style={{
        borderTop: "1px solid var(--bevel)",
        display: "grid",
        gridTemplateColumns: links.length > 1 ? "1fr 1fr" : "1fr",
        marginTop: "auto",
      }}
    >
      {links.map((l, i) => {
        const style = {
          padding: "12px 24px",
          color: "var(--yellow)",
          borderRight: i < links.length - 1 ? "1px solid var(--bevel)" : undefined,
        } as const;
        return l.href.startsWith("/") ? (
          <Link key={l.href} className="lbl" href={l.href} style={style}>
            {l.label}
          </Link>
        ) : (
          <a key={l.href} className="lbl" href={l.href} target="_blank" rel="noopener" style={style}>
            {l.label}
          </a>
        );
      })}
    </div>
  );
}

function BayCard({ bay }: { bay: Bay }) {
  return (
    <div
      className="panel on bay"
      style={{
        display: "flex",
        flexDirection: "column",
        ...(bay.wide ? { gridColumn: "span 2" } : {}),
      }}
    >
      <span className="serial">P-03 · BAY-{bay.n}</span>

      <div
        style={{
          padding: "14px 24px",
          borderBottom: "1px solid var(--bevel)",
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <span className={`lamp ${bay.lamp} ${bay.lamp === "on" && bay.wide ? "pulse" : ""}`} />
        <span className="engr" style={{ color: "var(--dim)" }}>
          {bay.n} · {bay.status}
        </span>
      </div>

      <div
        className={bay.wide ? "grid-bayfeat" : undefined}
        style={
          bay.wide
            ? { padding: "22px 24px 0", display: "grid", gridTemplateColumns: "minmax(0, 1fr) 380px", gap: 32 }
            : { padding: "22px 24px 0", display: "flex", flexDirection: "column", gap: 12 }
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="cond h-bay" style={{ fontSize: 44, lineHeight: 0.9, fontWeight: 700 }}>
            <span className="title">{bay.title}</span>
          </div>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.55, color: "var(--text)" }}>{bay.lead}</p>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "var(--dim)" }}>{bay.detail}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {bay.stack.map((s) => (
              <span key={s} className="chip">
                {s}
              </span>
            ))}
          </div>
        </div>

        {bay.wide && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16, alignContent: "start" }}>
            {bay.metrics.map(([n, l]) => (
              <div key={l}>
                <div className="seg plain" style={{ fontSize: 48 }}>
                  {n}
                </div>
                <div className="lbl" style={{ marginTop: 6 }}>
                  {l}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!bay.wide && (
        <div
          style={{
            marginTop: 20,
            padding: bay.links ? "18px 24px" : "18px 24px 22px",
            borderTop: "1px solid var(--bevel)",
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 16,
          }}
        >
          {bay.metrics.map(([n, l]) => (
            <div key={l}>
              <div className="seg plain" style={{ fontSize: 48 }}>
                {n}
              </div>
              <div className="lbl" style={{ marginTop: 6 }}>
                {l}
              </div>
            </div>
          ))}
        </div>
      )}

      {bay.wide && <div style={{ marginTop: 20 }} />}
      {bay.links && <BayLinks links={bay.links} />}
    </div>
  );
}

export default function Work() {
  const ref = useReveal<HTMLElement>();

  return (
    <section
      id="work"
      ref={ref}
      className="rise"
      style={{ padding: "40px 20px 8px", display: "flex", flexDirection: "column", gap: 20 }}
    >
      <div className="step">
        <span className="n">3</span>
        <span className="t">Things I&rsquo;ve built</span>
        <span className="rule" />
        <span className="lbl">most proven first · every one links to something real</span>
      </div>

      {/* The one thing that moves: a demo of a system working */}
      <div
        className="grid-split"
        style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.35fr) minmax(0, 1fr)", gap: 12 }}
      >
        <div className="panel on" style={{ padding: 10, overflow: "hidden" }}>
          <span className="serial">P-03 · MONITOR</span>
          <video
            src="/operator-demo.mp4"
            poster="/operator-demo.jpg"
            autoPlay
            muted
            loop
            playsInline
            style={{ display: "block", width: "100%", height: "auto", border: "1px solid var(--bevel)" }}
          />
          <div
            style={{
              position: "absolute",
              left: 24,
              bottom: 24,
              display: "flex",
              gap: 10,
              alignItems: "center",
              background: "var(--panel)",
              border: "1px solid var(--bevel-hi)",
              padding: "8px 12px",
            }}
          >
            <span className="lamp on pulse" style={{ width: 10, height: 10 }} />
            <span className="lbl" style={{ color: "var(--text)" }}>
              10-second loop · demo data, not a real client
            </span>
          </div>
        </div>

        <div
          className="panel on"
          style={{ padding: "28px 30px", display: "flex", flexDirection: "column", gap: 16, justifyContent: "center", animationDelay: ".1s" }}
        >
          <span className="serial">P-03 · CAPTION</span>
          <div className="cond h-panel" style={{ fontSize: 56, lineHeight: 0.9, fontWeight: 700 }}>
            Watch one
            <br />
            <span style={{ color: "var(--yellow)" }}>do the work.</span>
          </div>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: "var(--dim)" }}>
            A short video of an automated task board. The cursor you see is the system, not a
            person. It picks up each job, handles it, and flags the one that needs a human. I made
            75 of these videos in August, one per prospect, generated automatically.
          </p>
        </div>
      </div>

      <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
        {BAYS.map((b) => (
          <BayCard key={b.n} bay={b} />
        ))}
      </div>
    </section>
  );
}
