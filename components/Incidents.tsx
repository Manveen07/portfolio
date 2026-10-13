import { INCIDENTS, BROKE_INTRO } from "@/data/portfolio";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-07" → "Jul 2026". */
function fmtMonth(ym: string) {
  const [y, m] = ym.split("-");
  return `${MONTHS[Number(m) - 1]} ${y}`;
}

export default function Incidents() {
  return (
    <section id="broke" className="wrap sec">
      <p className="kicker">What broke</p>
      <p className="body">{BROKE_INTRO}</p>
      <ol className="broke">
        {INCIDENTS.map((x) => (
          <li key={x.broke}>
            <p className="small">
              {fmtMonth(x.when)} · {x.system}
            </p>
            <p className="body">{x.broke}</p>
            <p className="fix">→ {x.changed}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
