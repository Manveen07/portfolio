import { Inline } from "@/components/Prose";
import A from "@/components/A";
import { SKILLS } from "@/data/how";

// What I can do, and what I can't yet (2 Nov), on /how-i-build: one row per skill in the reader's words, one receipt,
// and one gap at the same size as the receipt. No bars, no percentages, no level pills (cut 5: the receipts say where
// the work ran), no tool list, and no red anywhere in this section: the gaps are said in ink, so the failures aren't
// the loudest thing on the page. Each row has an id, so a DM can link one row. Words in data/how.ts (SKILLS).

export default function SkillRows() {
  return (
    <ul className="skills">
      {SKILLS.map((s) => (
        <li key={s.id} id={s.id} className="skill">
          <h3 className="skill-title">{s.title}</h3>
          <div className="skill-body">
            {s.proof && (
              <p className="skill-proof">
                <Inline s={s.proof} linkClass="link" />
                {s.to && (
                  <>
                    {" "}
                    <A href={s.to.href} aria={s.to.aria} className="link skill-to">
                      ↑
                    </A>
                  </>
                )}
              </p>
            )}
            <div className="skill-gap">
              <span className="skill-gap-label">gap</span>
              <p>{s.gap}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
