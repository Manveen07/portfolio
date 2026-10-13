import { ME, PILOT } from "@/data/portfolio";

export default function Contact() {
  return (
    <section id="contact" className="wrap sec">
      <p className="kicker">How working with me goes</p>
      <p className="lede">{PILOT.opener}</p>
      <ol className="steps">
        {PILOT.steps.map((s) => (
          <li key={s} className="body">
            {s}
          </li>
        ))}
      </ol>
      <p className="cta-row">
        <a className="btn" href={ME.calendly} target="_blank" rel="noopener">
          Book a 30-minute call
        </a>
        <a className="link" href={`mailto:${ME.email}`}>
          {ME.email}
        </a>
      </p>
    </section>
  );
}
