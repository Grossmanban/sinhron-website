"use client";

import Link from "next/link";
import { href } from "@/lib/i18n";
import { site } from "@/config/site";
import { useI18n } from "./DictProvider";
import { Logo } from "./ui/Logo";
import { ThemeSegmented } from "./ThemeControl";
import { LanguageSwitch } from "./LanguageSwitch";

export function Footer() {
  const { locale, dict } = useI18n();
  const f = dict.footer;
  const cols = [
    {
      title: f.product,
      links: [
        { label: dict.nav.features, to: href(locale, "/#features") },
        { label: dict.nav.security, to: href(locale, "/#security") },
        { label: dict.nav.selfHost, to: href(locale, "/docs/self-hosting") },
        { label: dict.nav.download, to: href(locale, "/download") },
      ],
    },
    {
      title: f.resources,
      links: [
        { label: dict.nav.docs, to: href(locale, "/docs") },
        { label: f.faq, to: href(locale, "/docs/faq") },
        { label: f.roadmap, to: href(locale, "/docs/roadmap") },
        { label: dict.open.items[1]!.title, to: href(locale, "/docs/threat-model") },
      ],
    },
    {
      title: f.project,
      links: [
        { label: "GitHub", to: site.github },
        { label: f.blog, to: href(locale, "/blog") },
        { label: f.changelog, to: href(locale, "/changelog") },
        { label: f.press, to: href(locale, "/press") },
      ],
    },
  ];

  return (
    <footer className="border-t border-divider bg-bg pb-[max(2.5rem,env(safe-area-inset-bottom))] pt-16">
      <div className="container-x">
        <div className="grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-[15px] leading-relaxed text-text-2">{f.tagline}</p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 md:contents">
            {cols.map((c) => (
              <div key={c.title}>
                <h2 className="text-[13px] font-semibold text-text">{c.title}</h2>
                <ul className="mt-4 space-y-1">
                  {c.links.map((l) => (
                    <li key={l.to + l.label}>
                      {/^https?:/.test(l.to) ? (
                        <a href={l.to} rel="noopener" className="inline-block py-1.5 text-[14.5px] text-text-2 transition-colors hover:text-text">
                          {l.label}
                        </a>
                      ) : (
                        <Link href={l.to} className="inline-block py-1.5 text-[14.5px] text-text-2 transition-colors hover:text-text">
                          {l.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-6 border-t border-divider pt-8 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1 text-[13px] text-text-3">
            <p>{f.noTracking}</p>
            <p>
              © {new Date().getFullYear()} Sinhron · {f.license}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitch id="footer-lang" />
            <ThemeSegmented />
          </div>
        </div>
      </div>
    </footer>
  );
}
