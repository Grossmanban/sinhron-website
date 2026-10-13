"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, m } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { href } from "@/lib/i18n";
import { site } from "@/config/site";
import { useI18n } from "../DictProvider";
import { Icon } from "../ui/Icon";

interface Entry {
  slug: string;
  page: string;
  heading: string;
  id: string;
  text: string;
}

const cache = new Map<string, Promise<Entry[]>>();
function loadIndex(locale: string) {
  if (!cache.has(locale)) {
    cache.set(
      locale,
      fetch(`${site.basePath}/${locale}/docs/search-index.json`)
        .then((r) => (r.ok ? r.json() : []))
        .catch(() => []),
    );
  }
  return cache.get(locale)!;
}

const norm = (s: string) => s.toLowerCase().replace(/ё/g, "е");

function search(entries: Entry[], q: string) {
  const terms = norm(q).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const scored: { e: Entry; score: number; snippet: string }[] = [];
  for (const e of entries) {
    const head = norm(`${e.page} ${e.heading}`);
    const body = norm(e.text);
    let score = 0;
    let ok = true;
    for (const t of terms) {
      const inHead = head.includes(t);
      const inBody = body.includes(t);
      if (!inHead && !inBody) {
        ok = false;
        break;
      }
      score += (inHead ? 10 : 0) + (inBody ? 1 : 0);
    }
    if (!ok) continue;
    const at = body.indexOf(terms[0]!);
    const start = Math.max(0, at - 50);
    const snippet = at < 0 ? e.text.slice(0, 120) : (start ? "…" : "") + e.text.slice(start, start + 150) + "…";
    scored.push({ e, score, snippet });
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, 12);
}

function Highlight({ text, q }: { text: string; q: string }) {
  const terms = norm(q).split(/\s+/).filter((t) => t.length > 1);
  if (!terms.length) return <>{text}</>;
  const re = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  const n = norm(text);
  const parts: React.ReactNode[] = [];
  let last = 0;
  n.replace(re, (m, _g, i: number) => {
    parts.push(text.slice(last, i), <mark key={i} className="rounded bg-accent-soft px-0.5 text-accent">{text.slice(i, i + m.length)}</mark>);
    last = i + m.length;
    return m;
  });
  parts.push(text.slice(last));
  return <>{parts}</>;
}

/** Client-side docs search (⌘K / Ctrl K / "/"). The index is a static JSON built with the site. */
export function DocsSearch({ compact = false }: { compact?: boolean }) {
  const { locale, dict } = useI18n();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const results = useMemo(() => search(entries, q), [entries, q]);

  const show = useCallback(() => {
    setOpen(true);
    loadIndex(locale).then(setEntries);
  }, [locale]);

  useEffect(() => {
    if (compact) return; // only one instance owns the shortcut
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const typing = t.isContentEditable || /input|textarea|select/i.test(t.tagName);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        show();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [compact, show]);

  useEffect(() => {
    if (!open) return;
    setTimeout(() => input.current?.focus(), 30);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const go = (r: Entry) => {
    setOpen(false);
    setQ("");
    router.push(`${href(locale, `/docs/${r.slug}`)}${r.id ? `#${r.id}` : ""}`);
  };

  return (
    <>
      {compact ? (
        <button type="button" onClick={show} aria-label={dict.docs.search} className="grid size-11 place-items-center rounded-full text-text-2 hover:text-text">
          <Icon name="search" size={20} />
        </button>
      ) : (
        <button
          type="button"
          onClick={show}
          className="flex h-11 w-full items-center gap-2 rounded-xl border border-divider-strong bg-card px-3 text-[14.5px] text-text-3 transition-colors hover:border-accent/40"
        >
          <Icon name="search" size={17} />
          <span className="flex-1 truncate text-left">{dict.docs.search}</span>
          <kbd className="rounded-md border border-divider-strong px-1.5 font-mono text-[11px]">⌘K</kbd>
        </button>
      )}

      <AnimatePresence>
        {open && (
          <m.div
            className="fixed inset-0 z-[70] flex items-start justify-center bg-black/35 px-4 pt-[max(1rem,env(safe-area-inset-top))] backdrop-blur-sm sm:pt-[12vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <m.div
              role="dialog"
              aria-modal="true"
              aria-label={dict.docs.search}
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 420, damping: 34 }}
              onClick={(e) => e.stopPropagation()}
              className="flex max-h-[min(70dvh,560px)] w-full max-w-xl flex-col overflow-hidden rounded-[22px] border border-divider-strong bg-elevated shadow-lift"
            >
              <div className="flex items-center gap-3 border-b border-divider px-4">
                <Icon name="search" size={19} className="text-text-3" />
                <input
                  ref={input}
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setActive(0);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setOpen(false);
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      setActive((a) => Math.min(a + 1, results.length - 1));
                    }
                    if (e.key === "ArrowUp") {
                      e.preventDefault();
                      setActive((a) => Math.max(a - 1, 0));
                    }
                    if (e.key === "Enter" && results[active]) go(results[active].e);
                  }}
                  placeholder={dict.docs.searchPlaceholder}
                  className="h-14 flex-1 bg-transparent text-[16px] text-text outline-none placeholder:text-text-3 focus-visible:outline-none"
                  aria-label={dict.docs.searchPlaceholder}
                  enterKeyHint="search"
                />
                <button type="button" onClick={() => setOpen(false)} className="grid size-11 place-items-center text-text-3" aria-label={dict.nav.closeMenu}>
                  <Icon name="close" size={18} />
                </button>
              </div>
              <ul className="overflow-y-auto p-2" role="listbox" aria-label={dict.docs.search}>
                {q && results.length === 0 && <li className="px-4 py-10 text-center text-[15px] text-text-3">{dict.docs.noResults}</li>}
                {results.map(({ e, snippet }, i) => (
                  <li key={`${e.slug}-${e.id}-${i}`} role="option" aria-selected={i === active}>
                    <Link
                      href={`${href(locale, `/docs/${e.slug}`)}${e.id ? `#${e.id}` : ""}`}
                      onClick={() => setOpen(false)}
                      onMouseEnter={() => setActive(i)}
                      className={`block rounded-xl px-4 py-3 ${i === active ? "bg-accent-soft" : ""}`}
                    >
                      <span className="block text-[12px] font-medium text-text-3">{e.page}</span>
                      <span className="block text-[15px] font-medium text-text">
                        <Highlight text={e.heading} q={q} />
                      </span>
                      <span className="mt-0.5 line-clamp-2 block text-[13.5px] leading-snug text-text-2">
                        <Highlight text={snippet} q={q} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
