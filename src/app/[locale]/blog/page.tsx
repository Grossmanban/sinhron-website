import type { Metadata } from "next";
import { alternates } from "@/lib/seo";
import Link from "next/link";
import { getDict } from "@/content/dict";
import { posts } from "@/content/blog/posts";
import { href, isLocale, locales, type Locale } from "@/lib/i18n";
import { formatDate } from "@/lib/format";
import { Icon } from "@/components/ui/Icon";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const d = getDict(locale as Locale);
  return { title: d.blog.title, description: d.blog.lead, alternates: alternates(locale as Locale, "blog/") };
}

export default async function Blog({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const d = getDict(locale);
  return (
    <div className="container-x max-w-3xl pb-24 pt-[calc(7rem+env(safe-area-inset-top))] md:pt-36">
      <div className="enter-soft">
        <h1 className="t-display">{d.blog.title}</h1>
        <p className="t-lead mt-4">{d.blog.lead}</p>
      </div>
      <ul className="mt-14 divide-y divide-divider border-y border-divider">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link href={href(locale, `/blog/${p.slug}`)} className="group block py-8">
              <time dateTime={p.date} className="text-[13px] text-text-3">
                {formatDate(p.date, locale)}
              </time>
              <h2 className="mt-2 text-[24px] font-semibold tracking-[-0.025em] text-text group-hover:text-accent">{p.title[locale]}</h2>
              <p className="mt-2 text-[16px] text-text-2">{p.summary[locale]}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-[15px] font-medium text-accent">
                {d.blog.read}
                <Icon name="arrowRight" size={16} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
