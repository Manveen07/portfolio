// Small markdown helpers for the generated copies (/index.md, /resume.md, posts, llms.txt).

export const para = (s: string) => s.trim();
export const list = (items: string[]) => items.map((i) => `- ${i}`).join("\n");
export const link = (text: string, href: string) => `[${text.replace(/([[\]])/g, "\\$1")}](${href})`;
export const image = (alt: string, src: string) => `![${alt.replace(/([[\]])/g, "\\$1")}](${src})`;

/** A Response with a text body and its content type. Markdown copies say they are markdown (llmstxt.org). */
export function textResponse(body: string, type: "text/markdown" | "text/plain" | "application/json"): Response {
  return new Response(body, { headers: { "Content-Type": `${type}; charset=utf-8` } });
}

/** "14 June 2026" from "2026-06-14", as the writing pages show it. */
export function fmtLongDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
