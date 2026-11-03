import Sketch from "@/components/Sketch";
import { INBOX } from "@/data/how";
import { loop, width } from "@/lib/sketch";

// The inbox fleet (3 Nov 2026), on /how-i-build: the agency's inbox bot, stage by stage, and where a person decides.
// Wide (from 640px): a snake like the pipeline's, stages 1 to 4 left to right, then the line curves down and runs back
// right to left through 5 to 7. Tall (phones): one column. An ink dot: the bot does it. The open dot (stage 5): a test,
// not yet running for every inbox. A red loop: a person decides (stages 1, 6 and 7), and the key circles its own words
// the same way. The one red note is why stage 6 waits for two strikes. The wide line starts 12 units before stage 1's
// dot and ends 12 past stage 7's (the agency reader, 3 Nov: a longer tail read as a missing eighth stage). Words come
// from data/how.ts (INBOX), so the
// markdown copy prints what is drawn.

const STAGES = INBOX.stages;
const KEY = INBOX.key;
const label = (i: number) => `${i + 1} ${STAGES[i].name}`;
const dot = (i: number) => (STAGES[i].who === "test" ? "open" : "dot");

/** Wide text: the 760 viewBox fills the 660px column beside the rail, so 15 renders at 13px, as the other drawings do. */
const WIDE = 15;
const WIDE_SUB = 13.5;
const ROWS = [36, 150];
// Each stage's dot. Row 1 runs left to right; row 2 runs back from the curve, right to left. Set so each grey line ends
// 20 or more units before the next stage's text (at 10, stage 6's grey line ran into stage 5's as one phrase), the
// loops around 6 and 7 stay apart, and the curve down passes 13 or more units clear of the end of "12 kinds of problem".
const WIDE_AT = [
  { x: 40, y: ROWS[0] },
  { x: 214, y: ROWS[0] },
  { x: 392, y: ROWS[0] },
  { x: 548, y: ROWS[0] },
  { x: 548, y: ROWS[1] },
  { x: 380, y: ROWS[1] },
  { x: 170, y: ROWS[1] },
];

// A small ink chevron between two stages on the same row shows which way the work flows (row 2 runs right to left).
const chevron = (x: number, y: number, d: number) => `M${x - 4 * d} ${y - 4.5} L${x + 2 * d} ${y} L${x - 4 * d} ${y + 4.5}`;
const CHEVRONS = WIDE_AT.slice(0, -1).flatMap((a, i) => {
  const b = WIDE_AT[i + 1];
  return a.y === b.y ? [chevron((a.x + b.x) / 2, a.y, Math.sign(b.x - a.x))] : [];
});

// The tall drawing is 300 wide, so its red note takes three lines: before "about", then up to the semicolon.
const NOTE = INBOX.note;
const CUT1 = NOTE.indexOf(" about ");
const CUT2 = NOTE.indexOf("; ") + 1;
const NOTE_TALL = [NOTE.slice(0, CUT1), NOTE.slice(CUT1 + 1, CUT2), NOTE.slice(CUT2 + 1)];

/** The tall column: one stage every 50 units, its grey line 22 under its name, clear of the red loop. */
const tallY = (i: number) => 22 + 50 * i;

export default function InboxFleet() {
  return (
    <Sketch label={INBOX.label}>
      <svg className="sketch-wide" viewBox="0 0 760 290" aria-hidden="true" fontSize={WIDE}>
        <path className="ink" d="M28 36 C220 33 400 39 548 36 C772 35 772 151 548 150 C400 152 260 148 158 150" />
        {CHEVRONS.map((d) => (
          <path key={d} className="ink" d={d} />
        ))}
        {STAGES.map((s, i) => {
          const { x, y } = WIDE_AT[i];
          const tx = x - 6;
          const ty = y + 26;
          return (
            <g key={s.name}>
              <circle cx={x} cy={y} r="5" className={dot(i)} />
              <text x={tx} y={ty}>{label(i)}</text>
              <text x={tx} y={ty + 24} fontSize={WIDE_SUB} className="dim">{s.sub}</text>
              {s.who === "person" && <path className="mark" pathLength={1} d={loop(tx, ty, width(label(i), WIDE), WIDE)} />}
            </g>
          );
        })}
        <circle cx="40" cy="241" r="5" className="dot" />
        <text x="52" y="246" fontSize={WIDE_SUB} className="dim">{KEY.bot}</text>
        <circle cx="214" cy="241" r="5" className="open" />
        <text x="226" y="246" fontSize={WIDE_SUB} className="dim">{KEY.test}</text>
        <text x="372" y="246" fontSize={WIDE_SUB}>{KEY.person}</text>
        <path className="mark" pathLength={1} d={loop(372, 246, width(KEY.person, WIDE_SUB), WIDE_SUB)} />
        <text x="34" y="281" fontSize="14" className="red">{NOTE}</text>
      </svg>
      <svg className="sketch-tall" viewBox="0 0 300 496" aria-hidden="true" fontSize="13">
        <path className="ink" d="M16 12 C14 120 18 240 16 338" />
        {STAGES.map((s, i) => {
          const y = tallY(i);
          return (
            <g key={s.name}>
              <circle cx="16" cy={y} r="5" className={dot(i)} />
              <text x="38" y={y + 4}>{label(i)}</text>
              <text x="38" y={y + 26} fontSize="12" className="dim">{s.sub}</text>
              {s.who === "person" && <path className="mark" pathLength={1} d={loop(38, y + 4, width(label(i), 13))} />}
            </g>
          );
        })}
        <circle cx="16" cy="388" r="5" className="dot" />
        <text x="30" y="392" fontSize="12" className="dim">{KEY.bot}</text>
        <circle cx="160" cy="388" r="5" className="open" />
        <text x="174" y="392" fontSize="12" className="dim">{KEY.test}</text>
        <text x="30" y="420" fontSize="12">{KEY.person}</text>
        <path className="mark" pathLength={1} d={loop(30, 420, width(KEY.person, 12), 12)} />
        {NOTE_TALL.map((line, k) => (
          <text key={line} x="6" y={454 + 17 * k} fontSize="12.5" className="red">
            {line}
          </text>
        ))}
      </svg>
    </Sketch>
  );
}
