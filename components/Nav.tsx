"use client";

import { usePathname } from "next/navigation";
import { NAV, ME } from "@/data/portfolio";
import { useScrollSpy } from "@/lib/hooks";

const IDS = NAV.map((n) => n.id);

export default function Nav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  // Scroll-spy only means anything on the homepage; sub-routes link back.
  const active = useScrollSpy(onHome ? IDS : []);
  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  return (
    <div
      className="panel on"
      style={{
        margin: "20px 20px 0",
        padding: "14px 24px",
        display: "flex",
        alignItems: "center",
        gap: 20,
        flexWrap: "wrap",
        animationDelay: ".1s",
        position: "sticky",
        top: 12,
        zIndex: 20,
      }}
    >
      <a href={onHome ? "#top" : "/"} style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <span className="lamp on boot" />
        <span className="cond" style={{ fontSize: 22, fontWeight: 700 }}>
          {ME.name}
        </span>
      </a>
      <span className="engr">
        {ME.role} · {ME.location} · remote
      </span>
      <span style={{ flexGrow: 1 }} />
      <div className="nav-keys" style={{ display: "flex", gap: 6 }}>
        {NAV.map((n) => (
          <a
            key={n.id}
            href={href(n.id)}
            className={`key ${onHome && active === n.id ? "active" : ""}`}
          >
            {n.label}
          </a>
        ))}
      </div>
      <a className="btn go" href={ME.calendly} target="_blank" rel="noopener">
        Book 30 min <span>→</span>
      </a>
    </div>
  );
}
