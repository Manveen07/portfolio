// Unit tests for when a pen mark is revealed. lib/reveal.ts has no imports, so Node
// can load it directly:  node --experimental-strip-types --test tests/reveal.test.mjs

import { test } from "node:test";
import assert from "node:assert/strict";
import { shouldReveal } from "../lib/reveal.ts";

test("a small element is revealed at 60% visible and not at 50%", () => {
  assert.equal(shouldReveal(0.6, 120, 800), true);
  assert.equal(shouldReveal(0.5, 100, 800), false);
});

test("an element taller than the screen is revealed once it fills 80% of the viewport", () => {
  // 568x320 landscape phone: the tall sketch is about 660px high, so its best ratio is about 0.48.
  assert.equal(shouldReveal(0.48, 317, 320), true);
  assert.equal(shouldReveal(0.3, 200, 320), false);
});

test("the 80% rule is exact at the boundary and ignores a zero-height viewport", () => {
  assert.equal(shouldReveal(0.4, 256, 320), true);
  assert.equal(shouldReveal(0.4, 255, 320), false);
  assert.equal(shouldReveal(0.4, 500, 0), false);
});
