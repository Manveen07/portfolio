import { POSTS, getPost } from "@/data/posts";
import { postMarkdown } from "@/lib/md/posts";
import { textResponse } from "@/lib/md/format";

// A post as markdown. Its public address is /writing/<slug>.md: next.config.ts rewrites that here,
// because a route segment can't be "[slug].md".
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  if (!post) return new Response("Not found\n", { status: 404 });
  return textResponse(postMarkdown(post), "text/markdown");
}
