import Image from "next/image";
import { ME, HERO, PHOTO } from "@/data/portfolio";
import Annotated from "@/components/Annotated";
import { Underline } from "@/components/Pen";
import WeekSketch from "@/components/sketches/WeekSketch";

export default function Hero() {
  return (
    <section id="top" className="wrap sec hero">
      <div className="hero-head">
        {PHOTO && (
          // 176px wide at every width (.photo in globals.css), so the browser picks the smallest file that is sharp.
          // priority: it is the largest thing in the first screen, so it is fetched first; every other image is lazy.
          <Image className="photo" src={PHOTO.src} alt={PHOTO.alt} width={PHOTO.width} height={PHOTO.height} sizes="176px" priority />
        )}
        <h1>{HERO.headline}</h1>
      </div>
      <Annotated note={HERO.nerdNote}>
        <p className="lede">
          {HERO.answer} <Underline>{HERO.marked}</Underline>
        </p>
      </Annotated>
      <WeekSketch />
      {HERO.how.map((line) => (
        <p key={line} className="body">
          {line}
        </p>
      ))}
      <p className="small">{ME.hours}</p>
    </section>
  );
}
