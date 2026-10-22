import Link from "next/link";
import { ME } from "@/data/portfolio";

export default function Nav() {
  return (
    <header className="wrap head">
      <Link href="/" className="head-name">
        {ME.name}
      </Link>
      <nav className="head-links" aria-label="Site">
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
