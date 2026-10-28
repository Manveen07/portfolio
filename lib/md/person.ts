// The site's schema.org JSON-LD: who this is (the home page's Person), and each post as a BlogPosting written by
// that Person, for search engines and agents that read structured data. The Person's @id ties the two together.
// Identity and links from the site (data/portfolio.ts), job title, skills and school from the resume (data/resume.ts).

import { ME, PHOTO } from "@/data/portfolio";
import { RESUME } from "@/data/resume";
import type { Post } from "@/data/posts";
import { abs } from "@/lib/site";

const PERSON_ID = abs("/#person");

export function personJsonLd() {
  const [locality, country] = ME.location.split(",").map((s) => s.trim());
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: ME.name,
    jobTitle: RESUME.role,
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
