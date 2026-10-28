import type { NextConfig } from "next";
import { SITE } from "./lib/site";

const nextConfig: NextConfig = {
  // Speed, tried 22 Oct and measured with Lighthouse (mobile, 3 to 8 runs each), none kept:
  // - experimental.inlineCss: first paint 0.94 s to 1.07 s; the CSS rode along in every page and prefetch.
  // - AVIF (images.formats): the photo grew from 19.6 KiB (WebP) to 21.1 KiB; the source is only 264px wide.
  // - Plex Mono not preloaded (app/layout.tsx): first paint 0.91 s to 1.22 s, in all 8 runs.
  // - content-visibility: auto on sections below the first screen: LCP within run-to-run noise.
  // What is left is React and the Next router (about 130 of the page's 138 KiB of script), the Archivo font
  // and the photo, all needed for the page to look the way it does.
  async rewrites() {
    // A post's markdown copy lives at its own address plus .md (llmstxt.org). A route segment can't be
    // "[slug].md", so app/md/writing/[slug]/route.ts serves it. beforeFiles: ahead of the /writing/[slug] page.
    return { beforeFiles: [{ source: "/writing/:slug.md", destination: "/md/writing/:slug" }], afterFiles: [], fallback: [] };
  },
  async headers() {
    // Every response, the markdown files included, points to the llms.txt that describes it (llmstxt.org's
    // Link header form; the HTML pages also carry it as a <link> in the head).
    // A page's markdown copy also names the page as canonical, so search engines index the page, not its copy
    // (Google: the rel="canonical" HTTP header is the way for non-HTML files). The last rule matching a path sets
    // its Link header, so the copies' rules repeat describedby.
    const describedby = '</llms.txt>; rel="describedby"; type="text/plain"';
    const copyOf = (page: string) => [{ key: "Link", value: `${describedby}, <${SITE}${page}>; rel="canonical"` }];
    return [
      { source: "/:path*", headers: [{ key: "Link", value: describedby }] },
      { source: "/index.md", headers: copyOf("/") },
      { source: "/writing.md", headers: copyOf("/writing") },
      { source: "/writing/:slug.md", headers: copyOf("/writing/:slug") },
    ];
  },
};

export default nextConfig;
