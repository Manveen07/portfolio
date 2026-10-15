# Fonts

The site's two fonts, kept in the repo so a build never has to download them from Google
(a Vercel build failed on 15 Oct 2026 when Google's font server did not deliver Archivo).

| File | Font | Weights | Characters |
|---|---|---|---|
| `archivo-latin.woff2` | Archivo (variable) | 400 to 900 | Latin |
| `plex-mono-400-latin.woff2` | IBM Plex Mono | 400 | Latin |
| `plex-mono-500-latin.woff2` | IBM Plex Mono | 500 | Latin |

They are Google Fonts' own files for the Latin subset, the same ones `next/font/google` used to fetch
(taken from a build's `.next/static/media`). Both fonts are under the SIL Open Font License 1.1, which
allows bundling them with a site: Archivo by Omnibus-Type, IBM Plex Mono by IBM.

The share card (`app/opengraph-image.tsx`) uses the static `Archivo-*.ttf` files in `app/`, because
`next/og` cannot read woff2 or variable fonts.
