import { Circle, Strike } from "@/components/Pen";
import A from "@/components/A";
import { keep } from "@/lib/text";
import type { Habit } from "@/data/how";

// One habit on /how-i-build (2 Nov), shown through one of his own public projects: the old number struck through in
// red, the lower published one circled, the limit in the caption, and who checked it with the link to the receipt.
// A wash box like a proof card: no border, no shadow, no tilt. Red only through the pen. Words in data/how.ts (HABITS).
// The ProofCard isn't reused: two compact cards beside the rest of the old page measured 823 visible words.

export default function HabitRow({ h }: { h: Habit }) {
  const x = h.exhibit;
  // The circle keeps the words after it up to their first comma ("7 wrong of 419 values,"); the rest can wrap.
  const rest = x.rest ?? "";
  const cut = rest.indexOf(",", 1);
  const kept = cut > 0 ? rest.slice(0, cut + 1) : rest;
  const tail = cut > 0 ? rest.slice(cut + 1) : "";
  return (
    <article className="habit" id={h.id}>
      {h.eyebrow && <p className="habit-eyebrow">{h.eyebrow}</p>}
      <h3 className="h3">{keep(h.head)}</h3>
      <p className="habit-exhibit">
        {x.struck && (
          <>
            <Strike>{keep(x.struck)}</Strike>
            <span aria-hidden="true"> → </span>
          </>
        )}
        {/* The circle and the words after it stay on one line, so the circled number is never read as the clean result. */}
        <span className="pc-nb">
          <Circle>{keep(x.circled)}</Circle>
          {kept && keep(kept)}
        </span>
        {tail && keep(tail)}
      </p>
      <p className="habit-cap">{keep(h.cap)}</p>
      <p className="habit-tag">
        {h.checked} · <A href={h.link.href}>{h.link.label}</A>
      </p>
    </article>
  );
}
