import Hero from "@/components/Hero";
import ProofCard from "@/components/ProofCard";
import OwnCheck from "@/components/OwnCheck";
import Work from "@/components/Work";
import Writing from "@/components/Writing";
import Contact from "@/components/Contact";
import type { Metadata } from "next";
import { homeJsonLd, ldJson } from "@/lib/md/person";
import { PROOF, HOME_CARDS, HOME_BAND, HOME_OWN_BAND, HOME_OWN_CARDS } from "@/data/proof";

// The page's canonical address (one URL per page for search engines) and its markdown copy, for AI agents (llmstxt.org).
export const metadata: Metadata = { alternates: { canonical: "/", types: { "text/markdown": "/index.md" } } };

// Order (2 Nov, verify loop round 2, from the round 1 readers: all 4 stopped at or before Work): the hero, the held-list
// card, the jobs, his own projects' two cards, Tender Radar, the newest writing, then Say hi. Round 3: his own projects'
// cards are a line each with the card behind a click, and Say hi no longer holds the pilot (its own page,
// /working-with-me). Round 4: Built on my own (PresentAI) is off the home page. Round 6 (2 Nov): Tender Radar is off the
// home page (components/Proof.tsx says why), so the page reads no run history and is fully static.
export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldJson(homeJsonLd()) }} />
      <Hero />
      <section id="proof-cards" className="wrap sec">
        <h2 className="kicker">{HOME_BAND.kicker}</h2>
        {HOME_CARDS.map((slug) => (
          <ProofCard key={slug} c={PROOF[slug]} density="compact" level={3} />
        ))}
      </section>
      <Work />
      <section id={HOME_OWN_BAND.id} className="wrap sec">
        <h2 className="kicker">{HOME_OWN_BAND.kicker}</h2>
        {HOME_OWN_CARDS.map((slug) => (
          <OwnCheck key={slug} c={PROOF[slug]} />
        ))}
      </section>
      <Writing />
      <Contact />
    </>
  );
}
