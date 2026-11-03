import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Manveen Singh, GTM engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The card people see when manveen.me is pasted into an email, Slack or LinkedIn.
export default async function Image() {
  // Static TTFs from the Archivo project (OFL): next/og cannot read woff2 or variable fonts.
  // Read from disk on the Node runtime (the edge bundle with both fonts was close to Vercel's Hobby limit).
  const [bold, regular] = await Promise.all([
    readFile(join(process.cwd(), "app/Archivo-ExtraBold.ttf")),
    readFile(join(process.cwd(), "app/Archivo-Regular.ttf")),
  ]);
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
        <div style={{ display: "flex", fontSize: 28, fontWeight: 800 }}>Manveen Singh</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {/* The hero's h1 (2 Nov, verify loop round 2), at 56 so its longer second line fits the 1056px inside the padding. */}
          <div style={{ display: "flex", fontSize: 56, fontWeight: 800, lineHeight: 1.08, letterSpacing: -2 }}>
            I build AI agents for outbound
          </div>
          <div style={{ display: "flex", fontSize: 56, fontWeight: 800, lineHeight: 1.08, letterSpacing: -2 }}>
            and measure what they get wrong.
          </div>
        </div>
        {/* Round 6 (2 Nov): the circled Tender Radar count ("mornings one system has started on its own") is off, with
            the section it came from: those runs showed green while the AI step failed (components/Proof.tsx). */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
          {/* The domain reads like the underlined words on the page: ink text, a hand-drawn red line under it. */}
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
