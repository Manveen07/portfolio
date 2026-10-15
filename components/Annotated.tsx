import type { ReactNode } from "react";

/** Where the note starts on wide screens, when it should not sit level with the top of its content:
    "line" is one quote line lower (`.note-drop`), "scorecard" is level with the leadlens scorecard
    (`.note-score`). Both are in globals.css. */
const DROP_CLASS = { line: "note note-drop", scorecard: "note note-score" } as const;

/** Content with a red margin note: beside it on wide screens, under it on phones. */
export default function Annotated({ note, children, drop }: { note: ReactNode; children: ReactNode; drop?: keyof typeof DROP_CLASS }) {
  return (
    <div className="annotated">
      <div>{children}</div>
      <aside className={drop ? DROP_CLASS[drop] : "note"}>{note}</aside>
    </div>
  );
}
