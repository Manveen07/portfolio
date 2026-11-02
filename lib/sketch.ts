// Drawing helpers shared by the hand-drawn sketches on /how-i-build (components/sketches/PipelineSketch.tsx and
// AgentLanes.tsx): the red pen loop around a label, and how wide a mono label is.

/** IBM Plex Mono advances 0.6 em per character. */
export const width = (s: string, size: number) => s.length * size * 0.6;
const r1 = (n: number) => Math.round(n * 10) / 10;

/** A hand-drawn loop around a line of text that starts at x, sits on baseline y and is w wide. `size` is the font size
    the label is drawn at (13 by default), so the loop grows with bigger text. */
export function loop(x: number, y: number, w: number, size = 13): string {
  const k = size / 13;
  const l = x - 13 * k;
  const r = x + w + 11 * k;
  const t = y - 16 * k;
  const b = y + 7 * k;
  const mid = (l + r) / 2;
  // The right-hand curve's control points, set so its widest point lands just past r whatever the label's length
  // (2 Nov: with r + 3 as the control, a long label like "5 edits, approves" had its last letter cut by the loop).
  const c = (r + 2 * k - 0.25 * mid - 0.0375 * w - 0.375 * k) / 0.75;
  return [
    `M${r1(l + 3 * k)} ${r1(y - 1 * k)}`,
    `C${r1(l - 2 * k)} ${r1(t + 3 * k)} ${r1(mid - w * 0.25)} ${r1(t - 2 * k)} ${r1(mid + w * 0.1)} ${r1(t)}`,
    `C${r1(c)} ${r1(t + 1 * k)} ${r1(c + 1 * k)} ${r1(b - 3 * k)} ${r1(mid + w * 0.2)} ${r1(b + 1 * k)}`,
    `C${r1(mid - w * 0.25)} ${r1(b + 3 * k)} ${r1(l - 1 * k)} ${r1(b)} ${r1(l + 1 * k)} ${r1(y - 7 * k)}`,
  ].join(" ");
}
