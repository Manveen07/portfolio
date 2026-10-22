// The site's address, for absolute links in the markdown copies, llms.txt, the sitemap, robots.txt and the
// JSON-LD. SITE_URL overrides it at build time, so a local test build can point its links at itself
// (SITE_URL=http://localhost:3107 npm run build). Unset, it is manveen.me.
export const SITE = (process.env.SITE_URL || "https://manveen.me").replace(/\/+$/, "");

/** An absolute URL for a path on this site. Full URLs and mailto: links pass through. */
export function abs(path: string): string {
  if (/^[a-z][a-z0-9+.-]*:/i.test(path)) return path;
  return `${SITE}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** The markdown copy of a page on this site: "/" is /index.md, a post is its address plus .md.
 *  Anything else (a file, an outside link) is returned as is. */
export function mdHref(href: string): string {
  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return href;
  const [path, hash] = href.split("#");
  if (path === "" || path === "/") return abs(`/index.md${hash ? `#${hash}` : ""}`);
  if (/^\/writing(\/[a-z0-9-]+)?$/.test(path)) return abs(`${path}.md`);
  return abs(href);
}
