import { workingMarkdown } from "@/lib/md/working";
import { textResponse } from "@/lib/md/format";

// The page /working-with-me as markdown (llmstxt.org: a page's copy at its own address plus .md).
export const dynamic = "force-static";

export function GET() {
  return textResponse(workingMarkdown(), "text/markdown");
}
