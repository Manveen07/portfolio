// The day each page's words last changed, for the sitemap's lastmod and the JSON-LD's dateModified (3 Nov 2026, the
// AI-friendly audit: two pages were a day stale and one post still said its June publish date after a 31 Oct edit).
// data/page-dates.json keeps a date and a hash of the page's markdown copy for each page. A build reads it through
// lib/md/dates.ts; tests/ai.test.mjs fails when a page's words no longer match its hash, and `npm run page-dates`
// (after a build) writes today's date and the new hash for every page that changed.
// No "@/" imports: the tests and scripts/page-dates.mjs load this file with plain Node.

import { createHash } from "node:crypto";

export type PageDate = { date: string; hash: string };

/** The words a page's date follows: its markdown copy without a post's "More writing" list (a new post is not an
    edit to the old ones), with the site's address taken out (a SITE_URL test build hashes the same). */
export function pageHash(md: string, site: string): string {
  const cut = md.indexOf("\n\n---\n\n## More writing");
  const own = (cut < 0 ? md : md.slice(0, cut)).split(site).join("");
  return createHash("sha256").update(own).digest("hex").slice(0, 16);
}

/** Where `next build` writes a page's markdown copy, under .next/server/app/. */
export function bodyFile(path: string): string {
  if (path === "/") return "index.md.body";
  if (path.startsWith("/writing/")) return `md${path}.body`;
  return `${path.slice(1)}.md.body`;
}

/** The page's date if its words still match the saved hash; otherwise the build's own day, so a page whose words
    changed never shows an older date (and the test above fails until the file is refreshed). */
export function dateFor(dates: Record<string, PageDate>, path: string, md: string, site: string): string {
  const saved = dates[path];
  return saved && saved.hash === pageHash(md, site) ? saved.date : new Date().toISOString().slice(0, 10);
}
