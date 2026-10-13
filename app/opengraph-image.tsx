import { ImageResponse } from "next/og";
import snapshot from "@/data/pipeline-snapshot.json";

export const runtime = "edge";
export const alt = "Manveen Singh, automation engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The card people see when manveen.me is pasted into an email, Slack or LinkedIn.
export default async function Image() {
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
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, fontWeight: 700 }}>Manveen Singh</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 56, fontWeight: 800, lineHeight: 1.08, letterSpacing: -2 }}>
            Your tools don&apos;t talk to each other.
          </div>
          <div style={{ display: "flex", fontSize: 56, fontWeight: 800, lineHeight: 1.08, letterSpacing: -2 }}>
            I connect them so it happens on its own.
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div
              style={{
                display: "flex",
                padding: "6px 26px",
                border: "4px solid #c4161c",
                borderRadius: "50%",
                fontSize: 52,
                fontWeight: 800,
              }}
            >
              {snapshot.totalRuns}
            </div>
            <div style={{ display: "flex", fontSize: 26, color: "#5a5750" }}>mornings one system has run on its own</div>
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#c4161c" }}>manveen.me</div>
        </div>
      </div>
    ),
    size,
  );
}
