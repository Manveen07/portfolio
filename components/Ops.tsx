"use client";

import { T } from "@/lib/tokens";
import { useInView } from "@/lib/hooks";
import { useScramble, useTilt } from "@/lib/effects";
import { OPS, type Op } from "@/data/portfolio";

function Reveal({ i = 0, children }: { i?: number; children: React.ReactNode }) {
  const [ref] = useInView<HTMLDivElement>();
  return <div ref={ref} className="pf-rev" data-i={i}>{children}</div>;
}

function ImpactValue({ text, delay = 0 }: { text: string; delay?: number }) {
  const { ref, value } = useScramble<HTMLDivElement>(text, 600 + delay);
  return (
    <div
      ref={ref}
      style={{
        fontFamily: T.sans, fontSize: 18, color: T.accent, fontWeight: 500,
        letterSpacing: "-0.01em", fontVariantNumeric: "tabular-nums",
      }}
    >
      {value}
    </div>
  );
}

function OpCard({ op }: { op: Op }) {
  const tilt = useTilt<HTMLDivElement>(3.5);
  return (
    <div
      ref={tilt.ref}
      className="pf-card"
      style={{
        padding: 0, overflow: "hidden", display: "flex", flexDirection: "column", height: "100%",
        transformStyle: "preserve-3d",
        ...tilt.style,
      }}
    >
      <div style={{
        padding: "16px 22px", borderBottom: `1px solid ${T.line}`,
        display: "flex", alignItems: "center", gap: 12,
        fontFamily: T.mono, fontSize: 11, color: T.dim,
      }}>
        <span style={{ color: T.accent, letterSpacing: "0.1em" }}>{op.tag}</span>
        <span style={{ width: 1, height: 12, background: T.line2 }} />
        <span style={{ color: T.dim, letterSpacing: "0.04em" }}>{op.role}</span>
        <span style={{ marginLeft: "auto", color: T.accent2, display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span className="pf-pulse" style={{ width: 5, height: 5, borderRadius: 9999, background: T.accent }} />
          shipped
        </span>
      </div>

      <div style={{ padding: "26px 26px 0", flex: 1, display: "flex", flexDirection: "column" }}>
        <div className="pf-h3" style={{ fontSize: 22 }}>{op.title}</div>
        <p style={{
          marginTop: 12, fontFamily: T.sans, fontSize: 14, color: T.dim, lineHeight: 1.65,
        }}>
          {op.blurb}
        </p>

        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{
            display: "flex", gap: 8, fontFamily: T.mono, fontSize: 11, color: T.dim,
            lineHeight: 1.55,
          }}>
            <span style={{ color: T.warn, flex: "0 0 auto" }}>challenge:</span>
            <span style={{ color: T.dim }}>{op.challenge}</span>
          </div>
          <div style={{
            display: "flex", gap: 8, fontFamily: T.mono, fontSize: 11,
            lineHeight: 1.55,
          }}>
            <span style={{ color: T.accent, flex: "0 0 auto" }}>solution:</span>
            <span style={{ color: T.text }}>{op.solution}</span>
          </div>
        </div>

        <div style={{ marginTop: 22, display: "flex", flexWrap: "wrap", gap: 5 }}>
          {op.stack.map((s) => (
            <span key={s} className="pf-chip" style={{ fontSize: 10 }}>{s}</span>
          ))}
        </div>
      </div>

      <div style={{
        marginTop: 24, padding: "16px 22px", borderTop: `1px dashed ${T.line2}`,
        display: "grid", gridTemplateColumns: `repeat(${op.impact.length}, 1fr)`, gap: 16,
      }}>
        {op.impact.map(([n, l], j) => (
          <div key={j}>
            <ImpactValue text={n} delay={j * 80} />
            <div style={{
              marginTop: 4, fontFamily: T.mono, fontSize: 10, color: T.dim2,
              letterSpacing: "0.08em", textTransform: "uppercase", lineHeight: 1.4,
            }}>{l}</div>
          </div>
        ))}
      </div>

      {(op.link || op.demo) && (
        <div style={{
          borderTop: `1px solid ${T.line}`,
          display: "grid",
          gridTemplateColumns: op.link && op.demo ? "1fr 1px 1fr" : "1fr",
          fontFamily: T.mono, fontSize: 11, letterSpacing: "0.04em",
        }}>
          {op.demo && (
            <a
              href={op.demo}
              target="_blank"
              rel="noopener"
              style={{
                padding: "12px 22px", color: T.accent,
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10,
                transition: "background .15s ease",
              }}
              onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(125,217,154,0.05)"; }}
              onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <span
                  className="pf-pulse"
                  style={{ width: 6, height: 6, borderRadius: 9999, background: T.accent, boxShadow: `0 0 6px ${T.accent}` }}
                />
                live demo ↗
              </span>
              <span style={{ color: T.dim, fontSize: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {op.demo.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </span>
            </a>
          )}
          {op.link && op.demo && <span style={{ background: T.line }} />}
          {op.link && (
            <a
              href={op.link}
              target="_blank"
              rel="noopener"
              style={{
                padding: "12px 22px", color: T.accent2,
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10,
                transition: "background .15s ease",
              }}
              onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(63,176,112,0.05)"; }}
              onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <span>{"</> source"} ↗</span>
              <span style={{ color: T.dim, fontSize: 10 }}>github.com</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function Ops() {
  return (
    <section id="ops" style={{ position: "relative", padding: "120px 0" }}>
      <div className="pf-wrap">
        <div className="pf-sec-head">
          <span className="num">// 03</span>
          <span>selected.work — shipped systems</span>
          <span className="rule" />
        </div>

        <Reveal>
          <div style={{ marginBottom: 36, display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
            <h2 className="pf-h2">
              Systems<br />
              <span style={{ color: T.dim, fontStyle: "italic", fontWeight: 300 }}>already in production.</span>
            </h2>
            <span style={{
              fontFamily: T.mono, fontSize: 12, color: T.dim, marginLeft: "auto", maxWidth: 460, textAlign: "right",
            }}>
              Each system below is something I&apos;ve shipped for a team. Stack,
              outcome, and what it replaced — pick the one that looks like
              your problem.
            </span>
          </div>
        </Reveal>

        <div className="ops-grid" style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16,
        }}>
          {OPS.map((op, i) => (
            <Reveal key={op.tag} i={i}>
              <OpCard op={op} />
            </Reveal>
          ))}
        </div>

        <style>{`
          @media (max-width: 880px) {
            .ops-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </section>
  );
}
