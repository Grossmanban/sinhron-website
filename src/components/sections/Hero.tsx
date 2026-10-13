"use client";

import { m, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useRef, type CSSProperties } from "react";
import { href } from "@/lib/i18n";
import { useI18n } from "../DictProvider";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { Phone } from "../phone/Phone";
import { ChatDemo } from "../phone/ChatDemo";

const ease = [0.16, 1, 0.3, 1] as const;

/** Word-by-word entrance (CSS, so it runs before hydration): blur → sharp, staggered. */
function Words({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  // The class goes on each word: background-clip:text on a parent doesn't paint through
  // children that get their own compositing layer (transform/filter).
  const words = text.split(" ");
  return (
    <span>
      {words.map((w, i) => (
        <span key={i} className={`enter enter-word ${className}`} style={{ "--d": `${Math.round((delay + i * 0.08) * 1000)}ms` } as CSSProperties}>
          {w + (i < words.length - 1 ? " " : "")}
        </span>
      ))}
    </span>
  );
}

const chips = [
  { icon: "lock", pos: "right-[calc(100%+1.25rem)] top-[30%]", depth: -90 },
  { icon: "noPhone", pos: "left-[calc(100%+1.5rem)] top-[16%]", depth: -140 },
  { icon: "eyeOff", pos: "left-[calc(100%+0.75rem)] top-[58%]", depth: -60 },
] as const;

/** Floating badge that drifts at its own depth (parallax) while the hero scrolls. */
function Chip({ i, text, p, reduce }: { i: number; text: string; p: MotionValue<number>; reduce: boolean | null }) {
  const c = chips[i]!;
  const y = useTransform(p, [0, 1], [0, c.depth]);
  return (
    <m.div
      style={reduce ? undefined : { y }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 1.4 + i * 0.15, ease }}
      className={`absolute hidden items-center gap-2 whitespace-nowrap rounded-2xl border border-white/10 bg-[rgba(20,27,37,0.72)] px-3.5 py-2.5 text-[13.5px] font-medium text-text shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl md:flex ${c.pos}`}
    >
      <span className="grid size-7 place-items-center rounded-full bg-accent-soft text-accent">
        <Icon name={c.icon} size={16} />
      </span>
      {text}
    </m.div>
  );
}

/**
 * Full-height dark hero. While scrolling through it the headline lifts away and the phone rises,
 * straightens out of its 3D tilt and settles — scrubbed to the scroll position.
 */
export function Hero() {
  const { locale, dict } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });

  const titleY = useTransform(p, [0, 0.6], ["0vh", "-18vh"]);
  const titleOpacity = useTransform(p, [0, 0.4], [1, 0]);
  const titleScale = useTransform(p, [0, 0.6], [1, 0.92]);
  const phoneY = useTransform(p, [0, 0.75], ["0svh", "-60svh"]);
  const phoneRotate = useTransform(p, [0, 0.7], [24, 0]);
  const phoneScale = useTransform(p, [0, 0.75], [0.92, 1]);
  const glowScale = useTransform(p, [0, 1], [1, 1.5]);

  return (
    <section ref={ref} data-nav-dark className={`sn-dark relative ${reduce ? "" : "h-[200svh] md:h-[220svh]"}`} aria-labelledby="hero-title">
      {/* Reduced motion: no scroll scene — the phone simply sits under the headline. */}
      <div className={`flex flex-col items-center overflow-hidden ${reduce ? "pb-24" : "sticky top-0 h-svh"}`}>
        {/* ambient glow */}
        <m.div aria-hidden style={{ scale: reduce ? 1 : glowScale }} className="pointer-events-none absolute inset-0">
          <div
            className="absolute left-1/2 top-[38%] h-[70vmax] w-[70vmax] rounded-full opacity-80 blur-[60px]"
            style={{
              background: "radial-gradient(closest-side, rgba(79,138,255,0.42), rgba(79,138,255,0.12) 55%, transparent 75%)",
              animation: "breathe 9s ease-in-out infinite",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
              maskImage: "radial-gradient(ellipse 60% 50% at 50% 35%, black, transparent 75%)",
              WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 35%, black, transparent 75%)",
            }}
          />
        </m.div>

        <m.div
          style={reduce ? undefined : { y: titleY, opacity: titleOpacity, scale: titleScale }}
          className="container-x relative z-10 flex flex-col items-center pt-[calc(6.5rem+env(safe-area-inset-top))] text-center md:pt-[calc(8rem+env(safe-area-inset-top))]"
        >
          <span
            className="enter inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[13px] font-medium text-text-2 backdrop-blur"
          >
            <span className="size-1.5 rounded-full bg-success shadow-[0_0_10px_var(--sn-success)]" />
            {dict.hero.eyebrow}
          </span>
          <h1 id="hero-title" className="t-mega mt-6 max-w-[14ch]">
            <Words text={dict.hero.titleA} delay={0.1} />
            <br />
            <Words text={dict.hero.titleB} delay={0.35} className="text-gradient" />
          </h1>
          <p className="enter-soft t-lead mt-6 max-w-[38rem]" style={{ "--d": "200ms" } as CSSProperties}>
            {dict.hero.lead}
          </p>
          <div className="enter mt-9 flex flex-wrap items-center justify-center gap-3" style={{ "--d": "600ms", "--enter-blur": "0px" } as CSSProperties}>
            <Button href={href(locale, "/download")} size="lg" magnetic>
              <Icon name="download" size={19} />
              {dict.hero.ctaDownload}
            </Button>
            <Button href={href(locale, "/docs/self-hosting")} size="lg" variant="secondary">
              {dict.hero.ctaServer}
              <Icon name="arrowRight" size={18} className="transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        </m.div>

        {/* phone */}
        <div className={`relative z-0 mt-10 w-full [perspective:1400px] md:mt-14 ${reduce ? "flex justify-center" : "flex-1"}`}>
          <div
            style={{ "--d": "400ms" } as CSSProperties}
            className={`enter-rise w-[min(76vw,330px)] md:w-[340px] lg:w-[360px] ${reduce ? "relative" : "absolute left-1/2 top-0 -translate-x-1/2"}`}
          >
            <m.div
              style={reduce ? undefined : { y: phoneY, rotateX: phoneRotate, scale: phoneScale, transformOrigin: "50% 0%" }}
              className="relative"
            >
              <Phone label={dict.meta.ogAlt}>
                <ChatDemo />
              </Phone>
              {/* floating chips (tablet / desktop) */}
              {dict.hero.chips.map((t, i) => (
                <Chip key={i} i={i} text={t} p={p} reduce={reduce} />
              ))}
            </m.div>
          </div>
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--sn-bg)] to-transparent" />
        </div>
      </div>
    </section>
  );
}
