import { writingMarkdown } from "@/lib/md/posts";
import { textResponse } from "@/lib/md/format";

export const dynamic = "force-static";

export function GET() {
  return textResponse(writingMarkdown(), "text/markdown");
}
