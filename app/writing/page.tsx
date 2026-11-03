import type { Metadata } from "next";
import Link from "next/link";
import { NEWEST_FIRST, postDate } from "@/data/posts";
import { ME } from "@/data/portfolio";
import { HOME_CARD } from "@/lib/site";
import { blogJsonLd, ldJson } from "@/lib/md/person";

const TITLE = "Writing | Manveen Singh";
const HEADLINE = "What I tried, what broke, what fixed it.";
// 3 Nov (the AI-friendly audit): the h1 alone named no one and no topic, and search snippets and answer engines quote
// this line, so it says whose posts these are and what they test first. The h1 stays.
const DESCRIPTION = `Posts by ${ME.name}, ${ME.role}, on testing AI steps and workflows: ${HEADLINE.charAt(0).toLowerCase()}${HEADLINE.slice(1)}`;

// A page's own openGraph replaces the layout's whole block, image included, so the home card is named again here, with
// its size and alt (3 Nov), and the locale.
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/writing", types: { "text/markdown": "/writing.md" } },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/writing", type: "website", siteName: "Manveen Singh", locale: "en_US", images: [HOME_CARD] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [HOME_CARD] },
};

export default function WritingIndex() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(blogJsonLd(NEWEST_FIRST, DESCRIPTION)) }} />
      <section className="wrap sec hero">
        <p className="kicker">Writing</p>
        <h1>{HEADLINE}</h1>
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
    </>
  );
}
