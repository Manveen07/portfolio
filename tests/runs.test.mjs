// Unit tests for the run-panel wording. lib/runs.ts has no imports, so Node
// loads it directly (type stripping: built into Node 24, flag on Node 22).

import { test } from "node:test";
import assert from "node:assert/strict";
import { fmtDay, fmtRun, parseVerdicts, runLine, summarizeRuns } from "../lib/runs.ts";

test("fmtRun uses fixed month names in UTC", () => {
  assert.equal(fmtRun("2026-09-07T10:39:34Z"), "7 Sep, 10:39 UTC");
});

test("fmtDay uses fixed month names, so a hover title says Sep and never Sept", () => {
  assert.equal(fmtDay("2026-09-07"), "7 Sep");
  assert.equal(fmtDay("2026-10-13"), "13 Oct");
  assert.equal(fmtDay("2026-01-01"), "1 Jan");
});

// GitHub returns runs newest first. An in-progress run has conclusion null.
const run = (created_at, conclusion) => ({ created_at, conclusion });

test("summarizeRuns drops an in-progress run, marks a failure not ok, and keeps the count in step with the bars", () => {
  const out = summarizeRuns({
    total_count: 102,
    workflow_runs: [
      run("2026-10-13T05:40:00Z", null), // still running: no conclusion yet
      run("2026-10-12T05:35:00Z", "failure"),
      run("2026-10-11T05:34:00Z", "success"),
    ],
  });
  assert.ok(out);
  assert.deepEqual(out.history, [
    { date: "2026-10-11", ok: true },
    { date: "2026-10-12", ok: false },
  ]);
  assert.deepEqual(out.lastRun, { at: "2026-10-12T05:35:00Z", ok: false });
  assert.equal(out.totalRuns, 101);
});

test("summarizeRuns returns null when no run has finished", () => {
  assert.equal(summarizeRuns({ total_count: 1, workflow_runs: [run("2026-10-13T05:40:00Z", null)] }), null);
  assert.equal(summarizeRuns({ total_count: 0, workflow_runs: [] }), null);
});

test("summarizeRuns puts the oldest day first and takes the last run from the newest finished one", () => {
  const out = summarizeRuns({
    total_count: 3,
    workflow_runs: [
      run("2026-10-13T05:30:00Z", "success"),
      run("2026-10-12T05:30:00Z", "success"),
      run("2026-10-11T05:30:00Z", "success"),
    ],
  });
  assert.ok(out);
  assert.deepEqual(out.history.map((h) => h.date), ["2026-10-11", "2026-10-12", "2026-10-13"]);
  assert.equal(out.lastRun.at, "2026-10-13T05:30:00Z");
  assert.equal(out.totalRuns, 3);
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

const SUMMARY_FIXTURE = [
  "## Profile results",
  "",
  "| Profile | Classified | Bid | Maybe | Skip | Unsent matches | Expiries / unseen | Latest digest |",
  "|---|---:|---:|---:|---:|---:|---:|---|",
  "| catering | 584 | 1 | 7 | 576 | 1 | 0 / 0 | `x` |",
  "| cleaning | 593 | 2 | 20 | 571 | 2 | 2 / 0 | `x` |",
  "| security | 593 | 3 | 5 | 585 | 1 | 0 / 0 | `x` |",
].join("\n");

test("parseVerdicts sums classified, bid and maybe across trades", () => {
  assert.deepEqual(parseVerdicts(SUMMARY_FIXTURE), { checks: 1770, bid: 6, maybe: 32 });
});

test("parseVerdicts returns null when the table is missing or malformed", () => {
  assert.equal(parseVerdicts("# Tender Radar Daily Summary\n\nno table today"), null);
  assert.equal(parseVerdicts("| Profile | Classified |\n|---|---:|\n| cleaning | lots |"), null);
});
