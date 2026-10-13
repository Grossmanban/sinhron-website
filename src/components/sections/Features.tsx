"use client";

import { AnimatePresence, m, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { useI18n } from "../DictProvider";
import { Icon, type IconName } from "../ui/Icon";
import { Reveal, RevealItem, Stagger } from "../ui/Reveal";
import { Avatar } from "../phone/ChatDemo";

/** Cycles 0..n-1 every `ms` while visible (never while hidden — saves battery). */
function useTicker(n: number, ms: number, active: boolean) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!active) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setInterval(() => setI((v) => (v + 1) % n), ms);
    return () => clearInterval(t);
  }, [n, ms, active]);
  return i;
}

function Card({
  icon,
  title,
  text,
  children,
  className = "",
  visualClass = "",
}: {
  icon: IconName;
  title: string;
  text: string;
  children?: ReactNode;
  className?: string;
  visualClass?: string;
}) {
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <RevealItem className={className}>
      <m.article
        onPointerMove={onMove}
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="spotlight flex h-full flex-col overflow-hidden rounded-[28px] border border-divider bg-card shadow-soft"
        style={{ containerType: "inline-size" }}
      >
        {children && <div className={`relative flex min-h-44 flex-1 items-center justify-center overflow-hidden px-6 pt-7 ${visualClass}`}>{children}</div>}
        <div className="p-6 pt-5 md:p-7 md:pt-5">
          <div className="flex items-center gap-2 text-accent">
            <Icon name={icon} size={18} />
          </div>
          <h3 className="mt-2 text-[19px] font-semibold tracking-[-0.02em] text-text md:text-[21px]">{title}</h3>
          <p className="mt-1.5 text-[15px] leading-relaxed text-text-2">{text}</p>
        </div>
      </m.article>
    </RevealItem>
  );
}

/* ───────────── mini visuals ───────────── */

function MenuVisual({ on }: { on: boolean }) {
  const { dict } = useI18n();
  const step = useTicker(4, 1600, on);
  const emojis = ["❤️", "👍", "😂", "😮", "🙏", "🔥"];
  return (
    <div className="w-full max-w-sm pb-4" aria-hidden>
      <div className="mb-3 space-y-2">
        <div className="w-fit max-w-[80%] rounded-[20px] rounded-bl-[6px] bg-bg-soft px-4 py-2.5 text-[15px] text-text">{dict.chat.messages[0]!.text}</div>
        <div className="ml-auto w-fit max-w-[80%] rounded-[20px] rounded-br-[6px] bg-button px-4 py-2.5 text-[15px] text-white">{dict.chat.messages[1]!.text}</div>
      </div>
      <div className="relative mx-auto w-fit">
        <AnimatePresence>
          {step >= 1 && (
            <m.div
              initial={{ opacity: 0, scale: 0.6, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 420, damping: 22 }}
              className="mb-3 flex gap-1 rounded-full border border-divider bg-elevated px-2 py-1.5 shadow-lift"
            >
              {emojis.map((e, i) => (
                <m.span
                  key={e}
                  initial={{ scale: 0 }}
                  animate={{ scale: step >= 2 && i === 0 ? 1.35 : 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15, delay: i * 0.03 }}
                  className="grid size-9 place-items-center text-[20px]"
                >
                  {e}
                </m.span>
              ))}
            </m.div>
          )}
        </AnimatePresence>
        <m.div
          animate={{ scale: step === 1 || step === 2 ? 1.04 : 1 }}
          className="relative ml-auto w-fit max-w-[260px] rounded-[20px] rounded-bl-[6px] bg-bg-soft px-4 py-2.5 text-[15px] text-text"
        >
          {dict.chat.messages[2]!.text}
          <AnimatePresence>
            {step >= 2 && (
              <m.span
                initial={{ scale: 0, rotate: -40 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 13 }}
                className="absolute -bottom-3 right-3 rounded-full border-2 border-card bg-elevated px-1.5 text-[13px] shadow-soft"
              >
                ❤️
              </m.span>
            )}
          </AnimatePresence>
        </m.div>
        <m.div
          animate={{ opacity: step === 3 ? 1 : 0.0, y: step === 3 ? 0 : 8 }}
          className="mt-5 flex items-center gap-2 rounded-2xl border-l-[3px] border-accent bg-accent-soft px-3 py-2 text-[13px] text-text-2"
        >
          <Icon name="reply" size={15} className="text-accent" />
          <span className="truncate">{dict.chat.messages[2]!.text}</span>
        </m.div>
      </div>
    </div>
  );
}

