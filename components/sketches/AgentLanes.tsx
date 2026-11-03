import Sketch from "@/components/Sketch";
import { AGENTS } from "@/data/how";
import { loop, width } from "@/lib/sketch";

// Me and my agents (2 Nov), on /how-i-build: what the follow-up agents do each day and where a person approves, as
// two lanes on one wobbly line. Wide (from 640px): the agents' four steps run left to right along the top, the line
// curves down and runs back right to left through the person's two steps. Tall (phones): one column, the agents'
// steps, a dashed rule, then the person's. One red loop per drawing (the gate: a person edits and approves) and one
// red note, his own words for how he works (cut in round 2 on reader flags, back in round 6, 2 Nov; reworded in
// his voice 3 Nov, his ask). Words come from data/how.ts, so the markdown copy prints what is drawn.

const STEPS = AGENTS.steps;
const label = (i: number) => `${i + 1} ${STEPS[i].name}`;
const AGENT = STEPS.map((s, i) => ({ s, i })).filter((x) => x.s.lane === "agents");
// The lower row: the person's step, then the tool's (it sends after the approval; its name says so).
const PERSON = STEPS.map((s, i) => ({ s, i })).filter((x) => x.s.lane !== "agents");

/** Wide text size: the viewBox is the 660px column, so 14 renders at 14px beside the rail. */
const WIDE = 14;
const TOP = 52;
const LOW = 172;
// 146 apart: "1 positive reply" clears "2 reads thread", and "4 rule check" ends clear of the curve down.
const AGENT_X = [72, 218, 364, 510];
// The person's steps sit right to left from the curve; 6 is pulled left so its label stays clear of the gate's loop.
const PERSON_X = [550, 330];

// The tall note splits after its comma (two lines in a 300-wide drawing).
const CUT = AGENTS.note.indexOf(",") + 1;
const NOTE_TALL = [AGENTS.note.slice(0, CUT), AGENTS.note.slice(CUT + 1)];

const chevron = (x: number, y: number, d: number) => `M${x - 4 * d} ${y - 4.5} L${x + 2 * d} ${y} L${x - 4 * d} ${y + 4.5}`;

export default function AgentLanes() {
  return (
    <Sketch label={AGENTS.label}>
      <svg className="sketch-wide" viewBox="0 0 660 236" aria-hidden="true" fontSize={WIDE}>
        <text x="0" y={TOP + 5} fontSize="12" className="dim">{AGENTS.lanes.agents}</text>
        <text x="0" y={LOW + 5} fontSize="12" className="dim">{AGENTS.lanes.person}</text>
        <path className="lane" d="M0 112 L660 112" />
        <path className="ink" d={`M64 ${TOP} C260 ${TOP - 3} 440 ${TOP + 3} 590 ${TOP} C652 ${TOP - 1} 652 ${LOW} 590 ${LOW} C480 ${LOW + 2} 380 ${LOW - 2} 270 ${LOW}`} />
        {AGENT_X.slice(0, -1).map((x, k) => (
          <path key={x} className="ink" d={chevron((x + AGENT_X[k + 1]) / 2, TOP, 1)} />
        ))}
        <path className="ink" d={chevron((PERSON_X[0] + PERSON_X[1]) / 2, LOW, -1)} />
        {AGENT.map(({ s, i }, k) => (
          <g key={s.name}>
            <circle cx={AGENT_X[k]} cy={TOP} r="5" className="dot" />
            <text x={AGENT_X[k] - 6} y={TOP + 26}>{label(i)}</text>
          </g>
        ))}
        {PERSON.map(({ s, i }, k) => {
          const x = PERSON_X[k];
          const w = width(label(i), WIDE);
          // End-anchored at the dot plus 6, so the label never runs off the right edge.
          const tx = x + 6 - w;
          const ty = LOW + 26;
          return (
            <g key={s.name}>
              <circle cx={x} cy={LOW} r="5" className="dot" />
              <text x={tx} y={ty}>{label(i)}</text>
              {s.gate && <path className="mark" pathLength={1} d={loop(tx, ty, w, WIDE)} />}
            </g>
          );
        })}
        <text x="0" y="226" className="red">{AGENTS.note}</text>
      </svg>
      <svg className="sketch-tall" viewBox="0 0 300 330" aria-hidden="true" fontSize="13">
        <text x="0" y="18" fontSize="12" className="dim">{AGENTS.lanes.agents}</text>
        <path className="ink" d="M16 30 C14 90 18 130 16 150" />
        {AGENT.map(({ s, i }, k) => {
          const y = 40 + 35 * k;
          return (
            <g key={s.name}>
              <circle cx="16" cy={y} r="5" className="dot" />
              <text x="38" y={y + 4}>{label(i)}</text>
            </g>
          );
        })}
        <path className="lane" d="M0 170 L300 170" />
        <text x="0" y="186" fontSize="12" className="dim">{AGENTS.lanes.person}</text>
        <path className="ink" d="M16 200 C14 220 18 235 16 255" />
        {PERSON.map(({ s, i }, k) => {
          const y = 210 + 35 * k;
          return (
            <g key={s.name}>
              <circle cx="16" cy={y} r="5" className="dot" />
              <text x="38" y={y + 4}>{label(i)}</text>
              {s.gate && <path className="mark" pathLength={1} d={loop(38, y + 4, width(label(i), 13))} />}
            </g>
          );
        })}
        <text x="0" y="292" fontSize="12.5" className="red">{NOTE_TALL[0]}</text>
        <text x="0" y="310" fontSize="12.5" className="red">{NOTE_TALL[1]}</text>
      </svg>
    </Sketch>
  );
}
