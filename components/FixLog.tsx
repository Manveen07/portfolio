import A from "@/components/A";
import { LIVE, logSummary, shortDate } from "@/data/how";

// My corrections log (2 Nov; "Where I corrected myself" until round 5), on /how-i-build: a dated log of corrections to his own public claims, newest
// first, behind one click whose summary names the newest date, so a reader can see it is kept up. Each entry has an
// anchor (log-YYYY-MM-DD-slug) a DM can link; components/OpenOnHash.tsx opens the click for it. Ink only: the log is
// evidence, not a pen mark. Words in data/how.ts (LIVE.log).

export default function FixLog() {
  return (
    <details className="more" id="corrections">
      <summary>
        <span className="more-line more-label">{logSummary()}</span>
        <span className="more-hint" aria-hidden="true" />
      </summary>
      <ol className="fixlog">
        {LIVE.log.map((e) => (
          <li key={e.id} id={e.id}>
            <p className="fixlog-date">
              <time dateTime={e.date}>{shortDate(e.date)}</time>
            </p>
            <p className="fixlog-text">
              {e.text}
              {e.link && (
                <>
                  {" "}
                  <A href={e.link.href}>{e.link.label}</A>
                </>
              )}
            </p>
          </li>
        ))}
      </ol>
    </details>
  );
}
