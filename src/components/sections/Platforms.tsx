"use client";

import Link from "next/link";
import { m } from "motion/react";
import { href } from "@/lib/i18n";
import { downloads } from "@/config/downloads";
import { useI18n } from "../DictProvider";
import { Icon, PlatformIcon } from "../ui/Icon";
import { Reveal, RevealItem, Stagger } from "../ui/Reveal";

export function Platforms() {
  const { locale, dict } = useI18n();
  const p = dict.platforms;
  return (
    <section className="section bg-bg-soft" aria-labelledby="platforms-title">
      <div className="container-x">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="t-eyebrow">{p.eyebrow}</p>
          <h2 id="platforms-title" className="t-display mt-4">
            {p.title}
          </h2>
          <p className="t-lead mx-auto mt-5 max-w-2xl">{p.lead}</p>
        </Reveal>
        <Stagger className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 md:mt-16 md:gap-4 lg:grid-cols-5" gap={0.06}>
          {downloads.map((d) => (
            <RevealItem key={d.id} className={d.id === "linux" ? "col-span-2 sm:col-span-1" : ""}>
              <m.div
                whileHover={{ y: -4 }}
                className="flex h-full flex-col items-center gap-3 rounded-[24px] border border-divider bg-card px-4 py-7 text-center shadow-soft"
              >
                <span className="text-text">
                  <PlatformIcon id={d.id} size={34} />
                </span>
                <span className="text-[16px] font-semibold text-text">{d.name}</span>
                <span className="font-mono text-[12px] text-text-3">{d.formats.join(" · ")}</span>
                {d.status === "soon" && (
                  <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[12px] font-semibold text-accent">{p.soon}</span>
                )}
              </m.div>
            </RevealItem>
          ))}
        </Stagger>
        <Reveal className="mt-10 text-center">
          <Link href={href(locale, "/download")} className="inline-flex min-h-11 items-center gap-1.5 text-[16px] font-medium text-accent">
            {p.cta}
            <Icon name="chevronRight" size={18} />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
