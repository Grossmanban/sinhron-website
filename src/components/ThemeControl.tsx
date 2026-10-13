"use client";

import { useEffect, useSyncExternalStore } from "react";
import { m } from "motion/react";
import { applyTheme, readThemeChoice, type ThemeChoice } from "@/lib/theme";
import { useI18n } from "./DictProvider";
import { Icon, type IconName } from "./ui/Icon";

const order: ThemeChoice[] = ["system", "light", "dark"];
const icons: Record<ThemeChoice, IconName> = { system: "monitor", light: "sun", dark: "moon" };

function subscribe(cb: () => void) {
  window.addEventListener("sinhron:theme", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("sinhron:theme", cb);
    window.removeEventListener("storage", cb);
  };
}

function useThemeChoice() {
  const choice = useSyncExternalStore<ThemeChoice>(subscribe, readThemeChoice, () => "system");
  // Follow the OS while the visitor hasn't picked a theme.
  useEffect(() => {
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const onSystem = () => readThemeChoice() === "system" && applyTheme("system");
    mq.addEventListener("change", onSystem);
    return () => mq.removeEventListener("change", onSystem);
  }, []);
  return choice;
}

/** Compact icon button for the nav: cycles System → Light → Dark. */
export function ThemeButton({ className = "" }: { className?: string }) {
  const { dict } = useI18n();
  const choice = useThemeChoice();
  const next = order[(order.indexOf(choice) + 1) % order.length]!;
  return (
    <button
      type="button"
      onClick={() => applyTheme(next)}
      className={`grid size-11 place-items-center rounded-full text-text-2 transition-colors hover:bg-[color-mix(in_srgb,var(--sn-text)_8%,transparent)] hover:text-text ${className}`}
      aria-label={`${dict.nav.theme.label}: ${dict.nav.theme[choice]}`}
      title={`${dict.nav.theme.label}: ${dict.nav.theme[choice]}`}
    >
      <m.span key={choice} initial={{ rotate: -60, opacity: 0, scale: 0.6 }} animate={{ rotate: 0, opacity: 1, scale: 1 }}>
        <Icon name={icons[choice]} size={20} />
      </m.span>
    </button>
  );
}

/** Segmented control (footer). */
export function ThemeSegmented() {
  const { dict } = useI18n();
  const choice = useThemeChoice();
  return (
    <div role="radiogroup" aria-label={dict.nav.theme.label} className="inline-flex rounded-full bg-bg-soft p-1 ring-1 ring-divider">
      {order.map((c) => (
        <button
          key={c}
          type="button"
          role="radio"
          aria-checked={choice === c}
          onClick={() => applyTheme(c)}
          className="relative grid h-9 min-w-11 place-items-center rounded-full px-3 text-text-2 aria-checked:text-text"
          aria-label={dict.nav.theme[c]}
          title={dict.nav.theme[c]}
        >
          {choice === c && (
            <m.span layoutId="theme-pill" className="absolute inset-0 rounded-full bg-elevated shadow-soft" />
          )}
          <span className="relative">
            <Icon name={icons[c]} size={17} />
          </span>
        </button>
      ))}
    </div>
  );
}
