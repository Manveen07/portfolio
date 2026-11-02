import { Inline } from "@/components/Prose";
import { SKILLS, SKILLS_NOT_YET } from "@/data/how";
import { keep } from "@/lib/text";

// What I can do (v2.1, 2 Nov), on /how-i-build: one row per skill, the skill in a hiring manager's words and one plain
// sentence of what I did, with its number, readable on its own; then one "Not yet" line for the gaps, in the same
// columns. No bars, no percentages, no level pills, no arrow-only links, and no red anywhere in this section. Each row
// has an id, so a DM can link one row. Words in data/how.ts (SKILLS, SKILLS_NOT_YET).

export default function SkillRows() {
  return (
    <>
      <ul className="skills">
        {SKILLS.map((s) => (
          <li key={s.id} id={s.id} className="skill">
            <h3 className="skill-title">{s.title}</h3>
            <p className="skill-line">
              <Inline s={keep(s.line)} linkClass="link" />
            </p>
          </li>
        ))}
      </ul>
      <p className="skills-notyet" id="skills-not-yet">
        <span className="skills-notyet-label">{SKILLS_NOT_YET.label}</span> <span>{SKILLS_NOT_YET.text}</span>
      </p>
    </>
  );
}
