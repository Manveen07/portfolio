// When a pen mark gets revealed. No imports, so tests/reveal.test.mjs can load it directly.

/** Reveal a pen mark once it is well into view: 60% of it visible, or, for elements taller
 *  than the screen, once it fills at least 80% of the viewport height. */
export function shouldReveal(ratio: number, visibleHeight: number, viewportHeight: number): boolean {
  return ratio >= 0.6 || (viewportHeight > 0 && visibleHeight >= 0.8 * viewportHeight);
}
