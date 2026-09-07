"use client";

import { INCIDENTS, TAG } from "@/data/portfolio";
import { useReveal } from "@/lib/hooks";

/* incident.log — one line per real failure, what broke and what changed.
   Nobody fakes their own failure log, which is why it is on the page. */
export default function Incidents() {
  const ref = useReveal<HTMLElement>();

  return (
    <section
      id="incidents"
      ref={ref}
      className="rise"
      style={{ padding: "40px var(--gutter) 8px", display: "flex", flexDirection: "column", gap: 20 }}
    >
      <div className="step">
        <span className="n">4</span>
        <span className="tag"><span>{TAG.incidents}</span></span>
        <span className="t">What broke, and what changed</span>
        <span className="rule" />
        <span className="lbl">{INCIDENTS.length} real entries · dates from commit history</span>
      </div>

      <div style={{ padding: "0 clamp(8px, 0.6vw, 16px)" }}>
        <p className="intro">
          Every system on this page has failed at least once. This is the list. I keep it public
          because <b>a person who tells you when it breaks is worth more than a system that claims it never does.</b>
        </p>
      </div>

      <div className="panel on" style={{ padding: "8px 0 0", overflow: "hidden" }}>
        <span className="serial">P-04 · INCIDENT.LOG</span>

        {/* header row */}
        <div
          className="log-row"
          style={{
            display: "grid",
            gridTemplateColumns: "84px 130px minmax(0, 1.2fr) minmax(0, 1fr)",
            gap: 20,
            padding: "10px 24px 12px",
            borderBottom: "1px solid var(--bevel)",
          }}
        >
          <span className="lbl">when</span>
          <span className="lbl">system</span>
          <span className="lbl">what broke</span>
          <span className="lbl">what changed</span>
        </div>

        {INCIDENTS.map((it, i) => (
          <div
            key={i}
            className="log-row"
            style={{
              display: "grid",
              gridTemplateColumns: "84px 130px minmax(0, 1.2fr) minmax(0, 1fr)",
              gap: 20,
              padding: "16px 24px",
              borderBottom: i < INCIDENTS.length - 1 ? "1px solid var(--bevel)" : undefined,
              alignItems: "start",
            }}
          >
            <span className="mono" style={{ fontSize: 13, color: "var(--text)" }}>{it.when}</span>
            <span className="mono" style={{ fontSize: 13, color: "var(--dim)" }}>{it.system}</span>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "var(--text)" }}>{it.broke}</p>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "var(--dim)" }}>
              <span style={{ color: "var(--yellow)" }}>→ </span>
              {it.changed}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
