// The home page's schema.org Person (JSON-LD): who this is, for search engines and agents that read structured data.
// Identity and links from the site (data/portfolio.ts), job title, skills and school from the resume (data/resume.ts).

import { ME, PHOTO } from "@/data/portfolio";
import { RESUME } from "@/data/resume";
import { abs } from "@/lib/site";

export function personJsonLd() {
  const [locality, country] = ME.location.split(",").map((s) => s.trim());
  return {
    "@context": "https://schema.org",
    "@type": "Person",
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
