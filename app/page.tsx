import Hero from "@/components/Hero";
import Proof from "@/components/Proof";
import Work from "@/components/Work";
import Drawings from "@/components/Drawings";
import Wrong from "@/components/Wrong";
import Contact from "@/components/Contact";
import { getPipeline } from "@/lib/pipeline";

// The run history is re-read from GitHub at most once an hour.
export const revalidate = 3600;

export default async function Home() {
  const pipe = await getPipeline();
  return (
    <>
      <Hero />
      <Proof pipe={pipe} />
      <Work />
      <Drawings />
      <Wrong />
      <Contact />
    </>
  );
}
