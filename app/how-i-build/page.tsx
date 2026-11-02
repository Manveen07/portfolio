import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HOW, AGENTS, HABITS, FAILURES, EMAILS, PIPELINE_STEPS, NERD, LIVE, CONTACT, VISUAL, type Story } from "@/data/how";
import { ME, PHOTO } from "@/data/portfolio";
import { PROOF } from "@/data/proof";
import { Inline } from "@/components/Prose";
import A from "@/components/A";
import ProofCard from "@/components/ProofCard";
import HabitRow from "@/components/HabitRow";
import SkillRows from "@/components/SkillRows";
import FixLog from "@/components/FixLog";
import OpenOnHash from "@/components/OpenOnHash";
import AgentLanes from "@/components/sketches/AgentLanes";
import PipelineSketch from "@/components/sketches/PipelineSketch";
import { ClaygentUnits, IdentityTiles, BounceBars } from "@/components/HowCharts";

// How Manveen works, his AI edge, his skills and things a stranger can check, for a GTM founder or hiring manager with
// about 30 seconds (2 Nov 2026; design: the 2 Nov design doc, outside this repo). Order: the h1
// and one miss he acted on (the held-list card), his agents and where a person approves, a habit from his own
// project, two day-job failures, what he can do with a gap per row (the pipeline, the email story and the details
// behind one click), what to click, and how to reach him. Numbers and pictures carry the page; every longer text sits
// behind a <details> (no JavaScript needed to open one).
// Words in data/how.ts; markdown copy at /how-i-build.md (lib/md/how.ts). The voice is his, casual on purpose.

const DESCRIPTION = `${HOW.headline} ${HOW.sub}`;

export const metadata: Metadata = {
  title: `${HOW.title} | Manveen Singh`,
  description: DESCRIPTION,
  alternates: { canonical: "/how-i-build", types: { "text/markdown": "/how-i-build.md" } },
  openGraph: { title: HOW.title, description: DESCRIPTION, url: "/how-i-build", type: "website", siteName: "Manveen Singh" },
  twitter: { card: "summary_large_image", title: HOW.title, description: DESCRIPTION },
};

/** A story's four parts: what broke, how I found it, how I proved the fix, what it changed. */
function StoryParts({ s }: { s: Story }) {
  const parts: [string, string][] = [
    ["What broke", s.broke],
    ["How I found it", s.found],
    ["How I proved the fix", s.tested],
    ["What it changed", s.changed],
  ];
  return (
    <dl className="story">
      {parts.map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>
            <Inline s={v} linkClass="link" />
          </dd>
        </div>
      ))}
    </dl>
  );
}

function StoryText({ s }: { s: Story }) {
  return (
    <details className="more">
      <summary>
        <span className="more-line more-label">{VISUAL.readStory}</span>
        <span className="more-hint" aria-hidden="true" />
      </summary>
      <StoryParts s={s} />
    </details>
  );
}

const CHARTS: Record<string, () => React.ReactElement> = {
  claygent: ClaygentUnits,
  bounces: BounceBars,
};

export default function HowIBuild() {
  const K = VISUAL.kickers;
  return (
    <>
      <section id="top" className="wrap sec hero how">
        <div className="hero-head">
          {PHOTO && (
            // 72px beside the h1 on a phone, 176px from 720px, in the rail from 1100px (globals.css, .how .photo).
            <Image className="photo" src={PHOTO.src} alt={PHOTO.alt} width={PHOTO.width} height={PHOTO.height} sizes="(max-width: 719px) 72px, 176px" priority />
          )}
          <h1>{HOW.headline}</h1>
          {/* In the head block, so it sits right under the h1 beside the photo (globals.css, .how .how-sub). */}
          <p className="how-sub">{HOW.sub}</p>
        </div>
        <ProofCard c={PROOF["held-list"]} density="full" level={2} links={false} />
        {VISUAL.heroLinks.length > 0 && (
          <p className="links">
            {VISUAL.heroLinks.map((l) => (
              <A key={l.href} href={l.href} className="">
                {l.label}
              </A>
            ))}
          </p>
        )}
      </section>

      <section id="agents" className="wrap sec">
        <h2 className="kicker">{K.agents}</h2>
        <AgentLanes />
        {AGENTS.lines.map((line) => (
          <p key={line} className="body">
            {line}
          </p>
        ))}
      </section>

      <section id="habits" className="wrap sec">
        <h2 className="kicker">{K.habits}</h2>
        {HABITS.map((h) => (
          <HabitRow key={h.id} h={h} />
        ))}
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

      <section id="skills" className="wrap sec">
        <h2 className="kicker">{K.skills}</h2>
        <SkillRows />
        <details className="more" id="nerd">
          <summary>
            <span className="more-line more-label">{NERD.summary}</span>
            <span className="more-hint" aria-hidden="true" />
          </summary>
          <figure className="pipe">
            <PipelineSketch />
            <figcaption className="cap">{NERD.caption}</figcaption>
          </figure>
          <ol className="steps-full">
            {PIPELINE_STEPS.steps.map((s) => (
              <li key={s.name}>
                <b>{s.name}{s.gate ? " (gate)" : ""}.</b> {s.what} <span className="check">Check: {s.check}</span>
              </li>
            ))}
          </ol>
          {/* Cut 1 (2 Nov): the email story, open with the click; the skills row links here. */}
          <article id={EMAILS.id} className="storycard nerd-story">
            <h3 className="h3">{VISUAL.stories.identity.head}</h3>
            <IdentityTiles />
            <p className="cap">{VISUAL.stories.identity.caption}</p>
            <StoryParts s={EMAILS} />
          </article>
          <h3 className="nerd-head">{NERD.testingHead}</h3>
          <ul className="nerd-list">
            {NERD.testing.map((t) => (
              <li key={t}>
                <Inline s={t} linkClass="link" />
              </li>
            ))}
          </ul>
          <h3 className="nerd-head">{NERD.clayHead}</h3>
          <ul className="nerd-list">
            {NERD.clay.map((t) => (
              <li key={t}>
                <Inline s={t} linkClass="link" />
              </li>
            ))}
          </ul>
        </details>
      </section>

      <section id="live" className="wrap sec">
        <h2 className="kicker">{K.live}</h2>
        <ul className="linkgrid">
          {LIVE.items.map((l) => (
            <li key={l.id} id={l.id}>
              <A href={l.href}>{l.label}</A>
              <span className="sr-only">: </span>
              <span>
                {l.code && (
                  <>
                    <code>{l.code}</code>{" "}
                  </>
                )}
                {l.text}
              </span>
              {l.extra && (
                <>
                  {" "}
                  <A href={l.extra.href}>{l.extra.label}</A>
                </>
              )}
            </li>
          ))}
        </ul>
        <p className="small">{LIVE.privacy}</p>
        <FixLog />
      </section>

      <section id="contact" className="wrap sec">
        <h2 className="kicker">{K.contact}</h2>
        <p className="body">{CONTACT.ask}</p>
        <p className="mail-line">
          <a className="mail" href={`mailto:${ME.email}`}>
            {ME.email}
          </a>
        </p>
        <p className="small">{CONTACT.where}</p>
        <p className="small">{CONTACT.results}</p>
        <p className="cta-row" style={{ marginTop: 28 }}>
          <A href={ME.linkedin}>LinkedIn ↗</A>
          <A href={ME.github}>GitHub ↗</A>
          <A href="/resume.pdf">Résumé (PDF)</A>
          <Link className="link" href="/">
            ← Home
          </Link>
          <Link className="link" href="/writing">
            Writing
          </Link>
        </p>
      </section>
      <OpenOnHash />
    </>
  );
}
