"use client";

import Link from "next/link";
import { m, useMotionValue, useSpring } from "motion/react";
import type { ReactNode, PointerEvent } from "react";

type Variant = "primary" | "secondary" | "ghost";

const styles: Record<Variant, string> = {
  primary:
    "bg-button text-white shadow-[0_8px_24px_-6px_color-mix(in_srgb,var(--sn-button)_60%,transparent)] hover:bg-button-hover",
  secondary: "bg-[color-mix(in_srgb,var(--sn-text)_8%,transparent)] text-text hover:bg-[color-mix(in_srgb,var(--sn-text)_13%,transparent)]",
  ghost: "text-accent hover:bg-accent-soft",
};

/**
 * Pill button. Presses in on tap; `magnetic` pulls it toward the cursor on fine pointers.
 * External links open in the same tab — no target="_blank" surprises.
 */
export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  magnetic = false,
  className = "",
  disabled = false,
  ariaLabel,
}: {
  href?: string;
  children: ReactNode;
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  magnetic?: boolean;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18 });
  const sy = useSpring(y, { stiffness: 220, damping: 18 });

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (!magnetic || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.35);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const sizes = { sm: "h-9 px-4 text-[14px]", md: "h-12 px-6 text-[16px]", lg: "h-14 px-8 text-[17px]" }[size];
  const cls = `group relative inline-flex min-w-11 select-none items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em] transition-colors duration-300 ${sizes} ${styles[variant]} ${
    disabled ? "pointer-events-none opacity-45" : ""
  } ${className}`;

  const inner = <span className="relative z-10 inline-flex items-center gap-2 whitespace-nowrap">{children}</span>;
  const motionProps = {
    style: { x: sx, y: sy },
    whileTap: { scale: 0.96 },
    onPointerMove: onMove,
    onPointerLeave: reset,
  };

  if (!href || disabled) {
    return (
      <m.span {...motionProps} className={cls} aria-disabled={disabled || undefined} aria-label={ariaLabel} role={href ? "link" : undefined}>
        {inner}
      </m.span>
    );
  }
  const external = /^https?:/.test(href);
  return (
    <m.span {...motionProps} className="inline-flex">
      {external ? (
        <a href={href} className={cls} aria-label={ariaLabel} rel="noopener">
          {inner}
        </a>
      ) : (
        <Link href={href} className={cls} aria-label={ariaLabel}>
          {inner}
        </Link>
      )}
    </m.span>
  );
}
