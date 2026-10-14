import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { WORK, QUOTE, NOW_LINE, ME } from "@/data/portfolio";
import Annotated from "@/components/Annotated";
import { Underline } from "@/components/Pen";
import Scorecard from "@/components/Scorecard";

// Cards and the quote block are direct children of the section, so `.wrap > .annotated`
// (globals.css) gives the quote and the leadlens card their margin-note column on wide screens.
// The section allows two notes: the quote's and leadlens's. PresentAI has none.
export default function Work() {
  return (
    <section id="work" className="wrap sec">
      <h2 className="kicker">Work, and who vouches for it</h2>
      {WORK.map((w) => {
        const card = (
          <article className="card">
            <p className="small">{w.where}</p>
            {w.role && <p className="small">{w.role}</p>}
            <h3 className="h3">{w.title}</h3>
            <p className="body">
              <b>{w.lead}</b>
            </p>
            <p className="body">{w.detail}</p>
            {w.scorecard && <Scorecard s={w.scorecard} />}
            {w.shot && (
              <Image
                className="shot"
                src={w.shot.src}
                alt={w.shot.alt}
                width={w.shot.width}
                height={w.shot.height}
                sizes="(min-width: 700px) 596px, calc(100vw - 84px)"
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
            {w.note ? <Annotated note={w.note}>{card}</Annotated> : card}
            {w.quote && (
              <Annotated note={QUOTE.penNote} drop>
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
