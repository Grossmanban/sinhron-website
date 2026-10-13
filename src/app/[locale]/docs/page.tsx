import type { Metadata } from "next";
import { alternates } from "@/lib/seo";
import Link from "next/link";
import { docsNav } from "@/content/docs/nav";
import { getDict } from "@/content/dict";
import { href, isLocale, locales, type Locale } from "@/lib/i18n";
import { Icon } from "@/components/ui/Icon";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const d = getDict(locale as Locale);
  return {
    title: d.docs.title,
    description: d.docs.lead,
    alternates: alternates(locale as Locale, "docs/"),
  };
}

export default async function DocsIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const d = getDict(locale);
  return (
    <div className="max-w-4xl">
      <p className="t-eyebrow">Sinhron</p>
      <h1 className="t-display mt-3">{d.docs.title}</h1>
      <p className="t-lead mt-4 max-w-2xl">{d.docs.lead}</p>
      <div className="mt-12 space-y-12">
        {docsNav.map((g) => (
          <section key={g.id} aria-labelledby={`g-${g.id}`}>
            <h2 id={`g-${g.id}`} className="text-[13px] font-semibold uppercase tracking-[0.08em] text-text-3">
              {g.title[locale]}
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {g.pages.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={href(locale, `/docs/${p.slug}`)}
                    className="group flex h-full flex-col rounded-[20px] border border-divider bg-card p-5 shadow-soft transition-[transform,box-shadow] duration-500 ease-out-expo hover:-translate-y-0.5 hover:shadow-lift"
                  >
                    <span className="flex items-center justify-between text-[17px] font-semibold tracking-[-0.015em] text-text">
                      {p.title[locale]}
                      <Icon name="arrowRight" size={18} className="text-text-3 transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                    </span>
                    <span className="mt-1.5 text-[14.5px] leading-relaxed text-text-2">{p.description[locale]}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
