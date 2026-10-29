import Sketch from "@/components/Sketch";
import { PIPELINE_STEPS } from "@/data/how";

// The twelve steps of the outbound pipeline on one wobbly line, for the page /how-i-build. Wide: a snake of three
// rows of four (left to right, back, then on again). Tall (phones): one column. The gates get the red pen loop,
// the only red marks, and they draw once like every sketch (.mark in globals.css). Words come from data/how.ts,
// so the markdown copy prints exactly what is drawn.

const STEPS = PIPELINE_STEPS.steps;
/** IBM Plex Mono advances 0.6 em per character. */
const width = (s: string, size: number) => s.length * size * 0.6;
const r1 = (n: number) => Math.round(n * 10) / 10;

/** A hand-drawn loop around a line of text that starts at x, sits on baseline y and is w wide. */
function loop(x: number, y: number, w: number): string {
  const l = x - 13;
  const r = x + w + 11;
  const t = y - 16;
  const b = y + 7;
  const mid = (l + r) / 2;
  return [
    `M${r1(l + 3)} ${r1(y - 1)}`,
    `C${r1(l - 2)} ${r1(t + 3)} ${r1(mid - w * 0.25)} ${r1(t - 2)} ${r1(mid + w * 0.1)} ${r1(t)}`,
    `C${r1(r + 3)} ${r1(t + 1)} ${r1(r + 4)} ${r1(b - 3)} ${r1(mid + w * 0.2)} ${r1(b + 1)}`,
    `C${r1(mid - w * 0.25)} ${r1(b + 3)} ${r1(l - 1)} ${r1(b)} ${r1(l + 1)} ${r1(y - 7)}`,
  ].join(" ");
}

const label = (i: number) => `${i + 1} ${STEPS[i].name}`;

// The tall drawing is 300 wide, so its red note takes two lines, split before "on until".
const CUT = PIPELINE_STEPS.note.indexOf(" on until");
const NOTE_TALL = [PIPELINE_STEPS.note.slice(0, CUT), PIPELINE_STEPS.note.slice(CUT + 1)];

// Wide: dots in four columns; row 2 runs right to left, so its steps sit in reverse column order.
const COLS = [60, 232, 404, 576];
const ROWS = [34, 114, 194];
const wideAt = (i: number) => {
  const row = Math.floor(i / 4);
  const col = row === 1 ? 3 - (i % 4) : i % 4;
  return { x: COLS[col], y: ROWS[row] };
};

export default function PipelineSketch() {
  return (
    <Sketch label={PIPELINE_STEPS.label}>
      <svg className="sketch-wide" viewBox="0 0 720 250" aria-hidden="true" fontSize="13">
        <path className="ink" d="M30 34 C220 31 420 37 620 34 C700 33 700 114 620 114 C420 111 220 117 60 114 C0 115 0 194 60 194 C260 191 460 197 690 194" />
        {STEPS.map((s, i) => {
          const { x, y } = wideAt(i);
          const tx = x - 6;
          const ty = y + 26;
          return (
            <g key={s.name}>
              <circle cx={x} cy={y} r="5" className="dot" />
              <text x={tx} y={ty}>{label(i)}</text>
              {s.gate && <path className="mark" pathLength={1} d={loop(tx, ty, width(label(i), 13))} />}
            </g>
          );
        })}
        <text x="30" y="244" className="red">{PIPELINE_STEPS.note}</text>
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
