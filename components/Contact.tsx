"use client";

import { T } from "@/lib/tokens";
import { useInView } from "@/lib/hooks";
import { ME, SERVICES } from "@/data/portfolio";

function Reveal({ i = 0, children }: { i?: number; children: React.ReactNode }) {
  const [ref] = useInView<HTMLDivElement>();
  return <div ref={ref} className="pf-rev" data-i={i}>{children}</div>;
}

export default function Contact() {
  return (
    <section id="contact" style={{ position: "relative", padding: "140px 0 100px" }}>
      <div className="pf-wrap">
        <div className="pf-sec-head">
          <span className="num">// 08</span>
          <span>comms.open — start the engagement</span>
          <span className="rule" />
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: T.accent }}>
            <span
              className="pf-pulse"
              style={{ width: 5, height: 5, borderRadius: 9999, background: T.accent, display: "inline-block" }}
            />
            2 slots open
          </span>
        </div>

        <Reveal>
          <div className="pf-card" style={{ padding: "56px 56px 0", position: "relative", overflow: "hidden" }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 2,
              background: `linear-gradient(90deg, transparent, ${T.accent}, transparent)`,
            }} />

            <div style={{
              fontFamily: T.mono, fontSize: 11, color: T.accent2, letterSpacing: "0.08em",
              marginBottom: 16,
            }}>
              <span style={{ color: T.dim }}>$</span> ./request_audit.sh --listen --no-fluff
            </div>

            <h2 className="pf-h2" style={{ maxWidth: 760 }}>
              Workflow eating hours?
              <br />
              <span style={{ color: T.dim, fontStyle: "italic", fontWeight: 300 }}>
                Let&rsquo;s kill it.
              </span>
            </h2>

            <p style={{
              marginTop: 24, fontFamily: T.sans, fontSize: 17, color: T.dim,
              lineHeight: 1.6, maxWidth: 620,
            }}>
              30-min audit, no slides, no fluff. Bring the workflow your team
              is sick of. I&rsquo;ll sketch the architecture, scope the build,
              and quote the retainer to keep it running — in one call.
            </p>

            <div style={{ marginTop: 36, display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a className="pf-btn pf-btn-primary" href={ME.calendly} target="_blank" rel="noopener">
                book the 30-min audit <span>→</span>
              </a>
              <a className="pf-btn" href={`mailto:${ME.email}?subject=Automation%20engagement`}>
                {ME.email} <span style={{ color: T.accent }}>↗</span>
              </a>
            </div>

            <div className="svc-head" style={{
              marginTop: 56, paddingTop: 24, borderTop: `1px solid ${T.line2}`,
              fontFamily: T.mono, fontSize: 11, color: T.dim,
              letterSpacing: "0.14em", textTransform: "uppercase",
            }}>
              what i build / things i ship
            </div>

            <div className="svc-grid" style={{
              marginTop: 18, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0,
            }}>
              {SERVICES.map((s, i) => (
                <div
                  key={s.code}
                  style={{
                    padding: "16px 18px 16px 0",
                    borderTop: i > 1 ? `1px dashed ${T.line2}` : "none",
                    paddingTop: i > 1 ? 18 : 16,
                    paddingLeft: i % 2 === 1 ? 24 : 0,
                    borderLeft: i % 2 === 1 ? `1px solid ${T.line}` : "none",
                  }}
                >
                  <div style={{
                    display: "flex", alignItems: "baseline", gap: 10, marginBottom: 6,
                  }}>
                    <span style={{
                      fontFamily: T.mono, fontSize: 10, color: T.accent,
                      letterSpacing: "0.1em",
                    }}>
                      {s.code}
                    </span>
                    <span style={{
                      fontFamily: T.sans, fontSize: 15, color: T.text, fontWeight: 500,
                    }}>
                      {s.name}
                    </span>
                  </div>
                  <div style={{
                    fontFamily: T.mono, fontSize: 11, color: T.dim, paddingLeft: 38,
                    lineHeight: 1.55,
                  }}>
                    {s.sub}
                  </div>
                </div>
              ))}
            </div>

            <div className="ct-grid" style={{
              marginTop: 36, padding: "26px 0 36px",
              borderTop: `1px solid ${T.line2}`,
              display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 28,
            }}>
              {[
                ["engagement", "build + retainer", T.accent],
                ["reply window", "< 24h", T.text],
                ["timezone", "IST · works async", T.text],
                ["next opening", "2 slots this quarter", T.warn],
              ].map(([k, v, c]) => (
                <div key={k}>
                  <div style={{
                    fontFamily: T.mono, fontSize: 10, color: T.dim2,
                    letterSpacing: "0.12em", textTransform: "uppercase",
                  }}>{k}</div>
                  <div style={{ marginTop: 8, fontFamily: T.sans, fontSize: 15, color: c }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <style>{`
          @media (max-width: 720px) {
            .ct-grid { grid-template-columns: repeat(2, 1fr) !important; }
            .svc-grid { grid-template-columns: 1fr !important; }
            .svc-grid > * { padding-left: 0 !important; border-left: none !important; }
          }
        `}</style>
      </div>
    </section>
  );
}
