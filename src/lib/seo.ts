import type { Metadata } from "next";
import { site } from "@/config/site";
import { locales, type Locale } from "./i18n";

/** canonical + hreflang links for a page that exists in every locale. `path` like "docs/faq/" or "". */
export function alternates(locale: Locale, path: string): Metadata["alternates"] {
  const p = path.replace(/^\/+/, "");
  return {
    canonical: `${site.url}/${locale}/${p}`,
    languages: { ...Object.fromEntries(locales.map((l) => [l, `${site.url}/${l}/${p}`])), "x-default": `${site.url}/en/${p}` },
  };
}
