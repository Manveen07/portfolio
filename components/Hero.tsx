import Image from "next/image";
import { ME, HERO, HERO_KICKER, PHOTO } from "@/data/portfolio";
import { HOME_BAND } from "@/data/proof";

export default function Hero() {
  return (
    <section id="top" className="wrap sec hero">
      <div className="hero-head">
        {PHOTO && (
          // 176px wide at every width (.photo in globals.css), so the browser picks the smallest file that is sharp.
          // priority: it is the largest thing in the first screen, so it is fetched first; every other image is lazy.
          <Image className="photo" src={PHOTO.src} alt={PHOTO.alt} width={PHOTO.width} height={PHOTO.height} sizes="176px" priority />
        )}
        {/* The role, then the AI edge as the h1 (2 Nov, verify loop round 2: the /how-i-build h1). The week's story and
            its sketch moved to "How working with me goes", its own page since round 3 (/working-with-me). */}
        <p className="kicker hero-kicker">{HERO_KICKER}</p>
        <h1>{HERO.headline}</h1>
      </div>
      {HERO.how.map((line) => (
        <p key={line} className="body">
          {line}
        </p>
      ))}
      <p className="links hero-links">
        <a href={HOME_BAND.link.href}>{HOME_BAND.link.label}</a>
      </p>
      <p className="small">{ME.hours}</p>
    </section>
  );
}
