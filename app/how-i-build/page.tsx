import type { Metadata } from "next";
import Link from "next/link";
import { HOW, FAILURES, TESTING, PIPELINE_STEPS, CLAY, VISUAL, type Story } from "@/data/how";
import { ME } from "@/data/portfolio";
import { Inline } from "@/components/Prose";
import PipelineSketch from "@/components/sketches/PipelineSketch";
import { ClaygentUnits, IdentityTiles, BounceBars } from "@/components/HowCharts";

// How Manveen builds and tests GTM systems, for hiring managers. Visual-first since the evening of 29 Oct: numbers and
// pictures carry the page, each caption is a line, and every longer text sits behind a <details> (no JavaScript).
// Words in data/how.ts (VISUAL for what shows, FAILURES / TESTING / CLAY / PIPELINE_STEPS behind the clicks);
// markdown copy at /how-i-build.md (lib/md/how.ts). The voice is his, casual on purpose.

const DESCRIPTION = HOW.headline;

export const metadata: Metadata = {
  title: `${HOW.title} | Manveen Singh`,
  description: DESCRIPTION,
  alternates: { canonical: "/how-i-build", types: { "text/markdown": "/how-i-build.md" } },
  openGraph: { title: HOW.title, description: DESCRIPTION, url: "/how-i-build", type: "website", siteName: "Manveen Singh" },
  twitter: { card: "summary_large_image", title: HOW.title, description: DESCRIPTION },
};

/** A link: same tab inside the site or the page, a new tab outside it. */
function A({ href, children, className = "link" }: { href: string; children: React.ReactNode; className?: string }) {
  return href.startsWith("/") || href.startsWith("#") ? (
    <a className={className} href={href}>
      {children}
    </a>
  ) : (
    <a className={className} href={href} target="_blank" rel="noopener">
      {children}
    </a>
  );
}

function StoryText({ s }: { s: Story }) {
  const parts: [string, string][] = [
    ["What broke", s.broke],
    ["How I found it", s.found],
    ["How I proved the fix", s.tested],
    ["What it changed", s.changed],
  ];
  return (
    <details className="more">
      <summary>
        <span className="more-line more-label">{VISUAL.readStory}</span>
        <span className="more-hint" aria-hidden="true" />
      </summary>
      <dl className="story">
        {parts.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>
              <Inline s={v} />
            </dd>
          </div>
        ))}
      </dl>
    </details>
  );
}

const CHARTS: Record<string, () => React.ReactElement> = {
  claygent: ClaygentUnits,
  identity: IdentityTiles,
  bounces: BounceBars,
};

