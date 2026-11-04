"use client";

import type { ReactNode } from "react";
import { FIVE_HABITS } from "@/data/portfolio";
import { useReveal } from "@/lib/hooks";
import { secs, replay } from "@/lib/motion";
import { keep, keepDay } from "@/lib/text";

// Five things I do (3 Nov 2026), in the home hero after the link down and the hours line: his pick of the animation
// mockups that day (option 2). Five steps on one line: left to right from 720px, down the left edge on phones. Once
// the strip is well into view (useReveal adds `.in`) it plays once, about 3.5 seconds, and holds its last frame: each
// dot fills, its example fades in, the line draws on to the next dot. At step 2 the review lands under the bar and the
// red HELD stamp comes down (the strip's one red mark), then the fix; the caption's caveats come last, once the steps
// they point at are on. "replay" restarts it.
// 3 Nov, the four blind readers: it took 15 seconds, so at 5 s only step 1 had its example, HELD came at about 8 s and
// the caveats showed before their steps. Now every example is on by about 3 s, and the stamp is the one beat that waits.
// All the words are in the server HTML; the motion only reveals them. app/globals.css (the .loop rules) hides the
// examples until `.in` only when JavaScript runs (`pen-js`) and motion is allowed, so no-JS readers and reduced motion
// get the last frame, still. Only opacity and transform move (CSS keyframes, off the main thread while the page loads).
// No timers: the delays are CSS custom properties set here, and the observer is useReveal's (cleaned up on unmount).
// Words come from data/portfolio.ts (FIVE_HABITS), so lib/md/home.ts prints what is drawn.

const H = FIVE_HABITS;

/** Seconds from the start when each step's dot fills. */
const DOT = [0.1, 0.5, 1.7, 2.1, 2.5];
/** The line to a dot draws in the 0.4 s before it fills (loop-draw in app/globals.css runs 400ms). */
const DRAW = 0.4;
/** When each line of each step fades in: a beat after its dot. Step 2 holds on "under the bar:" for the stamp, then the
    fix; step 5's second line follows its first. */
const LINE = [[0.2], [0.6, 0.85, 1.45], [1.8], [2.2], [2.6, 2.8]];
/** The stamp comes down a quarter second after "86%, under the bar:". */
const STAMP = 1.1;
/** The caption's caveats, after every step they point at. */
const NOTE = [3.0, 3.15];

const at = (i: number, k: number) => LINE[i]?.[k] ?? DOT[i] + 0.1 + 0.25 * k;

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** A line with its keys set in ink, its counts and dates kept whole ("43 of 50", "14 Oct" never split across lines). */
function inked(line: string, keys: string[] = []): ReactNode {
  const text = keepDay(keep(line));
  if (!keys.length) return text;
  const parts = text.split(new RegExp(`(${keys.map((k) => escape(keepDay(keep(k)))).join("|")})`));
  return parts.map((p, j) => (j % 2 ? <b key={j}>{p}</b> : p));
}

/** The caption's separator stays with the word before it, so a phone never starts a line with "·". */
const glue = (s: string) => s.replace(/ · /g, " · ");

export default function FiveHabits() {
  const ref = useReveal<HTMLElement>();
  return (
    <figure ref={ref} id={H.id} className="loop" aria-labelledby={`${H.id}-head`}>
      <div className="loop-top">
        <div>
          {H.eyebrow && <p className="loop-eyebrow">{H.eyebrow}</p>}
          <h2 id={`${H.id}-head`} className="loop-head">
            {H.head}
          </h2>
        </div>
        <button type="button" className="replay" onClick={() => replay(ref.current)}>
          {H.replay}
        </button>
      </div>
      {/* role="list": Safari drops list semantics from a list styled without markers. */}
      <ol className="loop-steps" role="list">
        {H.steps.map((s, i) => (
          <li key={s.name} className="loop-step" style={secs({ "--dot": DOT[i], "--draw": i + 1 < DOT.length ? DOT[i + 1] - DRAW : undefined })}>
            <span className="loop-node" aria-hidden="true" />
            <p className="loop-name">{s.name}</p>
            {s.lines.map((line, k) => (
              <p key={line} className="loop-rc" style={secs({ "--at": at(i, k) })}>
                {inked(line, s.keys)}
                {s.stamp?.line === k && (
                  <>
                    {" "}
                    <span className="loop-stamp" style={secs({ "--at": STAMP })}>
                      {s.stamp.word}
                    </span>
                  </>
                )}
              </p>
            ))}
          </li>
        ))}
      </ol>
      <figcaption className="loop-cap">
        {H.notes.map((n, j) => (
          <p key={n} style={secs({ "--at": NOTE[j] ?? NOTE[NOTE.length - 1] })}>
            {glue(n)}
          </p>
        ))}
      </figcaption>
    </figure>
  );
}
