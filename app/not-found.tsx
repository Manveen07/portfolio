import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "80vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "0 16px", position: "relative",
    }}>
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: 520 }}>
        <div style={{
          fontFamily: "var(--font-sans), system-ui, sans-serif",
          fontSize: "clamp(96px, 18vw, 160px)", fontWeight: 700,
          color: "rgba(255,255,255,0.04)", lineHeight: 1, userSelect: "none",
          letterSpacing: "-0.04em",
        }}>
          404
        </div>

        <div className="pf-card" style={{ marginTop: -40, padding: "20px 22px", textAlign: "left" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            paddingBottom: 10, marginBottom: 10,
            borderBottom: "1px solid rgba(155,220,170,0.10)",
          }}>
            <span style={{ width: 8, height: 8, borderRadius: 9999, background: "#e07a6a" }} />
            <span style={{ width: 8, height: 8, borderRadius: 9999, background: "#e3c178" }} />
            <span style={{ width: 8, height: 8, borderRadius: 9999, background: "#7dd99a" }} />
            <span style={{
              marginLeft: 6, fontFamily: "var(--font-mono), monospace", fontSize: 10,
              color: "#7d877a", letterSpacing: "0.08em", textTransform: "uppercase",
            }}>error.log</span>
          </div>
          <pre style={{
            margin: 0, fontFamily: "var(--font-mono), monospace", fontSize: 13,
            lineHeight: 1.7, color: "#dfe4dc",
          }}>
<span style={{ color: "#7dd99a" }}>$</span> <span style={{ color: "#7d877a" }}>locate page</span>{"\n"}
<span style={{ color: "#e07a6a" }}>ERROR</span> <span style={{ color: "#dfe4dc" }}>route not found in pipeline.</span>{"\n"}
<span style={{ color: "#7d877a" }}>the requested resource has been</span>{"\n"}
<span style={{ color: "#7d877a" }}>decommissioned or never existed.</span>{"\n\n"}
<span style={{ color: "#e3c178" }}>hint:</span> <span style={{ color: "#7d877a" }}>try navigating back to /</span>
          </pre>
        </div>

        <Link href="/" className="pf-btn pf-btn-primary" style={{ marginTop: 28, display: "inline-flex" }}>
          return to base <span>→</span>
        </Link>

        <p style={{
          fontFamily: "var(--font-mono), monospace", fontSize: 11,
          color: "#525a4e", marginTop: 24, letterSpacing: "0.08em",
        }}>
          sys.status: pipeline rerouted
        </p>
      </div>
    </div>
  );
}
