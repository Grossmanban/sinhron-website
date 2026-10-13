"use client";

import { m, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "../DictProvider";
import { Icon, type IconName } from "../ui/Icon";
import { Reveal } from "../ui/Reveal";
import { Phone, StatusBar } from "../phone/Phone";

function CallScreen({ on }: { on: boolean }) {
  const { dict } = useI18n();
  const c = dict.calls;
  const [secs, setSecs] = useState(252);
  useEffect(() => {
    if (!on) return;
    const t = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [on]);
  const time = `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;
  const controls: [IconName, string, boolean][] = [
    ["micOff", c.mute, false],
    ["video", c.video, true],
    ["speaker", c.speaker, false],
  ];
  return (
    <div className="relative flex h-full flex-col items-center" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_30%,#1d3a7a_0%,#0b1016_70%)]" />
      <StatusBar />
      <div className="relative mt-[14cqw] inline-flex items-center gap-[1.4cqw] rounded-full bg-white/10 px-[3cqw] py-[1.2cqw] text-[3cqw] font-medium text-white/85 backdrop-blur">
        <svg viewBox="0 0 24 24" className="size-[3.2cqw]" fill="none" stroke="currentColor" strokeWidth="2.2">
          <rect x="5" y="10.5" width="14" height="10" rx="2.6" />
          <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
        </svg>
        {c.badge}
      </div>
      <div className="relative mt-[12cqw] grid place-items-center">
        {[0, 1, 2].map((k) => (
          <m.span
            key={k}
            className="absolute size-[34cqw] rounded-full border border-white/25"
            animate={on ? { scale: [1, 1.7], opacity: [0.5, 0] } : undefined}
            transition={{ duration: 2.6, repeat: Infinity, delay: k * 0.85, ease: "easeOut" }}
          />
        ))}
        <span className="grid size-[34cqw] place-items-center rounded-full bg-[linear-gradient(135deg,#FFB089,#FF6E54)] text-[14cqw] font-semibold text-white shadow-[0_20px_50px_-10px_rgba(255,110,84,0.5)]">
          {c.callName.slice(0, 1)}
        </span>
      </div>
      <div className="relative mt-[8cqw] text-[7cqw] font-semibold text-white">{c.callName}</div>
      <div className="relative mt-[1cqw] font-mono text-[3.8cqw] text-white/70">{time}</div>
      {/* voice wave */}
      <div className="relative mt-[6cqw] flex h-[8cqw] items-center gap-[1cqw]">
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className="h-full w-[1cqw] origin-center rounded-full bg-white/80"
            style={{ animation: on ? `wave ${0.8 + (i % 4) * 0.2}s ${i * 0.06}s ease-in-out infinite` : undefined, transform: "scaleY(0.4)" }}
          />
        ))}
      </div>
      <div className="relative mt-auto grid w-full grid-cols-4 gap-[3cqw] px-[7cqw] pb-[12cqw]">
        {controls.map(([icon, label, active]) => (
          <div key={label} className="flex flex-col items-center gap-[1.6cqw]">
            <span className={`grid size-[14cqw] place-items-center rounded-full ${active ? "bg-white text-[#0b1016]" : "bg-white/15 text-white"} backdrop-blur`}>
              <Icon name={icon} size={22} className="size-[6cqw]" />
            </span>
            <span className="text-[2.7cqw] text-white/70">{label}</span>
          </div>
        ))}
        <div className="flex flex-col items-center gap-[1.6cqw]">
          <span className="grid size-[14cqw] place-items-center rounded-full bg-[#FF4D4D] text-white">
            <Icon name="phone" size={22} className="size-[6cqw] rotate-[135deg]" />
          </span>
          <span className="text-[2.7cqw] text-white/70">{c.end}</span>
        </div>
      </div>
      <span className="absolute bottom-[1.2%] left-1/2 h-[0.55%] w-[34%] -translate-x-1/2 rounded-full bg-white opacity-60" />
    </div>
  );
}

export function Calls() {
  const { dict } = useI18n();
  const c = dict.calls;
  const ref = useRef<HTMLElement>(null);
  const on = useInView(ref, { margin: "-20% 0px -20% 0px" });
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const phoneY = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const phoneRotate = useTransform(scrollYProgress, [0, 0.5, 1], [-8, 0, 6]);

  return (
    <section ref={ref} id="calls" data-nav-dark className="sn-dark section relative overflow-hidden" aria-labelledby="calls-title">
      <div aria-hidden className="pointer-events-none absolute -right-1/4 top-1/4 h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(closest-side,rgba(79,138,255,0.28),transparent)] blur-3xl" />
      <div className="container-x relative grid items-center gap-14 md:grid-cols-[1.1fr_1fr] lg:gap-20">
        <Reveal>
          <p className="t-eyebrow">{c.eyebrow}</p>
          <h2 id="calls-title" className="t-display mt-4">
            {c.title}
          </h2>
          <p className="t-lead mt-5 max-w-xl">{c.lead}</p>
          <div className="mt-8 flex flex-wrap gap-2.5">
            {["SFrame · RFC 9605", "LiveKit SFU", "TURN · 443"].map((t) => (
              <span key={t} className="rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 font-mono text-[12.5px] text-text-2">
                {t}
              </span>
            ))}
          </div>
          <p className="mt-6 text-[14px] text-text-3">{c.note}</p>
        </Reveal>
        <div className="flex justify-center [perspective:1200px]">
          <m.div style={reduce ? undefined : { y: phoneY, rotateY: phoneRotate }} className="w-[min(72vw,300px)] md:w-[300px] lg:w-[330px]">
            <Phone>
              <CallScreen on={on && !reduce} />
            </Phone>
          </m.div>
        </div>
      </div>
    </section>
  );
}
