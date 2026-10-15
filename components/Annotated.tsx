import type { ReactNode } from "react";

/** Content with a red note right under it, inside the reading column at every width. */
export default function Annotated({ note, children }: { note: ReactNode; children: ReactNode }) {
  return (
    <div className="annotated">
      <div>{children}</div>
      <aside className="note">{note}</aside>
    </div>
  );
}
