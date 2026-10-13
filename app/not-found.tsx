import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap sec hero">
      <p className="kicker">404</p>
      <h1>Nothing here.</h1>
      <p className="lede">This page doesn&apos;t exist, or it used to and I took it down.</p>
      <Link className="btn" href="/">
        Back to the home page
      </Link>
    </section>
  );
}
