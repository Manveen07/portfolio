import { PIPELINE } from "@/data/portfolio";
import type { PipelineData } from "@/lib/pipeline";
import { fmtDay, runLine } from "@/lib/runs";
import { Circle } from "@/components/Pen";
import RadarSketch from "@/components/sketches/RadarSketch";

// Off the home page since round 6 of the verify loop (2 Nov): Tender Radar's AI step has failed on every new notice since
// September (a suspended API key) while the runs showed green, so its numbers were stale and its bars said nothing about
// the AI step (data/portfolio.ts PIPELINE). Kept for when the classifier runs again and a failed classify step fails the run.
export default function Proof({ pipe }: { pipe: PipelineData }) {
  const failed = pipe.history.filter((r) => !r.ok).length;
  return (
    <section id="proof" className="wrap sec">
      <h2 className="kicker">Running right now · Tender Radar</h2>
      {PIPELINE.intro.map((p) => (
        <p key={p} className="lede">
          {p}
        </p>
      ))}
      {/* Round 4 (2 Nov): the sketch's note ("every number here comes from the same run as the bars below") is cut; the
          run and save times sit under the bars. */}
      <RadarSketch trades={pipe.clientProfiles} checks={pipe.checks} bid={pipe.bid} maybe={pipe.maybe} />
      <p className="count">
        <Circle>{pipe.totalRuns}</Circle>
      </p>
      <p className="body">mornings it has started on its own since {PIPELINE.firstRun}.</p>
      {/* The bars' pen note is cut (2 Nov, verify loop round 2); the sketch above already says every morning, on a timer. */}
      <div
        className="bars"
        role="img"
        aria-label={`Last ${pipe.history.length} days: ${pipe.history.length - failed} finished, ${failed} failed`}
      >
        {pipe.history.map((r, i) => (
          <i key={`${r.date}-${i}`} className={r.ok ? undefined : "f"} title={`${fmtDay(r.date)}: ${r.ok ? "finished" : "failed"}`} />
        ))}
      </div>
      <p className="small">
        One bar per day, last {pipe.history.length}. Black finished, red failed. {runLine(pipe.lastRun, pipe.live, pipe.asOf)}
      </p>
      {/* Cut 2 Nov (verify loop round 3): "It sorts for N trades, from cleaning and security to pest control, and has N
          notices on file." The sketch already says "for 7 trades", and the cto read the notices times the trades against
          the checks. */}
      <p className="body">{PIPELINE.outage}</p>
      <p className="links">
        <a href={PIPELINE.loom} target="_blank" rel="noopener">Watch it work (under 5 min) ↗</a>
        <a href={PIPELINE.repo} target="_blank" rel="noopener">See the code ↗</a>
      </p>
    </section>
  );
}
