import type { Metadata } from "next";
import { alternates } from "@/lib/seo";
import { getDict } from "@/content/dict";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { readContent } from "@/lib/docs";
import { renderMdx } from "@/lib/mdx";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const d = getDict(locale as Locale);
  return { title: d.changelog.title, description: d.changelog.lead, alternates: alternates(locale as Locale, "changelog/") };
}

export default async function Changelog({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const d = getDict(locale);
  const source = (await readContent(`changelog/${locale}.mdx`)) ?? "";
  return (
    <div className="container-x max-w-3xl pb-24 pt-[calc(7rem+env(safe-area-inset-top))] md:pt-36">
      <div className="enter-soft">
        <h1 className="t-display">{d.changelog.title}</h1>
        <p className="t-lead mt-4">{d.changelog.lead}</p>
      </div>
      <div className="prose-sn mt-6">{await renderMdx(source, locale, d)}</div>
    </div>
  );
}
