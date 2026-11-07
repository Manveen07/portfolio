import { VISUAL } from "@/data/how";

// The two small charts on /how-i-build, one per failure story. Plain HTML and CSS (no chart library), so they
// reflow on a phone and their numbers stay crisp text. Built to the dataviz skill's rules:
// - form: a unit chart where the counts are small (4, 18), horizontal bars for the bounce rates (v2.1, 2 Nov: the
//   identity replay's stat tiles went with its story to the habit card, which shows its numbers with the pen);
// - colour: highlight encoding, ink for the rest and the site's red for the one thing that matters, never colour
//   alone: every red mark also says what it is in words ("skipped", "0 of 4");
// - marks: thin bars with 4px round ends from the baseline, a 2px gap between units, values as direct labels, a
//   native tooltip (title) on each bar and unit row;
// - every chart is role="img" with the whole reading in its aria-label, and the markdown copy prints the same words.
// The ink and red pair passed the skill's validator for CVD separation (worst ΔE 19.4, protan) and contrast on the
// paper (29 Oct); ink "fails" the categorical chroma band by design, since it is the neutral, not a category.
// 2 Nov: the bounce bars print each rate exactly as the claims table writes it (`shown`), and the second group is the
// before and after of his lists beside a teammate's, the control group.

const C = VISUAL.stories;

export const claygentLabel = () =>
  `Claygent fit check, before and after the rewrite. ${C.claygent.rows.map((r) => `${r.label}: ${r.value}`).join(". ")}.`;

export function ClaygentUnits() {
  return (
    <figure className="chart units" role="img" aria-label={claygentLabel()}>
      {C.claygent.rows.map((r) => (
        <div key={r.label} className={r.kind ? `urow ${r.kind}` : "urow"} title={`${r.label}: ${r.value}`}>
          <span className="ulabel">{r.label}</span>
          <span className="udots">
            {Array.from({ length: r.n }, (_, k) => (
              <i key={k} className={k < r.filled ? "on" : "off"} />
            ))}
          </span>
          <span className="uval">{r.value}</span>
        </div>
      ))}
    </figure>
  );
}

// --w is the bar's share of the longest (5.1%, the same scale for both groups, so the two read together); CSS turns it
// into a width (70% of the track, 52% on a phone), so the value label fits beside the longest bar; on the narrowest
// phones (under 360px) each value sits under its bar instead (app/globals.css, 7 Nov).
const MAX = Math.max(...C.bounces.bars.map((b) => b.value));

export const bounceLabel = () =>
  `Bounce rate by the receiving mail server, 505,461 of our sends: ${C.bounces.bars
    .map((b) => `${b.label} ${b.shown}${b.skipped ? ", skipped before any paid lookup" : ", kept"}`)
    .join("; ")}. ${C.bounces.resultHead}: ${C.bounces.result.map((b) => `${b.label} ${b.shown}`).join("; ")}. ${C.bounces.after}`;

type Bar = { label: string; value: number; shown: string; skipped: boolean };

function Row({ b }: { b: Bar }) {
  return (
    <div className="brow" title={`${b.label}: ${b.shown} bounced${b.skipped ? ", now skipped" : ""}`}>
      <span className="blabel">{b.label}</span>
      <span className="btrack">
        <i className={b.skipped ? "bar red" : "bar"} style={{ "--w": (b.value / MAX).toFixed(4) } as React.CSSProperties} />
        <span className="bval">
          {b.shown}
          {b.skipped ? " · skipped" : ""}
        </span>
      </span>
    </div>
  );
}

export function BounceBars() {
  return (
    <figure className="chart bars-h" role="img" aria-label={bounceLabel()}>
      {C.bounces.bars.map((b) => (
        <Row key={b.label} b={b} />
      ))}
      <span className="bsub">{C.bounces.resultHead}</span>
      {C.bounces.result.map((b) => (
        <Row key={b.label} b={b} />
      ))}
      <span className="bafter">{C.bounces.after}</span>
    </figure>
  );
}
