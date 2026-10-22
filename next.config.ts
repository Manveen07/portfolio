import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // A post's markdown copy lives at its own address plus .md (llmstxt.org). A route segment can't be
    // "[slug].md", so app/md/writing/[slug]/route.ts serves it. beforeFiles: ahead of the /writing/[slug] page.
    return { beforeFiles: [{ source: "/writing/:slug.md", destination: "/md/writing/:slug" }], afterFiles: [], fallback: [] };
  },
  async headers() {
    // Every response, the markdown files included, points to the llms.txt that describes it (llmstxt.org's
    // Link header form; the HTML pages also carry it as a <link> in the head).
    return [{ source: "/:path*", headers: [{ key: "Link", value: '</llms.txt>; rel="describedby"; type="text/plain"' }] }];
  },
};

export default nextConfig;
