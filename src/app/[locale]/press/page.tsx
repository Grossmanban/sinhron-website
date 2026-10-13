import type { Metadata } from "next";
import { alternates } from "@/lib/seo";
import { getDict } from "@/content/dict";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { asset } from "@/config/site";
import { LogoMark } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const d = getDict(locale as Locale);
  return { title: d.press.title, description: d.press.lead, alternates: alternates(locale as Locale, "press/") };
}

const colors = [
  { name: "Accent", hex: "#2D6FF7" },
  { name: "Accent · dark", hex: "#4F8AFF" },
  { name: "Ink", hex: "#0E141B" },
  { name: "Paper", hex: "#FAF9F6" },
  { name: "Night", hex: "#0B1016" },
  { name: "Success", hex: "#1FAF6E" },
];

export default async function Press({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) return null;
  const t = getDict(locale).press;
  return (
    <div className="container-x max-w-5xl pb-24 pt-[calc(7rem+env(safe-area-inset-top))] md:pt-36">
      <div className="enter-soft">
        <h1 className="t-display">{t.title}</h1>
        <p className="t-lead mt-4 max-w-2xl">{t.lead}</p>
      </div>
      <div className="mt-14 grid gap-4 md:grid-cols-2">
        <Reveal className="rounded-[24px] border border-divider bg-card p-7 shadow-soft">
          <h2 className="text-[19px] font-semibold text-text">{t.logo}</h2>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="grid h-36 place-items-center rounded-2xl bg-[#FAF9F6] ring-1 ring-divider">
              <div style={{ ["--sn-bg" as string]: "#FAF9F6", ["--sn-accent" as string]: "#2D6FF7" }}>
                <LogoMark size={64} />
              </div>
            </div>
            <div className="sn-dark grid h-36 place-items-center rounded-2xl">
              <LogoMark size={64} />
            </div>
          </div>
          <a href={asset("/brand/sinhron-mark.svg")} download className="mt-5 inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-accent">
            <Icon name="download" size={17} />
            {t.download}
          </a>
        </Reveal>
        <Reveal className="rounded-[24px] border border-divider bg-card p-7 shadow-soft">
          <h2 className="text-[19px] font-semibold text-text">{t.colors}</h2>
          <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {colors.map((c) => (
              <li key={c.hex}>
                <span className="block h-16 rounded-xl ring-1 ring-divider-strong" style={{ background: c.hex }} />
                <span className="mt-2 block text-[13px] font-medium text-text">{c.name}</span>
                <span className="block font-mono text-[12px] text-text-3">{c.hex}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal className="rounded-[24px] border border-divider bg-card p-7 shadow-soft md:col-span-2">
          <h2 className="text-[19px] font-semibold text-text">{t.about}</h2>
          <p className="mt-3 max-w-3xl text-[16px] leading-relaxed text-text-2">{t.aboutText}</p>
        </Reveal>
      </div>
    </div>
  );
}
