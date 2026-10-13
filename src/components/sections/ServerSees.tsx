"use client";

import { AnimatePresence, m, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { useI18n } from "../DictProvider";
import { Icon, type IconName } from "../ui/Icon";
import { Reveal } from "../ui/Reveal";

const HEX = "0123456789abcdef";

/** Deterministic pseudo-random hex char for (index, tick) — the "noise" shimmer. */
function noise(k: number, tick: number) {
  const h = Math.sin(k * 127.1 + tick * 311.7) * 43758.5453;
  return HEX[Math.floor((h - Math.floor(h)) * 16)]!;
}

/** Mix plaintext → ciphertext: `amount` 0..1 of characters (in a scattered order) are replaced. */
function scramble(text: string, amount: number, tick: number) {
  const chars = [...text];
  return chars
    .map((ch, k) => {
      if (ch === " " && amount < 1) return " ";
      const order = ((k * 7) % chars.length) / chars.length; // scattered, stable order
      return order < amount ? noise(k, tick) : ch;
    })
    .join("");
}

function Node({ icon, label, active, accent }: { icon: IconName; label: string; active: boolean; accent?: boolean }) {
  return (
    <div className="flex w-[31%] flex-col items-center gap-3 md:w-56">
      <m.div
        animate={{ scale: active ? 1.06 : 1, opacity: active ? 1 : 0.55 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className={`grid size-16 place-items-center rounded-[22px] border md:size-20 ${
          accent ? "border-accent/30 bg-accent-soft text-accent" : "border-divider-strong bg-card text-text shadow-soft"
        }`}
      >
        <Icon name={icon} size={30} />
      </m.div>
      <span className="text-[14px] font-semibold text-text md:text-[15px]">{label}</span>
    </div>
  );
}

/**
 * Scroll-scrubbed story: a message leaves your phone, turns into noise, sits on the server as
 * noise, and becomes words again only on the recipient's phone.
 */
export function ServerSees() {
  const { dict } = useI18n();
  const s = dict.serverSees;
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.5 });

  const pos = useTransform(p, [0.06, 0.34, 0.6, 0.9], [0, 0.5, 0.5, 1]);
  const enc = useTransform(p, [0.08, 0.3, 0.62, 0.86], [0, 1, 1, 0]);
  const lineFill = useTransform(pos, [0, 1], [0, 1]);

  const [state, setState] = useState({ text: s.message, stage: 0, encrypted: false });
  useMotionValueEvent(p, "change", (v) => {
    const amount = enc.get();
    const tick = Math.floor(v * 120);
    const stage = v < 0.34 ? 0 : v < 0.62 ? 1 : 2;
    setState({ text: scramble(s.message, amount, tick), stage, encrypted: amount > 0.5 });
  });

  const steps = [s.stepEncrypt, s.stepRelay, s.stepDecrypt];

  return (
    <section ref={ref} className={reduce ? "section" : "relative h-[300svh]"} aria-labelledby="server-title">
      <div className={reduce ? "" : "sticky top-0 flex h-svh items-center overflow-hidden"}>
        <div className="container-x w-full">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="t-eyebrow">{s.eyebrow}</p>
            <h2 id="server-title" className="t-display mt-4">
              {s.title}
            </h2>
            <p className="t-lead mx-auto mt-5 max-w-2xl">{s.lead}</p>
          </Reveal>

          <div className="relative mx-auto mt-12 max-w-4xl md:mt-16">
            <div className="flex items-start justify-between">
              <Node icon="user" label={s.you} active={state.stage === 0} />
              <Node icon="server" label={s.server} active={state.stage === 1} accent />
              <Node icon="user" label={s.friend} active={state.stage === 2} />
            </div>

            {/* the wire */}
            <div className="relative mt-6 h-20 md:mt-8" style={{ containerType: "size" }}>
              <div className="absolute inset-x-[15.5%] top-1/2 h-px -translate-y-1/2 bg-divider-strong md:inset-x-28">
                <m.div style={{ scaleX: reduce ? 1 : lineFill }} className="h-full origin-left bg-gradient-to-r from-accent/0 via-accent to-accent" />
              </div>
              <m.div
                style={{ "--p": reduce ? 0.5 : pos } as never}
                className="packet absolute left-0 top-1/2 w-[38%] -translate-y-1/2 md:w-56"
              >
                <div
                  className={`mx-auto w-fit max-w-full rounded-[18px] rounded-br-[6px] px-3.5 py-2.5 text-center text-[13px] leading-snug transition-colors duration-500 md:px-4 md:text-[16px] ${
                    (reduce ? true : state.encrypted)
                      ? "bg-[#0d131b] font-mono text-[#7fa6ff] shadow-[0_0_0_1px_rgba(79,138,255,0.35),0_10px_30px_-8px_rgba(79,138,255,0.45)]"
                      : "bg-button text-white shadow-[0_10px_30px_-10px_rgba(45,111,247,0.6)]"
                  }`}
                >
                  <span className={`inline-flex items-center gap-1.5 ${reduce || state.encrypted ? "break-all" : ""}`}>
                    {(reduce || state.encrypted) && <Icon name="lock" size={14} className="shrink-0" />}
                    {reduce ? scramble(s.message, 1, 3) : state.text}
                  </span>
                </div>
              </m.div>
            </div>

            {/* captions */}
            <ol className="mt-8 hidden grid-cols-3 gap-6 text-center md:grid">
              {steps.map((t, i) => (
                <li key={i} className={`text-[15px] transition-colors duration-500 ${reduce || state.stage === i ? "text-text" : "text-text-3"}`}>
                  <span className="mb-2 block font-mono text-[12px] text-accent">0{i + 1}</span>
                  {t}
                </li>
              ))}
            </ol>
            <div className="relative mt-6 h-14 text-center md:hidden" aria-live="off">
              {reduce ? (
                <ol className="space-y-2 text-[15px] text-text">
                  {steps.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ol>
              ) : (
                <AnimatePresence mode="wait">
                  <m.p
                    key={state.stage}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="text-[16px] text-text"
                  >
                    <span className="mr-2 font-mono text-[12px] text-accent">0{state.stage + 1}</span>
                    {steps[state.stage]}
                  </m.p>
                </AnimatePresence>
              )}
            </div>
            <p className="mx-auto mt-6 max-w-md text-center text-[14px] text-text-3 md:mt-10">{s.caption}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
