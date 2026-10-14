import type { ReactNode } from "react";

/** Content with a red margin note: beside it on wide screens, under it on phones.
    `drop` pushes the note one quote line lower on wide screens (see .note-drop in globals.css). */
export default function Annotated({ note, children, drop }: { note: ReactNode; children: ReactNode; drop?: boolean }) {
  return (
    <div className="annotated">
      <div>{children}</div>
      <aside className={drop ? "note note-drop" : "note"}>{note}</aside>
    </div>
  );
}
