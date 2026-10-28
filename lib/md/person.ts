// The site's schema.org JSON-LD, for search engines and agents that read structured data. The home page is a
// ProfilePage about a Person, on a WebSite named after him (Google shows that name above results); each post is a
// BlogPosting by the same Person. The @ids tie them together across pages.
// Identity and links from the site (data/portfolio.ts), job title, skills and school from the resume (data/resume.ts).

import { ME, HERO, PHOTO } from "@/data/portfolio";
import { RESUME } from "@/data/resume";
import type { Post } from "@/data/posts";
import { abs } from "@/lib/site";

const PERSON_ID = abs("/#person");
const SITE_ID = abs("/#website");

/** The home page's graph: ProfilePage, its Person and the WebSite. */
export function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "ProfilePage", url: abs("/"), mainEntity: { "@id": PERSON_ID }, isPartOf: { "@id": SITE_ID } },
      person(),
      { "@type": "WebSite", "@id": SITE_ID, url: abs("/"), name: ME.name, alternateName: "manveen.me" },
    ],
  };
}

/** Who this is. The description is the paragraph under the hero, word for word. */
function person() {
  const [locality, country] = ME.location.split(",").map((s) => s.trim());
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: ME.name,
    jobTitle: RESUME.role,
    description: HERO.how[0],
    url: abs("/"),
    email: `mailto:${ME.email}`,
    ...(PHOTO ? { image: abs(PHOTO.src) } : {}),
    address: { "@type": "PostalAddress", addressLocality: locality, addressCountry: country },
    sameAs: [ME.linkedin, ME.github],
    knowsAbout: RESUME.skills.flatMap((s) => s.keywords),
    alumniOf: RESUME.education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.school })),
  };
}

/** A post as a BlogPosting. Its image is the post's own share card (app/writing/[slug]/opengraph-image.tsx). */
export function postJsonLd(post: Post) {
  const url = abs(`/writing/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    url,
    mainEntityOfPage: url,
    image: `${url}/opengraph-image`,
    inLanguage: "en",
    keywords: post.tags,
    author: { "@type": "Person", "@id": PERSON_ID, name: ME.name, url: abs("/") },
  };
}
