import type { ReactNode } from "react";

/** Content with a red margin note: beside it on wide screens, under it on phones. */
export default function Annotated({ note, children }: { note: ReactNode; children: ReactNode }) {
  return (
    <div className="annotated">
      <div>{children}</div>
      <aside className="note">{note}</aside>
    </div>
  );
}
