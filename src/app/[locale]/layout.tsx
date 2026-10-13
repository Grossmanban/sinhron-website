import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { getDict } from "@/content/dict";
import { isLocale, locales } from "@/lib/i18n";
import { themeBootScript } from "@/lib/theme";
import { site, asset } from "@/config/site";
import { DictProvider } from "@/components/DictProvider";
import { Providers } from "@/components/Providers";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import "../globals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF9F6" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1016" },
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = getDict(locale);
  return {
    metadataBase: new URL(`${site.url}/`),
    title: { default: d.meta.title, template: "%s · Sinhron" },
    description: d.meta.description,
    applicationName: "Sinhron",
    icons: { icon: asset("/favicon.svg"), apple: asset("/apple-touch-icon.png") },
    openGraph: {
      type: "website",
      siteName: "Sinhron",
      locale: locale === "ru" ? "ru_RU" : "en_US",
      title: d.meta.title,
      description: d.meta.description,
      images: [{ url: `${site.url}/og-${locale}.png`, width: 1200, height: 630, alt: d.meta.ogAlt }],
    },
    twitter: { card: "summary_large_image", title: d.meta.title, description: d.meta.description, images: [`${site.url}/og-${locale}.png`] },
    formatDetection: { telephone: false },
  };
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDict(locale);
  return (
    <html lang={locale} className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body>
        <DictProvider locale={locale} dict={dict}>
          <Providers>
            <Nav />
            <main id="main">{children}</main>
            <Footer />
          </Providers>
        </DictProvider>
      </body>
    </html>
  );
}
