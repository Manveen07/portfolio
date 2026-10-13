// Wording for the run panel. No imports, so tests/runs.test.mjs can load it directly.

export type LastRun = { at: string; ok: boolean };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "7 Sep, 10:39 UTC" from an ISO timestamp. Fixed month names so no locale
 *  renders "Sept" or moves the day. */
export function fmtRun(iso: string): string {
  const d = new Date(iso);
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}, ${hh}:${mm} UTC`;
}

/** The line under the bars: when it last ran, whether that worked, and where the numbers come from. */
export function runLine(lastRun: LastRun, live: boolean, asOf: string): string {
  const when = fmtRun(lastRun.at);
  const run = lastRun.ok ? `Last run: ${when}.` : `Last run: ${when}, and it failed.`;
  const source = live ? "Read live from GitHub." : `Numbers saved ${fmtRun(asOf)}.`;
  return `${run} ${source}`;
}
