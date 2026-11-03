import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HOW, AGENTS, HABITS, FAILURES, PIPELINE_STEPS, NERD, INBOX, LIVE, CONTACT, VISUAL, stageHead } from "@/data/how";
import { ME, PHOTO } from "@/data/portfolio";
import { PROOF } from "@/data/proof";
import { Inline } from "@/components/Prose";
import { StoryText } from "@/components/StoryParts";
import A from "@/components/A";
import ProofCard from "@/components/ProofCard";
import HabitRow from "@/components/HabitRow";
import SkillRows from "@/components/SkillRows";
import FixLog from "@/components/FixLog";
import OpenOnHash from "@/components/OpenOnHash";
import AgentLanes from "@/components/sketches/AgentLanes";
import PipelineSketch from "@/components/sketches/PipelineSketch";
import InboxFleet from "@/components/sketches/InboxFleet";
import { ClaygentUnits, BounceBars } from "@/components/HowCharts";

// How Manveen works, his AI edge, his skills and things a stranger can check, for a GTM founder or hiring manager with
// about 30 seconds (2 Nov 2026; design: the 2 Nov design doc, outside this repo). Order: the h1 and its two sub lines,
// his agents and where a person approves, what he can do in one sentence per skill and one "Not yet" line (the pipeline
// and the details behind one click; right after the agents since the verify loop's round 3, 2 Nov: the round 2
// recruiter gave up in "Two times it broke" before reaching it, and three readers called it the most useful part for a
// hirer), one miss he acted on (the held-list card, in the first screen until round 4, 2 Nov: three round 3 readers
// thought the home page's link "hadn't changed pages"; its own section after the skills in round 4; since round 5,
// behind a "How it actually went" click right under the skills rows, as all 4 round 4 readers said its story repeats
// what home and the Checking AI output row already tell), a habit from the day job (the email check, replayed before
// switching, its story behind the card's click), two day-job failures, what to click, and how to reach him. Numbers
// and pictures carry the page; every longer text sits behind a <details> (no JavaScript needed to open one).
// Words in data/how.ts; markdown copy at /how-i-build.md (lib/md/how.ts). The voice is his, casual on purpose.
// 3 Nov: the inbox fleet (the agency's inbox bot, stage by stage, and where a person decides) sits after the skills
// and their clicks, before the habit (his ask: "you did not have anything about inboxes").

const DESCRIPTION = `${HOW.headline} ${HOW.sub.join(" ")}`;

export const metadata: Metadata = {
  title: `${HOW.title} | Manveen Singh`,
  description: DESCRIPTION,
  alternates: { canonical: "/how-i-build", types: { "text/markdown": "/how-i-build.md" } },
  openGraph: { title: HOW.title, description: DESCRIPTION, url: "/how-i-build", type: "website", siteName: "Manveen Singh" },
  twitter: { card: "summary_large_image", title: HOW.title, description: DESCRIPTION },
};

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
          {/* Round 6 (2 Nov): a kicker above the h1, as home has, so the page doesn't read as home reloaded. */}
          <p className="kicker hero-kicker">{HOW.kicker}</p>
          <h1>{HOW.headline}</h1>
          {/* In the head block, so it sits right under the h1 beside the photo (globals.css, .how .how-sub). Two lines
              since round 4 (2 Nov), each 30 words or fewer. */}
          <div className="how-sub">
            {HOW.sub.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
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

      <section id="skills" className="wrap sec">
        <h2 className="kicker">{K.skills}</h2>
        <SkillRows />
        {/* Round 5 (2 Nov): the held-list card in full, behind its own click under the rows. The card keeps its id,
            held-list, so home's "The whole flow →" opens the click (components/OpenOnHash.tsx), as #identity does. */}
        <details className="more held-click" id="held">
          <summary>
            <span className="more-line more-label">{VISUAL.clicks["held-list"]}</span>
            <span className="more-hint" aria-hidden="true" />
          </summary>
          <ProofCard c={PROOF["held-list"]} density="full" level={3} links={false} />
        </details>
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

      {/* 3 Nov (his ask): the agency's inbox bot, stage by stage, and where a person decides, after the skills and their
          clicks. The lead line, the drawing, one caption and the credit show; each stage's detail sits behind one click.
          Words in data/how.ts (INBOX). */}
      <section id="inbox-fleet" className="wrap sec">
        <h2 className="kicker">{K.fleet}</h2>
        <p className="body">{INBOX.lead}</p>
        <figure className="pipe">
          <InboxFleet />
          <figcaption className="cap">{INBOX.caption}</figcaption>
        </figure>
        <p className="body">{INBOX.credit}</p>
        <details className="more" id="inbox-bot">
          <summary>
            <span className="more-line more-label">{INBOX.summary}</span>
            <span className="more-hint" aria-hidden="true" />
          </summary>
          <ol className="steps-full">
            {INBOX.stages.map((s) => (
              <li key={s.name}>
                <b>{stageHead(s)}</b> {s.detail}
              </li>
            ))}
          </ol>
          <p className="body">{INBOX.never}</p>
        </details>
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

      <section id="live" className="wrap sec">
        <h2 className="kicker">{K.live}</h2>
        <ul className="linkgrid">
          {LIVE.items.map((l) => (
            <li key={l.id} id={l.id}>
              <A href={l.href}>{l.label}</A>
              {(l.code || l.text) && (
                <>
                  <span className="sr-only">: </span>
                  <span>
                    {l.code && (
                      <>
                        <code>{l.code}</code>{" "}
                      </>
                    )}
                    {l.text}
                  </span>
                </>
              )}
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
