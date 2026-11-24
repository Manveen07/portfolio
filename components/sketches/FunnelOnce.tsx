"use client";

import type { CSSProperties } from "react";
import { INBOUND } from "@/data/portfolio";
import { useReveal } from "@/lib/hooks";
import { secs, replay } from "@/lib/motion";

// The funnel of the 300-lead test (24 Nov 2026), in the inbound CRM post: five rows, each bar its share of the 300,
// then how many first follow-ups were on time, with its caveat. Modelled on components/sketches/FreeCheckFirst.tsx and
// drawn with its `.fc` classes, so the play, the replay button, the reduced-motion state and the 5-second failsafe are
// the ones in app/globals.css already (and already tested). Once the figure is well into view (useReveal adds `.in`)
// it plays once, in about 3 seconds (PLAY), and holds its last frame: each bar draws from the axis and its number
// fades in, then the on-time line and its note. "replay" restarts it. Every word is in the server HTML; the CSS hides
// the numbers and bars until `.in` only when JavaScript runs (`pen-js`) and motion is allowed, so no-JS readers and
// reduced motion get the last frame, with no replay button. Only opacity and transform move. No red: nothing here
// went wrong. Words come from data/portfolio.ts (INBOUND.funnel), so lib/md/posts.ts prints what is drawn.

const F = INBOUND.funnel;
/** Every bar is drawn to scale of the first row's count. */
const ALL = F.rows[0].n;

/** The play, in seconds from the start: when each row's bar starts to draw, how long after it its number follows,
    then the on-time line and the note under it. */
const PLAY = { bar: [0.1, 0.6, 1.1, 1.6, 2.1], valueAfter: 0.3, result: 2.8, note: 3.0 } as const;

const style = (v: Record<string, number | undefined>, w?: number) =>
  ({ ...secs(v), ...(w === undefined ? {} : { "--w": w.toFixed(4) }) }) as CSSProperties;

export default function FunnelOnce() {
  const ref = useReveal<HTMLElement>();
  return (
    <figure ref={ref} id={F.id} className="fc crm-funnel" aria-labelledby={`${F.id}-head`}>
      <div className="fc-top">
        <h3 id={`${F.id}-head`} className="fc-head">
          {F.head}
        </h3>
        <button type="button" className="replay" onClick={() => replay(ref.current)}>
          {F.replay}
        </button>
      </div>
      {/* role="list": Safari drops list semantics from a list styled without markers. */}
      <ol className="fc-rows" role="list">
        {F.rows.map((r, i) => (
          <li key={r.name} className="fc-row" title={`${r.name}: ${r.value}`}>
            <p className="fc-name">{r.name}</p>
            <p className="fc-sub">{r.sub}</p>
            <div className="fc-track">
              <i className="fc-bar" aria-hidden="true" style={style({ "--at": PLAY.bar[i] }, r.n / ALL)} />
              <p className="fc-val" style={style({ "--at": PLAY.bar[i] + PLAY.valueAfter })}>
                {r.value}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <div className="fc-result">
        <p className="fc-name">{F.result.name}</p>
        <p className="fc-sub">{F.result.sub}</p>
        <div className="fc-lines">
          <p className="fc-line" style={style({ "--at": PLAY.result })}>
            {F.result.line}
          </p>
        </div>
        <p className="fc-note" style={style({ "--at": PLAY.note })}>
          {F.result.note}
        </p>
      </div>
    </figure>
  );
}