function VoiceVisual({ on }: { on: boolean }) {
  const bars = [6, 14, 22, 12, 28, 18, 32, 20, 10, 26, 16, 30, 12, 22, 8, 18, 26, 14, 20, 10];
  return (
    <div className="flex w-full items-center gap-3" aria-hidden>
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-button text-white shadow-[0_8px_20px_-6px_var(--sn-accent)]">
        <Icon name="mic" size={20} />
      </span>
      <div className="flex h-10 flex-1 items-center gap-[3px]">
        {bars.map((h, i) => (
          <span
            key={i}
            className="w-[3px] flex-1 origin-center rounded-full bg-accent"
            style={{ height: h + 6, animation: on ? `wave ${0.9 + (i % 5) * 0.17}s ${i * 0.05}s ease-in-out infinite` : undefined, opacity: 0.35 + (i % 4) * 0.18 }}
          />
        ))}
      </div>
      <m.span
        animate={on ? { y: [0, -10, 0] } : undefined}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        className="grid size-9 shrink-0 place-items-center rounded-full border border-divider-strong bg-elevated text-text-2"
      >
        <Icon name="lock" size={16} />
      </m.span>
    </div>
  );
}

function TimerVisual({ on }: { on: boolean }) {
  const { dict } = useI18n();
  const i = useTicker(dict.features.timer.length, 1800, on);
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-4" aria-hidden>
      <div className="relative size-24">
        <svg viewBox="0 0 80 80" className="size-full -rotate-90">
          <circle cx="40" cy="40" r={r} fill="none" stroke="var(--sn-divider-strong)" strokeWidth="5" />
          <m.circle
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke="var(--sn-accent)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={c}
            animate={{ strokeDashoffset: c * (1 - (i + 1) / dict.features.timer.length) }}
            transition={{ type: "spring", stiffness: 60, damping: 16 }}
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center text-accent">
          <Icon name="timer" size={26} />
        </span>
      </div>
      <div className="relative h-7 w-24 text-center">
        <AnimatePresence mode="popLayout">
          <m.span
            key={i}
            initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
            className="absolute inset-0 font-mono text-[15px] font-medium text-text"
          >
            {dict.features.timer[i]}
          </m.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

function FoldersVisual({ on }: { on: boolean }) {
  const { dict } = useI18n();
  const i = useTicker(dict.features.folders.length, 1500, on);
  const counts = [12, 3, 7, 4];
  return (
    <div className="w-full max-w-md" aria-hidden>
      <div className="flex gap-1 overflow-hidden rounded-full bg-bg-soft p-1">
        {dict.features.folders.map((f, k) => (
          <span key={f} className="relative flex-1 whitespace-nowrap rounded-full px-1.5 py-2 text-center text-[12.5px] font-medium sm:px-2 sm:text-[13px]">
            {i === k && <m.span layoutId="folder-pill" className="absolute inset-0 rounded-full bg-elevated shadow-soft" />}
            <span className={`relative ${i === k ? "text-text" : "text-text-3"}`}>
              {f}
              {i === k && <m.span
                key={`${k}-${i === k}`}
                initial={{ scale: 0.4 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 14 }}
                className={`ml-1.5 inline-grid min-w-5 place-items-center rounded-full px-1 text-[11px] ${i === k ? "bg-button text-white" : "bg-divider-strong text-text-3"}`}
              >
                {counts[k]}
              </m.span>}
            </span>
          </span>
        ))}
      </div>
      <div className="mt-4 space-y-2.5">
        {[0, 1].map((r) => (
          <m.div
            key={`${i}-${r}`}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: r * 0.06, type: "spring", stiffness: 300, damping: 28 }}
            className="flex items-center gap-3"
          >
            <span className="size-9 shrink-0 rounded-full" style={{ background: r ? "linear-gradient(135deg,#9DE6CB,#10B981)" : "linear-gradient(135deg,#C5A0FF,#7C3AED)" }} />
            <div className="flex-1 space-y-1.5">
              <div className="h-2.5 w-1/3 rounded-full bg-divider-strong" />
              <div className="h-2.5 w-2/3 rounded-full bg-divider" />
            </div>
          </m.div>
        ))}
      </div>
    </div>
  );
}

function CallsVisual({ on }: { on: boolean }) {
  const { dict } = useI18n();
  return (
    <div className="relative grid place-items-center py-2" aria-hidden>
      {[0, 1, 2].map((k) => (
        <m.span
          key={k}
          className="absolute size-16 rounded-full border border-accent/40"
          animate={on ? { scale: [1, 2.1], opacity: [0.6, 0] } : undefined}
          transition={{ duration: 2.4, repeat: Infinity, delay: k * 0.8, ease: "easeOut" }}
        />
      ))}
      <Avatar name={dict.chat.name} size="64px" />
    </div>
  );
}

