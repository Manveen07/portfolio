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
import { parseVerdicts, summarizeRuns } from "./runs";
import type { RunDay, RunsResponse } from "./runs";

export type { RunDay };

export type PipelineData = {
  asOf: string;            // ISO timestamp the numbers were read
  live: boolean;           // true when read from GitHub at request time
  totalRuns: number;
  lastRun: { at: string; ok: boolean };
  noticesRead: number;
  clientProfiles: number;
  checks: number;          // notices classified, summed over every trade
  bid: number;             // verdicts: worth bidding on
  maybe: number;           // verdicts: worth a look
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
      fetch(`https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW}/runs?event=schedule&per_page=40`, opts),
      fetch(`https://api.github.com/repos/${REPO}/contents/${SUMMARY}`, opts),
    ]);
    if (!runsRes.ok || !sumRes.ok) return FALLBACK;

    const summary = summarizeRuns((await runsRes.json()) as RunsResponse);
    if (!summary) return FALLBACK;
    const sum = (await sumRes.json()) as { content: string };
    const md = Buffer.from(sum.content, "base64").toString("utf8");

    const notices = Number(/Raw tender records[^\d]*(\d+)/.exec(md)?.[1] ?? FALLBACK.noticesRead);
    const profiles = (md.match(/^\| [a-z-]+ \|/gm) ?? []).length || FALLBACK.clientProfiles;
    const verdicts = parseVerdicts(md) ?? { checks: FALLBACK.checks, bid: FALLBACK.bid, maybe: FALLBACK.maybe };

    return {
      asOf: new Date().toISOString(),
      live: true,
      ...summary,
      noticesRead: notices,
      clientProfiles: profiles,
      ...verdicts,
    };
  } catch {
    return FALLBACK;
  }
}
