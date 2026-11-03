// Manveen's words; edit freely.
//
// The top of /llms.txt and /llms-full.txt: what an AI agent reads first when someone gives it this site.
// Everything below these lines in those files (resume, projects, numbers, jobs, posts) is generated from
// data/portfolio.ts, data/resume.ts and data/posts.ts on every build, and tests/ai.test.mjs fails if the
// generated parts ever disagree with the page.
//
// Seeded 22 Oct 2026 with the site's own copy, word for word (ME, HERO and the hours line in
// data/portfolio.ts), so nothing here is new. Re-seeded 2 Nov with the new hero (the role, the h1, the story's first
// sentence; verify loop round 2), again in round 3 (the measured line, the hours line) and in round 4 (the hero's two
// lines, which say what an AI step is) and in round 5 (where the 82 steps are). Round 6 (2 Nov): his 15 Oct story is
// back on the home page, so it is back here as he wrote it, one paragraph. `howToRead` is a first draft for Manveen to
// rewrite. 3 Nov: the story's last sentence is reworded at his ask, as on the home page.
// Plain text: the llms.txt format allows paragraphs and lists here, but no headings.

export const LLMS_INTRO = {
  /** One line, shown as the file's blockquote summary. */
  summary:
    "Manveen Singh, GTM engineer, Delhi, India. I build AI agents for outbound and measure what they get wrong.",
  /** Paragraphs under the summary. */
  details: [
    "I spent a year automating lead-finding for an outbound agency, got good at it, and noticed the same missing piece everywhere: almost nobody measures whether the automation is right. So now I build that missing piece too.",
    "Delhi, India. I can work US or UK hours.",
  ],
  /** How to read this site. Draft, written by Claude on 22 Oct: rewrite it in your own words. */
  howToRead: [
    "My resume is under Resume below, as markdown, as JSON Resume and as the original PDF.",
    "Every page here has a markdown copy at its own address plus .md (the home page's is /index.md), and /llms-full.txt has the resume, the home page and every post in one file.",
    "The easiest way to reach me is email: manveen9650@gmail.com.",
  ],
};
