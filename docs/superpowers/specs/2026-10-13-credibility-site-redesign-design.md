# manveen.me redesign: a credibility site that sounds like me

Date: 13 Oct 2026. Branch: `redesign-red-pen`. Status: design approved in chat, this document awaiting review.

## 1. Why

Someone called the current site AI slop. They were right about the look: a fake boot screen, serial-number labels, hazard stripes, slogans and an easter egg are a costume, and a costume that isn't you reads as generated. The content is the opposite. The live run history, the measured numbers, the incident log and the eval post are real and specific. This redesign keeps the content, removes the costume, and adds the one thing the site never had: someone other than me saying I'm good.

## 2. Who it's for and what "done" means

- **Reader:** a business owner who clicked the link in my cold email (UK or US trades, distributors, small firms), most likely on a phone, deciding in under a minute whether I'm a real person who has done this before.
- **Second reader (footer only):** recruiters and hiring managers. They get resume, LinkedIn and GitHub links, not a section.
- **Done means:**
  1. A stranger can tell within 10 seconds who I help and what changes for them.
  2. Every number and claim on the page can be traced to a source, and a skeptic can't catch any of it out.
  3. It reads like me: curious, quiet, a bit nerdy, never salesy.
  4. Booking a call is one tap from the top and one tap from the bottom.

## 3. Decisions and why

| Decision | Why |
|---|---|
| Built for business owners, recruiters in the footer | One page, one job. Serving both made each weaker. |
| Strip and rebuild in the same app (not a template, not a copy-only patch) | The slop is the costume; deleting it costs about the same as patching around it, and the content is already sourced. |
| Look: "Red pen" (paper, black ink, one red, notes in the margin) | Chosen from 3 mockups based on my own taste (Hunter x Hunter breakdown videos, Sekiro, Doom, The Weeknd). Quiet like me; the red pen shows the obsessive "here's exactly how it works" side without shouting. |
| Zackary Beckham's letter as the social proof | Signed, dated, from a COO. Quote two lines, not the whole letter. |
| Caprae dates and title follow the letter: Machine Learning Intern, 1 Aug 2025 to 11 Jan 2026 | The current site says "Jun to Dec 2025, AI/ML engineer". A prospect who sees the letter would notice. |
| Precise Leads appears as one line of job history only | My 8 Oct rule keeps agency results out of freelance work. One line still answers "what does he do now?" |
| The incident log stays, in a quieter form | Curious and obsessed is who I am; the failures written up are proof of that. |
| The "watch one do the work" demo video goes | It runs on demo data. Made-up data on a proof page undercuts everything else. |
| "7 companies served" becomes "sorts for 7 trades" | Checked 13 Oct: the 7 rows in Tender Radar's daily summary are trades (catering, cleaning, electrical testing, grounds, pest, product cleaning, security), not companies. |
| No claim that Tender Radar emails anyone | The current site says it emails each company a short list. The daily summary shows no digest sent for any trade, so the claim comes off unless I show evidence it's true. |
| "It broke once" becomes "its worst stretch" | GitHub shows it also failed on 3, 6, 13 and 19 July. The long outage (21 Jul to 11 Aug) is real. |

## 4. The page, top to bottom

