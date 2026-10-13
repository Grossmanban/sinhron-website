import type { Metadata } from "next";
import { alternates } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { docPages, docsNav } from "@/content/docs/nav";
import { getDict } from "@/content/dict";
import { href, isLocale, locales, type Locale } from "@/lib/i18n";
import { extractHeadings, readDoc } from "@/lib/docs";
import { renderMdx } from "@/lib/mdx";
import { site } from "@/config/site";
import { Toc } from "@/components/docs/Toc";
import { Icon } from "@/components/ui/Icon";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => docPages.map((p) => ({ locale, slug: p.slug })));
}

type Params = Promise<{ locale: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = docPages.find((p) => p.slug === slug);
  if (!page || !isLocale(locale)) return {};
  return {
    title: page.title[locale],
    description: page.description[locale],
    alternates: alternates(locale, `docs/${slug}/`),
    openGraph: { title: `${page.title[locale]} · Sinhron`, description: page.description[locale] },
  };
}

export default async function DocPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const index = docPages.findIndex((p) => p.slug === slug);
  const page = docPages[index];
  const doc = page ? await readDoc(locale, slug) : null;
  if (!page || !doc) notFound();

  const d = getDict(locale);
  const content = await renderMdx(doc.source, locale, d);
  const headings = extractHeadings(doc.source);
  const group = docsNav.find((g) => g.pages.some((p) => p.slug === slug));
  const prev = docPages[index - 1];
  const next = docPages[index + 1];
  const editUrl = `${site.siteRepo}/edit/main/src/content/docs/${doc.lang}/${slug}.mdx`;

  return (
    <div className="flex gap-12">
      <article className="min-w-0 max-w-[46rem] flex-1">
        <p className="t-eyebrow">{group?.title[locale]}</p>
        <h1 className="mt-3 text-[clamp(2rem,1.5rem+2vw,3.1rem)] font-[650] leading-[1.06] tracking-[-0.035em] text-text">{page.title[locale]}</h1>
        <p className="t-lead mt-4 text-[1.2rem]">{page.description[locale]}</p>
        {!doc.translated && (
          <p lang={locale} className="mt-6 rounded-2xl border border-divider-strong bg-bg-soft px-4 py-3 text-[14.5px] text-text-2">
            {d.docs.translationSoon}
          </p>
        )}
        <div lang={doc.lang} className="prose-sn mt-10">
          {content}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-divider pt-6 text-[14px]">
          <a href={editUrl} rel="noopener" className="inline-flex min-h-11 items-center gap-1.5 text-text-2 hover:text-text">
            <Icon name="github" size={16} />
            {d.docs.edit}
          </a>
        </div>
        <nav className="mt-6 grid gap-3 sm:grid-cols-2" aria-label={`${d.docs.previous} / ${d.docs.next}`}>
          {prev ? (
            <Link href={href(locale as Locale, `/docs/${prev.slug}`)} className="group rounded-2xl border border-divider p-4 transition-colors hover:border-accent/40">
              <span className="flex items-center gap-1 text-[13px] text-text-3">
                <Icon name="chevronLeft" size={15} />
                {d.docs.previous}
              </span>
              <span className="mt-1 block text-[16px] font-medium text-text group-hover:text-accent">{prev.title[locale]}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={href(locale as Locale, `/docs/${next.slug}`)} className="group rounded-2xl border border-divider p-4 text-right transition-colors hover:border-accent/40">
              <span className="flex items-center justify-end gap-1 text-[13px] text-text-3">
                {d.docs.next}
                <Icon name="chevronRight" size={15} />
              </span>
              <span className="mt-1 block text-[16px] font-medium text-text group-hover:text-accent">{next.title[locale]}</span>
            </Link>
          )}
        </nav>
      </article>
      <Toc headings={headings} />
    </div>
  );
}
