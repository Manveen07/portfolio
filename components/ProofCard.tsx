import Link from "next/link";
import type { ReactNode } from "react";
import { Brace, Circle, Strike } from "@/components/Pen";
import { stepLine, type ProofCard as Card, type ProofStep } from "@/data/proof";

// A proof card (1 Nov): one story told as what broke (struck through in red), the check, and the measured result
// (circled in red). All real text, no images, so it reflows on a phone and reads aloud. Words in data/proof.ts; the
// markdown copies print the same card through lib/md/proof.ts.
// - full: once the card is 760px wide (on a laptop), the whole flow as a row of steps and the struck lines held by a
//   red brace with the note beside them; narrower, a column of steps and the note under the lines.
// - compact: two lines instead of the flow (the check, then the result), the note under the struck lines at every
//   width, no brace: the hero's week already uses strike, brace and note, so the cards under it don't repeat it.
// Red only through the pen (strike, brace, circle, notes). The box is the tiles' wash: no border, no shadow, no tilt.

/** `text` with `circle` inside a red loop. The loop stays on one line with the punctuation touching it ("(86%)").
    `tight` hugs the letters: for the small type in the flow's steps. */
function circled(text: string, circle: string | undefined, tight: boolean): ReactNode {
  const at = circle ? text.indexOf(circle) : -1;
  if (!circle || at < 0) return text;
  const before = text.slice(0, at);
  const after = text.slice(at + circle.length);
  const cut = before.lastIndexOf(" ") + 1;
  const end = after.search(/\s|$/);
  const loop = <Circle tight={tight}>{circle}</Circle>;
  const lead = before.slice(cut);
  const trail = after.slice(0, end);
  return (
    <>
      {before.slice(0, cut)}
      {lead || trail ? (
        <span className="pc-nb">
          {lead}
          {loop}
          {trail}
        </span>
      ) : (
        loop
      )}
      {after.slice(end)}
    </>
  );
}

/** A step's name and sub, the circle on whichever holds it. */
function parts(s: ProofStep, tight: boolean): [ReactNode, ReactNode] {
  const inName = !!s.circle && s.name.includes(s.circle);
  return [inName ? circled(s.name, s.circle, tight) : s.name, inName ? s.sub : circled(s.sub, s.circle, tight)];
}

function Before({ c, full }: { c: Card; full: boolean }) {
  return (
    <div className="pc-before">
      <p className="pc-label">{c.before.label}</p>
      <div className="pc-struck">
        {c.before.lines.map((l) => (
          <p key={l} className="pc-line">
            <Strike>{l}</Strike>
          </p>
        ))}
      </div>
      {full && <Brace />}
      <p className="scribble pc-scribble">
        <span className="arr-up" aria-hidden="true">↑ </span>
        {full && <span className="arr-left" aria-hidden="true">← </span>}
        {c.before.note}
      </p>
    </div>
  );
}

function Flow({ steps }: { steps: ProofStep[] }) {
  return (
    <ol className="pc-flow">
      {steps.map((s) => {
        const [name, sub] = parts(s, true);
        return (
          <li key={s.name} className="pc-step">
            <p className="pc-pill">
              <span className="pc-name">{name}</span> <span className="pc-sub">{sub}</span>
            </p>
            {s.note && <p className="note">{s.note}</p>}
          </li>
        );
      })}
    </ol>
  );
}

function Pair({ c }: { c: Card }) {
  const check = c.steps[c.compact.check];
  const result = c.steps[c.compact.result];
  const [name, sub] = parts(result, false);
  return (
    <>
      <p className="pc-check">{stepLine(check)}</p>
      <p className="pc-result">
        <b>{name}</b>: {sub}
      </p>
      {result.note && <p className="note">{result.note}</p>}
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
      <H className="h3">{c.title}</H>
      <Before c={c} full={full} />
      {full ? <Flow steps={c.steps} /> : <Pair c={c} />}
      <p className="note pc-legend">circled: {c.circledLabel}</p>
      <p className="small pc-foot">{c.footer}</p>
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
