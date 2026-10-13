"use client";

import { m, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { href } from "@/lib/i18n";
import { site } from "@/config/site";
import { useI18n } from "../DictProvider";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { LogoMark } from "../ui/Logo";
import { Reveal } from "../ui/Reveal";

export function FinalCta() {
  const { locale, dict } = useI18n();
  const f = dict.finalCta;
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.6, 1.15]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-90, 0]);

  return (
    <section ref={ref} data-nav-dark className="sn-dark relative overflow-hidden py-[clamp(6rem,4rem+10vw,12rem)]" aria-labelledby="cta-title">
      <m.div
        aria-hidden
        style={reduce ? undefined : { scale }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[80vmax] w-[80vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(79,138,255,0.35),rgba(79,138,255,0.08)_60%,transparent)]"
      />
      <div className="container-x relative flex flex-col items-center text-center">
        <m.div style={reduce ? undefined : { rotate }} className="drop-shadow-[0_0_40px_rgba(79,138,255,0.55)]">
          <LogoMark size={88} />
        </m.div>
        <Reveal>
          <h2 id="cta-title" className="t-mega mt-10 max-w-[16ch] text-gradient">
            {f.title}
          </h2>
          <p className="t-lead mx-auto mt-6 max-w-xl">{f.lead}</p>
        </Reveal>
        <Reveal delay={0.1} className="mt-10 flex flex-wrap justify-center gap-3">
          <Button href={href(locale, "/download")} size="lg" magnetic>
            <Icon name="download" size={19} />
            {f.download}
          </Button>
          <Button href={site.github} size="lg" variant="secondary">
            <Icon name="github" size={19} />
            {f.star}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
