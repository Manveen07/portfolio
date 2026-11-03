import type { MetadataRoute } from "next";
import { POSTS } from "@/data/posts";
import { RESUME } from "@/data/resume";
import { abs } from "@/lib/site";
import { modified } from "@/lib/md/dates";

// The addresses a search result should open: every page and the resume PDF. Google reads every sitemap URL as a
// canonical, so the markdown copies, llms.txt and the resume as data stay out (until 28 Oct they were listed);
// agents find those through llms.txt and each page's <link rel="alternate">. No changefreq or priority: Google
// ignores both. Each lastmod is the day the page's words last changed (lib/page-dates.ts: a date kept beside a hash of
// the page's markdown copy, which a test holds to the build), so it moves when the words do; until 3 Nov two pages had
// hand-set dates that went a day stale, and a post edited on 31 Oct still said its June publish date.
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["/", "/writing", "/how-i-build", "/working-with-me", ...POSTS.map((p) => `/writing/${p.slug}`)];
  return [
    ...pages.map((p) => ({ url: abs(p), lastModified: modified(p) })),
    // The PDF's own creation date (tests/ai.test.mjs holds it to the file).
    { url: abs(RESUME.pdf), lastModified: RESUME.updated },
  ];
}
