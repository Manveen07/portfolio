#!/usr/bin/env node
// Refreshes data/page-dates.json from the last build: a page whose markdown copy changed gets today's date and its new
// hash; the others keep theirs. Run it after `npm run build` whenever the tests say a page's words changed, then
// build again and commit the file:
//
//   npm run build && npm run page-dates && npm run build
//
// lib/page-dates.ts says why the dates live in a file.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pageHash, bodyFile } from "../lib/page-dates.ts";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = (process.env.SITE_URL || "https://manveen.me").replace(/\/+$/, "");
const file = path.join(root, "data/page-dates.json");
const saved = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : {};

const slugs = [...readFileSync(path.join(root, "data/posts.ts"), "utf8").matchAll(/slug: "([a-z0-9-]+)"/g)].map((m) => m[1]);
const paths = ["/", "/writing", "/how-i-build", "/working-with-me", ...slugs.map((s) => `/writing/${s}`)];
const today = new Date().toISOString().slice(0, 10);

const next = {};
for (const p of paths) {
  const body = path.join(root, ".next/server/app", bodyFile(p));
  if (!existsSync(body)) throw new Error(`${body} is missing: run npm run build first`);
  const hash = pageHash(readFileSync(body, "utf8"), SITE);
  const old = saved[p];
  next[p] = old && old.hash === hash ? old : { date: today, hash };
  if (next[p] !== old) console.log(`${p}: ${old ? `${old.date} -> ` : "new, "}${today}`);
}
for (const p of Object.keys(saved)) if (!(p in next)) console.log(`${p}: gone`);
writeFileSync(file, `${JSON.stringify(next, null, 2)}\n`);
console.log(`data/page-dates.json: ${paths.length} pages`);
