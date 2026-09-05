"use client";

import { ME, DOORS } from "@/data/portfolio";
import { useReveal } from "@/lib/hooks";

export default function Contact() {
  const ref = useReveal<HTMLElement>();

  return (
    <section
      id="contact"
      ref={ref}
      className="rise"
      style={{ padding: "40px 20px 20px", display: "flex", flexDirection: "column", gap: 20 }}
    >
      <div className="step">
        <span className="n">5</span>
        <span className="t">Work with me</span>
        <span className="rule" />
      </div>

      <div className="grid-split" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 420px", gap: 12 }}>
        <div
          className="panel on"
          style={{ padding: "44px 40px", display: "flex", flexDirection: "column", gap: 22, overflow: "hidden" }}
        >
          <div className="scan" />
          <span className="serial">P-05 · DISPATCH</span>
          <div className="cond h-dispatch" style={{ fontSize: 132, lineHeight: 0.82, fontWeight: 800 }}>
            Thirty minutes.
            <br />
            <span style={{ color: "var(--yellow)" }}>No slides, no fluff.</span>
          </div>
          <p className="intro">
            Tell me about one process your team repeats by hand. I will tell you what I would
            automate first, what I would leave alone, and what it would take to keep it running.{" "}
            <b>Free, and useful even if we never speak again.</b>
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a className="btn go" href={ME.calendly} target="_blank" rel="noopener">
              Book the 30 minutes <span>→</span>
            </a>
            <a className="btn" href={`mailto:${ME.email}`}>
              {ME.email}
            </a>
          </div>
        </div>

        <div className="panel on" style={{ display: "flex", flexDirection: "column", animationDelay: ".1s" }}>
          <span className="serial">P-05 · DOORS</span>
          {DOORS.map((d) => (
            <div
              key={d.kicker}
              style={{
                padding: "20px 22px",
                borderBottom: "1px solid var(--bevel)",
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className={`lamp ${d.lamp}`} />
                <span className="engr" style={{ color: "var(--dim)" }}>
                  {d.kicker}
                </span>
              </div>
              <span className="cond" style={{ fontSize: 24, fontWeight: 700 }}>
                {d.title}
              </span>
              <span style={{ fontSize: 13, lineHeight: 1.5, color: "var(--dim)" }}>{d.body}</span>
              <div style={{ display: "flex", gap: 14, paddingTop: 4, flexWrap: "wrap" }}>
                {d.links.map((l) => (
                  <a
                    key={l.href}
                    className="lbl"
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener"
                    style={{ color: "var(--yellow)" }}
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
          <div
            style={{
              padding: "16px 22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginTop: "auto",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="lamp warn pulse" />
              <span className="lbl">room for 2 projects this quarter</span>
            </div>
            <span className="lbl">replies within a day</span>
          </div>
        </div>
      </div>
    </section>
  );
}
