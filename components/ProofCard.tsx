import Link from "next/link";
import type { ReactNode } from "react";
import { Brace, Circle, Underline } from "@/components/Pen";
import { stepLine, type ProofCard as Card, type ProofStep } from "@/data/proof";
import { keep } from "@/lib/text";

// A proof card (1 Nov): one story told as what broke (underlined in red since 2 Nov, verify loop round 3; struck through
// until then, which two round 2 readers read as "deleted, not true"), the check, and the measured result
// (circled in red). All real text, no images, so it reflows on a phone and reads aloud. Words in data/proof.ts; the
// markdown copies print the same card through lib/md/proof.ts.
// - full: once the card is 760px wide (on a laptop), the whole flow as a row of steps and the struck lines held by a
//   red brace with the note beside them; narrower, a column of steps and the note under the lines.
// - compact: two lines instead of the flow (the check, then the result), the note under the struck lines at every
//   width, no brace: the hero's week already uses strike, brace and note, so the cards under it don't repeat it.
// Red only through the pen (strike, brace, circle, notes). The box is the tiles' wash: no border, no shadow, no tilt.
// 2 Nov: `limit` (what the number can't tell you) sits under the footer at body size in both densities, and in the
// full flow a sub that holds the circle is set at 15px ink (has-circle), so "43 of 50 agree (86%)" reads at a glance.

/** `text` with `circle` inside a red loop, its counts kept whole. The punctuation touching the circled words stays
    with them: brackets inside the loop on the big result line ("(94%)", review 2), anything else (and every bracket
    in the flow's small steps, where `tight` hugs the letters) outside it, on the same line. */
function circled(text: string, circle: string | undefined, tight: boolean): ReactNode {
  text = keep(text);
  const ring = circle && keep(circle);
  const at = ring ? text.indexOf(ring) : -1;
  if (!ring || at < 0) return text;
  const before = text.slice(0, at);
  const after = text.slice(at + ring.length);
  const cut = before.lastIndexOf(" ") + 1;
  const end = after.search(/\s|$/);
  const lead = before.slice(cut);
  const trail = after.slice(0, end);
  const bracketed = !tight && !!(lead || trail) && /^\(?$/.test(lead) && /^\)?$/.test(trail);
  let loop: ReactNode = <Circle tight={tight}>{ring}</Circle>;
  if (bracketed) {
    loop = (
      <Circle>
        {lead}
        {ring}
        {trail}
      </Circle>
    );
  } else if (lead || trail) {
    loop = (
      <span className="pc-nb">
        {lead}
        {loop}
        {trail}
      </span>
    );
  }
  // On the result line the word after the loop stays on its line ("7 wrong of 419 values", not "values" alone below).
  // A no-break space is not enough: Chrome still breaks between the loop and it.
  const rest = after.slice(end);
  const next = tight ? "" : (rest.match(/^ \S+/)?.[0] ?? "");
  if (next) {
    loop = (
      <span className="pc-nb">
        {loop}
        {next}
      </span>
    );
  }
  return (
    <>
      {before.slice(0, cut)}
      {loop}
      {rest.slice(next.length)}
    </>
  );
}

/** A step's name and sub, the circle on whichever holds it. */
function parts(s: ProofStep, tight: boolean): [ReactNode, ReactNode] {
  const inName = !!s.circle && s.name.includes(s.circle);
  return [circled(s.name, inName ? s.circle : undefined, tight), circled(s.sub, inName ? undefined : s.circle, tight)];
}

function Before({ c, full }: { c: Card; full: boolean }) {
  return (
    <div className="pc-before">
      <p className="pc-label">{c.before.label}</p>
      <div className="pc-struck">
        {c.before.lines.map((l) => (
          <p key={l} className="pc-line">
            <Underline>{keep(l)}</Underline>
          </p>
        ))}
      </div>
      {full && <Brace />}
      <p className="scribble pc-scribble">
        <span className="arr-up" aria-hidden="true">↑ </span>
        {full && <span className="arr-left" aria-hidden="true">← </span>}
        {keep(c.before.note)}
      </p>
    </div>
  );
}

function Flow({ steps }: { steps: ProofStep[] }) {
  return (
    <ol className="pc-flow">
      {steps.map((s) => {
        const [name, sub] = parts(s, true);
        const subCircle = !!s.circle && !s.name.includes(s.circle);
        return (
          <li key={s.name} className="pc-step">
            <p className="pc-pill">
              <span className="pc-name">{name}</span> <span className={subCircle ? "pc-sub has-circle" : "pc-sub"}>{sub}</span>
            </p>
            {s.note && <p className="note">{keep(s.note)}</p>}
          </li>
        );
      })}
    </ol>
  );
}

function Pair({ c }: { c: Card }) {
  const check = c.steps[c.compact.check];
  const result = c.steps[c.compact.result];
  // The compact card's own note, if the card has one (round 6: held-list's says what changed between its two samples).
  const note = c.compact.note ?? result.note;
  // The colon sits inside the bold name, so a circled name keeps it on its line (": on its first run" was a line).
  const [name, sub] = parts({ ...result, name: `${result.name}:` }, false);
  return (
    <>
      <p className="pc-check">{keep(stepLine(check))}</p>
      <p className="pc-result">
        <b>{name}</b> {sub}
      </p>
      {note && <p className="note">{keep(note)}</p>}
    </>
  );
}

export default function ProofCard({
  c,
  density,
  level,
  links = true,
}: {
  c: Card;
  density: "full" | "compact";
  level: 2 | 3;
  /** Off where the card's link would point at the card itself (held-list on /how-i-build). */
  links?: boolean;
}) {
  const H = level === 2 ? "h2" : "h3";
  const full = density === "full";
  return (
    <article className={`pc pc-${density}`} id={c.slug}>
      <p className="pc-eyebrow">{c.eyebrow}</p>
      <H className="h3">{keep(c.title)}</H>
      <Before c={c} full={full} />
      {full ? <Flow steps={c.steps} /> : <Pair c={c} />}
      <p className="note pc-legend">circled: {keep(c.circledLabel)}</p>
      {c.footer && <p className="small pc-foot">{keep(c.footer)}</p>}
      {c.limit && <p className="pc-limit">{keep(c.limit)}</p>}
      {links && c.links.length > 0 && (
        <p className="links">
          {c.links.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </p>
      )}
    </article>
  );
}
