#!/usr/bin/env node
// Regenerates data/pipeline-snapshot.json from GitHub using the `gh` CLI.
// Run it whenever you want the committed fallback numbers to be current:
//
//   npm run refresh-snapshot
//
// The live path in lib/pipeline.ts does the same thing at request time when
// GITHUB_TOKEN is set; this script exists so the site is never more than a
// commit away from the truth even without that token.

import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const REPO = "Manveen07/new-10x-engineer";
const gh = (endpoint, jq) =>
  execFileSync("gh", ["api", endpoint, "--jq", jq], { encoding: "utf8" }).trim();

const runs = JSON.parse(
  gh(
    `repos/${REPO}/actions/workflows/tender-radar-daily.yml/runs?per_page=40`,
    "{total: .total_count, runs: [.workflow_runs[] | select(.conclusion != null) | {c: .conclusion, at: .created_at}]}",
  ),
);
const md = Buffer.from(
  gh(`repos/${REPO}/contents/projects/tender-radar/reports/daily-summary.md`, ".content"),
  "base64",
).toString("utf8");

const notices = Number(/Raw tender records[^\d]*(\d+)/.exec(md)?.[1]);
const profiles = (md.match(/^\| [a-z-]+ \|/gm) ?? []).length;

const snapshot = {
  asOf: new Date().toISOString(),
  totalRuns: runs.total,
  lastRun: { at: runs.runs[0].at, ok: runs.runs[0].c === "success" },
  noticesRead: notices,
  clientProfiles: profiles,
  history: runs.runs.map((r) => ({ date: r.at.slice(0, 10), ok: r.c === "success" })).reverse(),
};

const out = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "data", "pipeline-snapshot.json");
writeFileSync(out, JSON.stringify(snapshot, null, 2) + "\n");

const ok = snapshot.history.filter((h) => h.ok).length;
console.log(
  `wrote ${path.relative(process.cwd(), out)}: ${snapshot.totalRuns} runs total, ` +
    `last ${snapshot.lastRun.at} (${snapshot.lastRun.ok ? "ok" : "failed"}), ` +
    `${notices} notices, ${profiles} profiles, window ${ok}/${snapshot.history.length} ok`,
);
