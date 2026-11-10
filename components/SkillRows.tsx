import { Inline } from "@/components/Prose";
import { SKILLS, FIGS, type Skill } from "@/data/how";
import { keep } from "@/lib/text";

// What I've built (9 Nov; What I can do from v2.1, 2 Nov), on /how-i-build: one row per system, the skill in a hiring manager's words and one plain
// sentence of what I did, with its number, readable on its own; then one "Not yet" line for the gaps, in the same
// columns. No bars, no percentages, no level pills, no arrow-only links, and no red anywhere in this section. Each row
// has an id, so a DM can link one row. Words in data/how.ts (SKILLS).

// 9 Nov, late: the same rows carry How I test (data/how.ts TESTING).
// 10 Nov (his call: "how i test and what ive built look similar ... change one of them"): `ledger` lays the rows out as
// one list, figure on the left and sentence on the right; without it they are tiles.
export default function SkillRows({ rows = SKILLS, ledger = false }: { rows?: Skill[]; ledger?: boolean }) {
  return (
    <>
      <ul className={ledger ? "skills ledger" : "skills"}>
        {rows.map((s) => (
          <li key={s.id} id={s.id} className="skill">
            {/* 10 Nov: the figure is drawn above the title from this attribute (globals.css), so the row's own words stay
                one title and one sentence. */}
            <h3 className="skill-title" data-fig={FIGS[s.id]}>{s.title}</h3>
            <p className="skill-line">
              <Inline s={keep(s.line)} linkClass="link" />
            </p>
          </li>
        ))}
      </ul>
      {/* 9 Nov, late (his pick): the "Not yet" line under the rows is gone; a gap stays out unless they ask (his 5 Nov rule). */}
    </>
  );
}
