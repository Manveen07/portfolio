"use client";

import type { ReactNode } from "react";
import { SPLIT } from "@/data/how";
import { useReveal } from "@/lib/hooks";
import { secs, replay } from "@/lib/motion";
import { keep, keepDay } from "@/lib/text";

// What runs on its own, and what waits for a person (3 Nov 2026), on /how-i-build behind its own click under the agents
// lines: option 5 of that day's animation mockups. Two columns from 640px, stacked on phones: what the agents, bots and
// checks did by themselves, then the calls that stay with a person. Once the click is opened and the figure is well
// into view (useReveal adds `.in`) it plays once, about 4 seconds, and holds its last frame: the left lines come in one
// by one, in the order they ran, then each call lights in turn, its ink edge drawing down as it does, and all stay on.
// The one red is the "a person" head, the lane the drawing above circles in red. "replay" restarts it.
// 3 Nov, two of the four blind readers: the calls sat dimmed for seven seconds and looked switched off, so the whole
// play now takes about half as long.
// Every word is in the server HTML; app/globals.css (the .split rules) dims the calls and hides the lines until `.in`
// only when JavaScript runs (`pen-js`) and motion is allowed, so no-JS readers and reduced motion get the last frame.
// Only opacity and transform move. Words come from data/how.ts (SPLIT), so lib/md/how.ts prints what is drawn.

const S = SPLIT;

/** Seconds from the start when each left line comes in: 0.3 s apart, like a log being written. */
const BOT = S.bots.map((_, i) => 0.2 + 0.3 * i);
/** When each call lights: after the last line, half a second apart. */
const CALL = S.person.map((_, j) => 2.1 + 0.5 * j);

/** Counts, dates and hyphenated words stay whole when a line wraps (seen 3 Nov at 1440 and 390: "do-" / "not-contact"). */
function whole(s: string): ReactNode {
  const parts = keepDay(keep(s)).split(/([\w,.']+(?:-[\w']+)+)/);
  return parts.map((p, k) => (k % 2 ? <span key={k} className="nw">{p}</span> : p));
}

export default function OnItsOwn() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="split">
      <div className="split-top">
        <button type="button" className="replay" onClick={() => replay(ref.current)}>
          {S.replay}
        </button>
      </div>
      <div className="split-cols">
        <div>
          <h3 className="split-head">{S.heads.bots}</h3>
          {/* role="list": Safari drops list semantics from a list styled without markers. */}
          <ul className="split-bots" role="list">
            {S.bots.map((b, i) => (
              <li key={b} style={secs({ "--at": BOT[i] })}>
                {whole(b)}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="split-head split-head-person">{S.heads.person}</h3>
          <ul className="split-calls" role="list">
            {S.person.map((c, j) => (
              <li key={c.call} style={secs({ "--at": CALL[j] })}>
                <p className="split-call">{whole(c.call)}</p>
                {c.why && <p className="split-why">{whole(c.why)}</p>}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="split-cap">{S.note}</p>
    </div>
  );
}
