"use client";

import { T } from "@/lib/tokens";
import { useInView } from "@/lib/hooks";
import { ROLES, EDUCATION } from "@/data/portfolio";

function Reveal({ i = 0, children }: { i?: number; children: React.ReactNode }) {
  const [ref] = useInView<HTMLDivElement>();
  return <div ref={ref} className="pf-rev" data-i={i}>{children}</div>;
}

export default function Experience() {
  return (
    <section id="experience" style={{ position: "relative", padding: "120px 0" }}>
      <div className="pf-wrap">
        <div className="pf-sec-head">
          <span className="num">// 06</span>
          <span>execution.log — where this came from</span>
          <span className="rule" />
        </div>

        <div className="exp-grid" style={{
          display: "grid", gridTemplateColumns: "minmax(0, 0.85fr) minmax(0, 2fr)", gap: 64, alignItems: "start",
        }}>
          <Reveal>
            <h2 className="pf-h2">
              Where this<br />
              <span style={{ color: T.dim, fontStyle: "italic", fontWeight: 300 }}>came from.</span>
            </h2>
            <p style={{
              marginTop: 24, fontFamily: T.sans, fontSize: 15, color: T.dim,
              lineHeight: 1.7, maxWidth: 360,
            }}>
              Two recent engagements where I built and shipped the kind of
              system I&rsquo;d build for you. Short timeline, real production code,
              real ops on the other side.
            </p>
          </Reveal>

          <div style={{ position: "relative" }}>
            <div style={{
              position: "absolute", left: 11, top: 8, bottom: 8,
              width: 1, background: T.line2,
            }} />
            {ROLES.map((r, i) => (
              <Reveal key={r.co} i={i}>
                <div style={{ position: "relative", paddingLeft: 44, marginBottom: i === ROLES.length - 1 ? 0 : 48 }}>
                  <span style={{
                    position: "absolute", left: 4, top: 6, width: 16, height: 16,
                    borderRadius: 9999, background: T.ink,
                    border: `1.5px solid ${i === 0 ? T.accent : T.line2}`,
                    boxShadow: i === 0 ? `0 0 12px ${T.accent}` : "none",
                  }}>
                    {i === 0 && (
                      <span
                        className="pf-pulse"
                        style={{
                          position: "absolute", inset: 3, borderRadius: 9999,
                          background: T.accent,
                        }}
                      />
                    )}
                  </span>

                  <div className="pf-card" style={{ padding: "24px 26px" }}>
                    <div style={{
                      display: "flex", alignItems: "baseline", justifyContent: "space-between",
                      gap: 16, flexWrap: "wrap",
                    }}>
                      <div>
                        <div style={{
                          fontFamily: T.mono, fontSize: 10, color: T.accent,
                          letterSpacing: "0.12em", textTransform: "uppercase",
                        }}>
                          {r.co}
                        </div>
                        <div className="pf-h3" style={{ marginTop: 6 }}>{r.role}</div>
                      </div>
                      <div style={{ textAlign: "right", fontFamily: T.mono, fontSize: 11, color: T.dim }}>
                        <div>{r.span}</div>
                        <div style={{ color: T.dim2, marginTop: 2 }}>{r.loc}</div>
                      </div>
                    </div>

                    <div style={{
                      marginTop: 18, padding: "12px 14px",
                      borderLeft: `2px solid ${T.accent}`, background: "rgba(125,217,154,0.03)",
                      fontFamily: T.sans, fontSize: 14, color: T.text, lineHeight: 1.55,
                    }}>
                      <span style={{
                        fontFamily: T.mono, fontSize: 10, color: T.accent,
                        letterSpacing: "0.1em", textTransform: "uppercase", marginRight: 8,
                      }}>mission</span>
                      {r.mission}
                    </div>

                    <div className="exp-blocks" style={{
                      display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginTop: 22,
                    }}>
                      <div>
                        <div style={{
                          fontFamily: T.mono, fontSize: 10, color: T.dim,
                          letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10,
                        }}>execution</div>
                        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                          {r.execution.map((x, j) => (
                            <li key={j} style={{
                              fontFamily: T.sans, fontSize: 13, color: T.text,
                              lineHeight: 1.6, marginBottom: 8, position: "relative", paddingLeft: 16,
                            }}>
                              <span style={{
                                position: "absolute", left: 0, top: 8, width: 8, height: 1,
                                background: T.accent2,
                              }} />
                              {x}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div style={{
                          fontFamily: T.mono, fontSize: 10, color: T.dim,
                          letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10,
                        }}>impact</div>
                        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                          {r.impact.map((x, j) => (
                            <li key={j} style={{
                              fontFamily: T.sans, fontSize: 13, color: T.text,
                              lineHeight: 1.6, marginBottom: 8, position: "relative", paddingLeft: 16,
                            }}>
                              <span style={{
                                position: "absolute", left: 0, top: 7, width: 4, height: 4,
                                borderRadius: 9999, background: T.accent,
                              }} />
                              {x}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}

            <div style={{
              marginLeft: 44, marginTop: 28, padding: "14px 18px",
              borderTop: `1px dashed ${T.line2}`, display: "flex",
              alignItems: "baseline", justifyContent: "space-between", gap: 16,
              fontFamily: T.mono, fontSize: 11, color: T.dim2,
              letterSpacing: "0.06em", flexWrap: "wrap",
            }}>
              <span>
                <span style={{ color: T.dim }}>edu:</span>{" "}
                <span style={{ color: T.dim }}>{EDUCATION.degree} · {EDUCATION.school}</span>
              </span>
              <span>{EDUCATION.span}</span>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 980px) {
            .exp-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
            .exp-blocks { grid-template-columns: 1fr !important; gap: 18px !important; }
          }
        `}</style>
      </div>
    </section>
  );
}
