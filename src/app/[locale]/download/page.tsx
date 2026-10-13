import type { Metadata } from "next";
import { alternates } from "@/lib/seo";
import { getDict } from "@/content/dict";
import { href, isLocale, locales, type Locale } from "@/lib/i18n";
import { site } from "@/config/site";
import { DownloadPanel } from "@/components/DownloadPanel";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { LogoMark } from "@/components/ui/Logo";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const d = getDict(locale as Locale);
  return {
    title: d.download.title,
    description: d.download.lead,
    alternates: alternates(locale as Locale, "download/"),
  };
}

export default async function DownloadPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const t = getDict(locale).download;
  return (
    <div className="relative overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--sn-accent)_22%,transparent),transparent)]" />
      <div className="container-x relative pb-24 pt-[calc(7rem+env(safe-area-inset-top))] md:pt-36">
        <div className="enter-soft mx-auto max-w-3xl text-center">
          <div className="flex justify-center">
            <LogoMark size={64} />
          </div>
          <h1 className="t-display mt-8">{t.title}</h1>
          <p className="t-lead mx-auto mt-5 max-w-2xl">{t.lead}</p>
        </div>

        <DownloadPanel />

        <div className="mt-20 grid gap-4 md:grid-cols-3">
          <Reveal className="rounded-[24px] border border-divider bg-card p-7 shadow-soft md:col-span-3">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-xl bg-accent-soft text-accent">
                <Icon name="shield" size={20} />
              </span>
              <h2 className="text-[19px] font-semibold text-text">{t.verifyTitle}</h2>
            </div>
            <p className="mt-3 text-[15px] text-text-2">{t.verifyText}</p>
            <pre className="mt-4 overflow-x-auto rounded-2xl bg-[#0d131b] p-4 font-mono text-[13px] leading-relaxed text-[#d6dde8]">
              <span className="text-[#8fa3bd]"># macOS / Linux</span>
              {"\n"}shasum -a 256 Sinhron-*.dmg{"\n\n"}
              <span className="text-[#8fa3bd]"># Windows (PowerShell)</span>
              {"\n"}Get-FileHash .\Sinhron-*.msix -Algorithm SHA256
            </pre>
            <p className="mt-3 text-[13.5px] text-text-3">{t.verifyHint}</p>
          </Reveal>
          <Reveal className="flex flex-col rounded-[24px] border border-divider bg-card p-7 shadow-soft md:col-span-2">
            <h2 className="text-[19px] font-semibold text-text">{t.serverTitle}</h2>
            <p className="mt-2 flex-1 text-[15px] text-text-2">{t.serverText}</p>
            <div className="mt-5">
              <Button href={href(locale, "/docs/self-hosting")} variant="secondary">
                {t.serverCta}
                <Icon name="arrowRight" size={17} />
              </Button>
            </div>
          </Reveal>
          <Reveal className="flex flex-col rounded-[24px] border border-divider bg-card p-7 shadow-soft">
            <h2 className="text-[19px] font-semibold text-text">{t.sourceTitle}</h2>
            <p className="mt-2 flex-1 text-[15px] text-text-2">{t.sourceText}</p>
            <a href={`${site.repo}/tree/main/docs`} rel="noopener" className="mt-5 inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-accent">
              {t.sourceCta}
              <Icon name="arrowUpRight" size={16} />
            </a>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
