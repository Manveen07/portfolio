import Link from "next/link";
import { WORK } from "@/data/portfolio";

export default function Work() {
  return (
    <section id="work" className="wrap sec">
      <h2 className="kicker">Other things I&apos;ve built</h2>
      <div className="work">
        {WORK.map((w) => (
          <article key={w.title} className="card">
            <p className="small">{w.where}</p>
            <h3 className="h3">{w.title}</h3>
            <p className="body">
              <b>{w.lead}</b>
            </p>
            <p className="body">{w.detail}</p>
            <dl className="metrics">
              {w.metrics.map(([n, label]) => (
                <div key={label}>
                  <dt>{n}</dt>
                  <dd>{label}</dd>
                </div>
              ))}
            </dl>
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
        ))}
      </div>
    </section>
  );
}
