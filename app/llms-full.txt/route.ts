import { getPipeline } from "@/lib/pipeline";
import { llmsFullTxt } from "@/lib/md/llms";
import { textResponse } from "@/lib/md/format";

// Everything in one file: a convention beside the llms.txt spec, not part of it (see lib/md/llms.ts).
export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  return textResponse(llmsFullTxt(await getPipeline()), "text/plain");
}
