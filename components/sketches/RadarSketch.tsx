import Sketch from "@/components/Sketch";
import { RADAR_SOURCES as SOURCES, radarText } from "@/lib/sketch-text";

type Props = { trades: number; checks: number; bid: number; maybe: number };

// The words live in lib/sketch-text.ts, so the markdown copies print exactly what is drawn here.
export default function RadarSketch({ trades, checks, bid, maybe }: Props) {
  const t = radarText({ trades, checks, bid, maybe });
  return (
    <Sketch label={t.label}>
      {/* viewBox starts at y 30: with three source boxes nothing is drawn above y 38, so no blank band over the sketch */}
      {/* text is 13 (it was 12: 10.4px at a 640px window); the script box is 10 units wider so "no one presses go" keeps its margin */}
      <svg className="sketch-wide" viewBox="0 30 690 200" aria-hidden="true" fontSize="13">
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
        <path className="ink" d="M262 70 L418 68 L420 128 L263 130 Z" />
        <text x="274" y="90">{t.script[0]}</text>
        <text x="274" y="106" className="dim">{t.script[1]}</text>
        <text x="274" y="120" className="dim">{t.script[2]}</text>
        <path className="ink" d="M424 100 C434 98 440 98 448 100" />
        <path className="ink" d="M440 93 L449 100 L439 106" />
        <path className="ink" d="M452 40 L680 38 L681 170 L453 172 Z" />
        <text x="464" y="62">{t.checked}</text>
        <text x="464" y="80">{t.forTrades}</text>
        <text x="464" y="100" className="dim">{t.look}</text>
        <text x="470" y="146" fontSize="15" fontWeight="500">{t.worth}</text>
        <path className="mark" pathLength={1} d="M458 146 C456 126 540 122 610 126 C646 130 644 158 596 160 C530 163 462 160 464 140" />
        <text x="452" y="198" className="red">{t.under[0]}</text>
        <text x="452" y="214" className="red">{t.under[1]}</text>
      </svg>
      <svg className="sketch-tall" viewBox="0 0 320 400" aria-hidden="true" fontSize="13">
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
        <path className="ink" d="M40 142 L250 140 L252 202 L41 204 Z" />
        <text x="52" y="162">{t.script[0]}</text>
        <text x="52" y="178" className="dim">{t.script[1]}</text>
        <text x="52" y="193" className="dim">{t.script[2]}</text>
        <path className="ink" d="M145 208 C146 218 144 226 145 236" />
        <path className="ink" d="M139 229 L145 238 L151 229" />
        <path className="ink" d="M20 242 L300 240 L301 352 L21 354 Z" />
        <text x="32" y="264">{t.checked}</text>
        <text x="32" y="282">{t.forTrades}</text>
        <text x="32" y="300" className="dim">{t.look}</text>
        <text x="38" y="334" fontSize="15" fontWeight="500">{t.worth}</text>
        <path className="mark" pathLength={1} d="M28 334 C26 314 110 310 180 314 C214 318 212 346 166 348 C100 351 30 348 32 328" />
        <text x="20" y="378" className="red">{t.under[0]}</text>
        <text x="20" y="394" className="red">{t.under[1]}</text>
      </svg>
    </Sketch>
  );
}
