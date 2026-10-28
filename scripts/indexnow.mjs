#!/usr/bin/env node
// Tells the IndexNow search engines (Bing, Yandex, Seznam, Naver, Yep and others; not Google) that the pages in
// the live sitemap changed, so they recrawl them soon instead of whenever. Run it after a deploy that changes
// what a page says, a new post most of all:
//
//   npm run indexnow
//
// The key is public by design: public/<key>.txt holds it, and the engines fetch that file to check the request
// came from the site's owner (https://www.indexnow.org/documentation).

import { readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SITE = "https://manveen.me";
const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const keyFile = readdirSync(path.join(root, "public")).find((f) => /^[a-f0-9]{32}\.txt$/.test(f));
if (!keyFile) throw new Error("no IndexNow key file (32 hex characters + .txt) in public/");
const key = keyFile.replace(/\.txt$/, "");

// The live key file must say the key, or every engine rejects the request.
const live = await fetch(`${SITE}/${keyFile}`);
if (!live.ok || (await live.text()).trim() !== key) throw new Error(`${SITE}/${keyFile} is not live yet: deploy first`);

const sitemap = await (await fetch(`${SITE}/sitemap.xml`)).text();
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(SITE).host, key, keyLocation: `${SITE}/${keyFile}`, urlList }),
});
// 200: accepted. 202: accepted, key check pending. Anything else is a refusal (indexnow.org lists the codes).
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urlList.length} URLs`);
if (res.status !== 200 && res.status !== 202) process.exit(1);
