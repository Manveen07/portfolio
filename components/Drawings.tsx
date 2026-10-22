import Image from "next/image";
import { DRAWINGS as D } from "@/data/portfolio";
import Annotated from "@/components/Annotated";
import Marked from "@/components/Marked";

/** The body of the post /writing/marking-the-ais-homework (its title and lede come from the post page):
    drawing-proof, marked like homework. A real crop of the sheet with the wrong answer circled and the
    right one underlined, the scores, the fine print, and the drawing's credit (it is CC BY-SA). Two margin notes.
    A home page section until 22 Oct; the words are unchanged. */
export default function Drawings() {
  return (
    <div className="post-body">
      <p className="body">{D.what}</p>
      <figure className="tb">
        <Annotated note={D.shotNote}>
          <Marked>
            <Image
              className="tb-img"
              src={D.shot.src}
              alt={D.shot.alt}
              width={D.shot.width}
              height={D.shot.height}
              sizes="(min-width: 600px) 540px, calc(100vw - 40px)"
            />
            {/* Drawn in the crop's own pixels (1073 x 549): a loop round the name in the PART box,
                a line under MHA-060 in the DWG. NO. box (the "v32" after it is the revision). */}
            <svg viewBox="0 0 1073 549" preserveAspectRatio="none" aria-hidden="true">
              <path className="mark" pathLength={1} d="M170,160 C128,96 352,58 590,62 C800,66 858,118 810,168 C752,218 340,216 196,194 C150,186 138,166 156,144" />
              <path className="mark" pathLength={1} d="M42,440 C150,434 300,441 490,435" />
            </svg>
          </Marked>
        </Annotated>
        <figcaption className="small">{D.caption}</figcaption>
      </figure>
      <dl className="metrics marks">
        {D.marks.map(([n, label]) => (
          <div key={label}>
            <dt>{n}</dt>
            <dd>{label}</dd>
          </div>
        ))}
      </dl>
      <p className="body">{D.wrongLine}</p>
      <Annotated note={D.finePrintNote}>
        <p className="small fine">{D.finePrint}</p>
      </Annotated>
      <p className="stack">built with {D.stack.join(", ")}</p>
      <p className="small credit">
        Drawing © 2026 {D.credit.by}, from his{" "}
        <a className="link" href={D.credit.projectHref} target="_blank" rel="noopener">
          {D.credit.project}
        </a>{" "}
        project, marked{" "}
        <a className="link" href={D.credit.licenceHref} target="_blank" rel="noopener license">
          {D.credit.licence}
        </a>
        . Cropped, and shared under the same licence; the red pen is mine.
      </p>
    </div>
  );
}
