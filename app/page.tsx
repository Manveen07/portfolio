import Hero from "@/components/Hero";
import Proof from "@/components/Proof";
import Work from "@/components/Work";
import Writing from "@/components/Writing";
import Contact from "@/components/Contact";
import type { Metadata } from "next";
import { getPipeline } from "@/lib/pipeline";
import { personJsonLd } from "@/lib/md/person";

// The page's markdown copy, for AI agents (llmstxt.org).
export const metadata: Metadata = { alternates: { types: { "text/markdown": "/index.md" } } };

// The run history is re-read from GitHub at most once an hour.
export const revalidate = 3600;

export default async function Home() {
  const pipe = await getPipeline();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()).replace(/</g, "\\u003c") }}
      />
      <Hero />
      <Proof pipe={pipe} />
      <Work />
      <Writing />
      <Contact />
    </>
  );
}
