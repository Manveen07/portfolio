"use client";

import type { CSSProperties } from "react";
import { FREE_CHECK } from "@/data/how";
import { useReveal } from "@/lib/hooks";
import { secs, replay } from "@/lib/motion";
import { whole } from "@/components/sketches/whole";

// The free check before the AI spend (3 Nov 2026): option 4 of that day's animation mockups, in two places. On the home
// page it sits in the Precise Leads entry (components/Work.tsx, where two of its tiles were, 3 Nov late); on
// /how-i-build, inside the pipeline click, under Clay in depth. One market top to bottom, each bar its share of the
// 34,044, then the bounces on the lists he built beside a teammate's. Once the figure is well into view (useReveal adds
// `.in`; inside a closed click that happens only once it is opened and scrolled to) it plays once, in about 3.6 seconds
// (PLAY), and holds its last frame: each bar draws from the axis and its number fades in, the 28% the free mail-server
// check cut is hatched in red (the figure's one red mark), then the fit check, what passed with its caveat, and the
// bounces with theirs. "replay" restarts it. Every word is in the server HTML; app/globals.css (the .fc rules) hides the
// numbers and bars until `.in` only when JavaScript runs (`pen-js`) and motion is allowed, so no-JS readers and reduced
// motion get the last frame. Only opacity and transform move. Words come from data/how.ts (FREE_CHECK), so the
// markdown copies print what is drawn.

const F = FREE_CHECK;
/** Every bar is drawn to scale of the first row's count. */
const MARKET = F.rows[0].n ?? 1;

/** The play, in seconds from the start, one schedule for both pages. 3 Nov, late: about 9 seconds until then, and the
    night's blind readers called it slow (a 15-second strip was too slow for all four), so it ended in about 4. Review
    of the home change (3 Nov, later): three of four readers still waited on the bars and the bounce row, and the code
    review found the Passed caveat had only 0.3 s before the bounce row moved under it. So the rows come a little
    closer together, the caveat gets 0.5 s on its own, and the play ends in about 3.6 s: the last part starts at 3.2
    and rises in 450ms (app/globals.css, rise-in).
    - bar: when each row's bar starts to draw; its number follows `valueAfter` later, its line under it `noteAfter`.
    - cut: row 2's red hatch, once its ink part has all but drawn (700ms, strong ease-out); then its number, a beat
      before row 3's bar starts.
    - result: the bounce row's two lines, then its caveat. */
const PLAY = {
  bar: [0.1, 0.6, 1.4, 1.8],
  valueAfter: 0.3,
  noteAfter: 0.5,
  cut: 1.0,
  cutValue: 1.3,
  result: [2.8, 3.0, 3.2],
} as const;
const { bar: BAR, valueAfter: VALUE_AFTER, noteAfter: NOTE_AFTER, cut: CUT, cutValue: CUT_VALUE, result: RESULT } = PLAY;

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
              <p className="fc-name">{whole(r.name)}</p>
              <p className="fc-sub">{whole(r.sub)}</p>
              <div className="fc-track">
                <i className="fc-bar" aria-hidden="true" style={style({ "--at": BAR[i] }, ink)} />
                {r.cut && <i className="fc-cut" aria-hidden="true" style={style({ "--at": CUT }, r.cut / 100)} />}
                <p className="fc-val" style={style({ "--at": r.cut ? CUT_VALUE : BAR[i] + VALUE_AFTER })}>
                  {r.value}
                </p>
              </div>
              {r.note && (
                <p className="fc-note" style={style({ "--at": BAR[i] + NOTE_AFTER })}>
                  {whole(r.note)}
                </p>
              )}
            </li>
          );
        })}
      </ol>
      <div className="fc-result">
        <p className="fc-name">{whole(F.result.name)}</p>
        <p className="fc-sub">{whole(F.result.sub)}</p>
        <div className="fc-lines">
          {F.result.lines.map((l, k) => (
            <p key={l} className="fc-line" style={style({ "--at": RESULT[k] })}>
              {l}
            </p>
          ))}
        </div>
        <p className="fc-note" style={style({ "--at": RESULT[2] })}>
          {whole(F.result.note)}
        </p>
      </div>
    </figure>
  );
}
