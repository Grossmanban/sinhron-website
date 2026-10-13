import { docPages } from "@/content/docs/nav";
import { locales, isLocale } from "@/lib/i18n";
import { readDoc, toSearchEntries } from "@/lib/docs";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return Response.json([]);
  const entries = [];
  for (const p of docPages) {
    const doc = await readDoc(locale, p.slug);
    if (doc) entries.push(...toSearchEntries(p.slug, p.title[locale], doc.source));
  }
  return Response.json(entries);
}
