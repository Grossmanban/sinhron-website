"use client";

import { LazyMotion, MotionConfig, domMax } from "motion/react";
import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";

/** Motion defaults + Lenis smooth scrolling (skipped for reduced motion and touch-first devices). */
export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduce || !fine) return; // iOS / iPadOS already have native momentum scrolling.
    const lenis = new Lenis({ duration: 1.1, easing: (t) => 1 - Math.pow(1 - t, 4), anchors: { offset: -72 } });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    // LazyMotion + `m.*` components keep the animation runtime out of every component's bundle.
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user" transition={{ type: "spring", stiffness: 260, damping: 30, mass: 0.9 }}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
