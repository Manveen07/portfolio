import type { MetadataRoute } from "next";
import { POSTS } from "@/data/posts";
import { RESUME } from "@/data/resume";
import { abs } from "@/lib/site";

// Every page, its markdown copy, the llms.txt pair and the three resume files.
export default function sitemap(): MetadataRoute.Sitemap {
  const latest = POSTS.map((p) => p.date).sort().at(-1);
  return [
    { url: abs("/"), changeFrequency: "daily", priority: 1 },
    { url: abs("/index.md"), changeFrequency: "daily" },
    { url: abs("/writing"), lastModified: latest, changeFrequency: "monthly" },
    { url: abs("/writing.md"), lastModified: latest, changeFrequency: "monthly" },
    ...POSTS.flatMap((p) => [
      { url: abs(`/writing/${p.slug}`), lastModified: p.date },
      { url: abs(`/writing/${p.slug}.md`), lastModified: p.date },
    ]),
    { url: abs("/llms.txt"), changeFrequency: "daily" },
    { url: abs("/llms-full.txt"), changeFrequency: "daily" },
    ...[RESUME.pdf, "/resume.md", "/resume.json"].map((path) => ({ url: abs(path), lastModified: RESUME.updated })),
  ];
}
