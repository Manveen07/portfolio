import Link from "next/link";

export default function NotFound() {
  return (
    <section style={{ padding: "80px 20px 120px", display: "flex", justifyContent: "center" }}>
      <div className="panel on" style={{ padding: "40px 44px", maxWidth: 640, width: "100%" }}>
        <span className="serial">P-XX · NO ROUTE</span>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <span className="lamp red" />
          <span className="engr" style={{ color: "var(--dim)" }}>
            Fault · route not found
          </span>
        </div>

        <div className="cond" style={{ fontSize: 96, lineHeight: 0.85, fontWeight: 800, marginBottom: 20 }}>
          404
        </div>

        <p className="intro" style={{ marginBottom: 28 }}>
          This page was never built, or it was decommissioned. Everything that does exist is one
          click away.
        </p>

        <Link className="btn go" href="/">
          Back to the panel <span>→</span>
        </Link>
      </div>
    </section>
  );
}
