import { VISUAL } from "@/data/how";

// The three small charts on /how-i-build, one per failure story. Plain HTML and CSS (no chart library), so they
// reflow on a phone and their numbers stay crisp text. Built to the dataviz skill's rules:
// - form: a unit chart where the counts are small (4, 25, 30), stat tiles where the story is two numbers (the
//   identity replay: the published numbers are +77 and 0, with no base count, so bars would be invented), a
//   horizontal bar chart for the three bounce rates;
// - colour: highlight encoding, ink for the rest and the site's red for the one thing that matters, never colour
//   alone: every red mark also says what it is in words ("skipped", "0 of 4");
// - marks: thin bars with 4px round ends from the baseline, a 2px gap between units, values as direct labels, a
//   native tooltip (title) on each bar and unit row;
// - every chart is role="img" with the whole reading in its aria-label, and the markdown copy prints the same words.
// The ink and red pair passed the skill's validator for CVD separation (worst ΔE 19.4, protan) and contrast on the
// paper (29 Oct); ink "fails" the categorical chroma band by design, since it is the neutral, not a category.

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

export const identityLabel = () =>
  `Email identity check, old and new rules replayed side by side: ${C.identity.tiles.map(([n, l]) => `${n} ${l}`).join(", ")}.`;

export function IdentityTiles() {
  return (
    <figure className="chart" role="img" aria-label={identityLabel()}>
      <dl className="tiles mini">
        {C.identity.tiles.map(([n, label]) => (
          <div key={label}>
            <dt>{n}</dt>
            <dd>{label}</dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}

// --w is the bar's share of the longest (5.1%, the same scale for both groups, so the two read together); CSS turns it into a width (70% of the track, 52% on a phone), so the
// value label always fits beside the longest bar.
const MAX = Math.max(...C.bounces.bars.map((b) => b.value));
const pct = (v: number) => `${v.toFixed(1)}%`;

export const bounceLabel = () =>
  `Bounce rate by the receiving mail server, 505,461 sends: ${C.bounces.bars
    .map((b) => `${b.label} ${pct(b.value)}${b.skipped ? ", skipped before any paid lookup" : ", kept"}`)
    .join("; ")}. Bounces on my lists: ${C.bounces.result.map((b) => `${b.label} ${pct(b.value)}`).join("; ")}. ${C.bounces.after}`;

export function BounceBars() {
  return (
    <figure className="chart bars-h" role="img" aria-label={bounceLabel()}>
      {C.bounces.bars.map((b) => (
        <div key={b.label} className="brow" title={`${b.label}: ${pct(b.value)} bounced${b.skipped ? ", now skipped" : ""}`}>
          <span className="blabel">{b.label}</span>
          <span className="btrack">
            <i className={b.skipped ? "bar red" : "bar"} style={{ "--w": (b.value / MAX).toFixed(4) } as React.CSSProperties} />
            <span className="bval">
              {pct(b.value)}
              {b.skipped ? " · skipped" : ""}
            </span>
          </span>
        </div>
      ))}
      <span className="bsub">Bounces on my lists</span>
      {C.bounces.result.map((b) => (
        <div key={b.label} className="brow" title={`${b.label}: ${pct(b.value)}`}>
          <span className="blabel">{b.label}</span>
          <span className="btrack">
            <i className="bar" style={{ "--w": (b.value / MAX).toFixed(4) } as React.CSSProperties} />
            <span className="bval">{pct(b.value)}</span>
          </span>
        </div>
      ))}
      <span className="bafter">{C.bounces.after}</span>
    </figure>
  );
}
