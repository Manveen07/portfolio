"use client";

import { useState } from "react";
import { INBOUND, type LeadCall } from "@/data/portfolio";

// Sort the lead (24 Nov 2026), in the inbound CRM post: three of the build's 20 made-up test leads. The reader picks
// who should get each one; a pick shows what my rules did, what the blind reviewer said and, where the two differed,
// what I did about it, and says whether the pick is the rules', the reviewer's or neither. Under the cases, 20 dots:
// how the rules and the reviewer compared on all 20.
// Built like components/sketches/SpotTheNamesake.tsx without its gate, on the same .ns classes (app/globals.css), so
// the reveal, the reduced-motion state and the 5-second failsafe are the ones already tested there.
// Every word is in the server HTML: each case's calls and all three verdict lines are there before any pick. CSS hides
// the calls until a pick, only when JavaScript runs (`pen-js`) and motion is allowed; reduced motion shows every call
// from the start, and without JavaScript the buttons are not shown at all. `data-result` on the case shows the one
// verdict that fits. The state is the three picks, nothing else: no timers, no observers. Only opacity and transform
// move (the call rising into place, 200ms; a pressed button, 120ms).
// Words come from data/portfolio.ts (INBOUND.game), so lib/md/posts.ts prints what is drawn.

const G = INBOUND.game;
const LABEL = Object.fromEntries(G.picks.map((p) => [p.call, p.label])) as Record<LeadCall, string>;

export default function RouteTheLead() {
  const [picks, setPicks] = useState<(LeadCall | null)[]>(() => G.cases.map(() => null));
  const pick = (i: number, call: LeadCall) => setPicks((was) => was.map((p, k) => (k === i ? call : p)));

  return (
    <figure id={G.id} className="ns crm-game" aria-labelledby={`${G.id}-head`}>
      <p className="ns-eyebrow">{G.eyebrow}</p>
      <h3 id={`${G.id}-head`} className="ns-head">
        {G.head}
      </h3>
      <p className="ns-intro">{G.intro}</p>
      {/* role="list": Safari drops list semantics from a list styled without markers. */}
      <ol className="ns-cases" role="list">
        {G.cases.map((c, i) => {
          const mine = picks[i];
          // The rules' call first: where the reviewer agrees with it, a pick of that call is "what my rules do now".
          const result = mine === null ? undefined : mine === c.rules.call ? "rules" : mine === c.reviewer.call ? "reviewer" : "differ";
          return (
            <li key={c.who} className="ns-case" data-open={mine === null ? "" : undefined} data-result={result}>
              <p id={`${G.id}-${i + 1}`} className="ns-crm">
                {c.who}
              </p>
              <p className="ns-sig">{c.did}</p>
              <div className="ns-picks" role="group" aria-labelledby={`${G.id}-${i + 1}`}>
                {G.picks.map((p) => (
                  <button key={p.call} type="button" className="ns-pick" aria-pressed={mine === p.call} onClick={() => pick(i, p.call)}>
                    {p.label}
                  </button>
                ))}
              </div>
              {/* A live region that stays shown, so a screen reader reads the calls out when they appear. */}
              <div className="ns-callbox" aria-live="polite">
                <div className="ns-call">
                  <p>
                    <span className="ns-tag">{G.tags.rules}</span> <b>{LABEL[c.rules.call]}</b>
                    {`, ${c.rules.why}`}
                  </p>
                  <p>
                    <span className="ns-tag">{G.tags.reviewer}</span> <b>{LABEL[c.reviewer.call]}</b>
                    {`, ${c.reviewer.said}`}
                  </p>
                  {c.after && (
                    <p>
                      <span className="ns-tag">{G.tags.after}</span>
                      {` ${c.after}`}
                    </p>
                  )}
                </div>
                {/* The three lines share one cell, so the space is kept before a pick and any of them fits it. A div of
                    spans, not a paragraph: without JavaScript there is no pick, and nothing here shows. */}
                <div className="ns-verdict">
                  <span className="ns-same">{G.verdict.rules}</span>
                  <span className="ns-rev">{G.verdict.reviewer}</span>
                  <span className="ns-differ">{G.verdict.differ}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="crm-agree">
        <span className="udots" role="img" aria-label={G.dots.label}>
          {Array.from({ length: G.dots.same + G.dots.changed + G.dots.kept }, (_, k) => (
            <i key={k} className={k < G.dots.same ? undefined : k < G.dots.same + G.dots.changed ? "ring" : "kept"} />
          ))}
        </span>
        <p className="crm-cap">{G.dots.label}</p>
      </div>
    </figure>
  );
}
