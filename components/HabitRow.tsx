import { Circle, Strike } from "@/components/Pen";
import A from "@/components/A";
import { StoryText } from "@/components/StoryParts";
import { keep } from "@/lib/text";
import type { Habit } from "@/data/how";

// One habit on /how-i-build, told as one past event (v2.1, 2 Nov: the email check replayed before switching): the old
// number struck through in red, the new one circled, two or three short lines (the last says what the check can't
// show), what it was checked against, and the story's four parts behind a "How it actually went" click. A wash box like
// a proof card: no border, no shadow, no tilt. Red only through the pen. Words in data/how.ts (HABITS).

export default function HabitRow({ h }: { h: Habit }) {
  const x = h.exhibit;
  // The circle keeps the words after it up to their first comma, or (round 5, 2 Nov) the one word after it when the rest
  // has no comma ("70 of them pass the new rules" whole is wider than a phone's line); the rest can wrap.
  const rest = x.rest ?? "";
  const cut = rest.indexOf(",", 1);
  const kept = cut > 0 ? rest.slice(0, cut + 1) : (rest.match(/^ ?\S+/)?.[0] ?? "");
  const tail = rest.slice(kept.length);
  return (
    <article className="habit" id={h.id}>
      <h3 className="h3">{keep(h.head)}</h3>
      <p className="habit-exhibit">
        {x.struck && (
          <>
            <Strike>{keep(x.struck)}</Strike>
            <span aria-hidden="true"> → </span>
          </>
        )}
        {/* The circle and the words after it stay on one line, so the circled number is never read alone. */}
        <span className="pc-nb">
          <Circle>{keep(x.circled)}</Circle>
          {kept && keep(kept)}
        </span>
        {tail && keep(tail)}
      </p>
      {h.lines.map((l) => (
        <p key={l} className="habit-cap">
          {keep(l)}
        </p>
      ))}
      <p className="habit-tag">
        {h.checked}
        {h.link && (
          <>
            {" · "}
            <A href={h.link.href}>{h.link.label}</A>
          </>
        )}
      </p>
      {h.story && <StoryText s={h.story} id={h.story.id} />}
    </article>
  );
}
