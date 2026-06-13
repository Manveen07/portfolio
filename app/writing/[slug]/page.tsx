import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { POSTS, getPost } from "@/data/posts";
import Prose from "@/components/Prose";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
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
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function PostPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article style={{ position: "relative", padding: "140px 0 100px" }}>
      <div className="pf-wrap">
        <Link
          href="/#writing"
          style={{
            fontFamily: "var(--font-mono), monospace", fontSize: 12,
            color: "#7d877a", display: "inline-flex", alignItems: "center", gap: 8,
            marginBottom: 36,
          }}
          className="pf-link"
        >
          <span>←</span> cd ../writing
        </Link>

        <div style={{
          fontFamily: "var(--font-mono), monospace", fontSize: 11, color: "#525a4e",
          letterSpacing: "0.06em", display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 18,
        }}>
          <span style={{ color: "#7dd99a" }}>{fmtDate(post.date)}</span>
          <span>·</span>
          <span>{post.readMins} min read</span>
          <span>·</span>
          <span>{post.tags.map((t) => `#${t}`).join("  ")}</span>
        </div>

        <h1 style={{
          fontFamily: "var(--font-sans), system-ui, sans-serif",
          fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 500, lineHeight: 1.05,
          letterSpacing: "-0.03em", color: "#dfe4dc", margin: "0 0 24px", maxWidth: 820,
        }}>
          {post.title}
        </h1>

        <p style={{
          fontFamily: "var(--font-sans), system-ui, sans-serif", fontSize: 19,
          lineHeight: 1.55, color: "#7d877a", margin: "0 0 48px", maxWidth: 720,
          paddingBottom: 32, borderBottom: "1px solid rgba(155,220,170,0.10)",
        }}>
          {post.summary}
        </p>

        <Prose body={post.body} />

        <div style={{
          marginTop: 56, paddingTop: 28, borderTop: "1px solid rgba(155,220,170,0.10)",
          display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap",
        }}>
          <Link href="/#writing" className="pf-btn">← all writing</Link>
          <Link href="/#contact" className="pf-btn pf-btn-primary">work with me →</Link>
        </div>
      </div>
    </article>
  );
}
