"use client";

import Link from "next/link";
import { T } from "@/lib/tokens";
import { useInView } from "@/lib/hooks";
import { POSTS } from "@/data/posts";

function Reveal({ i = 0, children }: { i?: number; children: React.ReactNode }) {
  const [ref] = useInView<HTMLDivElement>();
  return <div ref={ref} className="pf-rev" data-i={i}>{children}</div>;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function Writing() {
  return (
    <section id="writing" style={{ position: "relative", padding: "120px 0" }}>
      <div className="pf-wrap">
        <div className="pf-sec-head">
          <span className="num">// 07</span>
          <span>writing.log — notes from the build</span>
          <span className="rule" />
          <span style={{ color: T.accent }}>{POSTS.length} post{POSTS.length === 1 ? "" : "s"}</span>
        </div>

        <Reveal>
          <div style={{ marginBottom: 32, display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
            <h2 className="pf-h2">
              How I<br />
              <span style={{ color: T.dim, fontStyle: "italic", fontWeight: 300 }}>actually build.</span>
            </h2>
            <span style={{
              fontFamily: T.mono, fontSize: 12, color: T.dim, marginLeft: "auto", maxWidth: 460, textAlign: "right",
            }}>
              Engineering write-ups with the real numbers — failure modes,
              what fixed them, and the parts most demos skip.
            </span>
          </div>
        </Reveal>

        <div style={{ display: "grid", gap: 1, background: T.line }}>
          {POSTS.map((p, i) => (
            <Reveal key={p.slug} i={i}>
              <Link
                href={`/writing/${p.slug}`}
                style={{
                  display: "block", background: T.ink, padding: "28px 30px",
                  transition: "background .2s ease",
                }}
                className="pf-post-row"
              >
                <div style={{
                  display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap",
                  fontFamily: T.mono, fontSize: 11, color: T.dim2, letterSpacing: "0.06em",
                }}>
                  <span style={{ color: T.accent }}>{String(i + 1).padStart(2, "0")}</span>
                  <span>{fmtDate(p.date)}</span>
                  <span>·</span>
                  <span>{p.readMins} min read</span>
                  <span style={{ marginLeft: "auto", display: "inline-flex", gap: 6 }}>
                    {p.tags.slice(0, 3).map((t) => (
                      <span key={t} style={{ color: T.dim }}>#{t}</span>
                    ))}
                  </span>
                </div>
                <h3 className="pf-h3" style={{ fontSize: 24, marginTop: 14 }}>{p.title}</h3>
                <p style={{
                  marginTop: 10, fontFamily: T.sans, fontSize: 15, color: T.dim,
                  lineHeight: 1.6, maxWidth: 760,
                }}>
                  {p.summary}
                </p>
                <span style={{
                  marginTop: 16, display: "inline-flex", alignItems: "center", gap: 8,
                  fontFamily: T.mono, fontSize: 12, color: T.accent, letterSpacing: "0.04em",
                }}>
                  cat ./{p.slug}.md <span>→</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>

      <style>{`
        .pf-post-row:hover { background: ${T.ink2} !important; }
        .pf-post-row:hover h3 { color: ${T.accent}; }
      `}</style>
    </section>
  );
}
