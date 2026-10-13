# Sinhron website

Static Next.js site (RU/EN) for the Sinhron messenger, deployed to GitHub Pages from `gh-pages`
by `.github/workflows/deploy.yml`. Start with `README.md`.

- Check before every push: `npm ci && npm run lint && npm run typecheck && NEXT_PUBLIC_BASE_PATH=/sinhron-website npm run build`;
  `npm run serve` serves `out/` like Pages on 127.0.0.1:4321.
- Every user-visible string exists in both `src/content/dict/en.ts` and `ru.ts` (the build fails otherwise);
  docs pages come in pairs `src/content/docs/{ru,en}/<slug>.mdx`.
- Only true statements: product facts come from the app repo (Grossmanban/sinhron → `docs/`, spec).
  Features that don't exist yet are marked "soon" — never invent users, audits or store releases.
- Animate only transform/opacity; keep `prefers-reduced-motion` fallbacks; check iPhone, iPad and desktop widths.
