import { homeMarkdown } from "@/lib/md/home";
import { textResponse } from "@/lib/md/format";

// The home page as markdown, at the address llmstxt.org gives a site root: /index.md. Static since round 6 (2 Nov): the
// home page reads no run history.
export const dynamic = "force-static";

export function GET() {
  return textResponse(homeMarkdown(), "text/markdown");
}
