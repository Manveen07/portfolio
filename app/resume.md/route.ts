import { resumeMarkdown } from "@/lib/md/resume";
import { textResponse } from "@/lib/md/format";

export const dynamic = "force-static";

export function GET() {
  return textResponse(resumeMarkdown(), "text/markdown");
}
