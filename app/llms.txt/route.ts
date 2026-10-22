import { getPipeline } from "@/lib/pipeline";
import { llmsTxt } from "@/lib/md/llms";
import { textResponse } from "@/lib/md/format";

// The llms.txt file (llmstxt.org): Manveen's words on top, the rest generated. Same hourly refresh as the home page.
export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  return textResponse(llmsTxt(await getPipeline()), "text/plain");
}
