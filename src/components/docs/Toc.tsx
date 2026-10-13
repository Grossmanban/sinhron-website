"use client";

import { useEffect, useState } from "react";
import { useI18n } from "../DictProvider";

/** "On this page" with scroll-spy. */
export function Toc({ headings }: { headings: { depth: number; text: string; id: string }[] }) {
  const { dict } = useI18n();
  const [active, setActive] = useState<string | null>(headings[0]?.id ?? null);
  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-80px 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [headings]);
  if (headings.length < 2) return null;
  return (
    <nav aria-label={dict.docs.onThisPage} className="sticky top-24 hidden max-h-[calc(100dvh-8rem)] w-56 shrink-0 overflow-y-auto xl:block">
      <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-text-3">{dict.docs.onThisPage}</p>
      <ul className="mt-3 space-y-1 border-l border-divider-strong">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className={`-ml-px block border-l py-1 text-[13.5px] leading-snug transition-colors ${h.depth === 3 ? "pl-6" : "pl-3.5"} ${
                active === h.id ? "border-accent font-medium text-accent" : "border-transparent text-text-2 hover:text-text"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
