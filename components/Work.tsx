import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { JOBS, OWN_WORK, QUOTE, NOW_LINE, ME, type WorkItem } from "@/data/portfolio";
import Annotated from "@/components/Annotated";
import { Underline } from "@/components/Pen";
import Scorecard from "@/components/Scorecard";

/** One entry, on the paper: meta lines, bold title, plain text, then whatever it carries. */
function Entry({ w }: { w: WorkItem }) {
  return (
    <article className="entry">
      <p className="small">{w.where}</p>
      {w.role && <p className="small">{w.role}</p>}
      <h3 className="h3">{w.title}</h3>
      <p className="body">{w.lead}</p>
      {w.detail && <p className="body">{w.detail}</p>}
      {w.scorecard && <Scorecard s={w.scorecard} />}
      {w.shot && (
        <Image className="shot" src={w.shot.src} alt={w.shot.alt} width={w.shot.width} height={w.shot.height} sizes="280px" />
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
}

/** A group: its mono label, then its entries with a pencil tick between them. An entry with a note
    gets an annotated block; the entry marked `quote` is followed by Zackary's quote and its note. */
function Group({ label, items }: { label: string; items: WorkItem[] }) {
  return (
    <>
      <p className="group">{label}</p>
      {items.map((w, i) => (
        <Fragment key={w.title}>
          {i > 0 && <hr className="tick" />}
          {w.note ? (
            <Annotated note={w.note} drop={w.scorecard ? "scorecard" : undefined}>
              <Entry w={w} />
            </Annotated>
          ) : (
            <Entry w={w} />
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
      ))}
    </>
  );
}

// Groups, entries and the quote are direct children of the section, all on the column's left edge.
// The section allows two margin notes: the quote's and leadlens's.
export default function Work() {
  return (
    <section id="work" className="wrap sec">
      <h2 className="kicker">Work, and who vouches for it</h2>
      <Group label="Jobs" items={JOBS} />
      <Group label="Built on my own" items={OWN_WORK} />
      <p className="small now">
        {NOW_LINE} <a className="link" href={ME.resume}>Full resume ↗</a>
      </p>
    </section>
  );
}
