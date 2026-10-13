"use client";

import { AnimatePresence, m, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "../DictProvider";
import { StatusBar } from "./Phone";

const spring = { type: "spring", stiffness: 420, damping: 30, mass: 0.8 } as const;

export function Avatar({ name, size = "9cqw", palette = ["#FFB089", "#FF6E54"] }: { name: string; size?: string; palette?: [string, string] }) {
  return (
    <span
      aria-hidden
      className="grid shrink-0 place-items-center rounded-full font-semibold text-white"
      style={{ width: size, height: size, fontSize: `calc(${size} * 0.42)`, background: `linear-gradient(135deg, ${palette[0]}, ${palette[1]})` }}
    >
      {name.slice(0, 1)}
    </span>
  );
}

/**
 * The app's chat screen rendered in HTML. Messages arrive one by one once the phone is on screen;
 * with reduced motion everything is shown at once.
 */
export function ChatDemo({ autoplay = true }: { autoplay?: boolean }) {
  const { dict } = useI18n();
  const c = dict.chat;
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const total = c.messages.length;
  const [shownState, setShown] = useState(0);
  const [typing, setTyping] = useState(false);
  const [reactedState, setReacted] = useState(false);

  useEffect(() => {
    if (!autoplay) return;
    if (reduce || !inView) return;
    // Arrival script: (delay ms, action)
    const plan: [number, () => void][] = [
      [500, () => setShown(1)],
      [1500, () => setShown(2)],
      [2300, () => setTyping(true)],
      [3500, () => (setTyping(false), setShown(3))],
      [4700, () => setShown(4)],
      [5600, () => setReacted(true)],
    ];
    const timers = plan.map(([t, fn]) => setTimeout(fn, t));
    return () => timers.forEach(clearTimeout);
  }, [inView, reduce, autoplay, total]);

  // Reduced motion: the whole conversation, no choreography.
  const shown = reduce ? total : shownState;
  const reacted = reduce || reactedState;

  return (
    <div ref={ref} className="flex h-full flex-col" aria-hidden>
      <StatusBar />
      {/* header */}
      <div className="flex items-center gap-[2.6cqw] border-b border-[var(--a-divider)] px-[4cqw] pb-[3cqw] pt-[2cqw]">
        <svg viewBox="0 0 24 24" className="size-[6cqw] text-[var(--a-accent)]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="m14.5 6-6 6 6 6" />
        </svg>
        <Avatar name={c.name} />
        <div className="min-w-0 flex-1 leading-tight">
          <div className="text-[4.2cqw] font-semibold">{c.name}</div>
          <div className="relative h-[3.9cqw] text-[3.3cqw]">
            <AnimatePresence mode="wait" initial={false}>
              <m.span
                key={typing ? "t" : "s"}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className={`absolute left-0 ${typing ? "text-[var(--a-accent)]" : "text-[#2bc58a]"}`}
              >
                {typing ? c.typing : c.status}
              </m.span>
            </AnimatePresence>
          </div>
        </div>
        <svg viewBox="0 0 24 24" className="size-[6cqw] text-[var(--a-accent)]" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="6" width="13" height="12" rx="2.6" />
          <path d="m16 10.5 5-3v9l-5-3" />
        </svg>
        <svg viewBox="0 0 24 24" className="ml-[1cqw] size-[5.6cqw] text-[var(--a-accent)]" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round">
          <path d="M6.6 3.5h2.2l1.4 4-2 1.3a11 11 0 0 0 7 7l1.3-2 4 1.4v2.2a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z" />
        </svg>
      </div>

      {/* messages */}
      <div className="flex flex-1 flex-col justify-end gap-[1.6cqw] overflow-hidden px-[3.4cqw] pb-[3cqw]">
        <div className="mx-auto mb-[1cqw] flex max-w-[86%] items-center gap-[1.4cqw] rounded-full bg-[var(--a-soft)] px-[3cqw] py-[1.2cqw] text-center text-[2.9cqw] text-[var(--a-text-3)]">
          <svg viewBox="0 0 24 24" className="size-[3cqw] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2">
            <rect x="5" y="10.5" width="14" height="10" rx="2.6" />
            <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
          </svg>
          {c.encrypted}
        </div>
        <div className="mb-[1cqw] text-center text-[2.9cqw] font-medium text-[var(--a-text-3)]">{c.today}</div>
        <AnimatePresence initial={false}>
          {c.messages.slice(0, shown).map((msg, i) => {
            const me = msg.from === "me";
            return (
              <m.div
                key={i}
                layout
                initial={{ opacity: 0, y: 14, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={spring}
                style={{ transformOrigin: me ? "100% 100%" : "0% 100%" }}
                className={`relative max-w-[78%] px-[3.4cqw] py-[2.2cqw] text-[3.9cqw] leading-[1.32] ${
                  me
                    ? "self-end rounded-[4.6cqw] rounded-br-[1.4cqw] bg-[#2864de] text-white"
                    : "self-start rounded-[4.6cqw] rounded-bl-[1.4cqw] bg-[var(--a-surface)] text-[var(--a-text)]"
                } ${reacted && i === 2 ? "mb-[3.6cqw]" : ""}`}
              >
                {msg.text}
                <span className={`ml-[1.6cqw] inline-block translate-y-[0.4cqw] text-[2.6cqw] ${me ? "text-white/70" : "text-[var(--a-text-3)]"}`}>
                  {`9:4${i + 1}`}
                  {me && " ✓✓"}
                </span>
                <AnimatePresence>
                  {reacted && i === 2 && (
                    <m.span
                      initial={{ scale: 0, rotate: -30 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 14 }}
                      className="absolute -bottom-[4cqw] right-[2cqw] grid h-[6.4cqw] min-w-[9cqw] place-items-center rounded-full border-[0.6cqw] border-[var(--a-bg)] bg-[var(--a-surface)] px-[1.6cqw] text-[3.4cqw]"
                    >
                      ❤️
                    </m.span>
                  )}
                </AnimatePresence>
              </m.div>
            );
          })}
          {typing && (
            <m.div
              key="typing"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={spring}
              style={{ transformOrigin: "0% 100%" }}
              className="flex gap-[1.1cqw] self-start rounded-[4.6cqw] rounded-bl-[1.4cqw] bg-[var(--a-surface)] px-[3.6cqw] py-[3cqw]"
            >
              {[0, 1, 2].map((d) => (
                <span key={d} className="size-[1.7cqw] rounded-full bg-[var(--a-text-3)]" style={{ animation: `typing 1.2s ${d * 0.15}s infinite` }} />
              ))}
            </m.div>
          )}
        </AnimatePresence>
      </div>

      {/* composer */}
      <div className="flex items-center gap-[2.4cqw] px-[3.4cqw] pb-[7cqw] pt-[1.6cqw]">
        <span className="grid size-[8cqw] shrink-0 place-items-center rounded-full bg-[var(--a-soft)] text-[var(--a-text-2)]">
          <svg viewBox="0 0 24 24" className="size-[4.6cqw]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
        <span className="flex h-[8.6cqw] flex-1 items-center rounded-full border border-[var(--a-divider)] bg-[var(--a-soft)] px-[3.4cqw] text-[3.7cqw] text-[var(--a-text-3)]">
          {c.placeholder}
        </span>
        <span className="grid size-[8cqw] shrink-0 place-items-center rounded-full text-[var(--a-accent)]">
          <svg viewBox="0 0 24 24" className="size-[5.4cqw]" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
            <rect x="9" y="3" width="6" height="11" rx="3" />
            <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
          </svg>
        </span>
      </div>
      {/* home indicator */}
      <span aria-hidden className="absolute bottom-[1.2%] left-1/2 h-[0.55%] w-[34%] -translate-x-1/2 rounded-full bg-[var(--a-text)] opacity-60" />
    </div>
  );
}