function LockVisual({ on }: { on: boolean }) {
  const i = useTicker(2, 2200, on);
  return (
    <div className="relative grid size-24 place-items-center rounded-[28px] bg-bg-soft" aria-hidden>
      <AnimatePresence mode="wait">
        {i === 0 ? (
          <m.span key="scan" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.2 }} className="text-accent">
            <Icon name="faceId" size={52} strokeWidth={1.5} />
          </m.span>
        ) : (
          <m.span
            key="ok"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 16 }}
            className="grid size-14 place-items-center rounded-full bg-success text-white"
          >
            <Icon name="check" size={30} strokeWidth={2.4} />
          </m.span>
        )}
      </AnimatePresence>
      {i === 0 && on && (
        <m.span
          className="absolute inset-x-4 h-0.5 rounded-full bg-accent/70 shadow-[0_0_12px_var(--sn-accent)]"
          initial={{ top: "20%" }}
          animate={{ top: ["20%", "78%", "20%"] }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}

function ThemesVisual({ on }: { on: boolean }) {
  const accents = ["#2D6FF7", "#1FAF6E", "#7C3AED", "#F59E0B", "#EC4899", "#0EA5A5"];
  const i = useTicker(accents.length, 1300, on);
  const bgs = ["#FAF9F6", "#0B1016", "#000000"];
  return (
    <div className="flex items-end gap-3" aria-hidden>
      {bgs.map((bg, k) => (
        <m.div
          key={bg}
          animate={{ y: k === 1 ? -8 : 0 }}
          className="flex h-28 w-16 flex-col justify-end gap-1.5 rounded-[14px] p-2 ring-1 ring-divider-strong"
          style={{ background: bg }}
        >
          <span className="h-2 w-8 rounded-full" style={{ background: k ? "#1A222D" : "#F1EFEA" }} />
          <m.span className="ml-auto h-2.5 w-9 rounded-full" animate={{ backgroundColor: accents[i] }} />
          <span className="h-2 w-7 rounded-full" style={{ background: k ? "#1A222D" : "#F1EFEA" }} />
        </m.div>
      ))}
    </div>
  );
}

function SearchVisual({ on }: { on: boolean }) {
  const { dict } = useI18n();
  const q = dict.features.searchQuery;
  const reduce = useReducedMotion();
  const [typed, setN] = useState(0);
  const n = reduce ? q.length : typed;
  useEffect(() => {
    if (!on || reduce) return;
    let k = 0;
    const t = setInterval(() => {
      k = (k + 1) % (q.length + 8);
      setN(Math.min(k, q.length));
    }, 220);
    return () => clearInterval(t);
  }, [on, q, reduce]);
  const done = n === q.length;
  return (
    <div className="w-full max-w-[16rem]" aria-hidden>
      <div className="flex h-10 items-center gap-2 rounded-full bg-bg-soft px-3.5 text-[14px] text-text">
        <Icon name="search" size={16} className="text-text-3" />
        <span>{q.slice(0, n)}</span>
        <span className="-ml-1.5 h-4 w-px bg-accent" style={{ animation: "blink 1s steps(1) infinite" }} />
      </div>
      <m.div animate={{ opacity: done ? 1 : 0.25, y: done ? 0 : 6 }} className="mt-3 rounded-2xl bg-bg-soft px-3.5 py-2.5 text-[13px] text-text-2">
        …<mark className="rounded bg-accent-soft px-0.5 text-accent">{q}</mark> 19:30?
      </m.div>
    </div>
  );
}

function MediaVisual({ on }: { on: boolean }) {
  const tiles = [
    "linear-gradient(135deg,#FFB089,#FF6E54)",
    "linear-gradient(160deg,#A0C4FF,#3B82F6)",
    "linear-gradient(135deg,#9DE6CB,#10B981)",
    "linear-gradient(200deg,#E8B4FF,#A21CAF)",
    "linear-gradient(135deg,#FFE08A,#F59E0B)",
  ];
  return (
    <div className="grid w-full max-w-sm grid-cols-6 grid-rows-2 gap-1.5 overflow-hidden rounded-[22px]" aria-hidden>
      {tiles.map((bg, k) => (
        <m.div
          key={k}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={on ? { opacity: 1, scale: 1 } : undefined}
          transition={{ delay: 0.1 + k * 0.08, type: "spring", stiffness: 260, damping: 22 }}
          className={`relative h-24 md:h-28 ${k < 2 ? "col-span-3" : "col-span-2"}`}
          style={{ background: bg }}
        >
          <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-1/2 w-full opacity-40">
            <path d={k % 2 ? "M0 60 L30 25 L55 45 L75 20 L100 40 L100 60Z" : "M0 60 L25 35 L50 50 L80 15 L100 35 L100 60Z"} fill="white" />
          </svg>
          {k === 4 && <span className="absolute inset-0 grid place-items-center bg-black/30 text-[18px] font-semibold text-white">+8</span>}
        </m.div>
      ))}
    </div>
  );
}

function IdentityVisual({ on }: { on: boolean }) {
  const { dict } = useI18n();
  const items = dict.features.identityItems;
  const words = ["orbit", "maple", "quartz", "lantern", "velvet", "harbor", "ember", "cobalt", "tundra", "willow", "saffron", "zenith"];
  return (
    <div className="flex w-full flex-col items-center gap-5 md:flex-row md:justify-center md:gap-8" aria-hidden>
      <div className="flex flex-wrap justify-center gap-2">
        {items.map((t, k) => (
          <span key={t} className="relative rounded-full border border-divider-strong px-3.5 py-1.5 text-[14px] text-text-3">
            {t}
            <m.span
              className="absolute left-2 right-2 top-1/2 h-[1.5px] origin-left bg-text-2"
              initial={{ scaleX: 0 }}
              animate={on ? { scaleX: 1 } : undefined}
              transition={{ delay: 0.4 + k * 0.2, duration: 0.5 }}
            />
          </span>
        ))}
      </div>
      <Icon name="arrowRight" size={20} className="hidden text-text-3 md:block" />
      <div className="grid grid-cols-4 gap-1.5 rounded-2xl bg-bg-soft p-2.5 font-mono text-[11.5px]">
        {words.map((w, k) => (
          <m.span
            key={w}
            initial={{ filter: "blur(5px)", opacity: 0.4 }}
            animate={on ? { filter: k < 4 ? "blur(0px)" : "blur(4px)", opacity: 1 } : undefined}
            transition={{ delay: 1 + k * 0.05 }}
            className="rounded-md bg-card px-1.5 py-1 text-text-2"
          >
            <span className="mr-1 text-text-3">{k + 1}</span>
            {w}
          </m.span>
        ))}
      </div>
    </div>
  );
}

/* ───────────── section ───────────── */

export function Features() {
  const { dict } = useI18n();
  const f = dict.features;
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { margin: "0px 0px -10% 0px" });
  const c = f.cards;

  return (
    <section id="features" className="section" aria-labelledby="features-title">
      <div className="container-x">
        <Reveal className="max-w-3xl">
          <p className="t-eyebrow">{f.eyebrow}</p>
          <h2 id="features-title" className="t-display mt-4">
            {f.title}
          </h2>
          <p className="t-lead mt-5 max-w-2xl">{f.lead}</p>
        </Reveal>

        <div ref={ref}>
          <Stagger className="mt-12 grid grid-cols-1 gap-4 md:mt-16 md:grid-cols-2 md:gap-5 lg:grid-cols-4" gap={0.06}>
            <Card icon="heart" title={c.menu.title} text={c.menu.text} className="md:col-span-2 lg:row-span-2" visualClass="min-h-64 bg-gradient-to-b from-accent-soft/60 to-transparent">
              <MenuVisual on={on} />
            </Card>
            <Card icon="noPhone" title={c.identity.title} text={c.identity.text} className="md:col-span-2">
              <IdentityVisual on={on} />
            </Card>
            <Card icon="mic" title={c.voice.title} text={c.voice.text}>
              <VoiceVisual on={on} />
            </Card>
            <Card icon="timer" title={c.disappearing.title} text={c.disappearing.text}>
              <TimerVisual on={on} />
            </Card>
            <Card icon="folder" title={c.folders.title} text={c.folders.text} className="md:col-span-2">
              <FoldersVisual on={on} />
            </Card>
            <Card icon="video" title={c.calls.title} text={c.calls.text}>
              <CallsVisual on={on} />
            </Card>
            <Card icon="faceId" title={c.lock.title} text={c.lock.text}>
              <LockVisual on={on} />
            </Card>
            <Card icon="image" title={c.media.title} text={c.media.text} className="md:col-span-2">
              <MediaVisual on={on} />
            </Card>
            <Card icon="palette" title={c.themes.title} text={c.themes.text}>
              <ThemesVisual on={on} />
            </Card>
            <Card icon="search" title={c.search.title} text={c.search.text}>
              <SearchVisual on={on} />
            </Card>
          </Stagger>
        </div>
      </div>
    </section>
  );
}
