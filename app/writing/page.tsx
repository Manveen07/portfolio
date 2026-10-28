import type { Metadata } from "next";
import Link from "next/link";
import { NEWEST_FIRST, postDate } from "@/data/posts";

const TITLE = "Writing | Manveen Singh";
const DESCRIPTION = "What I tried, what broke, what fixed it.";

// A page's own openGraph replaces the layout's whole block, image included, so the home card is named again here.
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/writing", types: { "text/markdown": "/writing.md" } },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/writing", type: "website", siteName: "Manveen Singh", images: "/opengraph-image" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: "/opengraph-image" },
};

export default function WritingIndex() {
  return (
    <section className="wrap sec hero">
      <p className="kicker">Writing</p>
      <h1>What I tried, what broke, what fixed it.</h1>
      <ul className="post-list">
        {NEWEST_FIRST.map((p) => (
          <li key={p.slug}>
            <Link href={`/writing/${p.slug}`}>
              <p className="small">{`${postDate(p)} · ${p.readMins} min read`}</p>
              <h2 className="h3">{p.cardTitle ?? p.title}</h2>
              <p className="body">{p.cardSummary ?? p.summary}</p>
            </Link>
          </li>
        ))}
      </ul>
      <p className="cta-row" style={{ marginTop: 48 }}>
        <Link className="link" href="/">
          ← Home
        </Link>
      </p>
    </section>
  );
}
