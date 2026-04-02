import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Manveen Singh - AI & Automation Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#080c16",
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
        {/* Grid overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "linear-gradient(90deg, #00e5ff, #00ff88, #a78bfa)",
          }}
        />

        {/* Logo */}
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
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "rgba(0,229,255,0.1)",
              border: "1px solid rgba(0,229,255,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#00e5ff",
              fontSize: 24,
              fontWeight: 700,
            }}
          >
            M
          </div>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, letterSpacing: 4, textTransform: "uppercase" as const }}>
            manveen.vercel.app
          </span>
        </div>

        {/* Name */}
        <div style={{ fontSize: 56, fontWeight: 900, color: "white", marginBottom: 12, letterSpacing: -1 }}>
          Manveen Singh
        </div>

        {/* Role */}
        <div style={{ fontSize: 28, color: "#00e5ff", marginBottom: 32, display: "flex", gap: 12, alignItems: "center" }}>
          <span>AI & Automation Engineer</span>
        </div>

        {/* Tagline */}
        <div style={{ fontSize: 20, color: "rgba(255,255,255,0.3)", maxWidth: 700 }}>
          Building production-ready workflow systems that actually ship.
        </div>

        {/* Bottom status */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 80,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13,
            color: "rgba(0,255,136,0.5)",
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00ff88" }} />
          All pipelines operational
        </div>
      </div>
    ),
    { ...size }
  );
}
