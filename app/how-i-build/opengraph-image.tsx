import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { HOW, VISUAL } from "@/data/how";

export const alt = `Manveen Singh: ${HOW.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The card people see when manveen.me/how-i-build is pasted into a DM, an email or LinkedIn. Same paper, ink and
// red pen as the home card (app/opengraph-image.tsx); the niche line, then the test count circled.
export default async function Image() {
  const [bold, regular] = await Promise.all([
    readFile(join(process.cwd(), "app/Archivo-ExtraBold.ttf")),
    readFile(join(process.cwd(), "app/Archivo-Regular.ttf")),
  ]);
  const [tests, testsLabel] = VISUAL.tiles[2];
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
        <div style={{ display: "flex", fontSize: 28, fontWeight: 800 }}>Manveen Singh · {HOW.title}</div>
        <div style={{ display: "flex", fontSize: 50, fontWeight: 800, lineHeight: 1.12, letterSpacing: -1.5 }}>{HOW.headline}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ display: "flex", padding: "6px 26px", border: "4px solid #c4161c", borderRadius: "50%", fontSize: 46, fontWeight: 800 }}>
              {tests}
            </div>
            <div style={{ display: "flex", fontSize: 26, color: "#5a5750" }}>{testsLabel}</div>
          </div>
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