export default function HowIBuild() {
  const K = VISUAL.kickers;
  return (
    <>
      <section id="top" className="wrap sec hero how">
        <p className="kicker">{HOW.title}</p>
        <h1>{HOW.headline}</h1>
        <dl className="tiles">
          {VISUAL.tiles.map(([n, label]) => (
            <div key={n}>
              <dt>{n}</dt>
              <dd>{label}</dd>
            </div>
          ))}
        </dl>
        <figure className="pipe">
          <PipelineSketch />
          <figcaption className="cap">{VISUAL.pipelineCaption}</figcaption>
        </figure>
        <details className="more">
          <summary>
            <span className="more-line more-label">{VISUAL.stepsSummary}</span>
            <span className="more-hint" aria-hidden="true" />
          </summary>
          <ol className="steps-full">
            {PIPELINE_STEPS.steps.map((s) => (
              <li key={s.name}>
                <b>{s.name}{s.gate ? " (gate)" : ""}.</b> {s.what} <span className="check">Check: {s.check}</span>
              </li>
            ))}
          </ol>
        </details>
        <p className="links">
          {VISUAL.heroLinks.map((l) => (
            <A key={l.href} href={l.href} className="">
              {l.label}
            </A>
          ))}
        </p>
      </section>

      <section id="patterns" className="wrap sec">
        <h2 className="kicker">{K.patterns}</h2>
        <ul className="tilegrid three">
          {VISUAL.patterns.map((t) => (
            <li key={t.head}>
              <span className="tile-num">{t.num}</span>{" "}
              <span className="tile-head">{t.head}</span>{" "}
              <span className="tile-line">{t.line}</span>{" "}
              <A href={t.href} className="tile-more">
                {t.link}
              </A>
            </li>
          ))}
        </ul>
      </section>

      <section id="failures" className="wrap sec">
        <h2 className="kicker">{K.failures}</h2>
        {FAILURES.stories.map((s) => {
          const v = VISUAL.stories[s.id as keyof typeof VISUAL.stories];
          const Chart = CHARTS[s.id];
          return (
            <article key={s.id} id={s.id} className="storycard">
              <h3 className="h3">{v.head}</h3>
              <Chart />
              <p className="cap">{v.caption}</p>
              <StoryText s={s} />
            </article>
          );
        })}
      </section>

      <section id="testing" className="wrap sec">
        <h2 className="kicker">{K.testing}</h2>
        <ol className="gates">
          {VISUAL.gates.map((g) => (
            <li key={g.head}>
              <span className="gate-head">{"href" in g && g.href ? <A href={g.href}>{g.head}</A> : g.head}</span>{" "}
              <span className="gate-line">{g.line}</span>
            </li>
          ))}
          <li className="gate-live">
            <span className="gate-head">{VISUAL.live.head}</span>{" "}
            <span className="gate-line">{VISUAL.live.line}</span>
          </li>
          <li className="gate-after">
            <span className="gate-head">
              <A href={VISUAL.after.href}>{VISUAL.after.head}</A>
            </span>{" "}
            <span className="gate-line">{VISUAL.after.line}</span>
          </li>
        </ol>
        <details className="more">
          <summary>
            <span className="more-line more-label">{VISUAL.gatesSummary}</span>
            <span className="more-hint" aria-hidden="true" />
          </summary>
          <ol className="habits">
            {TESTING.items.map((t) => (
              <li key={t.lead}>
                <b>{t.lead}</b> <Inline s={t.text} />
              </li>
            ))}
          </ol>
        </details>
      </section>

      <section id="clay" className="wrap sec">
        <h2 className="kicker">{K.clay}</h2>
        <dl className="tilegrid two">
          {VISUAL.clay.map(([n, line], i) => (
            <div key={i}>
              <dt>{n}</dt>
              <dd>{line}</dd>
            </div>
          ))}
        </dl>
        <details className="more">
          <summary>
            <span className="more-line more-label">{VISUAL.clayDetails}</span>
            <span className="more-hint" aria-hidden="true" />
          </summary>
          <ul className="habits">
            {CLAY.items.map((t) => (
              <li key={t}>
                <Inline s={t} />
              </li>
            ))}
          </ul>
        </details>
      </section>

      <section id="live" className="wrap sec">
        <h2 className="kicker">{K.live}</h2>
        <ul className="linkgrid">
          {VISUAL.live_items.map((l) => (
            <li key={l.href}>
              <A href={l.href}>{l.label}</A>
              <span className="sr-only">: </span>
              <span>{l.text}</span>
            </li>
          ))}
        </ul>
        <p className="small">{VISUAL.privacy}</p>
      </section>

      <section id="contact" className="wrap sec">
        <h2 className="kicker">{K.contact}</h2>
        <p className="body">{VISUAL.ask}</p>
        <p className="mail-line">
          <a className="mail" href={`mailto:${ME.email}`}>
            {ME.email}
          </a>
        </p>
        <p className="small">{ME.hours}</p>
        <p className="cta-row" style={{ marginTop: 28 }}>
          <Link className="link" href="/">
            ← Home
          </Link>
          <Link className="link" href="/writing">
            Writing
          </Link>
        </p>
      </section>
    </>
  );
}
