export const locales = ["ru", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && (locales as readonly string[]).includes(value);
}

export const localeNames: Record<Locale, string> = { ru: "Русский", en: "English" };
export const LOCALE_STORAGE_KEY = "sinhron.locale";

/** Path inside the site for a locale, e.g. href("ru", "/docs/faq") → "/ru/docs/faq/". */
export function href(locale: Locale, path = "/"): string {
  const [pathname, hash] = path.split("#");
  const clean = (pathname ?? "/").replace(/^\/+|\/+$/g, "");
  return `/${locale}/${clean ? `${clean}/` : ""}${hash ? `#${hash}` : ""}`;
}

/** Swap the locale prefix of a pathname (without basePath). */
export function switchLocalePath(pathname: string, to: Locale): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length && isLocale(parts[0])) parts.shift();
  return href(to, parts.join("/"));
}
