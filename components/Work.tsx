import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { WORK, QUOTE, NOW_LINE, ME } from "@/data/portfolio";
import Annotated from "@/components/Annotated";
import { Underline } from "@/components/Pen";
import Scorecard from "@/components/Scorecard";

// Entries and the quote block are direct children of the section; on wide screens `.annotated`
// (globals.css) hangs the quote's and the leadlens note in the right margin. Entries sit on the
// paper, with a short pencil tick (`hr.tick`) before every entry but the first.
// The section allows two notes: the quote's and leadlens's. PresentAI has none.
export default function Work() {
  return (
    <section id="work" className="wrap sec">
      <h2 className="kicker">Work, and who vouches for it</h2>
      {WORK.map((w, i) => {
        const card = (
          <article className="entry">
            <p className="small">{w.where}</p>
            {w.role && <p className="small">{w.role}</p>}
            <h3 className="h3">{w.title}</h3>
            <p className="body">{w.lead}</p>
            {w.detail && <p className="body">{w.detail}</p>}
            {w.scorecard && <Scorecard s={w.scorecard} />}
            {w.shot && (
              <Image
                className="shot"
                src={w.shot.src}
                alt={w.shot.alt}
                width={w.shot.width}
                height={w.shot.height}
                sizes="280px"
              />
            )}
            {w.metrics.length > 0 && (
              <dl className="metrics">
                {w.metrics.map(([n, label]) => (
                  <div key={label}>
                    <dt>{n}</dt>
                    <dd>{label}</dd>
                  </div>
                ))}
              </dl>
            )}
            <p className="stack">built with {w.stack.join(", ")}</p>
            {w.links && (
              <p className="links">
                {w.links.map((l) =>
                  l.href.startsWith("/") ? (
                    <Link key={l.href} href={l.href}>
                      {l.label}
                    </Link>
                  ) : (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener">
                      {l.label}
                    </a>
                  ),
                )}
              </p>
            )}
          </article>
        );
        return (
          <Fragment key={w.title}>
            {i > 0 && <hr className="tick" />}
            {w.note ? (
              <Annotated note={w.note} drop={w.scorecard ? "scorecard" : undefined}>
                {card}
              </Annotated>
            ) : (
              card
            )}
            {w.quote && (
              <Annotated note={QUOTE.penNote} drop="line">
                <figure className="quote">
                  <blockquote>
                    <p>
                      &ldquo;{QUOTE.before}
                      <Underline>{QUOTE.marked}</Underline>&rdquo;
                    </p>
                  </blockquote>
                  <figcaption>
                    <b>{QUOTE.name}</b>, {QUOTE.title}, {QUOTE.company}
                    <br />
                    <span className="small">{QUOTE.source}</span>
                  </figcaption>
                </figure>
              </Annotated>
            )}
          </Fragment>
        );
      })}
      <p className="small">
        {NOW_LINE} <a className="link" href={ME.resume}>Full resume ↗</a>
      </p>
    </section>
  );
}
