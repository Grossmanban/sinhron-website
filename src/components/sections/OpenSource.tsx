"use client";

import Link from "next/link";
import { href } from "@/lib/i18n";
import { site } from "@/config/site";
import { useI18n } from "../DictProvider";
import { Icon, type IconName } from "../ui/Icon";
import { Reveal, RevealItem, Stagger } from "../ui/Reveal";

export function OpenSource() {
  const { locale, dict } = useI18n();
  const o = dict.open;
  const targets: { to: string; icon: IconName }[] = [
    { to: site.repo, icon: "code" },
    { to: href(locale, "/docs/threat-model"), icon: "shield" },
    { to: href(locale, "/docs/roadmap"), icon: "map" },
  ];
  return (
    <section className="section" aria-labelledby="open-title">
      <div className="container-x">
        <Reveal className="max-w-3xl">
          <p className="t-eyebrow">{o.eyebrow}</p>
          <h2 id="open-title" className="t-display mt-4">
            {o.title}
          </h2>
          <p className="t-lead mt-5 max-w-2xl">{o.lead}</p>
        </Reveal>
        <Stagger className="mt-12 grid gap-4 md:mt-16 md:grid-cols-3 md:gap-5">
          {o.items.map((it, i) => {
            const t = targets[i]!;
            const external = /^https?:/.test(t.to);
            const inner = (
              <>
                <span className="grid size-11 place-items-center rounded-2xl bg-bg-soft text-text">
                  <Icon name={t.icon} size={22} />
                </span>
                <h3 className="mt-6 text-[20px] font-semibold tracking-[-0.02em] text-text">{it.title}</h3>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-text-2">{it.text}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-medium text-accent">
                  {it.link}
                  <Icon name={external ? "arrowUpRight" : "arrowRight"} size={17} className="transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </>
            );
            const cls = "group flex h-full flex-col rounded-[24px] border border-divider bg-card p-7 shadow-soft transition-[transform,box-shadow] duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-lift";
            return (
              <RevealItem key={it.title}>
                {external ? (
                  <a href={t.to} rel="noopener" className={cls}>
                    {inner}
                  </a>
                ) : (
                  <Link href={t.to} className={cls}>
                    {inner}
                  </Link>
                )}
              </RevealItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
