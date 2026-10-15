import Link from "next/link";
import { ME } from "@/data/portfolio";

export default function Nav() {
  return (
    <header className="wrap head">
      <Link href="/" className="head-name">
        {ME.name}
      </Link>
      <a className="head-cta" href={`mailto:${ME.email}`}>
        Write to me
      </a>
    </header>
  );
}
