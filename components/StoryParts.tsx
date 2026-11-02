import { Inline } from "@/components/Prose";
import { VISUAL, type Story } from "@/data/how";

// A story's four parts on /how-i-build (what broke, how I found it, how I proved the fix, what it changed), and the
// "How it actually went" click that holds them. Used by the two failure cards (app/how-i-build/page.tsx) and, since
// v2.1 (2 Nov), the habit card (components/HabitRow.tsx). A <details>, so it opens without JavaScript; with an id, a
// link to that id opens it (components/OpenOnHash.tsx).

export function StoryParts({ s }: { s: Story }) {
  const parts: [string, string][] = [
    ["What broke", s.broke],
    ["How I found it", s.found],
    ["How I proved the fix", s.tested],
    ["What it changed", s.changed],
  ];
  return (
    <dl className="story">
      {parts.map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>
            <Inline s={v} linkClass="link" />
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function StoryText({ s, id }: { s: Story; id?: string }) {
  return (
    <details className="more" id={id}>
      <summary>
        <span className="more-line more-label">{VISUAL.readStory}</span>
        <span className="more-hint" aria-hidden="true" />
      </summary>
      <StoryParts s={s} />
    </details>
  );
}
