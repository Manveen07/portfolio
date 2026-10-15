import Sketch from "@/components/Sketch";

const LABEL =
  "A week of the same task: Monday to Friday, copy, paste, double-check, crossed out in red. Runs on its own now.";

const DAYS = ["mon", "tue", "wed", "thu", "fri"] as const;
const TASK = "copy, paste, double-check";

// A hand-written week: five rows, each task struck through in red, a red bracket that holds them
// together and the label beside it. One SVG for every width: 302 units wide with 12-unit text, so on a
// 320 phone (280px column) the text renders at about 11.1px; .sketch-week caps it on wide screens.
// Every stroke is drawn by hand: no row is level, no strike is straight.
const ROW_Y = [22, 48, 74, 100, 126];
const ROW_TILT = [0, 0.6, -0.4, 0.8, -0.2];

// Each strike runs through the middle of its row's letters (baseline minus 4), following the row's tilt.
const STRIKES = [
  "M32 18 C80 15 140 20 219 16",
  "M34 44 C90 46 150 44 221 47",
  "M31 71 C85 72 160 67 218 69",
  "M35 96 C96 94 150 100 222 99",
  "M33 122 C88 124 150 119 220 121",
];

const BRACKET = "M226 9 C234 10 236 16 235 26 C234 42 236 55 235 64 C236 69 239 70 243 71 C239 73 236 75 235 81 C234 94 236 108 235 120 C235 128 232 132 225 133";

export default function WeekSketch() {
  return (
    <Sketch label={LABEL}>
      <svg className="sketch-week" viewBox="0 0 302 142" aria-hidden="true" fontSize="12">
        {DAYS.map((d, i) => (
          <g key={d} transform={`rotate(${ROW_TILT[i]} 4 ${ROW_Y[i]})`}>
            <text x="4" y={ROW_Y[i]}>{d}</text>
            <text x="36" y={ROW_Y[i]}>{TASK}</text>
          </g>
        ))}
        {STRIKES.map((d) => (
          <path key={d} className="mark" pathLength={1} d={d} />
        ))}
        <path className="mark" pathLength={1} d={BRACKET} />
        <text x="248" y="58" className="red">runs on</text>
        <text x="248" y="73" className="red">its own</text>
        <text x="248" y="88" className="red">now</text>
      </svg>
    </Sketch>
  );
}
