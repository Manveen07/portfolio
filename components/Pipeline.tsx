"use client";

import { useEffect, useRef, useState } from "react";
import { T } from "@/lib/tokens";
import { useInView } from "@/lib/hooks";
import { DAG_NODES, DAG_EDGES, HOT_EDGES, LOG_POOL, type DagNode } from "@/data/portfolio";

const KIND_COLOR: Record<DagNode["kind"], string> = {
  in: T.warn,
  out: T.accent,
  work: T.text,
  agent: T.accent2,
};

function nodeById(id: string) {
  return DAG_NODES.find((n) => n.id === id)!;
}

function Edge({ from, to, hot }: { from: DagNode; to: DagNode; hot: boolean }) {
  const x1 = from.x + 70;
  const y1 = from.y + 22;
  const x2 = to.x;
  const y2 = to.y + 22;
  const mx = (x1 + x2) / 2;
  const path = `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
  return (
    <g>
      <path d={path} fill="none" stroke={T.line2} strokeWidth="1" />
      {hot && (
        <>
          <path d={path} fill="none" stroke={T.accent} strokeWidth="1.2" opacity="0.55" className="pf-edge-flow" />
          <circle r="3" fill={T.accent}>
            <animateMotion dur={`${2 + Math.random() * 1.8}s`} repeatCount="indefinite" path={path} />
          </circle>
        </>
      )}
    </g>
  );
}

function Node({ n, focused }: { n: DagNode; focused: boolean }) {
  const w = 140;
  const h = 44;
  return (
    <g transform={`translate(${n.x}, ${n.y})`}>
      <rect
        x="0"
        y="0"
        width={w}
        height={h}
        fill={T.ink2}
        stroke={focused ? T.accent : T.line2}
        strokeWidth={focused ? 1.4 : 1}
      />
      <text
        x="12"
        y="18"
        fill={KIND_COLOR[n.kind]}
        fontFamily={T.mono}
        fontSize="10"
        letterSpacing="0.06em"
      >
        [{n.tag}]
      </text>
      <text
        x="12"
        y="32"
        fill={T.text}
        fontFamily={T.mono}
        fontSize="11"
        fontWeight="600"
      >
        {n.label}
      </text>
      {n.live && (
        <circle cx={w - 12} cy={12} r="3" fill={T.accent} className="pf-pulse" />
      )}
    </g>
  );
}

function useLogStream() {
  const [lines, setLines] = useState<{ id: number; entry: (typeof LOG_POOL)[number] }[]>([]);
  const counter = useRef(0);

  useEffect(() => {
    let id: ReturnType<typeof setInterval>;
    // seed with a few lines so it doesn't look empty
    const seed: typeof lines = [];
    for (let i = 0; i < 6; i++) {
      const entry = LOG_POOL[Math.floor(Math.random() * LOG_POOL.length)];
      seed.push({ id: counter.current++, entry });
    }
    setLines(seed);

    id = setInterval(() => {
      const entry = LOG_POOL[Math.floor(Math.random() * LOG_POOL.length)];
      setLines((prev) => {
        const next = [...prev, { id: counter.current++, entry }];
        return next.slice(-14);
      });
    }, 1100);
    return () => clearInterval(id);
  }, []);
  return lines;
}

function useClock12() {
  const [t, set] = useState<string>("");
  useEffect(() => {
    const fmt = () => {
      const d = new Date();
      return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
    };
    set(fmt());
    const id = setInterval(() => set(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export default function Pipeline() {
  const [revealRef] = useInView<HTMLDivElement>();
  const lines = useLogStream();
  const clock = useClock12();
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const W = 1430;
  const H = 290;

  return (
    <section id="pipeline" style={{ position: "relative", padding: "120px 0" }}>
      <div className="pf-wrap">
        <div className="pf-sec-head">
          <span className="num">// 02</span>
          <span>pipeline.dag — how the systems run</span>
          <span className="rule" />
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: T.accent }}>
            <span
              className="pf-pulse"
              style={{ width: 5, height: 5, borderRadius: 9999, background: T.accent, display: "inline-block" }}
            />
            5 nodes hot
          </span>
        </div>

        <div ref={revealRef} className="pf-rev pipe-grid" style={{
          display: "grid", gridTemplateColumns: "minmax(0, 1.55fr) minmax(0, 1fr)", gap: 18, alignItems: "stretch",
        }}>
          <div className="pf-card" style={{ padding: "20px 18px", overflow: "auto" }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              fontFamily: T.mono, fontSize: 11, color: T.dim, marginBottom: 14,
            }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: T.dim2 }}>$</span> render --graph pipeline.dag --realtime
              </span>
              <span style={{ color: T.accent }}>{DAG_NODES.length} nodes · {DAG_EDGES.length} edges</span>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", minWidth: 720 }}>
              <defs>
                <pattern id="pf-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke={T.line} strokeWidth="0.4" />
                </pattern>
              </defs>
              <rect x="0" y="0" width={W} height={H} fill="url(#pf-grid)" opacity="0.6" />
              {DAG_EDGES.map(([a, b]) => (
                <Edge key={`${a}-${b}`} from={nodeById(a)} to={nodeById(b)} hot={HOT_EDGES.has(`${a}-${b}`)} />
              ))}
              {DAG_NODES.map((n) => (
                <Node key={n.id} n={n} focused={!!n.live} />
              ))}
            </svg>
            <div style={{
              display: "flex", flexWrap: "wrap", gap: 14, marginTop: 18,
              fontFamily: T.mono, fontSize: 10, color: T.dim,
              letterSpacing: "0.08em", textTransform: "uppercase",
            }}>
              {[
                ["trigger", T.warn],
                ["worker", T.text],
                ["agent", T.accent2],
                ["sink", T.accent],
              ].map(([k, c]) => (
                <span key={k} style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                  <span style={{ width: 8, height: 8, background: c, borderRadius: 2 }} />
                  {k}
                </span>
              ))}
              <span style={{ marginLeft: "auto", color: T.accent }}>
                <span style={{ color: T.dim2 }}>throughput:</span> 142 evt/s
              </span>
            </div>
          </div>

          <div className="pf-card" style={{ display: "flex", flexDirection: "column", minHeight: 360 }}>
            <div style={{
              padding: "12px 16px", borderBottom: `1px solid ${T.line}`,
              display: "flex", alignItems: "center", gap: 10,
              fontFamily: T.mono, fontSize: 11, color: T.dim,
              letterSpacing: "0.08em", textTransform: "uppercase",
            }}>
              <span style={{ display: "inline-flex", gap: 5 }}>
                <span style={{ width: 8, height: 8, borderRadius: 9999, background: T.danger }} />
                <span style={{ width: 8, height: 8, borderRadius: 9999, background: T.warn }} />
                <span style={{ width: 8, height: 8, borderRadius: 9999, background: T.accent }} />
              </span>
              <span>tail -f pipeline.log</span>
              <span style={{ marginLeft: "auto", color: T.accent, display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span className="pf-pulse" style={{ width: 5, height: 5, borderRadius: 9999, background: T.accent }} />
                {clock}
              </span>
            </div>
            <div
              ref={logRef}
              style={{
                flex: 1, padding: "14px 16px", fontFamily: T.mono, fontSize: 12,
                lineHeight: 1.65, color: T.text, overflow: "hidden",
              }}
            >
              {lines.map(({ id, entry }) => (
                <div key={id} className="pf-log-in" style={{ display: "flex", gap: 10, whiteSpace: "nowrap" }}>
                  <span style={{ color: T.dim2, flex: "0 0 auto" }}>[{entry[0]}]</span>
                  <span style={{ color: entry[3], flex: "0 0 auto" }}>{entry[1]}</span>
                  <span style={{ color: T.dim, overflow: "hidden", textOverflow: "ellipsis" }}>{entry[2]}</span>
                </div>
              ))}
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: T.accent, marginTop: 6 }}>
                <span style={{ color: T.dim }}>$</span>
                <span
                  className="pf-blink"
                  style={{ display: "inline-block", width: 8, height: 14, background: T.accent }}
                />
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 1080px) {
            .pipe-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </section>
  );
}
