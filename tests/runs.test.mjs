// Unit tests for the run-panel wording. lib/runs.ts has no imports, so Node
// loads it directly (type stripping: built into Node 24, flag on Node 22).

import { test } from "node:test";
import assert from "node:assert/strict";
import { fmtRun, runLine } from "../lib/runs.ts";

test("fmtRun uses fixed month names in UTC", () => {
  assert.equal(fmtRun("2026-09-07T10:39:34Z"), "7 Sep, 10:39 UTC");
});

test("a failed last run is said plainly", () => {
  assert.equal(
    runLine({ at: "2026-10-13T12:53:46Z", ok: false }, true, "2026-10-13T13:00:00Z"),
    "Last run: 13 Oct, 12:53 UTC, and it failed. Read live from GitHub.",
  );
});

test("saved numbers say when they were saved", () => {
  assert.equal(
    runLine({ at: "2026-10-13T12:53:46Z", ok: true }, false, "2026-10-13T18:00:00Z"),
    "Last run: 13 Oct, 12:53 UTC. Numbers saved 13 Oct, 18:00 UTC.",
  );
});
