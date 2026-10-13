import { PIPELINE } from "@/data/portfolio";
import type { PipelineData } from "@/lib/pipeline";
import { runLine } from "@/lib/runs";
import Annotated from "@/components/Annotated";
import { Circle } from "@/components/Pen";

/** "7 Sep" for a bar's hover title. */
function fmtDay(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
}

export default function Proof({ pipe }: { pipe: PipelineData }) {
  const failed = pipe.history.filter((r) => !r.ok).length;
  return (
    <section id="proof" className="wrap sec">
      <p className="kicker">Running right now · Tender Radar</p>
      <p className="lede">{PIPELINE.intro}</p>
      <Annotated note={PIPELINE.penNote}>
        <p className="count">
          <Circle>{pipe.totalRuns}</Circle>
        </p>
        <p className="body">mornings it has run on its own since {PIPELINE.firstRun}.</p>
        <div
          className="bars"
          role="img"
          aria-label={`Last ${pipe.history.length} mornings: ${pipe.history.length - failed} ran, ${failed} failed`}
        >
          {pipe.history.map((r, i) => (
            <i key={`${r.date}-${i}`} className={r.ok ? undefined : "f"} title={`${fmtDay(r.date)}: ${r.ok ? "ran" : "failed"}`} />
          ))}
        </div>
        <p className="small">
          One bar per morning, last {pipe.history.length}. Black ran, red failed. {runLine(pipe.lastRun, pipe.live, pipe.asOf)}
        </p>
      </Annotated>
      <p className="body">
        It sorts for {pipe.clientProfiles} trades, from cleaning and security to pest control, and has {pipe.noticesRead} notices on file.
      </p>
      <p className="body">{PIPELINE.outage}</p>
      <p className="links">
        <a href={PIPELINE.loom} target="_blank" rel="noopener">Watch it work (under 5 min) ↗</a>
        <a href={PIPELINE.repo} target="_blank" rel="noopener">See the code ↗</a>
      </p>
    </section>
  );
}
