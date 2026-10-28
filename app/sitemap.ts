import type { MetadataRoute } from "next";
import { POSTS } from "@/data/posts";
import { RESUME } from "@/data/resume";
import { abs } from "@/lib/site";

// The addresses a search result should open: every page and the resume PDF. Google reads every sitemap URL as a
// canonical, so the markdown copies, llms.txt and the resume as data stay out (until 28 Oct they were listed);
// agents find those through llms.txt and each page's <link rel="alternate">. No changefreq or priority: Google
// ignores both. The home page has no lastmod: its run count changes every morning, which isn't a content change.
export default function sitemap(): MetadataRoute.Sitemap {
  const latest = POSTS.map((p) => p.date).sort().at(-1);
  return [
    { url: abs("/") },
    { url: abs("/writing"), lastModified: latest },
    ...POSTS.map((p) => ({ url: abs(`/writing/${p.slug}`), lastModified: p.date })),
    { url: abs(RESUME.pdf), lastModified: RESUME.updated },
  ];
}
