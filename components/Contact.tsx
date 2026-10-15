import { ME, PILOT } from "@/data/portfolio";
import Annotated from "@/components/Annotated";
import PilotSketch from "@/components/sketches/PilotSketch";

export default function Contact() {
  return (
    <section id="contact" className="wrap sec">
      <h2 className="kicker">How working with me goes</h2>
      <p className="lede">{PILOT.opener}</p>
      {/* The drawn timeline below shows these steps; the list stays in the page for screen readers. */}
      <ol className="steps sr-only">
        {PILOT.steps.map((s) => (
          <li key={s} className="body">
            {s}
          </li>
        ))}
      </ol>
      <Annotated note={PILOT.note}>
        <PilotSketch label={PILOT.sketchLabel} />
      </Annotated>
      <p className="body ask">{PILOT.ask}</p>
      <p className="mail-line">
        <a className="mail" href={`mailto:${ME.email}`}>
          {ME.email}
        </a>
      </p>
      <p className="small">
        <a className="link" href={ME.calendly} target="_blank" rel="noopener">
          {PILOT.calendar}
        </a>
      </p>
    </section>
  );
}
