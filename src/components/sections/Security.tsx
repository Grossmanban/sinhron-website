"use client";

import { AnimatePresence, m, useInView } from "motion/react";
import { useRef, useState } from "react";
import { useI18n } from "../DictProvider";
import { Icon, type IconName } from "../ui/Icon";
import { Reveal, RevealItem, Stagger } from "../ui/Reveal";

const icons: Record<string, IconName> = {
  mls: "lock",
  server: "server",
  sframe: "video",
  telemetry: "eyeOff",
  device: "shield",
  key: "key",
};

function Pillar({ k, title, text, tech }: { k: string; title: string; text: string; tech: string }) {
  const { dict } = useI18n();
  const [open, setOpen] = useState(false);
  const id = `pillar-${k}`;
  return (
    <RevealItem className="h-full">
      <article className="flex h-full flex-col rounded-[24px] border border-divider bg-card p-6 shadow-soft md:p-7">
        <span className="grid size-11 place-items-center rounded-2xl bg-accent-soft text-accent">
          <Icon name={icons[k] ?? "lock"} size={22} />
        </span>
        <h3 className="mt-5 text-[20px] font-semibold tracking-[-0.02em] text-text">{title}</h3>
        <p className="mt-2 flex-1 text-[15.5px] leading-relaxed text-text-2">{text}</p>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((v) => !v)}
          className="mt-4 inline-flex min-h-11 items-center gap-1.5 self-start text-[14px] font-medium text-accent"
        >
          {open ? dict.security.hideDetails : dict.security.showDetails}
          <m.span animate={{ rotate: open ? 180 : 0 }}>
            <Icon name="chevronDown" size={16} />
          </m.span>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <m.div
              id={id}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <p className="mt-1 rounded-2xl bg-bg-soft p-4 font-mono text-[12.5px] leading-relaxed text-text-2">{tech}</p>
            </m.div>
          )}
        </AnimatePresence>
      </article>
    </RevealItem>
  );
}

/** 60 digits in 12 groups of 5 — the app's safety-number layout. Illustrative digits. */
const DIGITS = "38271 90416 52830 17694 40128 66735 92051 13847 75602 28419 61370 04593".split(" ");

function SafetyNumber() {
  const { dict } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true, amount: 0.5 });
  return (
    <Reveal className="mt-5">
      <div ref={ref} className="grid items-center gap-8 overflow-hidden rounded-[28px] border border-divider bg-card p-6 shadow-soft md:grid-cols-[1fr_auto] md:p-10">
        <div>
          <h3 className="t-title">{dict.security.safety.title}</h3>
          <p className="t-lead mt-3 max-w-lg text-[17px]">{dict.security.safety.text}</p>
        </div>
        <div className="relative justify-self-center md:justify-self-end">
          <div className="grid grid-cols-4 gap-x-4 gap-y-2.5 font-mono text-[15px] tracking-wider text-text sm:text-[17px]" aria-hidden>
            {DIGITS.map((g, i) => (
              <m.span
                key={i}
                initial={{ opacity: 0, filter: "blur(6px)", y: 6 }}
                animate={on ? { opacity: 1, filter: "blur(0px)", y: 0 } : undefined}
                transition={{ delay: i * 0.05, duration: 0.5 }}
              >
                {g}
              </m.span>
            ))}
          </div>
          <m.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={on ? { opacity: 1, scale: 1 } : undefined}
            transition={{ delay: 0.9, type: "spring", stiffness: 400, damping: 16 }}
            className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--sn-success)_14%,transparent)] px-3 py-1.5 text-[13px] font-semibold text-success"
          >
            <Icon name="check" size={15} strokeWidth={2.4} />
            {dict.security.safety.verified}
          </m.span>
        </div>
      </div>
    </Reveal>
  );
}

export function Security() {
  const { dict } = useI18n();
  const s = dict.security;
  return (
    <section id="security" className="section bg-bg-soft" aria-labelledby="security-title">
      <div className="container-x">
        <Reveal className="max-w-3xl">
          <p className="t-eyebrow">{s.eyebrow}</p>
          <h2 id="security-title" className="t-display mt-4">
            {s.title}
          </h2>
          <p className="t-lead mt-5 max-w-2xl">{s.lead}</p>
        </Reveal>
        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 md:mt-16 md:gap-5 lg:grid-cols-3" gap={0.07}>
          {s.pillars.map((p) => (
            <Pillar key={p.key} k={p.key} title={p.title} text={p.text} tech={p.tech} />
          ))}
        </Stagger>
        <SafetyNumber />
      </div>
    </section>
  );
}
