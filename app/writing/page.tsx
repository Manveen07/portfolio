import type { Metadata } from "next";
import Link from "next/link";
import { POSTS } from "@/data/posts";

export const metadata: Metadata = {
  title: "Writing | Manveen Singh",
  description: "Notes from the bench: what I tried, what broke, what fixed it.",
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function WritingIndex() {
  return (
    <section style={{ padding: "40px var(--gutter) 80px", display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="step">
        <span className="n">5</span>
        <span className="t">Writing</span>
        <span className="lbl">{POSTS.length} post{POSTS.length === 1 ? "" : "s"}</span>
        <span className="rule" />
        <Link href="/#writing" className="lbl">← back to the panel</Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 960 }}>
        {POSTS.map((p, i) => (
          <Link
            key={p.slug}
            className="panel on bay"
            href={`/writing/${p.slug}`}
            style={{ padding: "28px 32px", display: "flex", flexDirection: "column", gap: 14 }}
          >
            <span className="serial">P-05 · POST-{String(i + 1).padStart(2, "0")}</span>
            <span className="mono" style={{ fontSize: 12, color: "var(--dim)" }}>
              {fmtDate(p.date)} · {p.readMins} min read
            </span>
            <div className="cond h-bay" style={{ lineHeight: 0.92, fontWeight: 700, textTransform: "none", maxWidth: "26ch" }}>
              <span className="title">{p.cardTitle ?? p.title}</span>
            </div>
            <p className="intro" style={{ fontSize: 15 }}>{p.cardSummary ?? p.summary}</p>
            <span className="lbl" style={{ color: "var(--yellow)" }}>read the post →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
