// The home page as markdown (/index.md), in page order, built from the same data the components render.
// tests/ai.test.mjs reads the built page and this file side by side: every block of text, every alt text and
// aria-label, and every word drawn in a sketch must appear here, and every number here must be on the page.
// So when a component's wording changes, change it here too, or the tests fail.

import { NEWEST_FIRST } from "@/data/posts";
import { ME, HERO, HERO_KICKER, SAY_HI, PHOTO, REFERENCE, NOW_LINE, JOBS, OFF_CLOCK, FREELANCE, type WorkItem } from "@/data/portfolio";
import { CONTACT } from "@/data/how";
import { abs, mdHref, SITE } from "@/lib/site";
import { para, list, link, image, pen } from "@/lib/md/format";
import { PROOF, HOME_CARDS, HOME_BAND, HOME_OWN_BAND, HOME_OWN_CARDS, type ProofCard } from "@/data/proof";
import { proofMarkdown } from "@/lib/md/proof";

// The week and the pilot's drawings left with the pilot (round 3, 2 Nov): lib/md/working.ts. Tender Radar's section and
// its drawing left the home page in round 6 (2 Nov; components/Proof.tsx says why).

function entry(w: WorkItem): string {
  const out: string[] = [`#### ${w.title}`, para([w.where, w.role].filter(Boolean).join(" · "))];
  if (w.lead) out.push(para(w.lead));
  if (w.detail) out.push(para(w.detail));
  if (w.points) out.push(list(w.points));
  if (w.scorecard) {
    const s = w.scorecard;
    out.push(para(s.caption));
    out.push(list([`**${s.caught}** caught`, `**${s.missed}** missed`, `**${s.falseAlarms}** false alarms (circled in red)`, `**${s.leftAlone}** left alone`]));
  }
  if (w.shot) out.push(para(image(w.shot.alt, abs(w.shot.src))));
  if (w.metrics.length) out.push(list(w.metrics.map(([n, label]) => `**${n}** ${label}`)));
  out.push(para(`built with ${w.stack.join(", ")}`));
  if (w.links) out.push(list(w.links.map((l) => link(l.label, mdHref(l.href)))));
  if (w.note) out.push(para(pen(w.note)));
  if (w.reference) out.push(para(REFERENCE));
  return out.join("\n\n");
}

/** components/Writing.tsx: the three newest posts, titles only (round 5, 2 Nov), and the way to the rest. */
function latestWriting(): string[] {
  const latest = NEWEST_FIRST.slice(0, 3);
  if (!latest.length) return [];
  return [
    "## Writing",
    ...latest.map((p) => `### ${link(p.cardTitle ?? p.title, mdHref(`/writing/${p.slug}`))}`),
    para(link("All writing →", mdHref("/writing"))),
  ];
}

export function homeMarkdown(): string {
  return [
    `# ${ME.name} | ${ME.role}`,
    para(
      `The home page of ${SITE}/ as markdown, in page order, generated from the site's data on every build. ` +
        `Resume: ${link("resume.md", abs("/resume.md"))}, ${link("resume.json", abs("/resume.json"))}, ${link("resume.pdf", abs(ME.resume))}. ` +
        `Everything in one file: ${link("llms-full.txt", abs("/llms-full.txt"))}.`,
    ),

    PHOTO ? para(image(PHOTO.alt, abs(PHOTO.src))) : "",
    para(`*${HERO_KICKER}*`),
    `## ${HERO.headline}`,
    ...HERO.how.map(para),
    list([link(HOME_BAND.link.label, mdHref(HOME_BAND.link.href))]),
    para(ME.hours),

    `## ${HOME_BAND.kicker}`,
    ...HOME_CARDS.map((slug) => proofMarkdown(PROOF[slug], "compact", { level: 3, links: true, href: mdHref })),

    "## Work",
    ...JOBS.map(entry),
    para(`${NOW_LINE} ${link("Full resume ↗", abs(ME.resume))} (as text: ${link("resume.md", abs("/resume.md"))})`),

    // Round 3 (2 Nov): each of his own projects is its line, then the full card that its click opens.
    `## ${HOME_OWN_BAND.kicker}`,
    ...HOME_OWN_CARDS.flatMap((slug) => [para((PROOF[slug] as ProofCard).line ?? ""), proofMarkdown(PROOF[slug], "full", { level: 3, links: true, href: mdHref })]),

    ...latestWriting(),

    // Round 3 (2 Nov): Say hi ends like /how-i-build's; the pilot is /working-with-me (lib/md/working.ts).
    `## ${SAY_HI.kicker}`,
    para(SAY_HI.ask),
    para(`Email: ${link(ME.email, `mailto:${ME.email}`)}`),
    para(CONTACT.where),
    para(
      [link("LinkedIn ↗", ME.linkedin), link("GitHub ↗", ME.github), link("Résumé (PDF)", abs(ME.resume)), link("How I build", mdHref("/how-i-build")), link("Writing", mdHref("/writing"))].join(" "),
    ),

    "---",
    para(`**Off the clock:** ${OFF_CLOCK}`),
    para(
      `Hiring? ${link("Resume", abs(ME.resume))} · ${link("LinkedIn", ME.linkedin)} · ${link("GitHub", ME.github)} · ${link("Writing", mdHref("/writing"))} · ${link(ME.email, `mailto:${ME.email}`)}`,
    ),
    para(link(FREELANCE.link, mdHref(FREELANCE.href))),
    para(`${ME.location} · © 2026 ${ME.name}`),
  ]
    .filter(Boolean)
    .join("\n\n")
    .concat("\n");
}
