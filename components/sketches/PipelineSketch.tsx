import Sketch from "@/components/Sketch";
import { PIPELINE_STEPS } from "@/data/how";
import { loop, width } from "@/lib/sketch";

// The twelve steps of the outbound pipeline on one wobbly line, for the page /how-i-build (inside the skills click
// since 2 Nov). Wide: a snake of three rows of four (left to right, back, then on again). Tall (phones): one column.
// The gates get the red pen loop, the only red marks, and they draw once like every sketch (.mark in globals.css).
// Words come from data/how.ts, so the markdown copy prints exactly what is drawn.

const STEPS = PIPELINE_STEPS.steps;

/** The wide drawing's text size: 14.2 in the 720 viewBox renders at 13px in the 660px column beside the rail. */
const WIDE = 14.2;

const label = (i: number) => `${i + 1} ${STEPS[i].name}`;

// The tall drawing is 300 wide, so its red note takes two lines, split after its first sentence ("circled: a gate.").
const CUT = PIPELINE_STEPS.note.indexOf(". ") + 1;
const NOTE_TALL = [PIPELINE_STEPS.note.slice(0, CUT), PIPELINE_STEPS.note.slice(CUT + 1)];

// Wide: dots in four columns; row 2 runs right to left, so its steps sit in reverse column order. 2 Nov: the columns
// moved apart for the bigger text, so "10 wording variants" clears the loop around "11 launch" and "5 research
// signals" ends inside the drawing.
const COLS = [48, 205, 395, 560];
const ROWS = [34, 114, 194];
const wideAt = (i: number) => {
  const row = Math.floor(i / 4);
  const col = row === 1 ? 3 - (i % 4) : i % 4;
  return { x: COLS[col], y: ROWS[row] };
};

// Visual round 1: the middle row runs right to left, so a small ink chevron between each pair of steps shows which way
// the work flows. Rows change at the curves, which need no chevron.
const chevrons = STEPS.slice(0, -1).flatMap((_, i) => {
  const a = wideAt(i);
  const b = wideAt(i + 1);
  if (a.y !== b.y) return [];
  const d = Math.sign(b.x - a.x);
  const m = (a.x + b.x) / 2;
  return [`M${m - 4 * d} ${a.y - 4.5} L${m + 2 * d} ${a.y} L${m - 4 * d} ${a.y + 4.5}`];
});

export default function PipelineSketch() {
  return (
    <Sketch label={PIPELINE_STEPS.label}>
      <svg className="sketch-wide" viewBox="0 0 720 250" aria-hidden="true" fontSize={WIDE}>
        <path className="ink" d="M30 34 C220 31 420 37 620 34 C700 33 700 114 620 114 C420 111 220 117 48 114 C-6 115 -6 194 48 194 C260 191 460 197 690 194" />
        {chevrons.map((d) => (
          <path key={d} className="ink" d={d} />
        ))}
        {STEPS.map((s, i) => {
          const { x, y } = wideAt(i);
          const tx = x - 6;
          const ty = y + 26;
          return (
            <g key={s.name}>
              <circle cx={x} cy={y} r="5" className="dot" />
              <text x={tx} y={ty}>{label(i)}</text>
              {s.gate && <path className="mark" pathLength={1} d={loop(tx, ty, width(label(i), WIDE), WIDE)} />}
            </g>
          );
        })}
        <text x="30" y="246" className="red">{PIPELINE_STEPS.note}</text>
      </svg>
      <svg className="sketch-tall" viewBox="0 0 300 418" aria-hidden="true" fontSize="13">
        <path className="ink" d="M16 10 C14 120 18 250 16 352" />
        {STEPS.map((s, i) => {
          const y = 20 + 30 * i;
          return (
            <g key={s.name}>
              <circle cx="16" cy={y} r="5" className="dot" />
              <text x="38" y={y + 4}>{label(i)}</text>
              {s.gate && <path className="mark" pathLength={1} d={loop(38, y + 4, width(label(i), 13))} />}
            </g>
          );
        })}
        <text x="6" y="392" fontSize="12" className="red">{NOTE_TALL[0]}</text>
        <text x="6" y="408" fontSize="12" className="red">{NOTE_TALL[1]}</text>
      </svg>
    </Sketch>
  );
}
