// /resume.md and /resume.json, both from data/resume.ts (the PDF, line for line).

import { RESUME } from "@/data/resume";
import { ME } from "@/data/portfolio";
import { LLMS_INTRO } from "@/data/llms-intro";
import { abs } from "@/lib/site";
import { para, list, link } from "@/lib/md/format";

export function resumeMarkdown(): string {
  const r = RESUME;
  const job = (j: (typeof r.experience)[number]) =>
    [`### ${j.title} · ${j.org}`, para(`${j.dates} · ${j.location}`), list(j.bullets)].join("\n\n");
  const project = (p: (typeof r.projects)[number]) =>
    [
      `### ${p.name}`,
      para([p.stack.join(", "), ...p.links.map((l) => link(l.label, l.href)), p.date].join(" · ")),
      list(p.bullets),
    ].join("\n\n");
  return [
    `# ${r.name}`,
    para(`${r.role} · ${r.focus}`),
    para(`${r.location} · ${r.phone}`),
    para(r.links.map((l) => link(l.label, l.href)).join(" · ")),
    para(
      `The text of ${link("resume.pdf", abs(r.pdf))} (updated ${r.updated}), as markdown. The same resume as JSON: ${link("resume.json", abs("/resume.json"))}.`,
    ),
    `## ${r.headings.experience}`,
    ...r.experience.map(job),
    `## ${r.headings.projects}`,
    ...r.projects.map(project),
    `## ${r.headings.education}`,
    ...r.education.map((e) => [`### ${e.school}`, para(`${e.degree} · ${e.dates} · ${e.gpa}`)].join("\n\n")),
    `## ${r.headings.skills}`,
    list(r.skills.map((s) => `**${s.name}:** ${s.keywords.join(", ")}`)),
  ]
    .join("\n\n")
    .concat("\n");
}

/** The resume in the JSON Resume schema (https://jsonresume.org/schema, v1.2.1 checked 22 Oct 2026). */
export function resumeJson() {
  const r = RESUME;
  const linkedin = r.links.find((l) => l.href.includes("linkedin.com"))!;
  const github = r.links.find((l) => l.href.includes("github.com"))!;
  const email = r.links.find((l) => l.href.startsWith("mailto:"))!.label;
  return {
    $schema: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.2.1/schema.json",
    basics: {
      name: r.name,
      label: r.role,
      email,
      phone: r.phone,
      url: abs("/"),
      // Manveen's own summary, from data/llms-intro.ts.
      summary: LLMS_INTRO.summary,
      // The resume's line ("India (remote, US/EU overlap)") as the address; the city is the site's (Delhi, India).
      location: { address: r.location, city: ME.location.split(",")[0], countryCode: "IN" },
      profiles: [
        { network: "LinkedIn", username: linkedin.label.split("/").pop(), url: linkedin.href },
        { network: "GitHub", username: github.label.split("/").pop(), url: github.href },
      ],
    },
    work: r.experience.map((j) => ({
      name: j.org,
      position: j.title,
      location: j.location,
      startDate: j.start,
      ...(j.end ? { endDate: j.end } : {}),
      highlights: j.bullets,
    })),
    education: r.education.map((e) => ({
      institution: e.school,
      area: e.area,
      studyType: e.studyType,
      startDate: e.start,
      endDate: e.end,
      score: e.score,
    })),
    projects: r.projects.map((p) => ({
      name: p.name,
      description: p.bullets[0],
      highlights: p.bullets,
      keywords: p.stack,
      startDate: p.date,
      ...(p.links[0] ? { url: p.links[0].href } : {}),
    })),
    skills: r.skills.map((s) => ({ name: s.name, keywords: s.keywords })),
    meta: { canonical: abs("/resume.json"), lastModified: r.updated, source: abs(r.pdf) },
  };
}
