import type { Metadata } from "next";
import Link from "next/link";
import { ME, PILOT, WEEK_JOB, FREELANCE } from "@/data/portfolio";
import { Underline } from "@/components/Pen";
import Annotated from "@/components/Annotated";
import WeekSketch from "@/components/sketches/WeekSketch";
import PilotSketch from "@/components/sketches/PilotSketch";

// How working with me goes: the freelance pilot, on its own page since the verify loop's round 3 (2 Nov). Until then it
// was the second half of the home page's Say hi; all 4 round 2 readers asked whether he wants a job or clients, and his
// target until 3 Jan is GTM engineer roles, so home ends on the job ask and this page is linked once, from the footer.
// Word for word as it was on home, in the same look: his approved 15 Oct week (version A) and its sketch, the opener,
// the drawn timeline (its steps stay as a list for screen readers), the ask, the address and the calendar. Round 6
// (2 Nov): the two red-pen notes cut in round 2 are back beside what they mark (his approved wording, claims rows 56
// and 57): the deterministic note under his week line, the "every miss" note under the timeline.
// Words in data/portfolio.ts (WEEK_JOB, PILOT, FREELANCE); markdown copy at /working-with-me.md (lib/md/working.ts).

const TITLE = `${PILOT.head} | Manveen Singh`;
const DESCRIPTION = PILOT.sketchLabel;

// A page's own openGraph replaces the layout's whole block, image included, so the home card is named again here.
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: FREELANCE.href, types: { "text/markdown": "/working-with-me.md" } },
  openGraph: { title: TITLE, description: DESCRIPTION, url: FREELANCE.href, type: "website", siteName: "Manveen Singh", images: "/opengraph-image" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: "/opengraph-image" },
};

export default function WorkingWithMe() {
  return (
    <section id="pilot" className="wrap sec hero">
      <p className="kicker">{FREELANCE.kicker}</p>
      <h1>{PILOT.head}</h1>
      <Annotated note={WEEK_JOB.nerdNote}>
        <p className="lede">
          {WEEK_JOB.headline} {WEEK_JOB.answer} <Underline>{WEEK_JOB.marked}</Underline>
        </p>
      </Annotated>
      <WeekSketch />
      <p className="body">{PILOT.opener}</p>
      {/* The drawn timeline below shows these steps; the list stays in the page for screen readers. */}
      <ol className="steps sr-only">
        {PILOT.steps.map((s) => (
          <li key={s} className="body">
            {s}
          </li>
        ))}
      </ol>
      <Annotated note={PILOT.note}>
        <PilotSketch label={PILOT.sketchLabel} />
      </Annotated>
      <p className="body ask">{PILOT.ask}</p>
      <p className="mail-line">
        <a className="mail" href={`mailto:${ME.email}`}>
          {ME.email}
        </a>
      </p>
      <p className="small">
        <a className="link" href={ME.calendly} target="_blank" rel="noopener">
          {PILOT.calendar}
        </a>
      </p>
      <p className="cta-row" style={{ marginTop: 48 }}>
        <Link className="link" href="/">
          ← Home
        </Link>
      </p>
    </section>
  );
}
