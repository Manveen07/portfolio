import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { POSTS, getPost } from "@/data/posts";
import Prose from "@/components/Prose";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Not found" };
  return {
    title: `${post.title} | Manveen Singh`,
    description: post.summary,
    openGraph: { title: post.title, description: post.summary, type: "article" },
    alternates: { types: { "text/markdown": `/writing/${post.slug}.md` } },
  };
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const others = POSTS.filter((p) => p.slug !== post.slug);

  return (
    <article className="wrap sec hero post">
      {/* Back link and date: in the side rail from 1100px, above the title below that. */}
      <div className="post-meta">
        <p className="small">
          <Link className="link" href="/writing">
            ← all writing
          </Link>
        </p>
        <p className="small">
          {fmtDate(post.date)} · {post.readMins} min read · {post.tags.join(", ")}
        </p>
      </div>
      <h1>{post.title}</h1>
      <p className="lede">{post.summary}</p>
      <Prose body={post.body} />
      {others.length > 0 && (
        <>
          <p className="kicker" style={{ marginTop: 48 }}>
            More writing
          </p>
          <ul className="post-list">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/writing/${o.slug}`}>
                  <p className="small">{fmtDate(o.date)}</p>
                  <h2 className="h3">{o.cardTitle ?? o.title}</h2>
                </Link>
              </li>
            ))}
          </ul>
        </>
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
