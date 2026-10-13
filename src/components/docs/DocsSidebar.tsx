"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "motion/react";
import { useEffect, useState } from "react";
import { docsNav } from "@/content/docs/nav";
import { href } from "@/lib/i18n";
import { useI18n } from "../DictProvider";
import { Icon } from "../ui/Icon";
import { DocsSearch } from "./DocsSearch";

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const { locale } = useI18n();
  const pathname = usePathname() ?? "";
  return (
    <nav className="space-y-7">
      {docsNav.map((g) => (
        <div key={g.id}>
          <h2 className="px-3 text-[12px] font-semibold uppercase tracking-[0.08em] text-text-3">{g.title[locale]}</h2>
          <ul className="mt-2 space-y-0.5">
            {g.pages.map((p) => {
              const to = href(locale, `/docs/${p.slug}`);
              const active = pathname.replace(/\/?$/, "/") === to;
              return (
                <li key={p.slug}>
                  <Link
                    href={to}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={`relative flex min-h-10 items-center rounded-xl px-3 text-[15px] transition-colors ${
                      active ? "font-medium text-accent" : "text-text-2 hover:bg-bg-soft hover:text-text"
                    }`}
                  >
                    {active && <m.span layoutId="docs-active" className="absolute inset-0 rounded-xl bg-accent-soft" />}
                    <span className="relative">{p.title[locale]}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

/**
 * Pinned sidebar from `lg` (laptop, iPad landscape); a slide-in panel below that
 * (iPhone, iPad portrait) opened from a sticky bar under the site nav.
 */
export function DocsSidebar() {
  const { dict } = useI18n();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // Close the menu on navigation (state adjusted during render, per React docs).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* pinned */}
      <aside className="sticky top-20 hidden max-h-[calc(100dvh-6rem)] w-64 shrink-0 overflow-y-auto pb-10 pr-2 lg:block">
        <DocsSearch />
        <div className="mt-6">
          <NavList />
        </div>
      </aside>

      {/* compact bar */}
      <div className="glass sticky top-14 z-30 -mx-5 flex items-center gap-2 border-b border-divider px-5 py-2 md:top-16 md:-mx-10 md:px-10 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="docs-drawer"
          className="flex min-h-11 items-center gap-2 rounded-full pr-3 text-[15px] font-medium text-text"
        >
          <Icon name="menu" size={20} />
          {dict.docs.menu}
        </button>
        <div className="ml-auto">
          <DocsSearch compact />
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <>
            <m.div
              className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <m.div
              id="docs-drawer"
              role="dialog"
              aria-modal="true"
              aria-label={dict.docs.menu}
              className="fixed inset-y-0 left-0 z-[61] w-[min(86vw,340px)] overflow-y-auto bg-elevated px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[calc(1rem+env(safe-area-inset-top))] shadow-lift lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
            >
              <div className="mb-6 flex items-center justify-between pl-3">
                <span className="text-[17px] font-semibold text-text">{dict.docs.title}</span>
                <button type="button" onClick={() => setOpen(false)} aria-label={dict.nav.closeMenu} className="grid size-11 place-items-center rounded-full text-text-2">
                  <Icon name="close" size={20} />
                </button>
              </div>
              <NavList onNavigate={() => setOpen(false)} />
            </m.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
