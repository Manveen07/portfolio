import Link from "next/link";
import { ME } from "@/data/portfolio";

export default function Nav() {
  return (
    <header className="wrap head">
      <Link href="/" className="head-name">
        {ME.name}
      </Link>
      <nav className="head-links" aria-label="Site">
        {/* 29 Oct: the page for hiring managers, findable from every page (Manveen: "yes", put it live). */}
        <Link className="head-link" href="/how-i-build">
          How I build
        </Link>
        <Link className="head-link" href="/writing">
          Writing
        </Link>
        <a className="head-cta" href={`mailto:${ME.email}`}>
          Write to me
        </a>
      </nav>
    </header>
  );
}
