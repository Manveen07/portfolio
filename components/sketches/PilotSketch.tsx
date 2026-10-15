import Sketch from "@/components/Sketch";

// Four steps on a wobbly line. Each visible label is one plain string, so the server HTML
// holds "1 · a call" as one piece. The pen circle sits around "every miss logged, you see the list"
// and is the only red mark (it draws itself once, see .mark in globals.css). Its loop is kept 3 or more
// units clear of every letter (checked per glyph in the browser): the brief's first loop clipped the
// first letters of "every" and "you".
export default function PilotSketch({ label }: { label: string }) {
  return (
    <Sketch label={label}>
      <svg className="sketch-wide" viewBox="0 0 690 130" aria-hidden="true" fontSize="12">
        <path className="ink" d="M10 40 C160 37 300 43 450 39 S640 40 680 41" />
        <circle cx="20" cy="40" r="5" fill="#1d1d1d" />
        <circle cx="187" cy="40" r="5" fill="#1d1d1d" />
        <circle cx="352" cy="40" r="5" fill="#1d1d1d" />
        <circle cx="547" cy="40" r="5" fill="#1d1d1d" />

        <text x="8" y="22" fontWeight="500">1 · a call</text>
        <text x="8" y="66">you tell me what</text>
        <text x="8" y="80">wastes the most time</text>
        <text x="8" y="94" className="dim">not a real problem?</text>
        <text x="8" y="108" className="dim">{"I'll say so"}</text>

        <text x="175" y="22" fontWeight="500">2 · a fixed quote</text>
        <text x="175" y="66">before any work</text>
        <text x="175" y="80">starts</text>

        <text x="340" y="22" fontWeight="500">3 · a month, for real</text>
        <text x="340" y="66">on your actual requests</text>
        <text x="340" y="86">every miss logged,</text>
        <text x="340" y="100">you see the list</text>
        <path className="mark" pathLength={1} d="M333 99 C331 86 333 76 346 73.5 C380 72 440 73.5 468 74 C480 75 482 84 481 92 C480 104 470 110 450 110.5 C410 112.5 360 111 342 107 C334 104 332 100 335 94" />

        <text x="535" y="22" fontWeight="500">4 · you decide</text>
        <text x="535" y="66">keep it: a monthly</text>
        <text x="535" y="80">fee, I look after it</text>
      </svg>
      <svg className="sketch-tall" viewBox="0 0 300 356" aria-hidden="true" fontSize="12">
        <path className="ink" d="M16 12 C14 112 18 224 16 344" />
        <circle cx="16" cy="20" r="5" fill="#1d1d1d" />
        <circle cx="16" cy="124" r="5" fill="#1d1d1d" />
        <circle cx="16" cy="204" r="5" fill="#1d1d1d" />
        <circle cx="16" cy="296" r="5" fill="#1d1d1d" />

        <text x="34" y="24" fontWeight="500">1 · a call</text>
        <text x="34" y="42">you tell me what</text>
        <text x="34" y="58">wastes the most time</text>
        <text x="34" y="74" className="dim">not a real problem?</text>
        <text x="34" y="90" className="dim">{"I'll say so"}</text>

        <text x="34" y="128" fontWeight="500">2 · a fixed quote</text>
        <text x="34" y="146">before any work</text>
        <text x="34" y="162">starts</text>

        <text x="34" y="208" fontWeight="500">3 · a month, for real</text>
        <text x="34" y="226">on your actual requests</text>
        <text x="34" y="246">every miss logged,</text>
        <text x="34" y="260">you see the list</text>
        <path className="mark" pathLength={1} d="M26 266 C23 254 24 241 37 234 C70 232 130 233.5 168 234 C180 235 183 246 182 254 C181 264 170 270 150 270.5 C110 272 55 271 36 267 C29 265 27 263 29 258" />

        <text x="34" y="300" fontWeight="500">4 · you decide</text>
        <text x="34" y="318">keep it: a monthly</text>
        <text x="34" y="334">fee, I look after it</text>
      </svg>
    </Sketch>
  );
}
