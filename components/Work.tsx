import { Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { JOBS, REFERENCE, NOW_LINE, ME, type WorkItem } from "@/data/portfolio";
import Annotated from "@/components/Annotated";
import Scorecard from "@/components/Scorecard";

/** One entry, on the paper: meta lines, bold title, plain text, then whatever it carries. */
function Entry({ w }: { w: WorkItem }) {
  return (
    <article className="entry">
      <p className="small">{w.where}</p>
      {w.role && <p className="small">{w.role}</p>}
      <h3 className="h3">{w.title}</h3>
      {w.lead && <p className="body">{w.lead}</p>}
      {w.detail && <p className="body">{w.detail}</p>}
      {w.points && (
        <ul className="points">
          {w.points.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      )}
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

/** Entries with a pencil tick between them. An entry with a note gets an annotated block; the entry marked `reference`
    is followed by Zackary's reference, one plain line (round 4, 2 Nov: the quoted excerpt is cut). */
function Entries({ items }: { items: WorkItem[] }) {
  return (
    <>
      {items.map((w, i) => (
        <Fragment key={w.title}>
          {i > 0 && <hr className="tick" />}
          {w.note ? (
            <Annotated note={w.note}>
              <Entry w={w} />
            </Annotated>
          ) : (
            <Entry w={w} />
          )}
          {w.reference && <p className="body ref">{REFERENCE}</p>}
        </Fragment>
      ))}
    </>
  );
}

// The jobs and the reference, right under the held-list card (2 Nov, verify loop round 2). The kicker was "Work, and
// who vouches for it" until then (2 of 4 readers flagged it as AI-sounding). Entries and the reference line are direct
// children of the section, all on the column's left edge.
export default function Work() {
  return (
    <section id="work" className="wrap sec">
      <h2 className="kicker">Work</h2>
      <Entries items={JOBS} />
      <p className="small now">
        {NOW_LINE} <a className="link" href={ME.resume}>Full resume ↗</a>
      </p>
    </section>
  );
}

// "Built on my own" (PresentAI) left the home page in round 4 (2 Nov); its code stays on his GitHub profile.
