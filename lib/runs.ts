// Wording for the run panel. No imports, so tests/runs.test.mjs can load it directly.

export type LastRun = { at: string; ok: boolean };
export type RunDay = { date: string; ok: boolean };

/** The part of GitHub's "list workflow runs" response this site reads. Newest run first. */
export type RunsResponse = {
  total_count: number;
  workflow_runs: { conclusion: string | null; created_at: string }[];
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "7 Sep" from "2026-09-07", for a bar's hover title. Fixed month names, so no
 *  locale renders "Sept". */
export function fmtDay(date: string): string {
  const [, month, day] = date.split("-");
  return `${Number(day)} ${MONTHS[Number(month) - 1]}`;
}

/** Finished runs only (an in-progress run has no conclusion yet), oldest first.
 *  Null when none has finished. The count drops the unfinished runs on this page, so
 *  it never runs ahead of the bars. */
export function summarizeRuns(runs: RunsResponse): { totalRuns: number; lastRun: LastRun; history: RunDay[] } | null {
  const finished = runs.workflow_runs.filter((r) => r.conclusion);
  if (!finished.length) return null;
  const unfinished = runs.workflow_runs.length - finished.length;
  return {
    totalRuns: runs.total_count - unfinished,
    lastRun: { at: finished[0].created_at, ok: finished[0].conclusion === "success" },
    history: finished
      .map((r) => ({ date: r.created_at.slice(0, 10), ok: r.conclusion === "success" }))
      .reverse(),
  };
}

/** "7 Sep, 10:39 UTC" from an ISO timestamp. Fixed month names so no locale
 *  renders "Sept" or moves the day. */
export function fmtRun(iso: string): string {
  const d = new Date(iso);
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}, ${hh}:${mm} UTC`;
}

/** Totals across the "Profile results" table of the Tender Radar daily summary:
 *  checks = sum of Classified (one check per notice per trade), bid and maybe = the
 *  classifier's verdict counts. Null if the table is missing or any cell isn't a number,
 *  so callers fall back to saved numbers instead of showing zeros. */
export function parseVerdicts(md: string): { checks: number; bid: number; maybe: number } | null {
  const lines = md.split("\n");
  const head = lines.findIndex((l) => /^\|\s*Profile\s*\|/.test(l));
  if (head < 0) return null;
  const cols = lines[head].split("|").map((c) => c.trim());
  const at = (name: string) => cols.indexOf(name);
  const [ci, bi, mi] = [at("Classified"), at("Bid"), at("Maybe")];
  if (ci < 0 || bi < 0 || mi < 0) return null;
  let checks = 0, bid = 0, maybe = 0, rows = 0;
  for (const line of lines.slice(head + 2)) {
    if (!line.startsWith("|")) break;
    const cells = line.split("|").map((c) => c.trim());
    const nums = [cells[ci], cells[bi], cells[mi]].map((c) => (/^\d+$/.test(c ?? "") ? Number(c) : NaN));
    if (nums.some(Number.isNaN)) return null;
    checks += nums[0]; bid += nums[1]; maybe += nums[2]; rows += 1;
  }
  return rows ? { checks, bid, maybe } : null;
}

/** The line under the bars: when it last ran, whether that worked, and where the numbers come from. */
export function runLine(lastRun: LastRun, live: boolean, asOf: string): string {
  const when = fmtRun(lastRun.at);
  const run = lastRun.ok ? `Last run: ${when}.` : `Last run: ${when}, and it failed.`;
  const source = live ? "Read live from GitHub." : `Numbers saved ${fmtRun(asOf)}.`;
  return `${run} ${source}`;
}
