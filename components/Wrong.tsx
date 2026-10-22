import { WRONG, type Pin } from "@/data/portfolio";
import { Circle, Underline } from "@/components/Pen";

/** The AI's own words or data, as code, with the red pen on the part that was wrong. */
function Exhibit({ e }: { e: Pin["exhibit"] }) {
  const marked = e.pen === "underline" ? <Underline>{e.marked}</Underline> : <Circle tight={e.pen === "tight"}>{e.marked}</Circle>;
  return (
    <code className="exhibit">
      {e.before}
      {marked}
      {e.after}
    </code>
  );
}

/** Notes pinned down the page, oldest first: the date it was caught, what the AI said, what happened,
    and what I check now. It teaches; nothing in it asks for work. */
export default function Wrong() {
  return (
    <section id="wrong" className="wrap sec">
      <h2 className="kicker">{WRONG.kicker}</h2>
      <p className="lede">{WRONG.lede}</p>
      <ol className="pins">
        {WRONG.pins.map((p) => (
          <li key={p.iso} className="pin">
            <p className="pin-date">
              <time dateTime={p.iso}>{p.date}</time>
            </p>
            <h3 className="h3">{p.title}</h3>
            <p className="pin-exhibit">
              <Exhibit e={p.exhibit} /> <span className="scribble">
                <span className="arr-up" aria-hidden="true">↑ </span>
                <span className="arr-left" aria-hidden="true">← </span>
                {p.scribble}
              </span>
            </p>
            <p className="pin-text">{p.what}</p>
            <p className="pin-text">
              <b>What I check now:</b> {p.now}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
