// The site's address, for absolute links in the markdown copies, llms.txt, the sitemap, robots.txt and the
// JSON-LD. SITE_URL overrides it at build time, so a local test build can point its links at itself
// (SITE_URL=http://localhost:3107 npm run build). Unset, it is manveen.me.
export const SITE = (process.env.SITE_URL || "https://manveen.me").replace(/\/+$/, "");

/** An absolute URL for a path on this site. Full URLs and mailto: links pass through. */
export function abs(path: string): string {
  if (/^[a-z][a-z0-9+.-]*:/i.test(path)) return path;
  return `${SITE}${path.startsWith("/") ? "" : "/"}${path}`;
}

/** The markdown copy of a page on this site: "/" is /index.md, a post (or /how-i-build, /working-with-me) is its
 *  address plus .md. A page anchor ("/#proof-cards") is dropped: it names an HTML id, which the markdown copy doesn't
 *  have (3 Nov; an agent following one landed at the top anyway, or called it broken).
 *  Anything else (a file, an outside link) is returned as is. */
export function mdHref(href: string): string {
  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return href;
  const path = href.split("#")[0];
  if (path === "" || path === "/") return abs("/index.md");
  if (/^\/writing(\/[a-z0-9-]+)?$/.test(path) || path === "/how-i-build" || path === "/working-with-me") return abs(`${path}.md`);
  return abs(href);
}

/** The home page's share card (app/opengraph-image.tsx: its size, type and alt), for the pages that share it
 *  (/writing, /working-with-me). Named whole, so those pages send its size and alt like home does (3 Nov). */
export const HOME_CARD = { url: "/opengraph-image", width: 1200, height: 630, type: "image/png", alt: "Manveen Singh, GTM engineer" };
