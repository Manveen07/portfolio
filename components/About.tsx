"use client";

import { useInView } from "@/lib/hooks";
import { T } from "@/lib/tokens";

function Reveal({ i = 0, children }: { i?: number; children: React.ReactNode }) {
  const [ref] = useInView<HTMLDivElement>();
  return <div ref={ref} className="pf-rev" data-i={i}>{children}</div>;
}

export default function About() {
  return (
    <section id="about" style={{ position: "relative", padding: "120px 0" }}>
      <div className="pf-wrap">
        <div className="pf-sec-head">
          <span className="num">// 01</span>
          <span>system.profile — what i do</span>
          <span className="rule" />
        </div>

        <div className="about-grid" style={{
          display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: 80, alignItems: "start",
        }}>
          <Reveal>
            <h2 className="pf-h2">
              Built<br />
              <span style={{ color: T.dim, fontStyle: "italic", fontWeight: 300 }}>for your team.</span>
            </h2>
            <div style={{
              marginTop: 30, fontFamily: T.mono, fontSize: 11, color: T.dim,
              letterSpacing: "0.1em", textTransform: "uppercase",
              display: "inline-flex", alignItems: "center", gap: 8,
            }}>
              <span
                className="pf-pulse"
                style={{ width: 5, height: 5, borderRadius: 9999, background: T.accent, display: "inline-block" }}
              />
              available · build &amp; retainer
            </div>
            <div style={{
              marginTop: 32, padding: "18px 0",
              borderTop: `1px solid ${T.line2}`, borderBottom: `1px solid ${T.line2}`,
              fontFamily: T.sans, fontSize: 18, color: T.text, lineHeight: 1.45,
              position: "relative", paddingLeft: 20,
            }}>
              <span style={{
                position: "absolute", left: 0, top: 14, color: T.accent,
                fontFamily: T.mono, fontSize: 20, lineHeight: 1,
              }}>›</span>
              <em style={{ fontStyle: "italic", color: T.text }}>If your team is doing it twice, I&rsquo;ll build the system that does it.</em>
            </div>
          </Reveal>

          <div>
            <Reveal i={1}>
              <p style={{
                fontFamily: T.sans, fontSize: 23, lineHeight: 1.55, color: T.text,
                margin: 0, fontWeight: 300, letterSpacing: "-0.005em", maxWidth: 720,
              }}>
                I&rsquo;m an automation engineer who designs, ships, and operates the
                workflow systems your team is tired of building in-house. Lead
                pipelines, document processing, multi-agent stacks, internal
                tooling — <span style={{ color: T.accent }}>built to run unattended</span>, with logs you can actually read.
              </p>
              <p style={{
                fontFamily: T.mono, fontSize: 14, color: T.dim, lineHeight: 1.7, marginTop: 22,
                paddingLeft: 18, borderLeft: `1px solid ${T.line2}`, maxWidth: 660,
              }}>
                I don&rsquo;t hand you a notebook and disappear. I ship production code,
                wire up the alerting, document the failure modes, and stay on
                retainer to keep it running. Boring stability is the deliverable.
              </p>
            </Reveal>

            <Reveal i={2}>
              <div className="traj-grid" style={{
                marginTop: 48, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: T.line,
              }}>
                {[
                  ["GTM Pipelines", "Lead discovery, enrichment, scoring, and CRM sync — replaces the manual research your SDRs are doing today."],
                  ["AI Agents & Docs", "Resume parsing, document extraction, multi-step LLM workflows — agents that retry, escalate, and report cleanly."],
                  ["Build + Operate", "I don't disappear after shipping. Retainer keeps the system patched, monitored, and on-call when it matters."],
                ].map(([k, v]) => (
                  <div key={k} style={{ background: T.ink, padding: "24px 22px" }}>
                    <div style={{
                      fontFamily: T.mono, fontSize: 11, color: T.accent,
                      letterSpacing: "0.08em", textTransform: "uppercase",
                    }}>{k}</div>
                    <div style={{
                      marginTop: 14, fontFamily: T.sans, fontSize: 15,
                      color: T.text, lineHeight: 1.5,
                    }}>{v}</div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal i={3}>
              <div className="prin-grid" style={{
                marginTop: 36, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 28,
              }}>
                {[
                  ["No Black Boxes", "You'll know what runs and why."],
                  ["Production-First", "Built for uptime, not demos."],
                  ["Tight Loops", "Ship in days, iterate from logs."],
                  ["Boring Reliability", "The best system is invisible."],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div style={{ width: 28, height: 1, background: T.accent, marginBottom: 14 }} />
                    <div style={{ fontFamily: T.sans, fontSize: 15, color: T.text, fontWeight: 500 }}>{k}</div>
                    <div style={{ marginTop: 6, fontFamily: T.mono, fontSize: 11, color: T.dim, lineHeight: 1.55 }}>{v}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        <style>{`
          @media (max-width: 980px) {
            .about-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
          }
          @media (max-width: 720px) {
            .traj-grid { grid-template-columns: 1fr !important; }
            .prin-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
        `}</style>
      </div>
    </section>
  );
}
