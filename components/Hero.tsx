import Image from "next/image";
import { ME, HERO, PHOTO } from "@/data/portfolio";
import Annotated from "@/components/Annotated";
import { Underline } from "@/components/Pen";

export default function Hero() {
  return (
    <section id="top" className="wrap sec hero">
      {PHOTO && (
        <Image className="photo" src={PHOTO.src} alt={PHOTO.alt} width={PHOTO.width} height={PHOTO.height} priority />
      )}
      <h1>{HERO.headline}</h1>
      <Annotated note={HERO.nerdNote}>
        <p className="lede">
          {HERO.answer} <Underline>{HERO.marked}</Underline>
        </p>
      </Annotated>
      {HERO.how.map((line) => (
        <p key={line} className="body">
          {line}
        </p>
      ))}
      <p className="small">{ME.hours}</p>
      <a className="btn" href={ME.calendly} target="_blank" rel="noopener">
        Book a 30-minute call
      </a>
    </section>
  );
}
