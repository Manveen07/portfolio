import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Manveen Singh — AI & Automation Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0d0c",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "monospace",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(155,220,170,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(155,220,170,0.05) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: "linear-gradient(90deg, transparent, #7dd99a, transparent)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              border: "1px solid rgba(155,220,170,0.22)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#7dd99a",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            M
          </div>
          <span style={{ color: "rgba(223,228,220,0.4)", fontSize: 14, letterSpacing: 4, textTransform: "uppercase" as const }}>
            manveen.vercel.app
          </span>
        </div>

        <div style={{ fontSize: 62, fontWeight: 600, color: "#dfe4dc", marginBottom: 12, letterSpacing: -1.5 }}>
          Manveen Singh
        </div>

        <div style={{ fontSize: 28, color: "#7dd99a", marginBottom: 32, display: "flex", gap: 12, alignItems: "center" }}>
          <span>AI &amp; Automation Engineer</span>
        </div>

        <div style={{ fontSize: 20, color: "rgba(223,228,220,0.45)", maxWidth: 760 }}>
          Building production-ready workflow systems that actually ship.
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 80,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: "rgba(125,217,154,0.55)",
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#7dd99a" }} />
          all pipelines operational
        </div>
      </div>
    ),
    { ...size }
  );
}
