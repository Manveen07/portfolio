import type { MetadataRoute } from "next";
import { abs } from "@/lib/site";

// Every crawler is welcome, AI crawlers included (GPTBot, ClaudeBot, PerplexityBot, Google-Extended and the
// rest all fall under "*"): the point of this site is to be read. llms.txt is the guide for agents.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: abs("/sitemap.xml"),
  };
}
