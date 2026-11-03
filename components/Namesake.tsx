import { NAMESAKE as N } from "@/data/portfolio";
import SpotTheNamesake from "@/components/sketches/SpotTheNamesake";
import Prose from "@/components/Prose";

/** The body of the post about champion-move-checker (its title and lede come from the post page, 3 Nov 2026): the
    game first (three cases to call, then the README's gate output), then the story in short prose sections, all in
    data/portfolio.ts (NAMESAKE). The game is the only part that runs in the browser. */
export default function Namesake() {
  return (
    <div className="post-body">
      <SpotTheNamesake />
      <Prose body={N.after} />
    </div>
  );
}
