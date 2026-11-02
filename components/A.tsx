import type { ReactNode } from "react";

/** A link: same tab inside the site or the page, a new tab outside it (rel="noopener", as tests/how.test.mjs requires). */
export default function A({
  href,
  children,
  className = "link",
  aria,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  /** What a screen reader says for a link whose text is only an arrow. */
  aria?: string;
}) {
  return href.startsWith("/") || href.startsWith("#") ? (
    <a className={className || undefined} href={href} aria-label={aria}>
      {children}
    </a>
  ) : (
    <a className={className || undefined} href={href} target="_blank" rel="noopener" aria-label={aria}>
      {children}
    </a>
  );
}
