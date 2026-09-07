"use client";

import { PIPELINE, QUOTE_PROOF, TAG } from "@/data/portfolio";
import { fmtRun, type PipelineData } from "@/lib/pipeline";
import { useReveal } from "@/lib/hooks";

function fmt(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  });
}

/** Odometer: the number rolls up from below on first paint. */
function Odo({ value, delay }: { value: string | number; delay: number }) {
  return (
    <span className="odo">
      <span style={{ animationDelay: `${delay}s` }}>{value}</span>
    </span>
  );
}

export default function Proof({ pipe }: { pipe: PipelineData }) {
  const ref = useReveal<HTMLElement>();
  const RUN_HISTORY = pipe.history;
  const last = RUN_HISTORY.length - 1;
  const lastOk = pipe.lastRun.ok;

  return (
    <section
      id="proof"
      ref={ref}
      className="rise"
      style={{ padding: "40px var(--gutter) 20px", display: "flex", flexDirection: "column", gap: 20 }}
    >
      <div className="step">
        <span className="n">1</span>
        <span className="tag"><span>{TAG.proof}</span></span>
        <span className="t">Proof it runs</span>
        <span className="rule" />
        <span className="lbl">a real system, live since july 2026</span>
      </div>

      <div style={{ padding: "0 clamp(8px, 0.6vw, 16px)" }}>
        <p className="intro">
          This is a system I built for cleaning, security and facilities companies in the UK.{" "}
          <b>Every morning at 6:30 it wakes up on its own</b>, reads every new government contract
          notice, works out which ones fit each company, and writes them a short email. No one
          presses a button. The numbers below come straight from its own logs.
        </p>
      </div>

      <div
        className="grid-live"
        style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr", gap: 12 }}
      >
        {/* Main gauge */}
        <div
          className="panel on"
          style={{
            padding: "22px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
            overflow: "hidden",
            animationDelay: "2.3s",
            cursor: "crosshair",
          }}
        >
          <div className="scan" />
          <span className="serial">P-01 · LINE-01 · S/N 0075</span>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className={`lamp ${lastOk ? "on" : "red"} pulse`} />
            <span className="engr" style={{ color: "var(--dim)" }}>
              {lastOk ? "Running" : "Last run failed"} · last run {fmtRun(pipe.lastRun.at)}
              {pipe.live ? " · read live from GitHub" : ""}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 24,
              flexWrap: "wrap",
              minWidth: 0,
            }}
          >
            <div>
              <div className="seg">
                <Odo value={pipe.totalRuns} delay={2.5} />
              </div>
              <div className="explain">
                <b>{pipe.totalRuns} mornings</b> it has run by itself since {PIPELINE.firstRun}.
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end", minWidth: 0, flex: "1 1 320px" }}>
              <div className="hist" style={{ maxWidth: "100%", overflow: "hidden" }}>
                {RUN_HISTORY.map((r, i) => (
                  <i
                    key={`${r.date}-${i}`}
                    className={`${r.ok ? "" : "f"} ${i === last ? "last" : ""}`}
                    title={`${fmt(r.date)} · ${r.ok ? "ran" : "failed"}${i === last ? " · today" : ""}`}
                    style={{ animationDelay: `${(2.5 + i * 0.04).toFixed(2)}s` }}
                  />
                ))}
              </div>
              <span className="lbl" style={{ textAlign: "right", lineHeight: 1.6 }}>
                one bar per morning, last {RUN_HISTORY.length} · green ran, red failed
                <br />
                hover a bar for its date
              </span>
            </div>
          </div>

          <p
            style={{
              margin: 0,
              fontSize: 14,
              lineHeight: 1.55,
              color: "var(--dim)",
              paddingTop: 12,
              borderTop: "1px solid var(--bevel)",
            }}
          >
            {PIPELINE.outageNote}
          </p>

          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <a className="lbl" href={PIPELINE.loom} target="_blank" rel="noopener" style={{ color: "var(--yellow)" }}>
              watch a 3-minute video of it working ↗
            </a>
            <a className="lbl" href={PIPELINE.repo} target="_blank" rel="noopener" style={{ color: "var(--yellow)" }}>
              see the code ↗
            </a>
          </div>
        </div>

        {/* Counter: notices read */}
        <div
          className="panel on"
          style={{ padding: "22px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 18, animationDelay: "2.4s" }}
        >
          <span className="serial">P-01 · READ</span>
          <span className="engr">Contracts read</span>
          <div>
            <div className="seg plain">
              <Odo value={pipe.noticesRead} delay={2.7} />
            </div>
            <div className="explain">
              <b>{pipe.noticesRead} contract notices</b> read and sorted so far. A person would
              have opened each one.
            </div>
          </div>
        </div>

        {/* Counter: companies */}
        <div
          className="panel on"
          style={{ padding: "22px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 18, animationDelay: "2.5s" }}
        >
          <span className="serial">P-01 · CLIENTS</span>
          <span className="engr">Companies served</span>
          <div>
            <div className="seg plain">
              <Odo value={pipe.clientProfiles} delay={2.9} />
            </div>
            <div className="explain">
              <b>{pipe.clientProfiles} companies</b> each get their own matches, in their own
              sector and region.
            </div>
          </div>
        </div>

        {/* Mode dial */}
        <div
          className="panel on"
          style={{ padding: "22px 24px", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 18, animationDelay: "2.6s" }}
        >
          <span className="serial">P-01 · MODE</span>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="engr">Human involved</span>
            <span className="lamp warn pulse" />
          </div>
          <svg className="dial" viewBox="0 0 120 120" width="96" height="96" style={{ display: "block", alignSelf: "center" }}>
            <circle cx="60" cy="60" r="50" fill="#1d2126" stroke="#3a424b" strokeWidth="2" />
            <g stroke="#3a424b" strokeWidth="2">
              <path d="M 20 96 l 6 -6 M 60 108 v -8 M 100 96 l -6 -6 M 108 60 h -8 M 96 24 l -6 6" />
            </g>
            <circle cx="60" cy="60" r="30" fill="#0f1113" stroke="#3a424b" strokeWidth="1" />
            <path className="needle" d="M 60 60 L 96 34" stroke="#ffd60a" strokeWidth="5" strokeLinecap="round" />
            <g fontFamily="var(--font-mono), monospace" fontSize="7" fill="#565c66" letterSpacing="1">
              <text x="8" y="112">BY HAND</text>
              <text x="104" y="24" textAnchor="end">ON ITS OWN</text>
            </g>
          </svg>
          <div className="explain" style={{ marginTop: 0 }}>
            <b>Zero</b> manual steps from start to sent email.
          </div>
        </div>
      </div>

      {/* Second proof: quote intake, scored on real catalogs */}
      <div className="grid-split" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.25fr)", gap: 12 }}>
        <div className="panel on" style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 16, animationDelay: "2.7s" }}>
          <span className="serial">P-01 · LINE-02 · QUOTE INTAKE</span>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="lamp on" />
            <span className="engr" style={{ color: "var(--dim)" }}>Second proof · tested on {QUOTE_PROOF.catalogs} real distributor catalogs</span>
          </div>
          <div className="cond h-panel" style={{ lineHeight: 0.9, fontWeight: 700 }}>
            Quote intake,
            <br />
            <span style={{ color: "var(--yellow)" }}>tested honestly.</span>
          </div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--dim)" }}>
            When a customer emails a distributor a list of parts, someone reads it and types it into the
            system before anyone can send a price. Lists arrive messy: wrong codes, typos, &ldquo;2x&rdquo;
            instead of a quantity. I built a tool that reads those lists and drafts the quote. When it
            isn&rsquo;t sure, it hands the line to a person instead of guessing.
          </p>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--dim)" }}>
            To test it I took {QUOTE_PROOF.catalogs} real distributors&rsquo; product lists, wrote {QUOTE_PROOF.realRequests} requests
            the way customers write them, and mixed in {QUOTE_PROOF.traps} that had no right answer, to see if
            it would make one up.
          </p>
          <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 14, paddingTop: 6, borderTop: "1px solid var(--bevel)" }}>
            <div><div className="seg plain seg-md">{QUOTE_PROOF.right} of {QUOTE_PROOF.realRequests}</div><div className="lbl" style={{ marginTop: 6 }}>real requests: right</div></div>
            <div><div className="seg plain seg-md">{QUOTE_PROOF.trapsRefused} of {QUOTE_PROOF.traps}</div><div className="lbl" style={{ marginTop: 6 }}>made-up ones: refused</div></div>
            <div><div className="seg seg-md">{QUOTE_PROOF.wrong}</div><div className="lbl" style={{ marginTop: 6 }}>wrong answers</div></div>
          </div>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: "var(--text)", paddingTop: 12, borderTop: "1px solid var(--bevel)" }}>
            {QUOTE_PROOF.closing}
          </p>
        </div>
        <div className="panel on" style={{ padding: 10, overflow: "hidden", animationDelay: "2.8s" }}>
          <span className="serial">P-01 · SCORER OUTPUT</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={QUOTE_PROOF.screenshot} alt={QUOTE_PROOF.screenshotAlt} style={{ display: "block", width: "100%", height: "auto", border: "1px solid var(--bevel)" }} />
          <div className="monitor-caption" style={{ position: "absolute", left: 24, bottom: 24, display: "flex", gap: 10, alignItems: "center", background: "var(--panel)", border: "1px solid var(--bevel-hi)", padding: "8px 12px" }}>
            <span className="lamp on" style={{ width: 10, height: 10 }} />
            <span className="lbl" style={{ color: "var(--text)" }}>one distributor · 30 lines · public product data</span>
          </div>
        </div>
      </div>
    </section>
  );
}
