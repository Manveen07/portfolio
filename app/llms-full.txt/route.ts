import { llmsFullTxt } from "@/lib/md/llms";
import { textResponse } from "@/lib/md/format";

// Everything in one file: a convention beside the llms.txt spec, not part of it (see lib/md/llms.ts). Static (round 6).
export const dynamic = "force-static";

export function GET() {
  return textResponse(llmsFullTxt(), "text/plain");
}
