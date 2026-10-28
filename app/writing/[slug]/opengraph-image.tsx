import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { POSTS, getPost, postDate } from "@/data/posts";

export const alt = "A post from Manveen Singh's writing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

// The card people see when a post is pasted into LinkedIn, Slack or an email: the home card's paper, ink and red
// pen (app/opengraph-image.tsx), with the post's title in place of the hero line. Before 28 Oct posts had no card.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  const [bold, regular] = await Promise.all([
    readFile(join(process.cwd(), "app/Archivo-ExtraBold.ttf")),
    readFile(join(process.cwd(), "app/Archivo-Regular.ttf")),
  ]);
  const title = post?.title ?? "Writing";
  // Short titles at 68px; the long June title (80 characters) fits two lines at 54px.
  const big = title.length <= 48;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f4f1ea",
          color: "#1d1d1d",
          padding: 72,
          fontFamily: "Archivo",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, fontWeight: 800 }}>Manveen Singh · Writing</div>
        <div style={{ display: "flex", fontSize: big ? 68 : 54, fontWeight: 800, lineHeight: 1.08, letterSpacing: -2 }}>
          {title}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", fontSize: 26, color: "#5a5750" }}>{post ? postDate(post) : ""}</div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <div style={{ display: "flex", fontSize: 28, fontWeight: 800, color: "#1d1d1d" }}>manveen.me</div>
            <svg width="184" height="14" viewBox="0 0 184 14" style={{ marginTop: 2 }}>
              <path d="M3 8 C34 5 72 10 106 7 S158 5 181 8" fill="none" stroke="#c4161c" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Archivo", data: bold, weight: 800, style: "normal" },
        { name: "Archivo", data: regular, weight: 400, style: "normal" },
      ],
    },
  );
}
