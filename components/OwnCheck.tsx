import ProofCard from "@/components/ProofCard";
import { VISUAL } from "@/data/how";
import type { ProofCard as Card } from "@/data/proof";
import { keep } from "@/lib/text";

// One of his own projects on the home page (2 Nov, verify loop round 3): the card's one plain line (data/proof.ts,
// `line`), then the full red-pen card behind a click named for it (round 6), the way /how-i-build's stories open
// (components/StoryParts.tsx). A <details>, so it opens without JavaScript and its words stay in the HTML.
export default function OwnCheck({ c }: { c: Card }) {
  return (
    <div className="own-check">
      <p className="body own-line">{keep(c.line ?? "")}</p>
      <details className="more">
        <summary>
          <span className="more-line more-label">{VISUAL.clicks[c.slug]}</span>
          <span className="more-hint" aria-hidden="true" />
        </summary>
        <ProofCard c={c} density="full" level={3} />
      </details>
    </div>
  );
}
