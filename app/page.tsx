import Hero from "@/components/Hero";
import { getPipeline } from "@/lib/pipeline";

// The proof panel is re-read from GitHub at most once an hour.
export const revalidate = 3600;
import Proof from "@/components/Proof";
import About from "@/components/About";
import Work from "@/components/Work";
import Incidents from "@/components/Incidents";
import Writing from "@/components/Writing";
import Contact from "@/components/Contact";

export default async function Home() {
  const pipe = await getPipeline();
  return (
    <>
      <Hero />
      <div className="belt" style={{ margin: "clamp(16px, 1.4vw, 28px) var(--gutter) 0" }} />
      <Proof pipe={pipe} />
      <About />
      <div className="belt" style={{ margin: "clamp(16px, 1.4vw, 28px) var(--gutter) 0" }} />
      <Work />
      <Incidents />
      <Writing />
      <div className="belt" style={{ margin: "clamp(16px, 1.4vw, 28px) var(--gutter) 0" }} />
      <Contact />
    </>
  );
}
