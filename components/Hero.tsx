"use client";

import { useEffect, useRef, useState } from "react";
import { T } from "@/lib/tokens";
import { ME } from "@/data/portfolio";
import { useMouse, useReducedMotion } from "@/lib/effects";

/* Typing effect — types one character at a time after an initial delay. */
function Typed({
  text,
  speed = 38,
  startDelay = 600,
}: {
  text: string;
  speed?: number;
  startDelay?: number;
}) {
  const [i, setI] = useState(0);
  useEffect(() => {
    let id: ReturnType<typeof setInterval>;
    const t = setTimeout(() => {
      id = setInterval(() => {
        setI((x) => {
          if (x >= text.length) {
            clearInterval(id);
            return x;
          }
          return x + 1;
        });
      }, speed);
    }, startDelay);
    return () => {
      clearTimeout(t);
      if (id) clearInterval(id);
    };
  }, [text, speed, startDelay]);
  return <>{text.slice(0, i)}</>;
}

/* Word-by-word headline reveal. */
function HeadlineWords({
  text,
  color = T.text,
  accent,
}: {
  text: string;
  color?: string;
  accent?: number;
}) {
  const words = String(text).split(" ");
  return (
    <>
      {words.map((w, i) => (
        <span key={i} style={{ display: "inline-block", marginRight: "0.28em", overflow: "hidden" }}>
          <span
            className="pf-word-rise"
            style={{
              display: "inline-block",
              color: accent !== undefined && i === accent ? T.accent : color,
              fontStyle: accent !== undefined && i === accent ? "italic" : "normal",
              fontWeight: accent !== undefined && i === accent ? 300 : "inherit",
              animationDelay: `${0.15 + i * 0.07}s`,
            }}
          >
            {w}
          </span>
        </span>
      ))}
    </>
  );
}

/* Ambient drifting constellation behind the hero. */
function HeroAmbient() {
  const dots: [number, number][] = [
    [120, 200], [240, 90], [380, 160], [500, 240],
    [430, 380], [310, 460], [180, 410], [80, 320],
    [260, 280], [400, 290],
  ];
  const links: [number, number, number, number][] = [
    [120, 200, 240, 90], [240, 90, 380, 160], [380, 160, 500, 240],
    [500, 240, 430, 380], [430, 380, 310, 460], [310, 460, 180, 410],
    [180, 410, 80, 320], [80, 320, 120, 200],
    [260, 280, 400, 290], [400, 290, 380, 160],
  ];

  const mouse = useMouse();
  const reduced = useReducedMotion();
  const [vw, setVw] = useState(1280);
  useEffect(() => {
    setVw(window.innerWidth);
    const onR = () => setVw(window.innerWidth);
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);
  const nx = reduced || mouse.x < 0 ? 0 : (mouse.x / vw - 0.5);
  const ny = reduced || mouse.y < 0 ? 0 : (mouse.y / Math.max(600, window.innerHeight) - 0.5);
  const px = nx * 28;
  const py = ny * 22;

  return (
    <svg
      viewBox="0 0 600 600"
      style={{
        position: "absolute", top: "-40px", right: "-80px",
        width: 720, height: 720, pointerEvents: "none", opacity: 0.55,
        filter: "blur(.4px)", zIndex: 0,
        transform: `translate3d(${-px}px, ${-py}px, 0)`,
        transition: reduced ? "none" : "transform .35s cubic-bezier(.22,1,.36,1)",
        willChange: "transform",
      }}
    >
      <defs>
        <radialGradient id="pf-amb">
          <stop offset="0%"   stopColor={T.accent} stopOpacity="0.18" />
          <stop offset="60%"  stopColor={T.accent} stopOpacity="0.03" />
          <stop offset="100%" stopColor={T.accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="300" cy="300" r="280" fill="url(#pf-amb)" />
      {dots.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="3" fill={T.accent} opacity="0.7" />
          <circle
            cx={x}
            cy={y}
            r="3"
            fill={T.accent}
            className="pf-blink-soft"
            style={{ animationDelay: `${i * 0.27}s` }}
          />
        </g>
      ))}
      {links.map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={T.accent}
          strokeWidth="0.6"
          opacity="0.18"
        />
      ))}
    </svg>
  );
}

