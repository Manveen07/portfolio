import { resumeJson } from "@/lib/md/resume";
import { textResponse } from "@/lib/md/format";

// JSON Resume (jsonresume.org).
export const dynamic = "force-static";

export function GET() {
  return textResponse(JSON.stringify(resumeJson(), null, 2) + "\n", "application/json");
}
