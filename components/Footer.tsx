import Link from "next/link";
import { ME, OFF_CLOCK, FREELANCE } from "@/data/portfolio";

export default function Footer() {
  return (
    <footer className="wrap foot">
      <p className="small">
        <b>Off the clock:</b> {OFF_CLOCK}
      </p>
      <p className="small">
        Hiring? <a href={ME.resume}>Resume</a> ·{" "}
        <a href={ME.linkedin} target="_blank" rel="noopener">LinkedIn</a> ·{" "}
        <a href={ME.github} target="_blank" rel="noopener">GitHub</a> ·{" "}
        <Link href="/writing">Writing</Link> · <a href={`mailto:${ME.email}`}>{ME.email}</a>
      </p>
      {/* 2 Nov (verify loop round 3): the freelance pilot's own page, linked once, here. */}
      <p className="small">
        <Link href={FREELANCE.href}>{FREELANCE.link}</Link>
      </p>
      <p className="small">
        {ME.location} · © 2026 {ME.name}
      </p>
    </footer>
  );
}
