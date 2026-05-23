"use client";

import { useEffect, useState, useRef } from "react";
import { T } from "@/lib/tokens";

/* Boot overlay — splash with a streaming [ok] log. Click-to-skip.
   Auto-completes after 1.5s. */
export default function BootOverlay() {
  const [done, setDone] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const messages = useRef([
    "mounting filesystem …",
    "connecting agents.swarm …",
    "loading pipeline.dag …",
    "priming llm.runtime …",
    "system ready.",
  ]).current;

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setLines((prev) => [...prev, messages[i]]);
      i += 1;
      if (i >= messages.length) clearInterval(id);
    }, 220);
    const t = setTimeout(() => setDone(true), 1500);
    return () => {
      clearInterval(id);
      clearTimeout(t);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`pf-boot ${done ? "done" : ""}`} onClick={() => setDone(true)}>
      <div className="pf-boot-mark">
        M<span style={{ color: T.text }}>.</span>
      </div>
      <div className="pf-boot-bar"><i /></div>
      <div className="pf-boot-log">
        {lines.map((l, j) => (
          <div key={j} className="pf-log-in">
            <span className="ok">[ok]</span>&nbsp;&nbsp;{l}
          </div>
        ))}
      </div>
      <div style={{
        fontFamily: T.mono, fontSize: 10, color: T.dim2,
        letterSpacing: "0.16em", marginTop: 8,
      }}>
        click anywhere to skip
      </div>
    </div>
  );
}
