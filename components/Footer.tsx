"use client";

import { useEffect, useState } from "react";
import { T } from "@/lib/tokens";
import { ME, NAV_VISIBLE, NAV_LABELS } from "@/data/portfolio";

function useUptime() {
  const [s, set] = useState(0);
  useEffect(() => {
    const t0 = Date.now();
    const id = setInterval(() => set(Math.floor((Date.now() - t0) / 1000)), 1000);
    return () => clearInterval(id);
  }, []);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function Footer() {
  const uptime = useUptime();
  const year = new Date().getFullYear();

  return (
    <footer style={{
      position: "relative", borderTop: `1px solid ${T.line2}`,
      marginTop: 80, padding: "56px 0 28px",
    }}>
      <div className="pf-wrap">
        <div className="ft-grid" style={{
          display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 48,
        }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{
                width: 32, height: 32, border: `1px solid ${T.line2}`,
                display: "grid", placeItems: "center",
                fontFamily: T.sans, fontWeight: 600, fontSize: 15, color: T.accent,
              }}>
                M
              </span>
              <div style={{ lineHeight: 1.2 }}>
                <div style={{ fontFamily: T.sans, fontSize: 14, color: T.text, fontWeight: 500 }}>
                  {ME.handle}
                </div>
                <div style={{ fontFamily: T.mono, fontSize: 10, color: T.dim, letterSpacing: "0.1em" }}>
                  {ME.subrole} · {ME.version}
                </div>
              </div>
            </div>
            <p style={{
              marginTop: 18, fontFamily: T.sans, fontSize: 13, color: T.dim,
              lineHeight: 1.65, maxWidth: 340,
            }}>
              AI & Automation Engineer. Building production-ready workflow systems
              that eliminate manual ops and scale toward quant-grade agent infra.
            </p>
            <div style={{
              marginTop: 18, display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 10px", border: `1px solid ${T.line2}`,
              fontFamily: T.mono, fontSize: 10, color: T.dim, letterSpacing: "0.08em",
            }}>
              <span className="pf-pulse" style={{ width: 5, height: 5, borderRadius: 9999, background: T.accent }} />
              all systems nominal
            </div>
          </div>

          <div>
            <div style={{
              fontFamily: T.mono, fontSize: 10, color: T.dim,
              letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14,
            }}>nav</div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {NAV_VISIBLE.map((id) => (
                <li key={id}>
                  <a href={`#${id}`} className="pf-link" style={{ fontFamily: T.mono, fontSize: 12, color: T.text }}>
                    {NAV_LABELS[id]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div style={{
              fontFamily: T.mono, fontSize: 10, color: T.dim,
              letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14,
            }}>comms</div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              <li>
                <a className="pf-link" href={`mailto:${ME.email}`} style={{ fontFamily: T.mono, fontSize: 12 }}>
                  email →
                </a>
              </li>
              <li>
                <a className="pf-link" href={ME.calendly} target="_blank" rel="noopener" style={{ fontFamily: T.mono, fontSize: 12 }}>
                  calendly ↗
                </a>
              </li>
              <li>
                <a className="pf-link" href={ME.resume} target="_blank" rel="noopener" style={{ fontFamily: T.mono, fontSize: 12 }}>
                  resume.pdf ↗
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div style={{
              fontFamily: T.mono, fontSize: 10, color: T.dim,
              letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14,
            }}>elsewhere</div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              <li>
                <a className="pf-link" href={ME.github} target="_blank" rel="noopener" style={{ fontFamily: T.mono, fontSize: 12 }}>
                  github ↗
                </a>
              </li>
              <li>
                <a className="pf-link" href={ME.linkedin} target="_blank" rel="noopener" style={{ fontFamily: T.mono, fontSize: 12 }}>
                  linkedin ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="ft-bottom" style={{
          marginTop: 56, paddingTop: 22, borderTop: `1px solid ${T.line}`,
          display: "flex", justifyContent: "space-between", alignItems: "center", gap: 18, flexWrap: "wrap",
          fontFamily: T.mono, fontSize: 10, color: T.dim2,
          letterSpacing: "0.08em",
        }}>
          <span>© {year} {ME.name} · built from scratch · next.js + react 19</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 14 }}>
            <span>uptime: <span style={{ color: T.accent }}>{uptime}</span></span>
            <span>·</span>
            <span>press <span style={{ color: T.warn }}>?</span> for shortcuts</span>
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .ft-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
          .ft-bottom { flex-direction: column; align-items: flex-start; }
        }
      `}</style>
    </footer>
  );
}
