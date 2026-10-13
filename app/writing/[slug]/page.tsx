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
  };
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="wrap sec hero">
      <p className="small">
        <Link href="/writing" className="link">
          ← all writing
        </Link>
      </p>
      <p className="small">
        {fmtDate(post.date)} · {post.readMins} min read · {post.tags.join(", ")}
      </p>
      <h1>{post.title}</h1>
      <p className="lede">{post.summary}</p>
      <Prose body={post.body} />
      <p className="cta-row" style={{ marginTop: 48 }}>
        <Link href="/writing" className="link">
          ← all writing
        </Link>
        <Link href="/#contact" className="btn">
          Work with me
        </Link>
      </p>
    </article>
  );
}
