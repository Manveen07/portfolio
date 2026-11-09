import type { NextConfig } from "next";
import { SITE } from "./lib/site";

/** Each page and the route that serves its markdown copy. A post's slug has no dot, so /writing/<slug>.md is the rule
    above it, never this one. */
const MARKDOWN_COPIES: [string, string][] = [
  ["/", "/index.md"],
  ["/writing", "/writing.md"],
  ["/how-i-build", "/how-i-build.md"],
  ["/working-with-me", "/working-with-me.md"],
  ["/writing/:slug([a-z0-9-]+)", "/md/writing/:slug"],
];

const nextConfig: NextConfig = {
  // Speed, tried 22 Oct and measured with Lighthouse (mobile, 3 to 8 runs each), none kept:
  // - experimental.inlineCss: first paint 0.94 s to 1.07 s; the CSS rode along in every page and prefetch.
  // - AVIF (images.formats): the photo grew from 19.6 KiB (WebP) to 21.1 KiB; the source is only 264px wide.
  // - Plex Mono not preloaded (app/layout.tsx): first paint 0.91 s to 1.22 s, in all 8 runs.
  // - content-visibility: auto on sections below the first screen: LCP within run-to-run noise.
  // - 9 Nov: a modern "browserslist" (chrome 92, safari 15.4 and up, for Lighthouse's legacy-JavaScript flag): script
  //   159 to 160 KiB, /how-i-build median score 90 to 91 and TBT 269 to 231 ms over 3 runs each, inside the run-to-run
  //   spread (TBT 140 to 454 ms on one build); this Next 16 build ships the same runtime either way.
  // What is left is React and the Next router (about 130 of the page's 138 KiB of script), the Archivo font
  // and the photo, all needed for the page to look the way it does.
  async rewrites() {
    // A post's markdown copy lives at its own address plus .md (llmstxt.org). A route segment can't be
    // "[slug].md", so app/md/writing/[slug]/route.ts serves it. beforeFiles: ahead of the /writing/[slug] page.
    // 3 Nov (the AI-friendly audit): an agent that asks a page for markdown (an Accept header naming text/markdown, as
    // Claude Code sends on every fetch, checked that day) gets the page's markdown copy at the page's own address;
    // the pattern is Vercel's (blog, 3 Feb 2026, "Making agent-friendly pages with content negotiation"). A browser
    // never names text/markdown, so it gets the page. The copy says everything the page says, the words inside
    // closed clicks and drawings included, which an HTML-to-text tool can lose.
    const wantsMarkdown = [{ type: "header" as const, key: "accept", value: "(.*)text/markdown(.*)" }];
    return {
      beforeFiles: [
        { source: "/writing/:slug.md", destination: "/md/writing/:slug" },
        ...MARKDOWN_COPIES.map(([source, destination]) => ({ source, has: wantsMarkdown, destination })),
      ],
      afterFiles: [],
      fallback: [],
    };
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
      { source: "/how-i-build.md", headers: copyOf("/how-i-build") },
      { source: "/working-with-me.md", headers: copyOf("/working-with-me") },
      { source: "/writing/:slug.md", headers: copyOf("/writing/:slug") },
      // 3 Nov: the resume's markdown is the text of the PDF, so the PDF is its canonical, as each page is its copy's.
      { source: "/resume.md", headers: copyOf("/resume.pdf") },
      // A page's answer depends on the Accept header now, so a shared cache must key on it too (3 Nov). Checked with
      // `next start`: the markdown answer carries "Vary: Accept" beside Next's own Vary, so no cache hands it to a
      // browser; on the HTML answer Next's Vary (rsc, ...) replaces this one, which at worst gives an agent the page.
      ...MARKDOWN_COPIES.map(([source]) => ({ source, headers: [{ key: "Vary", value: "Accept" }] })),
    ];
  },
};

export default nextConfig;
