import { llmsTxt } from "@/lib/md/llms";
import { textResponse } from "@/lib/md/format";

// The llms.txt file (llmstxt.org): Manveen's words on top, the rest generated. Static, like the home page (round 6).
export const dynamic = "force-static";

export function GET() {
  return textResponse(llmsTxt(), "text/plain");
}
