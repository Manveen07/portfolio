import type { Metadata } from "next";
import Link from "next/link";
import { POSTS } from "@/data/posts";

export const metadata: Metadata = {
  title: "Writing | Manveen Singh",
  description: "What I tried, what broke, what fixed it.",
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function WritingIndex() {
  return (
    <section className="wrap sec hero">
      <p className="kicker">Writing</p>
      <h1>What I tried, what broke, what fixed it.</h1>
      <ul className="post-list">
        {POSTS.map((p) => (
          <li key={p.slug}>
            <Link href={`/writing/${p.slug}`}>
              <p className="small">
                {fmtDate(p.date)} · {p.readMins} min read
              </p>
              <h2 className="h3">{p.cardTitle ?? p.title}</h2>
              <p className="body">{p.cardSummary ?? p.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
