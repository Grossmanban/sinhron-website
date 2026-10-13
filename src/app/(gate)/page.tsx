import { site } from "@/config/site";
import { LOCALE_STORAGE_KEY } from "@/lib/i18n";
import { LogoMark } from "@/components/ui/Logo";

// GitHub Pages can't redirect by Accept-Language, so the root picks a language on the client:
// remembered choice → browser language → English. Without JS the two links below still work.
const pick = `(function(){var b='${site.basePath}';var l;try{l=localStorage.getItem('${LOCALE_STORAGE_KEY}')}catch(e){}
if(l!=='ru'&&l!=='en'){var n=(navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||'en']);
l='en';for(var i=0;i<n.length;i++){var c=String(n[i]).toLowerCase();if(c.indexOf('ru')===0){l='ru';break}if(c.indexOf('en')===0){break}}}
location.replace(b+'/'+l+'/'+location.hash);})();`;

export default function Gate() {
  return (
    <main className="grid min-h-dvh place-items-center px-6">
      <script dangerouslySetInnerHTML={{ __html: pick }} />
      <div className="flex flex-col items-center gap-8 text-center">
        <LogoMark size={64} />
        <p className="text-[15px] text-text-2">Choose your language · Выберите язык</p>
        <div className="flex gap-3">
          <a href={`${site.basePath}/en/`} hrefLang="en" className="rounded-full bg-button px-6 py-3 font-medium text-white">
            English
          </a>
          <a href={`${site.basePath}/ru/`} hrefLang="ru" lang="ru" className="rounded-full bg-bg-soft px-6 py-3 font-medium text-text ring-1 ring-divider">
            Русский
          </a>
        </div>
      </div>
    </main>
  );
}
