import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Manveen Singh — GTM automation engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          background: "#0f1113",
          padding: 64,
          fontFamily: "sans-serif",
        }}
      >
        {/* hazard belt */}
        <div
          style={{
            display: "flex",
            height: 10,
            background:
              "repeating-linear-gradient(45deg, #ffd60a 0 12px, #0f1113 12px 24px)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
            <div
              style={{
                display: "flex",
                width: 18,
                height: 18,
                borderRadius: 9,
                background: "#3ddc84",
              }}
            />
            <div style={{ fontSize: 24, color: "#8a9099", letterSpacing: 3, textTransform: "uppercase" }}>
              GTM automation engineer · Delhi · remote
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 104,
              fontWeight: 800,
              color: "#e6e3dc",
              lineHeight: 1,
              letterSpacing: -3,
            }}
          >
            Automating the boring.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 104,
              fontWeight: 800,
              color: "#ffd60a",
              lineHeight: 1.05,
              letterSpacing: -3,
            }}
          >
            Scaling the interesting.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", gap: 48 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 56, fontWeight: 800, color: "#e6e3dc" }}>75</div>
              <div style={{ fontSize: 18, color: "#8a9099", letterSpacing: 2 }}>MORNINGS UNATTENDED</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 56, fontWeight: 800, color: "#e6e3dc" }}>342</div>
              <div style={{ fontSize: 18, color: "#8a9099", letterSpacing: 2 }}>CONTRACTS READ</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 56, fontWeight: 800, color: "#e6e3dc" }}>0</div>
              <div style={{ fontSize: 18, color: "#8a9099", letterSpacing: 2 }}>MANUAL STEPS</div>
            </div>
          </div>
          <div style={{ fontSize: 24, color: "#ffd60a" }}>manveen.me</div>
        </div>
      </div>
    ),
    size,
  );
}
