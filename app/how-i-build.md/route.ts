import { howMarkdown } from "@/lib/md/how";
import { textResponse } from "@/lib/md/format";

// The page /how-i-build as markdown (llmstxt.org: a page's copy at its own address plus .md).
export const dynamic = "force-static";

export function GET() {
  return textResponse(howMarkdown(), "text/markdown");
}
