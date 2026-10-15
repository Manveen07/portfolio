import Sketch from "@/components/Sketch";

// Four steps on a wobbly line. Each visible label is one plain string, so the server HTML
// holds "1 · a call" as one piece. The pen circle sits around "every miss logged, you see the list"
// and is the only red mark (it draws itself once, see .mark in globals.css). Its loop is kept 3 or more
// units clear of every letter (checked per glyph in the browser): the brief's first loop clipped the
// first letters of "every" and "you".
export default function PilotSketch({ label }: { label: string }) {
  return (
    <Sketch label={label}>
      {/* text is 13 (it was 12: 10.4px at a 640px window). At 13 the longest lines are 156, 133, 179 and 156 units,
          so the columns start at 8, 178, 330 and 525 (each at least 14 units clear of the one before) and the
          circle's left half moved 10 units with its text. Each dot is 12 right of its column's text. */}
      <svg className="sketch-wide" viewBox="0 0 690 130" aria-hidden="true" fontSize="13">
        <path className="ink" d="M10 40 C160 37 300 43 450 39 S640 40 680 41" />
        <circle cx="20" cy="40" r="5" fill="#1d1d1d" />
        <circle cx="190" cy="40" r="5" fill="#1d1d1d" />
        <circle cx="342" cy="40" r="5" fill="#1d1d1d" />
        <circle cx="537" cy="40" r="5" fill="#1d1d1d" />

        <text x="8" y="22" fontWeight="500">1 · a call</text>
        <text x="8" y="66">you tell me what</text>
        <text x="8" y="80">wastes the most time</text>
        <text x="8" y="94" className="dim">not a real problem?</text>
        <text x="8" y="108" className="dim">{"I'll say so"}</text>

        <text x="178" y="22" fontWeight="500">2 · a fixed quote</text>
        <text x="178" y="66">before any work</text>
        <text x="178" y="80">starts</text>

        <text x="330" y="22" fontWeight="500">3 · a month, for real</text>
        <text x="330" y="66">on your actual requests</text>
        <text x="330" y="86">every miss logged,</text>
        <text x="330" y="100">you see the list</text>
        <path className="mark" pathLength={1} d="M323 99 C321 86 323 76 336 73.5 C370 72 440 73.5 468 74 C480 75 482 84 481 92 C480 104 470 110 450 110.5 C410 112.5 350 111 332 107 C324 104 322 100 325 94" />

        <text x="525" y="22" fontWeight="500">4 · you decide</text>
        <text x="525" y="66">keep it: a monthly</text>
        <text x="525" y="80">fee, I look after it</text>
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