export default function Hero() {
  const cmd = "schedule --call 30min --no-fluff";

  return (
    <section id="top" style={{ position: "relative", padding: "160px 0 120px", overflow: "hidden" }}>
      <div className="pf-wrap" style={{ position: "relative", zIndex: 1 }}>
        <HeroAmbient />

        <div className="hero-grid" style={{
          display: "grid", gridTemplateColumns: "minmax(0, 1.45fr) minmax(0, 1fr)",
          gap: 56, alignItems: "start",
        }}>
          <div>
            <div className="pf-word-rise" style={{
              display: "inline-flex", alignItems: "center", gap: 12, padding: "6px 12px",
              border: `1px solid ${T.line2}`, fontFamily: T.mono, fontSize: 11,
              color: T.dim, letterSpacing: "0.06em",
            }}>
              <span
                className="pf-pulse"
                style={{ width: 6, height: 6, borderRadius: 9999, background: T.accent, boxShadow: `0 0 8px ${T.accent}` }}
              />
              <span style={{ color: T.text }}>{ME.role}</span>
              <span style={{ color: T.dim2 }}>·</span>
              <span>{ME.location}</span>
              <span style={{ color: T.dim2 }}>·</span>
              <span style={{ color: T.accent }}>{ME.version}</span>
            </div>

            <div className="pf-word-rise" style={{
              marginTop: 28, fontFamily: T.mono, fontSize: 12,
              color: T.accent2, letterSpacing: "0.06em",
              animationDelay: "0.15s",
            }}>
              <span style={{ color: T.dim }}>$</span> cat&nbsp;./manifesto.txt
            </div>

            <h1 className="pf-h1" style={{ marginTop: 16, maxWidth: 760 }}>
              <HeadlineWords text="Automating the boring." />
              <br />
              <HeadlineWords text="Scaling the interesting." color={T.dim} accent={2} />
            </h1>

            <div className="pf-word-rise" style={{
              marginTop: 22, fontFamily: T.mono, fontSize: 14,
              letterSpacing: "0.04em",
              animationDelay: "0.45s",
              display: "inline-flex", alignItems: "center", gap: 10,
            }}>
              <span style={{ color: T.accent }}>→</span>
              <span
                className="pf-pulse"
                style={{ width: 5, height: 5, borderRadius: 9999, background: T.accent2, display: "inline-block" }}
              />
              <span style={{ color: T.text, fontStyle: "italic" }}>Agentic Workflows.</span>
              <span style={{ color: T.dim2 }}>—</span>
              <span style={{ color: T.dim }}>built for your team.</span>
            </div>

            <p className="pf-word-rise" style={{
              fontFamily: T.sans, fontSize: 20, lineHeight: 1.55, color: T.dim,
              maxWidth: 580, marginTop: 24, marginBottom: 0,
              animationDelay: "0.6s",
            }}>
              AI/ML engineer building multi-agent stacks and clever automation.
              <br />
              <span style={{ color: T.text }}>Writes code that nags less than humans.</span>
            </p>

            <div className="pf-word-rise" style={{
              marginTop: 18, fontFamily: T.mono, fontSize: 11,
              color: T.dim2, letterSpacing: "0.06em",
              animationDelay: "0.7s",
            }}>
              // python · llms · n8n · postgres · production-grade · under maintenance
            </div>

            {/* Command bar */}
            <div className="pf-word-rise" style={{
              marginTop: 44, fontFamily: T.mono, fontSize: 14,
              border: `1px solid ${T.line2}`, background: T.ink2,
              padding: "16px 20px", display: "flex", alignItems: "center", gap: 14,
              maxWidth: 600, animationDelay: "0.75s",
            }}>
              <span style={{ color: T.accent }}>manveen@prod</span>
              <span style={{ color: T.dim }}>:</span>
              <span style={{ color: T.warn }}>~/portfolio</span>
              <span style={{ color: T.dim }}>$</span>
              <span style={{ color: T.text }}>
                <Typed text={cmd} />
                <span
                  className="pf-blink"
                  style={{
                    display: "inline-block",
                    width: 9,
                    height: 16,
                    background: T.accent,
                    marginLeft: 4,
                    verticalAlign: "text-bottom",
                  }}
                />
              </span>
            </div>

            <div className="pf-word-rise" style={{
              marginTop: 28, display: "flex", gap: 14, flexWrap: "wrap",
              animationDelay: "0.85s",
            }}>
              <a className="pf-btn pf-btn-primary" href={ME.calendly} target="_blank" rel="noopener">
                <span>book a 30-min audit</span><span>→</span>
              </a>
              <a className="pf-btn" href="#ops">see the work ↓</a>
              <a className="pf-btn" href={`mailto:${ME.email}`}>email →</a>
            </div>

            <div className="pf-word-rise" style={{
              display: "flex", gap: 18, marginTop: 22,
              fontFamily: T.mono, fontSize: 11, color: T.dim2,
              letterSpacing: "0.08em", textTransform: "uppercase",
              animationDelay: "1s",
            }}>
              <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                <span
                  className="pf-pulse"
                  style={{ width: 5, height: 5, borderRadius: 9999, background: T.accent, display: "inline-block" }}
                />
                taking 2 projects this quarter
              </span>
              <span>·</span>
              <span>build &amp; retainer</span>
              <span>·</span>
              <span>replies within 24h</span>
            </div>
          </div>

          {/* Identity card */}
          <div className="pf-word-rise" style={{
            position: "relative", alignSelf: "start", animationDelay: "0.35s",
          }}>
            <div className="pf-card" style={{ fontFamily: T.mono, fontSize: 13 }}>
              <div style={{
                padding: "12px 16px", borderBottom: `1px solid ${T.line}`,
                display: "flex", alignItems: "center", gap: 10,
                fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase",
              }}>
                <div style={{ display: "flex", gap: 6 }}>
                  <span style={{ width: 9, height: 9, borderRadius: 9999, background: T.danger }} />
                  <span style={{ width: 9, height: 9, borderRadius: 9999, background: T.warn }} />
                  <span style={{ width: 9, height: 9, borderRadius: 9999, background: T.accent }} />
                </div>
                <span style={{ marginLeft: 6, color: T.dim }}>~/engineer.py</span>
                <span style={{
                  marginLeft: "auto", color: T.accent,
                  display: "inline-flex", alignItems: "center", gap: 6,
                }}>
                  <span
                    className="pf-pulse"
                    style={{ width: 5, height: 5, borderRadius: 9999, background: T.accent, display: "inline-block" }}
                  />
                  live
                </span>
              </div>
              <pre style={{ margin: 0, padding: "22px 24px", color: T.text, lineHeight: 1.75, fontSize: 13, overflow: "auto" }}>
<span style={{ color: T.dim }}># manveen.singh — sys.engineer</span>{`\n`}
<span style={{ color: T.accent2 }}>class</span> <span style={{ color: T.warn }}>Manveen</span>:{`\n`}
{`    `}role     = <span style={{ color: T.accent }}>&quot;AI/ML Engineer&quot;</span>{`\n`}
{`    `}location = <span style={{ color: T.accent }}>&quot;Delhi · Remote&quot;</span>{`\n`}
{`    `}status   = <span style={{ color: T.accent }}>&quot;shipping&quot;</span>{`\n`}
{`    `}focus    = [{`\n`}
{`        `}<span style={{ color: T.accent }}>&quot;multi-agent systems&quot;</span>,{`\n`}
{`        `}<span style={{ color: T.accent }}>&quot;workflow automation&quot;</span>,{`\n`}
{`        `}<span style={{ color: T.accent }}>&quot;production tooling&quot;</span>,{`\n`}
{`    `}]{`\n`}
{`    `}hates    = [<span style={{ color: T.accent }}>&quot;manual workflows&quot;</span>, <span style={{ color: T.accent }}>&quot;unclear logs&quot;</span>]{`\n\n`}
{`    `}<span style={{ color: T.accent2 }}>def</span> <span style={{ color: T.text }}>philosophy</span>(self):{`\n`}
{`        `}<span style={{ color: T.accent2 }}>return</span> <span style={{ color: T.accent }}>&quot;If I repeat it twice, I automate it.&quot;</span>
              </pre>
              <div style={{
                padding: "12px 16px", borderTop: `1px solid ${T.line}`,
                display: "flex", justifyContent: "space-between", color: T.dim, fontSize: 11,
              }}>
                <span>python 3.12 · 23 lines</span>
                <span style={{ color: T.accent }}>✓ no warnings</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 14 }}>
              {["multi-agent", "workflow", "GTM", "LLM", "vector search", "embeddings", "CV", "python", "next.js"].map((t, i) => (
                <span
                  key={t}
                  className="pf-chip pf-word-rise"
                  style={{ animationDelay: `${0.7 + i * 0.05}s` }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 980px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
