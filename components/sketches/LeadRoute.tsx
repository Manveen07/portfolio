import Sketch from "@/components/Sketch";
import { INBOUND } from "@/data/portfolio";
import { loop, width } from "@/lib/sketch";

// A lead's route on one wobbly line (24 Nov 2026), under the lede of the inbound CRM post: its title, then six stops,
// each with its name and, in grey, what happened to Priya there. Wide: one row, left to right. Tall (phones): one column. The
// deadline gets the red pen loop, the only red mark besides the note that says what it is, and it draws once like
// every sketch (.mark in globals.css). Words come from data/portfolio.ts (INBOUND.route), so the markdown copy prints
// what is drawn.

const R = INBOUND.route;
const STOPS = R.stops;

const label = (i: number) => `${i + 1} ${STOPS[i].name}`;

/** The tall drawing is in 13 units of mono: about 13px on a phone (it scales up a little). */
const SIZE = 13;
/** The wide drawing is 720 units across a 660px column, so 14.2 units renders at 13px, as the site's other sketches do
    (components/sketches/PipelineSketch.tsx, WIDE). */
const WIDE = 14.2;

// Wide: the stops are spaced by how long their words are, so the longest grey line of each (at most 15 characters,
// 128 units) ends 6 units or more before the next stop's words, and the last ends at 702 of 720.
const X = [20, 128, 250, 350, 462, 580];
const Y = 30;
/** A small ink chevron between each pair of stops: which way the lead travels. */
const chevrons = X.slice(0, -1).map((x, i) => {
  const m = (x + X[i + 1]) / 2 + 6;
  return `M${m - 4} ${Y - 4.5} L${m + 2} ${Y} L${m - 4} ${Y + 4.5}`;
});

// The tall drawing is 300 wide, so its red note takes two lines, split after its first sentence.
const CUT = R.note.indexOf(". ") + 1;
const NOTE_TALL = [R.note.slice(0, CUT), R.note.slice(CUT + 1)];

/** The loop goes round the stop's `loop` words where they are drawn: a smaller loop than a label's, so it stays clear
    of the line above it. */
const LOOP = 11;
const LOOP_WIDE = 12;

export default function LeadRoute() {
  return (
    <>
    <h3 className="fc-head crm-head crm-route-head">{R.head}</h3>
    <Sketch label={R.label}>
      <svg className="sketch-wide" viewBox="0 0 720 138" aria-hidden="true" fontSize={WIDE}>
        <path className="ink" d="M12 30 C150 27 300 33 450 30 S640 28 708 30" />
        {chevrons.map((d) => (
          <path key={d} className="ink" d={d} />
        ))}
        {STOPS.map((s, i) => {
          const x = X[i] - 6;
          return (
            <g key={s.name}>
              <circle cx={X[i]} cy={Y} r="5" className="dot" />
              <text x={x} y={Y + 27}>{label(i)}</text>
              {s.dim.map((d, k) => (
                <text key={d} x={x} y={Y + 48 + 21 * k} className="dim">
                  {d}
                </text>
              ))}
              {s.dim.map((d, k) => d === s.loop && <path key={d} className="mark" pathLength={1} d={loop(x, Y + 48 + 21 * k, width(d, WIDE), LOOP_WIDE)} />)}
            </g>
          );
        })}
        <text x="14" y="132" className="red">{R.note}</text>
      </svg>
      <svg className="sketch-tall" viewBox="0 0 300 300" aria-hidden="true" fontSize={SIZE}>
        <path className="ink" d="M16 8 C14 90 18 170 16 246" />
        {STOPS.map((s, i) => {
          const y = 18 + 44 * i;
          // The grey line holds the looped words at its end ("call within 1 hour"): they are drawn a little apart from
          // the words before them, so the loop goes round them without touching the "n" of "within".
          const before = s.loop ? s.tall.slice(0, s.tall.length - s.loop.length).trimEnd() : s.tall;
          const at = 38 + width(before, SIZE) + 17;
          return (
            <g key={s.name}>
              <circle cx="16" cy={y} r="5" className="dot" />
              <text x="38" y={y + 4}>{label(i)}</text>
              <text x="38" y={y + 22} className="dim">
                {before}
              </text>
              {s.loop && (
                <text x={at} y={y + 22} className="dim">
                  {s.loop}
                </text>
              )}
              {s.loop && <path className="mark" pathLength={1} d={loop(at, y + 22, width(s.loop, SIZE), LOOP)} />}
            </g>
          );
        })}
        <text x="6" y="280" fontSize="12" className="red">{NOTE_TALL[0]}</text>
        <text x="6" y="295" fontSize="12" className="red">{NOTE_TALL[1]}</text>
      </svg>
    </Sketch>
    </>
  );
}
