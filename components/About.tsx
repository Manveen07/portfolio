"use client";

import { ROLES, EDUCATION, TOOLS, PLATES, ME } from "@/data/portfolio";
import { useReveal } from "@/lib/hooks";

export default function About() {
  const ref = useReveal<HTMLElement>();

  return (
    <section
      id="about"
      ref={ref}
      className="rise"
      style={{ padding: "40px 20px 20px", display: "flex", flexDirection: "column", gap: 20 }}
    >
      <div className="step">
        <span className="n">2</span>
        <span className="t">What I do, and where I learned it</span>
        <span className="rule" />
      </div>

      <div
        className="grid-split"
        style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.25fr) minmax(0, 1fr)", gap: 12 }}
      >
        {/* Operator statement */}
        <div className="panel on" style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 22 }}>
          <span className="serial">P-02 · OPERATOR</span>
          <p
            className="cond h-panel"
            style={{ margin: 0, fontSize: 56, lineHeight: 0.92, fontWeight: 700, letterSpacing: "-0.01em" }}
          >
            I automate the repetitive work
            <br />
            <span style={{ color: "var(--yellow)" }}>
              between &ldquo;we found a lead&rdquo; and &ldquo;we emailed them.&rdquo;
            </span>
          </p>
          <p className="intro">
            Finding leads. Checking they are real. Adding the missing details. Scoring them. Putting
            them in the CRM. Sending the first email. Telling a human only when something needs a
            human.{" "}
            <b>
              I do this every day for a lead-generation company, and I build it for teams that want
              it done once, properly.
            </b>
          </p>

          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
            {PLATES.map(([k, v]) => (
              <div key={k} className="plate">
                <span className="engr">{k}</span>
                <span style={{ fontSize: 14, lineHeight: 1.55 }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
            <span className="engr" style={{ marginRight: 8 }}>
              Tools I use daily
            </span>
            {TOOLS.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Career log */}
        <div className="panel on" style={{ display: "flex", flexDirection: "column", animationDelay: ".1s" }}>
          <span className="serial">P-02 · LOG</span>
          <div
            style={{
              padding: "16px 24px",
              borderBottom: "1px solid var(--bevel)",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span className="lamp on pulse" />
            <span className="engr" style={{ color: "var(--dim)" }}>
              Where I&rsquo;ve done this
            </span>
          </div>

          {ROLES.map((r) => (
            <div
              key={r.co}
              style={{
                padding: "20px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                borderBottom: "1px solid var(--bevel)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                <span className="cond" style={{ fontSize: 26, fontWeight: 700 }}>
                  {r.co}
                </span>
                <span className="mono" style={{ fontSize: 11, color: "var(--dim)" }}>
                  {r.span}
                </span>
              </div>
              <span className="lbl" style={{ color: "var(--yellow)" }}>
                {r.role}
              </span>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "var(--dim)" }}>{r.what}</p>
              <div style={{ display: "flex", gap: 24, paddingTop: 6, flexWrap: "wrap" }}>
                {r.metrics.map(([n, l]) => (
                  <div key={l}>
                    <div className="seg plain" style={{ fontSize: 40 }}>
                      {n}
                    </div>
                    <div className="lbl" style={{ marginTop: 4 }}>
                      {l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div
            style={{
              padding: "14px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              marginTop: "auto",
              flexWrap: "wrap",
            }}
          >
            <span className="lbl">{EDUCATION}</span>
            <a className="lbl" href={ME.resume} target="_blank" rel="noopener" style={{ color: "var(--yellow)" }}>
              full resume ↗
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
