import Link from "next/link";
import { NEWEST_FIRST } from "@/data/posts";

/** The three newest posts, quietly, after the work: the titles only, and the way to the rest.
    Manveen, 22 Oct: "a person navigating the website will never lead to the writing section. I want them to go to
    the writing section." Later that day the drawing-proof and confidently-wrong blocks moved into the writing
    ("these are the blogs"; "I want my website to be not filled with balls of text"), so this stays a short list.
    Verify loop round 5 (2 Nov): the line under each title is cut (5 of round 4's 13 AI-sounding flags were those
    lines, and readers skipped the section); each post keeps its own lede on its page. The titles stay word for word. */
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
