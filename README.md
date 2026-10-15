# manveen.me

The site of Manveen Singh, an automation engineer in Delhi, written for business owners. It says what he builds (the weekly job that is the same clicks in the same order, made to run by itself), shows the Tender Radar running every morning with its real numbers, lists his two jobs and his own projects, and ends with his email address and a small link to his calendar.

Next.js 16 (app router), React 19 and TypeScript, with plain CSS in `app/globals.css`.

## Run it

- `npm run dev` starts it on http://localhost:3000.
- `npm run build` makes the production build, and `npm start` serves it.
- `npm test` runs `tests/site.test.mjs`, `tests/runs.test.mjs` and `tests/reveal.test.mjs` with Node's own test runner. The site tests read the pages that the build writes into `.next/`, so build first.

## The Tender Radar numbers

With `GITHUB_TOKEN` set (a fine-grained token with Actions:read and Contents:read on Manveen07/new-10x-engineer), the page reads the daily run history and summary from GitHub and caches them for an hour. Without it the page shows `data/pipeline-snapshot.json` and says the numbers are saved.

`npm run refresh-snapshot` rewrites that file from GitHub (it needs the `gh` CLI signed in). Rebuild and rerun the tests after it.
