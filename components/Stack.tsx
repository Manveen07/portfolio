"use client";

import { T } from "@/lib/tokens";
import { useInView } from "@/lib/hooks";
import { STACK } from "@/data/portfolio";

function Reveal({ i = 0, children }: { i?: number; children: React.ReactNode }) {
  const [ref] = useInView<HTMLDivElement>();
  return <div ref={ref} className="pf-rev" data-i={i}>{children}</div>;
}

export default function Stack() {
  const total = STACK.reduce((acc, g) => acc + g.items.length, 0);

  return (
    <section id="stack" style={{ position: "relative", padding: "120px 0" }}>
      <div className="pf-wrap">
        <div className="pf-sec-head">
          <span className="num">// 05</span>
          <span>stack.modules — what I build with</span>
          <span className="rule" />
          <span style={{ color: T.accent }}>{total} modules · {STACK.length} groups</span>
        </div>

        <Reveal>
          <div style={{ marginBottom: 32, display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
            <h2 className="pf-h2">
              Tools that <span style={{ color: T.dim, fontStyle: "italic", fontWeight: 300 }}>ship.</span>
            </h2>
            <span style={{
              fontFamily: T.mono, fontSize: 12, color: T.dim, marginLeft: "auto", maxWidth: 460, textAlign: "right",
            }}>
              The libraries, languages, and platforms that show up across production codebases —
              not the ones I&apos;ve only touched in a tutorial.
            </span>
          </div>
        </Reveal>

        <div className="stack-grid" style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: T.line,
        }}>
          {STACK.map((group, i) => (
            <Reveal key={group.k} i={i}>
              <div style={{
                background: T.ink, padding: "28px 26px", height: "100%",
                display: "flex", flexDirection: "column",
              }}>
                <div style={{
                  display: "flex", alignItems: "baseline", justifyContent: "space-between",
                  marginBottom: 18,
                }}>
                  <div>
                    <div style={{
                      fontFamily: T.mono, fontSize: 10, color: T.dim2,
                      letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 6,
                    }}>
                      group.{String(i).padStart(2, "0")}
                    </div>
                    <div className="pf-h3" style={{ fontSize: 18, color: T.text }}>
                      {group.k}
                    </div>
                  </div>
                  <span style={{
                    fontFamily: T.mono, fontSize: 10, color: T.accent,
                  }}>
                    {String(group.items.length).padStart(2, "0")}
                  </span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {group.items.map((item) => (
                    <span key={item} className="pf-chip">{item}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <style>{`
          @media (max-width: 900px) { .stack-grid { grid-template-columns: repeat(2, 1fr) !important; } }
          @media (max-width: 600px) { .stack-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </div>
    </section>
  );
}
