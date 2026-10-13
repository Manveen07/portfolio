import Link from "next/link";
import { ME } from "@/data/portfolio";

export default function Nav() {
  return (
    <header className="wrap head">
      <Link href="/" className="head-name">
        {ME.name}
      </Link>
      <a className="head-cta" href={ME.calendly} target="_blank" rel="noopener">
        Book a call
      </a>
    </header>
  );
}
