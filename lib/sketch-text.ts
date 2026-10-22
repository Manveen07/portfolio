// Every word drawn in the three hand-drawn sketches, in one place. The SVGs draw these strings and the
// markdown copies (/index.md, /llms-full.txt) print them, so nothing on the page exists only inside a
// drawing. tests/ai.test.mjs checks that every <text> in the built page also appears in /index.md.

import { fmtCount } from "./runs";

// ── Tender Radar (components/sketches/RadarSketch.tsx) ──
/** The sources the daily run reads, top to bottom. Public Contracts Scotland and Sell2Wales are
 *  left out on purpose: both return 403 every morning, so drawing them would be false. */
export const RADAR_SOURCES = ["Find a Tender", "Contracts Finder", "ProContract"];

type RadarNumbers = { trades: number; checks: number; bid: number; maybe: number };

/** The radar's words. Numbers are built into one string each (not `{n} text` in JSX), so the server HTML
 *  holds "8 worth bidding" as one piece instead of "8<!-- --> worth bidding". */
export function radarText({ trades, checks, bid, maybe }: RadarNumbers) {
  return {
    label: `${RADAR_SOURCES.length} public tender sites feed my script every morning. Each notice is checked for ${trades} trades: ${maybe} worth a look, ${bid} worth bidding, out of ${fmtCount(checks)} checks. The sites: ${RADAR_SOURCES.join(", ")}.`,
    script: ["my script", "every morning,", "no one presses go"],
    checked: "each notice, checked",
    forTrades: `for ${trades} trades`,
    look: `${maybe} worth a look`,
    worth: `${bid} worth bidding`,
    under: [`↑ ${bid} out of ${fmtCount(checks)} checks were`, "worth bidding on."],
  };
}

// ── The week (components/sketches/WeekSketch.tsx) ──
export const WEEK = {
  label: "A week of the same task: Monday to Friday, copy, paste, double-check, crossed out in red. Runs on its own now.",
  days: ["mon", "tue", "wed", "thu", "fri"],
  task: "copy, paste, double-check",
  /** The red label beside the bracket, one line each. */
  red: ["runs on", "its own", "now"],
};

// ── How working with me goes (components/sketches/PilotSketch.tsx) ──
// Each step's title, its lines, and its grey lines, as drawn in both layouts.
export const PILOT_DRAWN = [
  { title: "1 · a call", lines: ["you tell me what", "wastes the most time"], dim: ["not a real problem?", "I'll say so"] },
  { title: "2 · a fixed quote", lines: ["before any work", "starts"], dim: [] },
  { title: "3 · a month, for real", lines: ["on your actual requests", "every miss logged,", "you see the list"], dim: [] },
  { title: "4 · you decide", lines: ["keep it: a monthly", "fee, I look after it"], dim: [] },
];
