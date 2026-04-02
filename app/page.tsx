import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import CaseStudies from "@/components/CaseStudies";
import FutureVision from "@/components/FutureVision";
import Contact from "@/components/Contact";
import SectionConnector from "@/components/SectionConnector";

export default function Home() {
  return (
    <>
      <Hero />
      <SectionConnector />
      <About />
      <SectionConnector variant="glow" />
      <Experience />
      <SectionConnector />
      <Skills />
      <SectionConnector variant="glow" />
      <CaseStudies />
      <SectionConnector />
      <FutureVision />
      <SectionConnector variant="glow" />
      <Contact />
    </>
  );
}
