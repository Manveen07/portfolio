// The site's schema.org JSON-LD, for search engines and agents that read structured data. The home page is a
// ProfilePage about a Person, on a WebSite named after him (Google shows that name above results); each post is a
// BlogPosting by the same Person, /writing is the Blog that lists them, and /how-i-build and /working-with-me are pages
// about him (3 Nov 2026: until then those three had no JSON-LD). The @ids tie them together across pages.
// Identity, job title and links from the site (data/portfolio.ts), so the markup says what the page shows (3 Nov: the
// job title was the resume's headline, which no page shows); skills, school and current employer from the resume
// (data/resume.ts). Every dateModified is the day the page's words last changed (lib/md/dates.ts).

import { ME, HERO, PHOTO } from "@/data/portfolio";
import { RESUME } from "@/data/resume";
import type { Post } from "@/data/posts";
import { abs } from "@/lib/site";
import { modified } from "@/lib/md/dates";

const PERSON_ID = abs("/#person");
const SITE_ID = abs("/#website");
/** The Person by reference, for the other pages: the @id resolves to the home page's full node. */
const PERSON = { "@type": "Person", "@id": PERSON_ID, name: ME.name, url: abs("/") };

/** The home page's graph: ProfilePage, its Person and the WebSite. */
export function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "ProfilePage", url: abs("/"), mainEntity: { "@id": PERSON_ID }, isPartOf: { "@id": SITE_ID }, dateModified: modified("/") },
      person(),
      { "@type": "WebSite", "@id": SITE_ID, url: abs("/"), name: ME.name, alternateName: "manveen.me", publisher: { "@id": PERSON_ID } },
    ],
  };
}

/** Who this is. The description is the hero's h1 and the lines under it, word for word; the employer is the resume's
    current job, which the home page's Work section names. */
function person() {
  const [locality] = ME.location.split(",").map((s) => s.trim());
  const current = RESUME.experience.find((j) => !j.end);
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: ME.name,
    jobTitle: ME.role,
    description: [HERO.headline, ...HERO.how].join(" "),
    url: abs("/"),
    email: `mailto:${ME.email}`,
    ...(PHOTO ? { image: abs(PHOTO.src) } : {}),
    // schema.org recommends the ISO 3166-1 code for the country, as /resume.json has it.
    address: { "@type": "PostalAddress", addressLocality: locality, addressCountry: "IN" },
    ...(current ? { worksFor: { "@type": "Organization", name: current.org } } : {}),
    sameAs: [ME.linkedin, ME.github],
    knowsAbout: RESUME.skills.flatMap((s) => s.keywords),
    alumniOf: RESUME.education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.school })),
  };
}

/** A page about him (/how-i-build, /working-with-me): its name and description are the page's own title and meta
    description. */
export function pageJsonLd(path: string, type: "AboutPage" | "WebPage", name: string, description: string) {
  const url = abs(path);
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": url,
    url,
    name,
    description,
    inLanguage: "en",
    about: PERSON,
    author: PERSON,
    isPartOf: { "@id": SITE_ID },
    dateModified: modified(path),
  };
}

/** /writing: the Blog and its posts, newest first. */
export function blogJsonLd(posts: Post[], description: string) {
  const url = abs("/writing");
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": url,
    url,
    name: `Writing | ${ME.name}`,
    description,
    inLanguage: "en",
    author: PERSON,
    isPartOf: { "@id": SITE_ID },
    dateModified: modified("/writing"),
    blogPost: posts.map((p) => ({ "@type": "BlogPosting", "@id": abs(`/writing/${p.slug}`), url: abs(`/writing/${p.slug}`), headline: p.title, datePublished: p.date })),
  };
}

/** A post as a BlogPosting. Its image is the post's own share card (app/writing/[slug]/opengraph-image.tsx). */
export function postJsonLd(post: Post) {
  const url = abs(`/writing/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": url,
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    dateModified: modified(`/writing/${post.slug}`),
    url,
    mainEntityOfPage: url,
    image: `${url}/opengraph-image`,
    inLanguage: "en",
    keywords: post.tags,
    author: PERSON,
    isPartOf: { "@id": SITE_ID },
  };
}

/** A JSON-LD object as a <script> body: "<" escaped so no string can close the tag. */
export const ldJson = (data: object) => JSON.stringify(data).replace(/</g, "\\u003c");
