import type { Metadata } from "next";
import { alternates } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict } from "@/content/dict";
import { posts } from "@/content/blog/posts";
import { href, isLocale, locales, type Locale } from "@/lib/i18n";
import { formatDate } from "@/lib/format";
import { readContent } from "@/lib/docs";
import { renderMdx } from "@/lib/mdx";
import { Icon } from "@/components/ui/Icon";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => posts.map((p) => ({ locale, slug: p.slug })));
}

type Params = Promise<{ locale: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = posts.find((x) => x.slug === slug);
  if (!p || !isLocale(locale)) return {};
  return { title: p.title[locale], description: p.summary[locale], alternates: alternates(locale, `blog/${slug}/`), openGraph: { type: "article", publishedTime: p.date } };
}

export default async function PostPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const p = posts.find((x) => x.slug === slug);
  if (!p || !isLocale(locale)) notFound();
  const source = (await readContent(`blog/${locale}/${slug}.mdx`)) ?? (await readContent(`blog/${locale === "ru" ? "en" : "ru"}/${slug}.mdx`));
  if (!source) notFound();
  const d = getDict(locale as Locale);
  return (
    <article className="container-x max-w-3xl pb-24 pt-[calc(7rem+env(safe-area-inset-top))] md:pt-36">
      <Link href={href(locale, "/blog")} className="inline-flex min-h-11 items-center gap-1 text-[15px] text-text-2 hover:text-text">
        <Icon name="chevronLeft" size={17} />
        {d.blog.back}
      </Link>
      <time dateTime={p.date} className="mt-6 block text-[14px] text-text-3">
        {formatDate(p.date, locale)}
      </time>
      <h1 className="t-display mt-3">{p.title[locale]}</h1>
      <div className="prose-sn mt-10">{await renderMdx(source, locale, d)}</div>
    </article>
  );
}
