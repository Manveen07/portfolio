import type { ReactNode } from "react";
import { INBOUND as I, type InboundFig, type InboundPart } from "@/data/portfolio";
import type { Block } from "@/data/posts";
import Prose from "@/components/Prose";
import LeadRoute from "@/components/sketches/LeadRoute";
import RouteTheLead from "@/components/sketches/RouteTheLead";
import FunnelOnce from "@/components/sketches/FunnelOnce";
import { LeadSlip, TeamRows, RepNote, DecisionRows, CopiesDots, BatchDots, BandRows } from "@/components/InboundCharts";

/** The body of the post /writing/an-inbound-crm-on-hubspot-and-n8n (its title and lede come from the post page,
    24 Nov 2026): one made-up lead followed from her form to the weekly report, a figure per step and a few plain lines
    under each, all in data/portfolio.ts (INBOUND). The technical detail sits in closed <details> clicks at the end of
    its section, so the page reads whole without opening one; every word of them is in the server HTML and in the
    markdown copy (lib/md/posts.ts, inboundCrm). Only the game and the funnel run in the browser. */
const FIGS: Record<InboundFig, () => ReactNode> = {
  route: () => <LeadRoute />,
  slip: () => <LeadSlip />,
  teams: () => <TeamRows />,
  memo: () => <RepNote />,
  game: () => <RouteTheLead />,
  decisions: () => <DecisionRows />,
  copies: () => <CopiesDots />,
  batch: () => <BatchDots />,
  funnel: () => <FunnelOnce />,
  bands: () => <BandRows />,
};

/** A section's parts in order: runs of prose blocks share one Prose column, each figure sits between them. */
function Parts({ parts }: { parts: InboundPart[] }) {
  const out: ReactNode[] = [];
  let run: Block[] = [];
  const flush = () => {
    if (run.length) out.push(<Prose key={`p${out.length}`} body={run} />);
    run = [];
  };
  for (const p of parts) {
    if (p.t === "fig") {
      flush();
      out.push(<div key={p.fig}>{FIGS[p.fig]()}</div>);
    } else run.push(p);
  }
  flush();
  return <>{out}</>;
}

export default function Inbound() {
  return (
    <div className="post-body">
      {I.sections.map((s, i) => (
        <div key={i} className="crm-sec">
          <Parts parts={s.parts} />
          {s.more.length > 0 && (
            <div className="crm-mores">
              {s.more.map((m) => (
                <details key={m.label} className="more">
                  <summary>
                    <span className="more-line">
                      <span className="crm-more-tag">{I.moreTag}</span> <span className="more-label">{m.label}</span>
                    </span>
                    <span className="more-hint" aria-hidden="true" />
                  </summary>
                  <div className="crm-more-body">
                    <Prose body={m.body} />
                  </div>
                </details>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
