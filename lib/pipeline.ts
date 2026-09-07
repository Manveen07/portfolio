// Server-side source for the "proof it runs" numbers.
//
// With GITHUB_TOKEN set (a fine-grained token with Actions:read and
// Contents:read on Manveen07/new-10x-engineer), the page reads the real
// workflow history and the job's own daily summary, cached for an hour.
// Without it — local dev, a preview without secrets — it falls back to the
// committed snapshot, which `npm run refresh-snapshot` regenerates.
//
// Either way the shape is the same, so the component never knows which.

import snapshot from "@/data/pipeline-snapshot.json";

export type RunDay = { date: string; ok: boolean };

export type PipelineData = {
  asOf: string;            // ISO timestamp the numbers were read
  live: boolean;           // true when read from GitHub at request time
  totalRuns: number;
  lastRun: { at: string; ok: boolean };
  noticesRead: number;
  clientProfiles: number;
  history: RunDay[];       // oldest → newest, up to 40
};

const REPO = "Manveen07/new-10x-engineer";
const WORKFLOW = "tender-radar-daily.yml";
const SUMMARY = "projects/tender-radar/reports/daily-summary.md";

const FALLBACK: PipelineData = { ...(snapshot as Omit<PipelineData, "live">), live: false };

export async function getPipeline(): Promise<PipelineData> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return FALLBACK;

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const opts = { headers, next: { revalidate: 3600 } } as const;

  try {
    const [runsRes, sumRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW}/runs?per_page=40`, opts),
      fetch(`https://api.github.com/repos/${REPO}/contents/${SUMMARY}`, opts),
    ]);
    if (!runsRes.ok || !sumRes.ok) return FALLBACK;

    const runs = (await runsRes.json()) as {
      total_count: number;
      workflow_runs: { conclusion: string | null; created_at: string }[];
    };
    const sum = (await sumRes.json()) as { content: string };
    const md = Buffer.from(sum.content, "base64").toString("utf8");

    // Only finished runs count; an in-progress one has no conclusion yet.
    const finished = runs.workflow_runs.filter((r) => r.conclusion);
    if (!finished.length) return FALLBACK;

    const history: RunDay[] = finished
      .map((r) => ({ date: r.created_at.slice(0, 10), ok: r.conclusion === "success" }))
      .reverse();

    const notices = Number(/Raw tender records[^\d]*(\d+)/.exec(md)?.[1] ?? FALLBACK.noticesRead);
    const profiles = (md.match(/^\| [a-z-]+ \|/gm) ?? []).length || FALLBACK.clientProfiles;

    return {
      asOf: new Date().toISOString(),
      live: true,
      totalRuns: runs.total_count,
      lastRun: { at: finished[0].created_at, ok: finished[0].conclusion === "success" },
      noticesRead: notices,
      clientProfiles: profiles,
      history,
    };
  } catch {
    return FALLBACK;
  }
}

/** "7 Sep, 10:39 UTC" from an ISO timestamp. Fixed month names so no locale
 *  renders "Sept" or moves the day. */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export function fmtRun(iso: string): string {
  const d = new Date(iso);
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}, ${hh}:${mm} UTC`;
}
