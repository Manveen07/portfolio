import Link from "next/link";
import { ME, SAY_HI } from "@/data/portfolio";
import { CONTACT } from "@/data/how";
import A from "@/components/A";

// Say hi (2 Nov, verify loop round 3): it ends the way /how-i-build's does, in its words (data/how.ts CONTACT): the ask,
// the address, the hours line, then the links. The freelance pilot that followed it until round 3 is the page
// /working-with-me, linked from the footer: all 4 round 2 readers asked whether he wants a job or clients. The spaces
// between the links keep their words apart in the HTML (the markdown copy is held to it); the row's gap spaces them.
export default function Contact() {
  return (
    <section id="contact" className="wrap sec">
      <h2 className="kicker">{SAY_HI.kicker}</h2>
      <p className="lede">{SAY_HI.ask}</p>
      <p className="mail-line">
        <a className="mail" href={`mailto:${ME.email}`}>
          {ME.email}
        </a>
      </p>
      <p className="small">{CONTACT.where}</p>
      <p className="cta-row" style={{ marginTop: 28 }}>
        <A href={ME.linkedin}>LinkedIn ↗</A> <A href={ME.github}>GitHub ↗</A> <A href={ME.resume}>Résumé (PDF)</A>{" "}
        <Link className="link" href="/how-i-build">
          How I build
        </Link>{" "}
        <Link className="link" href="/writing">
          Writing
        </Link>
      </p>
    </section>
  );
}
