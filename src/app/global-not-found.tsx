import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { site } from "@/config/site";
import { themeBootScript } from "@/lib/theme";
import { en } from "@/content/dict/en";
import { ru } from "@/content/dict/ru";
import { LogoMark } from "@/components/ui/Logo";
import "./globals.css";

export const metadata: Metadata = { title: "404 · Sinhron" };

// GitHub Pages serves this as 404.html for any path. It shows both languages and highlights the one
// that matches the URL (/ru/… or /en/…) on the client.
const pickLang = `(function(){var p=location.pathname.replace('${site.basePath}','');var ru=p.indexOf('/ru/')===0||(p.indexOf('/en/')!==0&&(navigator.language||'').toLowerCase().indexOf('ru')===0);document.documentElement.lang=ru?'ru':'en';document.documentElement.dataset.lang=ru?'ru':'en';})();`;

export default function GlobalNotFound() {
  return (
    <html lang="en" className={GeistSans.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript + pickLang }} />
        <style>{`html[data-lang="ru"] [data-l="en"],html:not([data-lang="ru"]) [data-l="ru"]{display:none}`}</style>
      </head>
      <body>
        <main className="grid min-h-dvh place-items-center px-6 text-center">
          <div className="flex max-w-xl flex-col items-center">
            <LogoMark size={56} />
            <p className="mt-10 font-mono text-[15px] text-text-3">404</p>
            {([["en", en], ["ru", ru]] as const).map(([l, d]) => (
              <div key={l} data-l={l} lang={l}>
                <h1 className="t-title mt-3">{d.notFound.title}</h1>
                <p className="t-lead mt-4">{d.notFound.lead}</p>
                <a href={`${site.basePath}/${l}/`} className="mt-8 inline-flex h-12 items-center rounded-full bg-button px-6 font-medium text-white">
                  {d.common.backHome}
                </a>
              </div>
            ))}
          </div>
        </main>
      </body>
    </html>
  );
}
