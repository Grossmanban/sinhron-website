export const site = {
  name: "Sinhron",
  /** The app itself: client, core, server. */
  repo: "https://github.com/Grossmanban/sinhron",
  /** This website (public repo). Builds are published on its Releases, feedback goes to its Issues. */
  siteRepo: "https://github.com/Grossmanban/sinhron-website",
  /** Where the generic "GitHub" links (nav, footer, final CTA) go. The app repo is private for now,
   *  so they point to this public repo (releases + issues); switch to `repo` once the app is public. */
  github: "https://github.com/Grossmanban/sinhron-website",
  releases: "https://github.com/Grossmanban/sinhron-website/releases",
  // List endpoint answers 200 [] when there are no releases (…/latest would 404 and log a console error).
  releasesApi: "https://api.github.com/repos/Grossmanban/sinhron-website/releases?per_page=5",
  issues: "https://github.com/Grossmanban/sinhron-website/issues",
  /** Absolute URL of the deployed site, used for sitemap / Open Graph. Override with NEXT_PUBLIC_SITE_URL. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://grossmanban.github.io/sinhron-website").replace(/\/$/, ""),
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? "",
} as const;

/** Prefix a public/ asset with basePath (next/link adds it for routes, but not for raw URLs). */
export function asset(path: string): string {
  return `${site.basePath}${path.startsWith("/") ? path : `/${path}`}`;
}
