"use client";

import type { CSSProperties } from "react";
import { FREE_CHECK } from "@/data/how";
import { useReveal } from "@/lib/hooks";
import { secs, replay } from "@/lib/motion";

// The free check before the AI spend (3 Nov 2026), on /how-i-build inside the pipeline click, under Clay in depth:
// option 4 of that day's animation mockups. One market top to bottom, each bar its share of the 34,044, then the bounces
// on the lists he built beside a teammate's. Once the figure is well into view (useReveal adds `.in`; inside a closed
// click that happens only once it is opened and scrolled to) it plays once, about 9 seconds, and holds its last frame:
// each bar draws from the axis and its number fades in, the 28% the free mail-server check cut is hatched in red (the
// figure's one red mark), then the fit check, what passed with its caveat, and the bounces with theirs. "replay"
// restarts it. Every word is in the server HTML; app/globals.css (the .fc rules) hides the numbers and bars until `.in`
// only when JavaScript runs (`pen-js`) and motion is allowed, so no-JS readers and reduced motion get the last frame.
// Only opacity and transform move. Words come from data/how.ts (FREE_CHECK), so lib/md/how.ts prints what is drawn.

const F = FREE_CHECK;
/** Every bar is drawn to scale of the first row's count. */
const MARKET = F.rows[0].n ?? 1;

/** Seconds from the start when each row's bar starts to draw; its number follows half a second later. */
const BAR = [0.2, 1.5, 3.9, 5.1];
const VALUE_AFTER = 0.55;
/** Row 2: the ink part draws, then the cut is hatched in, then its number. */
const CUT = 2.3;
const CUT_VALUE = 2.8;
/** The caveat under the last row, then the bounce row's two lines and its caveat. */
const NOTE_AFTER = 0.9;
const RESULT = [6.9, 7.5, 8.1];

const style = (v: Record<string, number | undefined>, w?: number) =>
  ({ ...secs(v), ...(w === undefined ? {} : { "--w": w.toFixed(4) }) }) as CSSProperties;

export default function FreeCheckFirst() {
  const ref = useReveal<HTMLElement>();
  return (
    <figure ref={ref} id={F.id} className="fc" aria-labelledby={`${F.id}-head`}>
      <div className="fc-top">
        <h4 id={`${F.id}-head`} className="fc-head">
          {F.head}
        </h4>
        <button type="button" className="replay" onClick={() => replay(ref.current)}>
          {F.replay}
        </button>
      </div>
      {/* role="list": Safari drops list semantics from a list styled without markers. */}
      <ol className="fc-rows" role="list">
        {F.rows.map((r, i) => {
          // A cut row draws what's left in ink and the cut in red; the others, their count to scale.
          const ink = r.cut ? 1 - r.cut / 100 : (r.n ?? 0) / MARKET;
          return (
            <li key={r.name} className={r.cut ? "fc-row fc-cutrow" : "fc-row"}>
              <p className="fc-name">{r.name}</p>
              <p className="fc-sub">{r.sub}</p>
              <div className="fc-track">
                <i className="fc-bar" aria-hidden="true" style={style({ "--at": BAR[i] }, ink)} />
                {r.cut && <i className="fc-cut" aria-hidden="true" style={style({ "--at": CUT }, r.cut / 100)} />}
                <p className="fc-val" style={style({ "--at": r.cut ? CUT_VALUE : BAR[i] + VALUE_AFTER })}>
                  {r.value}
                </p>
              </div>
              {r.note && (
                <p className="fc-note" style={style({ "--at": BAR[i] + NOTE_AFTER })}>
                  {r.note}
                </p>
              )}
            </li>
          );
        })}
      </ol>
      <div className="fc-result">
        <p className="fc-name">{F.result.name}</p>
        <p className="fc-sub">{F.result.sub}</p>
        <div className="fc-lines">
          {F.result.lines.map((l, k) => (
            <p key={l} className="fc-line" style={style({ "--at": RESULT[k] })}>
              {l}
            </p>
          ))}
        </div>
        <p className="fc-note" style={style({ "--at": RESULT[2] })}>
          {F.result.note}
        </p>
      </div>
    </figure>
  );
}
