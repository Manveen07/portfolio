import type { CSSProperties } from "react";
import { INBOUND as I, type InboundRow, type DotRow } from "@/data/portfolio";
import { Circle, Underline } from "@/components/Pen";
import Annotated from "@/components/Annotated";

// The still figures of the inbound CRM post (24 Nov 2026): the form on a pinned slip with its score, the seven teams,
// the rep's note, the answers by reason, the two dot figures and the score bands. Server components: plain HTML and
// CSS (no chart library), so they reflow on a phone and their numbers stay crisp text. Words and numbers come from
// data/portfolio.ts (INBOUND), so lib/md/posts.ts prints what is drawn.
// Built to the dataviz skill's rules, as components/HowCharts.tsx is, inside the site's own look:
// - form: horizontal bars for counts that are compared (teams, answers, score bands), unit dots where the count is
//   small enough to see each one (17 and 35, the batch of 100), one stacked bar for the two parts of a score;
// - colour: ink, with the grey for the second part of the score; red only through the pen (a circle, an underline, a
//   ring round the dots that went wrong, a margin note), and every red mark also says what it is in words;
// - marks: thin bars with 4px round ends from the axis line, a 2px gap between units and between the score's two
//   parts, each value a direct label beside its bar, a native tooltip (title) on every row;
// - no categorical palette to validate: ink and the pen's red are the pair components/HowCharts.tsx validated.
// Nothing here moves except the pen marks, which draw once like every pen mark on the site (components/Pen.tsx).

const w = (n: number, max: number) => ({ "--w": (n / max).toFixed(4) }) as CSSProperties;

/** One bar row: its name, an optional deadline (the first team's is circled), its grey line, then the bar to scale with
    its value. Phones stack them; from 640px the bar sits beside the name (app/globals.css, .crm-row). */
function Row({ r, max, circled, note }: { r: InboundRow; max: number; circled?: boolean; note?: string }) {
  return (
    <li className="crm-row" title={`${r.name}: ${r.value}`}>
      <div className="crm-what">
        <p className="fc-name">{r.name}</p>
        {r.due && <p className="crm-due">{circled ? <Circle>{r.due}</Circle> : r.due}</p>}
        <p className="fc-sub">{r.sub}</p>
      </div>
      <div className="fc-track">
        <i className="fc-bar" aria-hidden="true" style={w(r.n, max)} />
        <p className="fc-val">{r.value}</p>
      </div>
      {note && <p className="note crm-note">{note}</p>}
    </li>
  );
}

/** F2: the form Priya filled in, as a slip pinned to the page, and the score it got. */
export function LeadSlip() {
  const S = I.slip;
  const m = S.message;
  return (
    <figure className="crm-fig">
      <div className="pin crm-slip">
        <p className="pin-date">{S.eyebrow}</p>
        <dl className="crm-fields">
          {S.rows.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
          <div>
            <dt>{m.label}</dt>
            <dd>
              {m.before}
              <Underline>{m.marked}</Underline>
              {`${m.after} `}
              <span className="scribble crm-scribble">
                <span aria-hidden="true">↑ </span>
                {m.scribble}
              </span>
            </dd>
          </div>
          <div>
            <dt>{S.last[0]}</dt>
            <dd>{S.last[1]}</dd>
          </div>
        </dl>
      </div>
      <div className="crm-score">
        <p className="crm-score-n">
          <b>{S.score.n}</b>
          {` ${S.score.of}`}
        </p>
        {/* A 0 to 100 track: the fit points in ink, the ready-to-buy points in grey, the rest empty. */}
        <div className="crm-stack" aria-hidden="true">
          <i className="crm-fit" style={w(S.score.fit, 100)} />
          <i className="crm-ready" style={w(S.score.ready, 100)} />
        </div>
        <p className="crm-key crm-key-fit">{S.score.captions[0]}</p>
        <p className="crm-key crm-key-ready">{S.score.captions[1]}</p>
      </div>
    </figure>
  );
}

/** F3: the seven teams, who lands in each, its deadline, and where the 300 test leads landed first. */
export function TeamRows() {
  const T = I.teams;
  const max = Math.max(...T.rows.map((r) => r.n));
  return (
    <figure className="crm-fig">
      <h3 className="fc-head crm-head">{T.head}</h3>
      {/* role="list": Safari drops list semantics from a list styled without markers. */}
      <ol className="crm-rows" role="list">
        {T.rows.flatMap((r, i) => [
          <Row key={r.name} r={r} max={max} circled={i === 0} note={i === 0 ? T.note : undefined} />,
          ...(i + 1 === T.sum.after
            ? [
                <li key="sum" className="crm-sum">
                  <p>{T.sum.text}</p>
                </li>,
              ]
            : []),
        ])}
      </ol>
    </figure>
  );
}

/** The task note the rep gets, as HubSpot stores it. */
export function RepNote() {
  const M = I.memo;
  return (
    <figure className="crm-fig">
      <figcaption className="crm-cap">{M.caption}</figcaption>
      <div className="crm-memo">
        {M.lines.map((l) => (
          <p key={l}>{l}</p>
        ))}
      </div>
    </figure>
  );
}

/** F5: what the simulated reps answered, and where each answer sends the lead. */
export function DecisionRows() {
  const D = I.decisions;
  const max = D.yes.n;
  return (
    <figure className="crm-fig">
      <h3 className="fc-head crm-head">{D.head}</h3>
      <ol className="crm-rows" role="list">
        <Row r={D.yes} max={max} />
        <li className="crm-sum crm-sub">
          <p>{D.noLabel}</p>
        </li>
        {D.no.map((r) => (
          <Row key={r.name} r={r} max={max} />
        ))}
      </ol>
    </figure>
  );
}

/** F9: how often a rep accepted a lead in each score band, with the caveat as the figure's one red note. */
export function BandRows() {
  const B = I.bands;
  return (
    <figure className="crm-fig">
      <Annotated note={B.note}>
        <h3 className="fc-head crm-head">{B.head}</h3>
        <p className="crm-cap crm-under">{B.under}</p>
        <ol className="crm-rows" role="list">
          {B.rows.map((r) => (
            <Row key={r.name} r={r} max={100} />
          ))}
        </ol>
      </Annotated>
    </figure>
  );
}

/** A dot per record: ink for the ones that are fine, a red ring for the ones that went wrong. */
function DotRows({ label, rows, dotKey }: { label: string; rows: DotRow[]; dotKey: string }) {
  return (
    <figure className="chart units crm-fig crm-units" role="img" aria-label={label}>
      {rows.map((r) => (
        <div key={r.label} className="urow main" title={`${r.label}: ${r.value}`}>
          <span className="ulabel">{r.label}</span>
          <span className="udots">
            {Array.from({ length: r.n }, (_, k) => (
              <i key={k} className={(r.ringedFirst ? k < r.ringed : k >= r.n - r.ringed) ? "ring" : undefined} />
            ))}
          </span>
          <span className="uval">{r.value}</span>
        </div>
      ))}
      <span className="crm-dotkey">
        <i className="ring" aria-hidden="true" />
        {dotKey}
      </span>
    </figure>
  );
}

/** F6: 35 company records for 17 companies. */
export const CopiesDots = () => <DotRows label={I.copies.label} rows={I.copies.rows} dotKey={I.copies.key} />;

/** F7: the batch of 100 the nightly job read on its first run. */
export const BatchDots = () => <DotRows label={I.batch.label} rows={I.batch.rows} dotKey={I.batch.key} />;
