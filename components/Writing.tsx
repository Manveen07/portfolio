import Link from "next/link";
import { POSTS } from "@/data/posts";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

/** The newest post, quietly, after the work: date, title, one line, and the way to the rest.
    Manveen, 22 Oct: "a person navigating the website will never lead to the writing section. I want them to go to the writing section." */
export default function Writing() {
  const latest = [...POSTS].sort((a, b) => b.date.localeCompare(a.date))[0];
  if (!latest) return null;
  return (
    <section id="writing" className="wrap sec">
      <h2 className="kicker">Writing</h2>
      <Link className="latest" href={`/writing/${latest.slug}`}>
        {/* One string, so the server HTML holds the line in one piece (no React text markers). */}
        <p className="small">{`${fmtDate(latest.date)} · ${latest.readMins} min read`}</p>
        <h3 className="h3">{latest.cardTitle ?? latest.title}</h3>
        <p className="body">{latest.line ?? latest.cardSummary ?? latest.summary}</p>
      </Link>
      <p className="links">
        <Link href="/writing">All writing →</Link>
      </p>
    </section>
  );
}
