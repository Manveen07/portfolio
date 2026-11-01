import Hero from "@/components/Hero";
import Proof from "@/components/Proof";
import ProofCard from "@/components/ProofCard";
import Work from "@/components/Work";
import Writing from "@/components/Writing";
import Contact from "@/components/Contact";
import type { Metadata } from "next";
import { getPipeline } from "@/lib/pipeline";
import { homeJsonLd } from "@/lib/md/person";
import { PROOF, HOME_CARDS, HOME_BAND } from "@/data/proof";

// The page's canonical address (one URL per page for search engines) and its markdown copy, for AI agents (llmstxt.org).
export const metadata: Metadata = { alternates: { canonical: "/", types: { "text/markdown": "/index.md" } } };

// The run history is re-read from GitHub at most once an hour.
export const revalidate = 3600;

export default async function Home() {
  const pipe = await getPipeline();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd()).replace(/</g, "\\u003c") }}
      />
      <Hero />
      {/* 1 Nov: three proof cards right under the hero, so the AI checks are the first proof a reader meets. */}
      <section id="proof-cards" className="wrap sec">
        <h2 className="kicker">{HOME_BAND.kicker}</h2>
        {HOME_CARDS.map((slug) => (
          <ProofCard key={slug} c={PROOF[slug]} density="compact" level={3} />
        ))}
      </section>
      <Proof pipe={pipe} />
      <Work />
      <Writing />
      <Contact />
    </>
  );
}
