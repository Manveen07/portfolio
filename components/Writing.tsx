import Link from "next/link";
import { NEWEST_FIRST } from "@/data/posts";

/** The three newest posts, quietly, after the work: a title and one line each, and the way to the rest.
    Manveen, 22 Oct: "a person navigating the website will never lead to the writing section. I want them to go to
    the writing section." Later that day the drawing-proof and confidently-wrong blocks moved into the writing
    ("these are the blogs"; "I want my website to be not filled with balls of text"), so this stays a short list. */
export default function Writing() {
  const latest = NEWEST_FIRST.slice(0, 3);
  if (!latest.length) return null;
  return (
    <section id="writing" className="wrap sec">
      <h2 className="kicker">Writing</h2>
      <ul className="latest">
        {latest.map((p) => (
          <li key={p.slug}>
            <Link href={`/writing/${p.slug}`}>
              <h3 className="h3">{p.cardTitle ?? p.title}</h3>
              <p className="body">{p.line ?? p.cardSummary ?? p.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
      <p className="links">
        <Link href="/writing">All writing →</Link>
      </p>
    </section>
  );
}
