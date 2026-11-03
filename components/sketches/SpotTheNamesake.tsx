"use client";

import { useEffect, useRef, useState } from "react";
import { NAMESAKE as N, type NamesakeCall } from "@/data/portfolio";
import { shouldReveal } from "@/lib/reveal";
import { secs, replay } from "@/lib/motion";

// Spot the namesake (3 Nov 2026), at the top of the champion-move-checker post: option 3 of that day's animation
// mockups ("other can be in their respected blogs"). Three cases from the repo's sample run (made-up data, and the
// eyebrow says so). The reader picks match, hold or not a match on each; a pick shows the checker's call and why. Then
// the README's gate output prints like a terminal, about 4.5 seconds, and holds: the naive version, BLOCKED stamped in
// red (the one red mark), then this one, PASS. It plays once all three are picked and the terminal is well into view,
// or at once on "run the gate"; the same button says "replay" after.
// Every word is in the server HTML: the calls and every terminal line are there before any pick. app/globals.css (the
// .ns rules) hides the calls until a pick, the buttons, and the terminal's later lines only when JavaScript runs
// (`pen-js`), and the lines only when motion is allowed, so no-JS readers, AI agents and reduced motion get the last
// frame. Only opacity and transform move. No timers: the line delays are CSS custom properties; the one observer is
// disconnected once it fires and on unmount. Words come from data/portfolio.ts (NAMESAKE), so lib/md/posts.ts prints
// what is drawn.
// Fix round, 3 Nov: a pick now says whether it is the checker's call (all four blind readers missed that): both lines
// are in the HTML under every call, and `data-result` on the case shows the one that fits. When the third pick starts
// the gate (`data-auto`), the terminal waits 1.2 s more, so BLOCKED doesn't land while the reader is still on that
// call; "run the gate" and "replay" start it at once. Reduced motion shows every call from the start (app/globals.css).

const LINES = N.gate.lines.split("\n");
/** Seconds after the run starts when each README line prints, line by line (undefined: there from the start, or the
    blank line between the two runs). The pause before the second command leaves BLOCKED on screen to be read. */
const AT: (number | undefined)[] = [undefined, 0.5, 0.9, 1.2, 1.7, undefined, 3.1, 3.8, 4.3];
/** A command with its README comment: the command, the README's own spaces, the comment. */
const COMMENTED = /^(.*?)(\s{2,})(# .*)$/;

/** A command whose words stay whole: on a phone it wraps at a space, never after a hyphen ("--" / "matcher naive"). */
const Words = ({ s }: { s: string }) => (
  <>
    {s.split(/(\s+)/).map((w, k) => (k % 2 ? w : <span key={k} className="ns-w">{w}</span>))}
  </>
);

function Line({ text, i }: { text: string; i: number }) {
  const at = AT[i];
  const gap = i > 0 && LINES[i - 1] === "";
  const cls = `ns-tl${gap ? " ns-gap" : ""}${text === "PASS" ? " ns-pass" : ""}`;
  if (text === N.gate.stamped)
    return (
      <p className={cls}>
        <span className="ns-blocked" style={secs({ "--at": at })}>
          {text}
        </span>
      </p>
    );
  const m = COMMENTED.exec(text);
  return (
    <p className={cls} data-out={at === undefined ? undefined : ""} style={secs({ "--at": at })}>
      {m ? (
        <>
          <Words s={m[1]} />
          {m[2]}
          <span className="ns-cmt">{m[3]}</span>
        </>
      ) : (
        text
      )}
    </p>
  );
}

export default function SpotTheNamesake() {
  const [picks, setPicks] = useState<(NamesakeCall | null)[]>(() => N.cases.map(() => null));
  /** The gate ran from its button: every call shows, picked or not. */
  const [ran, setRan] = useState(false);
  /** All three picked: the gate plays once the terminal is well into view. */
  const [armed, setArmed] = useState(false);
  const gate = useRef<HTMLDivElement>(null);

  const pick = (i: number, call: NamesakeCall) => {
    const next = picks.map((p, k) => (k === i ? call : p));
    setPicks(next);
    if (next.every(Boolean)) setArmed(true);
  };

  // `.in` starts the play (app/globals.css). React never sets this element's class again, so it stays.
  const run = () => {
    setRan(true);
    const el = gate.current;
    if (!el) return;
    // The lead-in is for the third pick only; React drops the attribute on the render this click causes, and removing it
    // here first means the restart below never runs with it.
    el.removeAttribute("data-auto");
    if (el.classList.contains("in")) replay(el);
    else el.classList.add("in");
  };

  useEffect(() => {
    const el = gate.current;
    if (!armed || !el || el.classList.contains("in")) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting && shouldReveal(e.intersectionRatio, e.intersectionRect.height, e.rootBounds?.height ?? window.innerHeight))) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [armed]);

  return (
    <figure id={N.id} className="ns" aria-labelledby={`${N.id}-head`}>
      <p className="ns-eyebrow">{N.eyebrow}</p>
      <h2 id={`${N.id}-head`} className="ns-head">
        {N.head}
      </h2>
      <p className="ns-intro">{N.intro}</p>
      {/* role="list": Safari drops list semantics from a list styled without markers. */}
      <ol className="ns-cases" role="list">
        {N.cases.map((c, i) => (
          <li
            key={c.crm}
            className="ns-case"
            data-open={picks[i] === null && !ran ? "" : undefined}
            data-result={picks[i] === null ? undefined : picks[i] === c.call ? "same" : "differ"}
          >
            <p id={`${N.id}-${i + 1}`} className="ns-crm">
              <span className="ns-tag">{N.tags.crm}</span> {c.crm}
            </p>
            <p className="ns-sig">
              <span className="ns-tag">{N.tags.signal}</span> {c.signal}
            </p>
            <div className="ns-picks" role="group" aria-labelledby={`${N.id}-${i + 1}`}>
              {N.picks.map((p) => (
                <button key={p.call} type="button" className="ns-pick" aria-pressed={picks[i] === p.call} onClick={() => pick(i, p.call)}>
                  {p.label}
                </button>
              ))}
            </div>
            {/* A live region that stays shown, so a screen reader reads the call out when it appears. */}
            <div className="ns-callbox" aria-live="polite">
              <p className="ns-call">
                <span className="ns-tag">{N.tags.call}</span> <b>{c.call}</b>, {c.why}
              </p>
              {/* Both lines share one cell, so the space is kept before a pick and either fits it. A div of spans, not a
                  paragraph: without JavaScript there is no pick, and nothing here shows. */}
              <div className="ns-verdict">
                <span className="ns-same">{N.verdict.same}</span>
                <span className="ns-differ">{N.verdict.differ}</span>
              </div>
            </div>
          </li>
        ))}
      </ol>
      <div ref={gate} id={N.gate.id} className="ns-gate" data-auto={armed && !ran ? "" : undefined}>
        <div className="ns-gate-top">
          <p className="ns-gate-intro">{N.gate.intro}</p>
          {/* Both labels share one cell, so the button keeps the wider one's width and the line beside it never re-wraps. */}
          <button type="button" className="replay ns-run" onClick={run}>
            <span className="ns-labels">
              <span className="ns-run-label">{N.gate.run}</span>
              <span className="ns-replay-label">{N.gate.replay}</span>
            </span>
          </button>
        </div>
        <div className="ns-term">
          {LINES.map((l, i) => (l ? <Line key={i} text={l} i={i} /> : null))}
        </div>
        <p className="ns-gate-cap">{N.gate.rule}</p>
      </div>
    </figure>
  );
}
