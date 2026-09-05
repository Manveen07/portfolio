"use client";

import { ME } from "@/data/portfolio";

/* Split-flap display: each character flips down like an airport board.
   Delays are computed so the two lines read left-to-right in sequence. */
function Flap({ text, start, step = 0.04 }: { text: string; start: number; step?: number }) {
  return (
    <>
      {[...text].map((ch, i) =>
        ch === " " ? (
          <span key={i}>&nbsp;</span>
        ) : (
          <span key={i} className="flap" style={{ animationDelay: `${(start + i * step).toFixed(2)}s` }}>
            {ch}
          </span>
        ),
      )}
    </>
  );
}

export default function Hero() {
  return (
    <section id="top" style={{ padding: "72px var(--gutter) 28px", display: "flex", flexDirection: "column", gap: 24 }}>
      <h1
        className="cond flapwrap h-hero"
        style={{
          margin: 0,
          padding: "0 clamp(8px, 0.6vw, 16px)",
          lineHeight: 0.82,
          fontWeight: 800,
          letterSpacing: "-0.02em",
        }}
      >
        <Flap text="Automating" start={0.3} />
        <br />
        <span style={{ color: "var(--dim2)" }}>
          <Flap text="the boring." start={0.74} />
        </span>
      </h1>

      <div
        className="grid-split"
        style={{
          padding: "0 clamp(8px, 0.6vw, 16px)",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 520px",
          gap: 48,
          alignItems: "end",
        }}
      >
        <h2
          className="cond flapwrap h-sub"
          style={{ margin: 0, fontSize: 72, lineHeight: 0.9, fontWeight: 500, color: "var(--yellow)" }}
        >
          <Flap text="Scaling the interesting." start={1.3} step={0.03} />
        </h2>

        <div className="on" style={{ display: "flex", flexDirection: "column", gap: 16, animationDelay: "2.1s" }}>
          <p className="intro" style={{ fontSize: 18 }}>
            I&rsquo;m Manveen. I build automation for sales and marketing teams:{" "}
            <b>the systems that find leads, check them, add the missing data, and put them in your CRM</b>{" "}
            without a person copying and pasting. Then I keep those systems running.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a className="btn go" href="#proof">
              See it working <span>↓</span>
            </a>
            <a className="btn" href={ME.calendly} target="_blank" rel="noopener">
              Book 20 min
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
