import Hero from "@/components/Hero";
import Proof from "@/components/Proof";
import About from "@/components/About";
import Work from "@/components/Work";
import Writing from "@/components/Writing";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="belt" style={{ margin: "clamp(16px, 1.4vw, 28px) var(--gutter) 0" }} />
      <Proof />
      <About />
      <div className="belt" style={{ margin: "clamp(16px, 1.4vw, 28px) var(--gutter) 0" }} />
      <Work />
      <Writing />
      <div className="belt" style={{ margin: "clamp(16px, 1.4vw, 28px) var(--gutter) 0" }} />
      <Contact />
    </>
  );
}
