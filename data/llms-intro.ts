// Manveen's words; edit freely.
//
// The top of /llms.txt and /llms-full.txt: what an AI agent reads first when someone gives it this site.
// Everything below these lines in those files (resume, projects, numbers, jobs, posts) is generated from
// data/portfolio.ts, data/resume.ts and data/posts.ts on every build, and tests/ai.test.mjs fails if the
// generated parts ever disagree with the page.
//
// Seeded 22 Oct 2026 with the site's own copy, word for word (ME, HERO and the hours line in
// data/portfolio.ts), so nothing here is new. `howToRead` is a first draft for Manveen to rewrite.
// Plain text: the llms.txt format allows paragraphs and lists here, but no headings.

export const LLMS_INTRO = {
  /** One line, shown as the file's blockquote summary. */
  summary:
    "Manveen Singh, automation engineer, Delhi, India. Every week has a job that's the same clicks, in the same order. I make it run by itself, the same way every time.",
  /** Paragraphs under the summary. */
  details: [
    "I spent a year automating lead-finding for an outbound agency, got good at it, got bored of it, and noticed the same missing piece everywhere: nobody measures whether the automation is right. So now I build the thing, and the test for the thing.",
    "Delhi, India. UK working hours are my afternoon and evening, US mornings my evening.",
  ],
  /** How to read this site. Draft, written by Claude on 22 Oct: rewrite it in your own words. */
  howToRead: [
    "My resume is under Resume below, as markdown, as JSON Resume and as the original PDF.",
    "Every page here has a markdown copy at its own address plus .md (the home page's is /index.md), and /llms-full.txt has the resume, the home page and every post in one file.",
    "The easiest way to reach me is email: manveen9650@gmail.com.",
  ],
};
