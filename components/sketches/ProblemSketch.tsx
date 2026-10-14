import Sketch from "@/components/Sketch";

const LABEL = "An order arrives by email, someone retypes it into your system. I connect the two directly.";

export default function ProblemSketch() {
  return (
    <Sketch label={LABEL}>
      <svg className="sketch-wide" viewBox="0 0 620 104" aria-hidden="true" fontSize="12">
        <path className="ink" d="M6 52 L150 50 L151 88 L7 90 Z" />
        <text x="16" y="68">an order comes in</text>
        <text x="16" y="82" className="dim">by email</text>
        <path className="ink" d="M156 70 C175 69 185 69 206 70" />
        <path className="ink" d="M198 64 L207 70 L198 76" />
        <path className="ink" d="M212 52 L392 50 L393 88 L213 90 Z" />
        <text x="224" y="68">someone retypes it</text>
        <text x="224" y="82" className="dim">every single time</text>
        <path className="ink" d="M398 70 C417 69 427 69 448 70" />
        <path className="ink" d="M440 64 L449 70 L440 76" />
        <path className="ink" d="M454 52 L612 50 L613 88 L455 90 Z" />
        <text x="466" y="68">your system</text>
        <text x="466" y="82" className="dim">(CRM, sheet, ERP)</text>
        <path className="mark" pathLength={1} d="M220 58 C280 78 330 66 386 84" />
        <path className="mark" pathLength={1} d="M222 84 C290 64 330 74 384 56" />
        <path className="mark" pathLength={1} d="M78 48 C160 20 460 18 530 46" />
        <path className="mark" pathLength={1} d="M518 40 L531 48 L516 52" />
        <text x="216" y="12" className="red">I connect these two directly</text>
      </svg>
      <svg className="sketch-tall" viewBox="0 0 300 236" aria-hidden="true" fontSize="12">
        <path className="ink" d="M10 10 L230 8 L231 46 L11 48 Z" />
        <text x="20" y="26">an order comes in</text>
        <text x="20" y="40" className="dim">by email</text>
        <path className="ink" d="M120 52 C121 60 119 68 120 76" />
        <path className="ink" d="M114 69 L120 78 L126 69" />
        <path className="ink" d="M10 82 L230 80 L231 118 L11 120 Z" />
        <text x="20" y="98">someone retypes it</text>
        <text x="20" y="112" className="dim">every single time</text>
        <path className="ink" d="M120 124 C121 132 119 140 120 148" />
        <path className="ink" d="M114 141 L120 150 L126 141" />
        <path className="ink" d="M10 154 L230 152 L231 190 L11 192 Z" />
        <text x="20" y="170">your system</text>
        <text x="20" y="184" className="dim">(CRM, sheet, ERP)</text>
        <path className="mark" pathLength={1} d="M16 88 C80 108 150 96 224 114" />
        <path className="mark" pathLength={1} d="M18 114 C90 94 150 104 222 86" />
        <path className="mark" pathLength={1} d="M236 28 C292 40 292 160 240 172" />
        <path className="mark" pathLength={1} d="M250 164 L238 172 L251 178" />
        <text x="10" y="216" className="red">I connect these two directly</text>
      </svg>
    </Sketch>
  );
}
