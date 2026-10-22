import { getPipeline } from "@/lib/pipeline";
import { homeMarkdown } from "@/lib/md/home";
import { textResponse } from "@/lib/md/format";

// The home page as markdown, at the address llmstxt.org gives a site root: /index.md.
export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  return textResponse(homeMarkdown(await getPipeline()), "text/markdown");
}