1. **Me.** Photo, name, the problem-first line (section 5a), the "how I pick problems" lines under it, time zone line (Delhi, works UK mornings and US evenings), one "Book a call" button.
2. **Running right now: Tender Radar.** What it does in two plain sentences. The run count (114 as of 13 Oct, read live), a bar per morning for the last 40 runs, the 3-minute Loom, the code link. Its worst stretch (21 Jul to 11 Aug) in one plain sentence. "Sorts for 7 trades" and the notices-read count. A red-pen note on the number.
3. **What people say.** Zackary's quote with name, title and company, and "full signed letter available on request" (the PDF is not published: it contains his email address). Then job history: Caprae (dates and title from the letter), Precise Leads as one line, B.Tech CS, MSIT Delhi, 2026.
4. **Other work, three at most.** Resume screening at Caprae (10h to 3h a week), PresentAI (live, try it), leadlens (links to the post on how I tested it).
5. **What broke.** The 4 real incidents, each with a red-pen "what I changed". Dated from the projects' own records, as now.
6. **How working with me goes.** Opens with: "On the first call you tell me what wastes the most time. If it isn't a real problem, I'll say so and we won't build it." Then the fixed-price pilot on a month of their real requests, quoted before work starts, every miss logged and shown to them, then a monthly retainer. "Book a call" and email.
7. **Footer.** My "Right now" line (what I'm watching, playing, listening to). Resume, LinkedIn, GitHub, writing.

Removed: boot screen, background effects (`Ambient`), easter eggs and console message (`Easter`), numbered nav, hazard-stripe dividers, serial-number labels, the slogan hero, the "Origin story" plates, the writing section on the home page (it moves to a footer link), the demo-data video and its files.

## 5. Voice: it has to sound like me

The words matter more than the design. Rules, taken from my own `client-hunting/VOICE-RULES.md` plus what I asked for on 13 Oct:

- **Read it out loud.** If I wouldn't say it to someone across a table, it goes.
- **Not salesy.** No promises about transforming their business, no urgency, no "solutions", no repeated pitches. "Book a call" sits at the top (header and first screen) and at the bottom, nowhere in between.
- **Curious.** Each project is told as what I wondered, what I tried, what happened. Not as a feature list.
- **A bit nerdy, explained plainly.** One specific technical detail per project that an outsider can still follow, for example the bug where "guard" matched inside "safeguarding", or the test that was leaking its own answers. The red-pen margin notes are where these asides live.
- **Plain words, short sentences, contractions.** No em or en dashes. None of: leverage, utilise, streamline, optimise, robust, seamless, cutting-edge, AI-powered, solution.
- **No slogans, no one-line dramatic closers, no lines about how honest I am.** Show the failures and the lower score; don't say "honest" about them.
- **Built from my own words.** I answer the prompts in section 9 by voice note or typing, and the copy is shaped from my sentences, keeping my phrasing. Then a humanizer pass, then I read every line out loud and cut anything that isn't me.

### 5a. Lines already in my own words (13 Oct, keep the phrasing)

Hero, problem first (I chose this over a "personal first" version because I like starting from the problem):

> Your tools don't talk to each other, so someone on your team copies things between them. I connect them so it happens on its own, the same way every time.

How I pick problems (my answer, grammar tidied only):

> I start with the problem that wastes the most of your time. I don't automate things that aren't anyone's problem. The ones worth fixing are usually messy. That's why they're not automatic yet, and that's why they're problems.

Red-pen margin note beside "the same way every time": *nerd word for this: deterministic. Same input, same result, every time.*

Words to avoid when describing the work: "better outcomes" (vague), "reduce manpower" (owners hear "fire people", staff hear "replace me"). Say "so your team stops doing the copy-paste part".

## 6. The look

- Paper background, black text, one red (the pen). Two fonts: Archivo for text, IBM Plex Mono for the red notes and small labels.
- The red pen only points at proof: a circle on a number, an underline on the line of the quote that matters, a short margin note. One or two marks per section at most.
- Phone: notes sit beside or under what they point at. Desktop: same single column, wider, notes in the right-hand margin.
- Run chart: black bars for good runs, red for failed ones.
- Motion: pen marks draw themselves once when scrolled into view; nothing else moves. Off when the device asks for reduced motion.
- The `/writing` pages, the 404 page and the link-preview image (`app/opengraph-image.tsx`) get the same look. The link preview matters: it's the first thing a prospect sees when my link shows up in an email or on LinkedIn.

## 7. What changes in the code

- **Delete:** `components/BootOverlay.tsx`, `components/Ambient.tsx`, `components/Easter.tsx`, the costume CSS in `app/globals.css`, `public/operator-demo.mp4` and `public/operator-demo.jpg`.
- **Rewrite:** `Hero`, `Proof`, `About` (becomes "what people say" plus job history), `Work`, `Incidents`, `Contact`, `Nav`, `Footer`, `app/page.tsx`, `app/layout.tsx` (fonts, metadata), `app/globals.css`, `app/not-found.tsx`, `app/opengraph-image.tsx`, the `/writing` pages' styling. `components/Writing.tsx` goes from the home page.
- **Data (`data/portfolio.ts`):** Caprae dates and title; the quote; "sorts for 7 trades"; the Precise Leads line; the "Right now" line; all copy rewritten per section 5.
- **Metadata:** the description still mentions "quote intake" (dropped from the work in September) and the share text is the old slogan. Both rewritten.
- **Live chart:**
  - The site falls back to the snapshot saved on 7 Sep because the live GitHub read isn't working in production, so it shows "78 mornings, last run 7 Sep" while the job has actually run 114 times, most recently today.
  - Proper fix: a new fine-grained GitHub token (Actions: read, Contents: read on `Manveen07/new-10x-engineer`) saved as `GITHUB_TOKEN` in Vercel. I do this with step-by-step clicks.
  - Meanwhile: `npm run refresh-snapshot` so the fallback reads 114.

## 8. Checks before I see it

1. `npm run build` and `npm run lint` pass.
2. Skeptic pass: a table of every number and claim on the page with its source (GitHub API, the letter, `CONTENT-PACK-2026-09-04.md`, the Loom, live links). Anything without a source comes off.
3. Stale-claim pass: anything with a date in it is checked against today. Known one: the leadlens card says "deploying Sep 2026", which is already in the past.
4. Screenshots at phone size and desktop size, in the preview panel.
5. Reduced-motion check, and a page-speed check on the preview link.
6. The copy passes section 5, and I've read it out loud.

## 9. What I need to give

- **1 to 3 photos of me.** Plain, decent light, my face. Not a studio shot.
- **Zackary's OK** to quote two lines on the site.
- **The GitHub token in Vercel** (guided).
- **Answers in my own words**, by voice note or typing, a few sentences each:
  1. Explain Tender Radar to a friend who has never heard of a tender.
  2. The bug I'm proudest of catching, and how I found it.
  3. What's the fun part of this work for me? (Partly answered 13 Oct: solving real problems, see 5a.)
  4. What I'd say in the first minute of a call with a business owner.
  5. What I'm watching, playing and listening to right now.

## 10. Not in this redesign

New projects, rewriting the blog post (restyled only), a CMS, analytics, a pricing page, testimonials I don't have yet. When the first pilot finishes, its testimonial and before/after hours go into section 3; that's a later change.

## 11. Going live

All work stays on `redesign-red-pen`. I review it locally first. Pushing the branch, and merging to `master` (which deploys to manveen.me), each happen only when I say so.
