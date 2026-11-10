import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TESTS_SHOWN, HOW, AGENTS, SPLIT, HABITS, HELD, TESTING, FAILURES, PIPELINE_STEPS, NERD, INBOX, LIVE, CONTACT, VISUAL, stageHead } from "@/data/how";
import { ME, PHOTO } from "@/data/portfolio";
import { PROOF } from "@/data/proof";
import { Inline } from "@/components/Prose";
import { StoryText } from "@/components/StoryParts";
import A from "@/components/A";
import ProofCard from "@/components/ProofCard";
import HabitRow, { PenExhibit } from "@/components/HabitRow";
import StoryCard from "@/components/StoryCard";
import SkillRows from "@/components/SkillRows";
import FixLog from "@/components/FixLog";
import OpenOnHash from "@/components/OpenOnHash";
import AgentLanes from "@/components/sketches/AgentLanes";
import PipelineSketch from "@/components/sketches/PipelineSketch";
import InboxFleet from "@/components/sketches/InboxFleet";
import FreeCheckFirst from "@/components/sketches/FreeCheckFirst";
import OnItsOwn from "@/components/sketches/OnItsOwn";
import { ClaygentUnits, BounceBars } from "@/components/HowCharts";
import { pageJsonLd, ldJson } from "@/lib/md/person";

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
// 9 Nov (his ask: "readable and understanble ... show them how i am diffrent not just someone uses ai to build"; his pick
// of three judged outlines, "Proof first"): the order is now the h1, What broke and what I changed (the held list, then
// Claygent and the mail servers, each with what it was checked against and its limit), What I can do, Before I change a
// rule, Me and my agents, The inbox fleet, Check it yourself, Say hi (the call offer before the hours line). Four readers had found the measured miss three
// screens down, behind a click, under an agents drawing every AI builder has.

const DESCRIPTION = `${HOW.headline} ${HOW.sub.join(" ")}`;

export const metadata: Metadata = {
  title: `${HOW.title} | Manveen Singh`,
  description: DESCRIPTION,
  alternates: { canonical: "/how-i-build", types: { "text/markdown": "/how-i-build.md" } },
  openGraph: { title: HOW.title, description: DESCRIPTION, url: "/how-i-build", type: "website", siteName: "Manveen Singh", locale: "en_US" },
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
      {/* 3 Nov: the page about him, by him, in schema.org terms (lib/md/person.ts). */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(pageJsonLd("/how-i-build", "AboutPage", HOW.title, DESCRIPTION)) }} />
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
            {/* 10 Nov (his ask: "build social proof to a recuiter that visits how i build page"): the one outside
                voice he has, home's own sentence (data/portfolio.ts REFERENCE), on the first screen. */}
            <p className="how-ref">{HOW.reference}</p>
            {/* 10 Nov (blind readers, 3 of 3): where he is and the hours he works sat only in the last line of the page. */}
            <p className="how-ref">{CONTACT.where}</p>
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
          <h3 className="nerd-head">{NERD.clayHead}</h3>
          {/* 3 Nov (option 4 of the animation mockups): the funnel the Clay list's second line tells in words, drawn. */}
          <FreeCheckFirst />
          <ul className="nerd-list">
            {NERD.clay.map((t) => (
              <li key={t}>
                <Inline s={t} linkClass="link" />
              </li>
            ))}
          </ul>
        </details>
      </section>

      {/* 9 Nov (his pick, "Proof first"): the stories, the held list first, each in one shape (components/StoryCard.tsx);
          since 9 Nov late (his pick, "What I've built") they follow the systems he built. The held-list card in full sits behind the first story's click; its id,
          held-list, still opens it from home's "The whole flow →" (components/OpenOnHash.tsx). */}
      <section id="failures" className="wrap sec">
        <h2 className="kicker">{K.failures}</h2>
        <StoryCard
          id="held"
          head={HELD.head}
          picture={<PenExhibit x={HELD.exhibit} />}
          lines={[HELD.caught]}
          checked={HELD.checked}
          limit={HELD.limit}
          click={
            <details className="more held-click" id="held-click">
              <summary>
                <span className="more-line more-label">{VISUAL.clicks["held-list"]}</span>
                <span className="more-hint" aria-hidden="true" />
              </summary>
              <ProofCard c={PROOF["held-list"]} density="full" level={4} links={false} title={false} />
            </details>
          }
        />
        {FAILURES.stories.map((s) => {
          const v = VISUAL.stories[s.id as keyof typeof VISUAL.stories];
          const Chart = CHARTS[s.id];
          return (
            <StoryCard
              key={s.id}
              id={s.id}
              head={v.head}
              picture={<Chart />}
              caption={v.caption}
              lines={v.lines}
              checked={v.checked}
              limit={v.limit}
              click={<StoryText s={s} />}
            />
          );
        })}
      </section>

      {/* 9 Nov, late (his ask: "tested like software", and to "know if anything breaks or goes live"): how he tests, in the
          rows' shape, after what he caught (jury, editor: pictures come sooner). Words in data/how.ts (TESTING). */}
      <section id="how-i-test" className="wrap sec">
        <h2 className="kicker">{K.testing}</h2>
        <SkillRows rows={TESTING} ledger first={TESTS_SHOWN} moreId="more-tests" />
        {/* 9 Nov, late (jury): the testing list that sat in the pipeline click, under its own click here. */}
        <details className="more" id="how-each-test">
          <summary>
            <span className="more-line more-label">{VISUAL.clicks["how-i-test"]}</span>
            <span className="more-hint" aria-hidden="true" />
          </summary>
          <ul className="nerd-list">
            {NERD.testing.map((t) => (
              <li key={t}>
                <Inline s={t} linkClass="link" />
              </li>
            ))}
          </ul>
        </details>
      </section>

      <section id="habits" className="wrap sec">
        <h2 className="kicker">{K.habits}</h2>
        {HABITS.map((h) => (
          <HabitRow key={h.id} h={h} />
        ))}
      </section>

      <section id="agents" className="wrap sec">
        <h2 className="kicker">{K.agents}</h2>
        <AgentLanes />
        {/* 3 Nov (option 5 of the animation mockups): what runs on its own and what waits for a person, behind its own
            click so the first screen and its word count stay as they were. Words in data/how.ts (SPLIT). */}
        <details className="more" id={SPLIT.id}>
          <summary>
            <span className="more-line more-label">{VISUAL.clicks[SPLIT.id]}</span>
            <span className="more-hint" aria-hidden="true" />
          </summary>
          {/* 9 Nov: the two lines that sat under the drawing moved in here (move, never remove): two readers found them
              repeating step 5 and the AI agents row on the first screen. */}
          {AGENTS.lines.map((line) => (
            <p key={line} className="body">
              {line}
            </p>
          ))}
          <OnItsOwn />
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
        {/* 9 Nov: body size (was small grey), right under the address (jury: an agency founder's first question is
            campaign results, and this is the answer); the hours line after it. */}
        <p className="body">{CONTACT.results}</p>
        <p className="small">{CONTACT.where}</p>
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
