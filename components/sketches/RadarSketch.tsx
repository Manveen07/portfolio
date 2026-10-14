import Sketch from "@/components/Sketch";
import { fmtCount } from "@/lib/runs";

/** The sources the daily run reads, top to bottom. Public Contracts Scotland and Sell2Wales are
 *  left out on purpose: both return 403 every morning, so drawing them would be false. */
const SOURCES = ["Find a Tender", "Contracts Finder", "ProContract"];

type Props = { trades: number; checks: number; bid: number; maybe: number };

// Numbers are built into one string each (not `{n} text` in JSX), so the server HTML holds
// "8 worth bidding" as one piece instead of "8<!-- --> worth bidding".
export default function RadarSketch({ trades, checks, bid, maybe }: Props) {
  const label = `${SOURCES.length} public tender sites feed my script every morning. Each notice is checked for ${trades} trades: ${maybe} worth a look, ${bid} worth bidding, out of ${fmtCount(checks)} checks.`;
  const forTrades = `for ${trades} trades`;
  const look = `${maybe} worth a look`;
  const worth = `${bid} worth bidding`;
  const under = `↑ ${bid} out of ${fmtCount(checks)} checks were`;
  return (
    <Sketch label={label}>
      {/* viewBox starts at y 30: with three source boxes nothing is drawn above y 38, so no blank band over the sketch */}
      <svg className="sketch-wide" viewBox="0 30 690 200" aria-hidden="true" fontSize="11">
        {SOURCES.map((s, i) => {
          const y = 48 + i * 38; // three boxes, centred on the script box (y 70 to 130)
          return (
            <g key={s}>
              <path className="ink" d={`M10 ${y + 1} L200 ${y} L201 ${y + 27} L11 ${y + 28} Z`} />
              <text x="18" y={y + 18}>{s}</text>
              <path className="ink" d={`M206 ${y + 14} C232 ${y + 14} 240 ${92 + i * 4} 262 ${94 + i * 4}`} />
            </g>
          );
        })}
        <path className="ink" d="M262 70 L408 68 L410 128 L263 130 Z" />
        <text x="274" y="90">my script</text>
        <text x="274" y="106" className="dim">every morning,</text>
        <text x="274" y="120" className="dim">no one presses go</text>
        <path className="ink" d="M414 100 C428 98 436 98 448 100" />
        <path className="ink" d="M440 93 L449 100 L439 106" />
        <path className="ink" d="M452 40 L680 38 L681 170 L453 172 Z" />
        <text x="464" y="62">each notice, checked</text>
        <text x="464" y="80">{forTrades}</text>
        <text x="464" y="100" className="dim">{look}</text>
        <text x="470" y="146" fontSize="15" fontWeight="500">{worth}</text>
        <path className="mark" pathLength={1} d="M458 146 C456 126 540 122 610 126 C646 130 644 158 596 160 C530 163 462 160 464 140" />
        <text x="452" y="198" className="red">{under}</text>
        <text x="452" y="214" className="red">worth bidding on.</text>
      </svg>
      <svg className="sketch-tall" viewBox="0 0 320 400" aria-hidden="true" fontSize="11">
        {SOURCES.map((s, i) => {
          const y = 8 + i * 34; // three boxes stacked above the script box
          return (
            <g key={s}>
              <path className="ink" d={`M10 ${y + 1} L200 ${y} L201 ${y + 25} L11 ${y + 26} Z`} />
              <text x="18" y={y + 17}>{s}</text>
              <path className="ink" d={`M206 ${y + 13} C226 ${y + 13} 232 ${52 + i} 240 ${54 + i}`} />
            </g>
          );
        })}
        <path className="ink" d="M240 56 C244 90 200 110 150 134" />
        <path className="ink" d="M158 126 L149 135 L161 139" />
        <path className="ink" d="M40 142 L250 140 L252 196 L41 198 Z" />
        <text x="52" y="162">my script</text>
        <text x="52" y="178" className="dim">every morning,</text>
        <text x="52" y="192" className="dim">no one presses go</text>
        <path className="ink" d="M145 202 C146 214 144 224 145 236" />
        <path className="ink" d="M139 229 L145 238 L151 229" />
        <path className="ink" d="M20 242 L300 240 L301 352 L21 354 Z" />
        <text x="32" y="264">each notice, checked</text>
        <text x="32" y="282">{forTrades}</text>
        <text x="32" y="300" className="dim">{look}</text>
        <text x="38" y="334" fontSize="15" fontWeight="500">{worth}</text>
        <path className="mark" pathLength={1} d="M28 334 C26 314 110 310 180 314 C214 318 212 346 166 348 C100 351 30 348 32 328" />
        <text x="20" y="378" className="red">{under}</text>
        <text x="20" y="394" className="red">worth bidding on.</text>
      </svg>
    </Sketch>
  );
}
