# Sinhron website

Landing page + documentation for [Sinhron](https://github.com/Grossmanban/sinhron) — an end-to-end
encrypted messenger on your own server. Fully static (Next.js `output: "export"`), published to
GitHub Pages by `.github/workflows/deploy.yml`. No server, no trackers, no external CDNs.

**Live:** https://grossmanban.github.io/sinhron-website/

- **Languages:** Russian and English on every page (`/ru/…`, `/en/…`). `/` picks one on the client.
- **Devices:** designed separately for iPhone, iPad (portrait / landscape / Split View) and desktop.
- **Motion:** Motion (Framer Motion) + Lenis; everything degrades to cross-fades under
  `prefers-reduced-motion`.

## Run

```bash
npm ci
npm run dev                      # http://127.0.0.1:3000/en/
npm run lint && npm run typecheck

NEXT_PUBLIC_BASE_PATH=/sinhron-website npm run build   # → out/
npm run serve                    # serves out/ like GitHub Pages: http://127.0.0.1:4321/sinhron-website/
```

`NEXT_PUBLIC_BASE_PATH` is `/<repo>` for `https://<owner>.github.io/<repo>` and empty for a custom
domain. `NEXT_PUBLIC_SITE_URL` is the absolute site URL used for the sitemap and Open Graph.

## Deploy

Every push to `main` runs lint + typecheck + build and publishes `out/` to the `gh-pages` branch
(`.github/workflows/deploy.yml`). Pull requests only build.

- **Pages settings:** Settings → Pages → Build and deployment → Source: *Deploy from a branch*,
  branch `gh-pages`, folder `/ (root)`.
- **Custom domain:** add a repository variable `CUSTOM_DOMAIN` (Settings → Secrets and variables →
  Actions → Variables), point the domain's DNS at GitHub Pages and push — the build switches to the
  domain root and publishes a `CNAME`.

## Downloads and feedback

The app repository ([Grossmanban/sinhron](https://github.com/Grossmanban/sinhron)) is private for now,
so public things live here: app builds go to **this repository's Releases** (the download page picks
up assets automatically by file extension — see `src/config/downloads.ts`), bug reports go to its
**Issues**. Docs facts come from the app repository's `docs/` — when a feature changes there, update
`src/content/docs/{ru,en}/` here.

## Where things live

| What | Where |
|---|---|
| All interface copy (RU / EN) | `src/content/dict/en.ts` (defines the shape), `src/content/dict/ru.ts` — a missing key fails the build |
| Links (repo, releases) | `src/config/site.ts` |
| Download buttons | `src/config/downloads.ts` — `status: "soon"` until a build exists; the page also checks GitHub Releases live |
| Landing sections + their order | `src/components/sections/*`, `src/app/[locale]/page.tsx` |
| Docs pages | `src/content/docs/{ru,en}/<slug>.mdx` + menu in `src/content/docs/nav.ts` |
| Blog / changelog | `src/content/blog/{ru,en}/*.mdx` + `posts.ts`, `src/content/changelog/{ru,en}.mdx` |
| Design tokens | `src/app/globals.css` (mirrors the app's tokens; AA values from `client_flutter/lib/app/theme/tokens.dart`) |
| Phone mock-ups | `src/components/phone/*` — HTML/CSS, not screenshots |
| OG images / touch icon | `public/og-{en,ru}.png`, `public/apple-touch-icon.png` — regenerate with `node scripts/make-og.cjs` (needs Playwright) |

## Add a docs page

1. Write `src/content/docs/en/<slug>.mdx` and `src/content/docs/ru/<slug>.mdx` (no `#` title — the
   layout renders it; start with a paragraph, then `##` sections).
2. Add `{ slug, title, description }` to a group in `src/content/docs/nav.ts`.

Missing translation → the other language is shown with a "translation coming" note.
MDX rules: no bare `{ } < >` in prose; code fences need a language; the only component is
`<Callout type="note|tip|warning" title="…">`. Internal links are written as `/docs/<slug>` —
the language prefix is added automatically.

## Add a landing section

Create `src/components/sections/MySection.tsx` (client component, copy from the dictionaries) and add
it to the `sections` array in `src/app/[locale]/page.tsx`.
