import type { Metadata } from "next";
import Link from "next/link";
import { HOW, PATTERNS, FAILURES, TESTING, PIPELINE_STEPS, CLAY, LIVE, HOW_END, type Story } from "@/data/how";
import { ME } from "@/data/portfolio";
import { Inline } from "@/components/Prose";
import PipelineSketch from "@/components/sketches/PipelineSketch";

// How Manveen builds and tests GTM systems, for hiring managers (29 Oct 2026). The first screen says what kind of
// GTM engineer he is and gives three numbers and the hardest fix; everything longer sits behind a <details> the
// reader opens (no JavaScript needed). Words in data/how.ts; markdown copy at /how-i-build.md (lib/md/how.ts).

const DESCRIPTION = HOW.headline;

// A link to a story (#claygent) opens it: a <details> named by the address opens on load and on every hash change.
// Without JavaScript the link still scrolls to the story's title.
const OPEN_FROM_HASH =
  "(function(){function o(){var e=location.hash&&document.getElementById(decodeURIComponent(location.hash.slice(1)));if(e&&e.tagName==='DETAILS')e.open=true}o();addEventListener('hashchange',o)})()";

export const metadata: Metadata = {
  title: `${HOW.title} | Manveen Singh`,
  description: DESCRIPTION,
  alternates: { canonical: "/how-i-build", types: { "text/markdown": "/how-i-build.md" } },
  openGraph: { title: HOW.title, description: DESCRIPTION, url: "/how-i-build", type: "website", siteName: "Manveen Singh" },
  twitter: { card: "summary_large_image", title: HOW.title, description: DESCRIPTION },
};

/** A link: same tab inside the site, a new tab outside it. */
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

function StoryItem({ s }: { s: Story }) {
  const parts: [string, string][] = [
    ["What broke", s.broke],
    ["How I found it", s.found],
    ["How I proved the fix", s.tested],
    ["What it changed", s.changed],
  ];
  return (
    <details className="more" id={s.id}>
      <summary>
        <h3 className="h3">{s.title}</h3>
        <span className="more-line">{s.result}</span>
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

export default function HowIBuild() {
  return (
    <>
      <section id="top" className="wrap sec hero how">
        <p className="kicker">{HOW.title}</p>
        <h1>{HOW.headline}</h1>
        <p className="lede">{HOW.lede}</p>
        <dl className="metrics proofs">
          {HOW.proofs.map(([n, label]) => (
            <div key={n}>
              <dt>{n}</dt>
              <dd>{label}</dd>
            </div>
          ))}
        </dl>
        <p className="body hardest">
          <Inline s={HOW.hardest} />{" "}
          <A href={HOW.hardestLink.href}>{HOW.hardestLink.label}</A>
        </p>
        <p className="small">
          <Inline s={HOW.privacy} />
        </p>
        <p className="links">
          {HOW.heroLinks.map((l) => (
            <A key={l.href} href={l.href} className="">
              {l.label}
            </A>
          ))}
        </p>
      </section>

      <section id="patterns" className="wrap sec">
        <h2 className="kicker">Patterns GTM teams ask for</h2>
        <p className="body">{PATTERNS.intro}</p>
        <ul className="habits">
          {PATTERNS.items.map((t) => (
            <li key={t.lead}>
              <b>{t.lead}</b> <Inline s={t.text} />
            </li>
          ))}
        </ul>
      </section>

      <section id="failures" className="wrap sec">
        <h2 className="kicker">Three failures I fixed</h2>
        <p className="body">{FAILURES.intro}</p>
        {FAILURES.stories.map((s) => (
          <StoryItem key={s.id} s={s} />
        ))}
      </section>

      <section id="testing" className="wrap sec">
        <h2 className="kicker">How I test a workflow</h2>
        <p className="body">{TESTING.intro}</p>
        <ol className="habits">
          {TESTING.items.map((t) => (
            <li key={t.lead}>
              <b>{t.lead}</b> <Inline s={t.text} />
            </li>
          ))}
        </ol>
      </section>

      <section id="pipeline" className="wrap sec">
        <h2 className="kicker">The whole pipeline</h2>
        <p className="body">{PIPELINE_STEPS.intro}</p>
        <PipelineSketch />
        <details className="more">
          <summary>
            <span className="more-line more-label">Each step, and the check that stops bad output</span>
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
      </section>

      <section id="clay" className="wrap sec">
        <h2 className="kicker">Clay, in depth</h2>
        <p className="body">{CLAY.intro}</p>
        <ul className="habits">
          {CLAY.items.map((t) => (
            <li key={t}>
              <Inline s={t} />
            </li>
          ))}
        </ul>
      </section>

      <section id="live" className="wrap sec">
        <h2 className="kicker">See it running</h2>
        <p className="body">{LIVE.intro}</p>
        <ul className="habits live">
          {LIVE.items.map((l) => (
            <li key={l.href}>
              <A href={l.href}>{l.label}</A>: {l.text}
            </li>
          ))}
        </ul>
      </section>

      <section id="contact" className="wrap sec">
        <h2 className="kicker">Write to me</h2>
        <p className="body">{HOW_END.ask}</p>
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
      <script dangerouslySetInnerHTML={{ __html: OPEN_FROM_HASH }} />
    </>
  );
}
