"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { m } from "motion/react";
import { locales, switchLocalePath, LOCALE_STORAGE_KEY, type Locale } from "@/lib/i18n";
import { useI18n } from "./DictProvider";

/** RU / EN pill. Keeps the current page and anchor, remembers the choice. */
export function LanguageSwitch({ className = "", id = "lang" }: { className?: string; id?: string }) {
  const { locale, dict } = useI18n();
  const pathname = usePathname() ?? "/";

  const remember = (to: Locale, e: React.MouseEvent<HTMLAnchorElement>) => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, to);
    } catch {
      /* ignore */
    }
    if (window.location.hash) {
      // Carry the anchor across so the visitor stays on the same section.
      e.currentTarget.href = e.currentTarget.href.split("#")[0] + window.location.hash;
    }
  };

  return (
    <nav aria-label={dict.nav.language} className={`inline-flex rounded-full bg-[color-mix(in_srgb,var(--sn-text)_7%,transparent)] p-1 ${className}`}>
      {locales.map((l) => {
        const active = l === locale;
        return (
          <Link
            key={l}
            href={switchLocalePath(pathname, l)}
            hrefLang={l}
            lang={l}
            aria-current={active ? "true" : undefined}
            onClick={(e) => remember(l, e)}
            className={`relative grid h-9 min-w-11 place-items-center rounded-full px-2.5 text-[13px] font-semibold tracking-wide transition-colors ${
              active ? "text-text" : "text-text-2 hover:text-text"
            }`}
          >
            {active && <m.span layoutId={`${id}-pill`} className="absolute inset-0 rounded-full bg-elevated shadow-soft" />}
            <span className="relative">{l.toUpperCase()}</span>
          </Link>
        );
      })}
    </nav>
  );
}
