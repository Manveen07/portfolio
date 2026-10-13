import { QUOTE, ROLES, EDUCATION, ME } from "@/data/portfolio";
import Annotated from "@/components/Annotated";
import { Underline } from "@/components/Pen";

export default function About() {
  return (
    <section id="people" className="wrap sec">
      <p className="kicker">What people say</p>
      <Annotated note={QUOTE.penNote}>
        <figure className="quote">
          <blockquote>
            <p>
              “{QUOTE.before}
              <Underline>{QUOTE.marked}</Underline>”
            </p>
          </blockquote>
          <figcaption>
            <b>{QUOTE.name}</b>, {QUOTE.title}, {QUOTE.company}
            <br />
            <span className="small">{QUOTE.source}</span>
          </figcaption>
        </figure>
      </Annotated>
      <h2 className="h3">Where I&apos;ve done this</h2>
      <ul className="roles">
        {ROLES.map((r) => (
          <li key={r.co}>
            <p>
              <b>{r.co}</b> · {r.role}
            </p>
            <p className="small">{r.span}</p>
            {r.what && <p className="what">{r.what}</p>}
          </li>
        ))}
      </ul>
      <p className="small">
        {EDUCATION} · <a className="link" href={ME.resume}>Full resume ↗</a>
      </p>
    </section>
  );
}
