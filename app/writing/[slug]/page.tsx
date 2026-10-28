import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { ComponentType } from "react";
import { POSTS, NEWEST_FIRST, getPost, postDate, type PostComponent } from "@/data/posts";
import Prose from "@/components/Prose";
import Drawings from "@/components/Drawings";
import Wrong from "@/components/Wrong";
import { postJsonLd } from "@/lib/md/person";
import { abs } from "@/lib/site";

/** Posts drawn by their own component (data/posts.ts says which). */
const BODIES: Record<PostComponent, ComponentType> = {
  "drawing-proof": Drawings,
  "confidently-wrong": Wrong,
};

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Not found" };
  const url = `/writing/${post.slug}`;
  // The share card comes from ./opengraph-image.tsx; Next names it in og:image and twitter:image.
  return {
    title: `${post.title} | Manveen Singh`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      url,
      type: "article",
      siteName: "Manveen Singh",
      publishedTime: post.date,
      authors: [abs("/")],
      tags: post.tags,
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.summary },
    alternates: { canonical: url, types: { "text/markdown": `${url}.md` } },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const others = NEWEST_FIRST.filter((p) => p.slug !== post.slug);
  const Body = Array.isArray(post.body) ? null : BODIES[post.body.component];

  return (
    <article className="wrap sec hero post">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postJsonLd(post)).replace(/</g, "\\u003c") }}
      />
      {/* Back link and date: in the side rail from 1100px, above the title below that. */}
      <div className="post-meta">
        <p className="small">
          <Link className="link" href="/writing">
            ← all writing
          </Link>
        </p>
        <p className="small">{`${postDate(post)} · ${post.readMins} min read · ${post.tags.join(", ")}`}</p>
      </div>
      <h1>{post.title}</h1>
      <p className="lede">{post.summary}</p>
      {Array.isArray(post.body) ? <Prose body={post.body} /> : Body && <Body />}
      {others.length > 0 && (
        // In a wrapper, so from 1100px the label stays in the reading column (a section's own kicker goes to the rail).
        // A heading, so the titles in the list sit under it (h3), not under the post's last section.
        <div style={{ marginTop: 48 }}>
          <h2 className="kicker">More writing</h2>
          <ul className="post-list">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/writing/${o.slug}`}>
                  <p className="small">{postDate(o)}</p>
                  <h3 className="h3">{o.cardTitle ?? o.title}</h3>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="cta-row" style={{ marginTop: 48 }}>
        <Link href="/writing" className="link">
          ← all writing
        </Link>
        <Link href="/" className="link">
          Home
        </Link>
        <Link className="link" href="/#contact">
          Write to me
        </Link>
      </p>
    </article>
  );
}
