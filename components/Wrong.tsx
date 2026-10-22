import { WRONG } from "@/data/portfolio";
import Exhibit from "@/components/Exhibit";

/** The body of the post /writing/things-ai-got-confidently-wrong (its title and lede come from the post page):
    notes pinned down the page, oldest first. The date it was caught, what the AI said, what happened,
    and what I check now. It teaches; nothing in it asks for work. A home page section until 22 Oct. */
export default function Wrong() {
  return (
    <div className="post-body">
      <ol className="pins">
        {WRONG.pins.map((p) => (
          <li key={p.iso} className="pin">
            <p className="pin-date">
              <time dateTime={p.iso}>{p.date}</time>
            </p>
            <h3 className="h3">{p.title}</h3>
            <Exhibit e={p.exhibit} scribble={p.scribble} />
            <p className="pin-text">{p.what}</p>
            <p className="pin-text">
              <b>What I check now:</b> {p.now}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
