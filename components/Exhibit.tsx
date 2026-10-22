import type { Pin } from "@/data/portfolio";
import { Circle, Underline } from "@/components/Pen";

/** Words as code with the red pen on the part that gave the game away, and a red scribble beside it
    (under it on a phone, pointing up). Used by the confidently-wrong notes and by prose posts. */
export default function Exhibit({ e, scribble }: { e: Pin["exhibit"]; scribble: string }) {
  const marked = e.pen === "underline" ? <Underline>{e.marked}</Underline> : <Circle tight={e.pen === "tight"}>{e.marked}</Circle>;
  return (
    <p className="pin-exhibit">
      <code className="exhibit">
        {e.before}
        {marked}
        {e.after}
      </code> <span className="scribble">
        <span className="arr-up" aria-hidden="true">↑ </span>
        <span className="arr-left" aria-hidden="true">← </span>
        {scribble}
      </span>
    </p>
  );
}
