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
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default async function PostPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article style={{ padding: "48px 20px 80px" }}>
      <div className="panel on" style={{ padding: "40px 44px", maxWidth: 920, margin: "0 auto" }}>
        <span className="serial">P-04 · {post.slug.toUpperCase().slice(0, 18)}</span>

        <Link href="/#writing" className="lbl" style={{ display: "inline-flex", gap: 8, marginBottom: 32 }}>
          ← all writing
        </Link>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 18, alignItems: "center" }}>
          <span className="lamp on" style={{ width: 10, height: 10 }} />
          <span className="mono" style={{ fontSize: 12, color: "var(--dim)" }}>
            {fmtDate(post.date)} · {post.readMins} min read
          </span>
          <span style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {post.tags.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </span>
        </div>

        <h1
          className="cond h-panel"
          style={{
            fontSize: "clamp(34px, 5vw, 60px)",
            fontWeight: 700,
            lineHeight: 0.95,
            textTransform: "none",
            color: "var(--text)",
            margin: "0 0 22px",
            maxWidth: 820,
          }}
        >
          {post.title}
        </h1>

        <p
          className="intro"
          style={{
            fontSize: 18,
            margin: "0 0 44px",
            paddingBottom: 30,
            borderBottom: "1px solid var(--bevel)",
          }}
        >
          {post.summary}
        </p>

        <Prose body={post.body} />

        <div
          style={{
            marginTop: 52,
            paddingTop: 28,
            borderTop: "1px solid var(--bevel)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <Link href="/#writing" className="btn">
            ← all writing
          </Link>
          <Link href="/#contact" className="btn go">
            work with me <span>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}
