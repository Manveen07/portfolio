"use client";

import { useEffect, useState } from "react";
import { T } from "@/lib/tokens";
import { useInView } from "@/lib/hooks";
import { AGENTS, type Agent } from "@/data/portfolio";

const STATUS_COLOR: Record<Agent["status"], string> = {
  running: T.accent,
  idle: T.dim,
  queued: T.warn,
};

function useJitter(agents: Agent[]) {
  const [state, setState] = useState(agents);
  useEffect(() => {
    const id = setInterval(() => {
      setState((prev) =>
        prev.map((a) => {
          if (a.status !== "running" || a.lat == null) return a;
          // jitter latency by ±15%
          const delta = (Math.random() - 0.5) * 0.3 * a.lat;
          const next = Math.max(0.1, +(a.lat + delta).toFixed(1));
          return { ...a, lat: next };
        }),
      );
    }, 1700);
    return () => clearInterval(id);
  }, []);
  return state;
}

export default function Agents() {
  const [ref] = useInView<HTMLDivElement>();
  const agents = useJitter(AGENTS);
  const running = agents.filter((a) => a.status === "running").length;

  return (
    <section id="agents" style={{ position: "relative", padding: "120px 0" }}>
      <div className="pf-wrap">
        <div className="pf-sec-head">
          <span className="num">// 04</span>
          <span>agents.swarm — what they look like running</span>
          <span className="rule" />
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: T.accent }}>
            <span
              className="pf-pulse"
              style={{ width: 5, height: 5, borderRadius: 9999, background: T.accent, display: "inline-block" }}
            />
            {running} / {agents.length} running
          </span>
        </div>

        <div ref={ref} className="pf-rev pf-card" style={{ overflow: "hidden" }}>
          <div className="ag-row ag-head" style={{
            display: "grid",
            gridTemplateColumns: "110px 1.1fr 1fr 1.6fr 110px 90px",
            gap: 12,
            padding: "14px 18px",
            borderBottom: `1px solid ${T.line}`,
            fontFamily: T.mono,
            fontSize: 10,
            color: T.dim,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}>
            <span>id</span>
            <span>agent</span>
            <span>model</span>
            <span>task</span>
            <span>status</span>
            <span style={{ textAlign: "right" }}>lat (s)</span>
          </div>
          {agents.map((a, i) => (
            <div
              key={a.id}
              className="ag-row"
              style={{
                display: "grid",
                gridTemplateColumns: "110px 1.1fr 1fr 1.6fr 110px 90px",
                gap: 12,
                padding: "14px 18px",
                borderBottom: i === agents.length - 1 ? "none" : `1px solid ${T.line}`,
                fontFamily: T.mono,
                fontSize: 12,
                color: T.text,
                alignItems: "center",
              }}
            >
              <span style={{ color: T.dim2 }}>{a.id}</span>
              <span style={{ color: T.accent2 }}>{a.name}</span>
              <span style={{ color: T.dim }}>{a.model}</span>
              <span style={{ color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {a.task}
              </span>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                color: STATUS_COLOR[a.status], fontSize: 11,
                letterSpacing: "0.06em",
              }}>
                <span
                  className={a.status === "running" ? "pf-pulse" : ""}
                  style={{
                    width: 7, height: 7, borderRadius: 9999, background: STATUS_COLOR[a.status],
                    boxShadow: a.status === "running" ? `0 0 8px ${STATUS_COLOR[a.status]}` : "none",
                  }}
                />
                {a.status}
              </span>
              <span style={{ textAlign: "right", color: a.lat == null ? T.dim2 : T.warn }}>
                {a.lat == null ? "—" : a.lat.toFixed(1)}
              </span>
            </div>
          ))}
        </div>

        <style>{`
          @media (max-width: 880px) {
            .ag-row { grid-template-columns: 80px 1fr 110px !important; }
            .ag-row > :nth-child(3), .ag-row > :nth-child(4), .ag-row > :nth-child(6) { display: none; }
          }
        `}</style>
      </div>
    </section>
  );
}
