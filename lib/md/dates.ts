// When a page's words last changed (lib/page-dates.ts says how): one source for the sitemap's lastmod, the pages'
// JSON-LD dateModified and a post's article:modified_time.

import DATES from "@/data/page-dates.json";
import { getPost } from "@/data/posts";
import { SITE } from "@/lib/site";
import { dateFor, type PageDate } from "@/lib/page-dates";
import { homeMarkdown } from "@/lib/md/home";
import { howMarkdown } from "@/lib/md/how";
import { workingMarkdown } from "@/lib/md/working";
import { postMarkdown, writingMarkdown } from "@/lib/md/posts";

const PAGES: Record<string, () => string> = {
  "/": homeMarkdown,
  "/writing": writingMarkdown,
  "/how-i-build": howMarkdown,
  "/working-with-me": workingMarkdown,
};

/** The day the words at `path` (a page, or /writing/<slug>) last changed, as YYYY-MM-DD. */
export function modified(path: string): string {
  const post = path.startsWith("/writing/") ? getPost(path.slice("/writing/".length)) : undefined;
  const md = post ? postMarkdown(post) : PAGES[path]?.();
  if (md === undefined) throw new Error(`no markdown copy for ${path}`);
  return dateFor(DATES as Record<string, PageDate>, path, md, SITE);
}
