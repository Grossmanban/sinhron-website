import type { ReactNode } from "react";

/**
 * Pure-CSS phone frame. Size it with a width class; height follows a 9:19.5 aspect.
 * `theme` picks the app palette rendered on the screen (independent of the page theme).
 */
export function Phone({
  children,
  className = "",
  theme = "dark",
  label,
}: {
  children: ReactNode;
  className?: string;
  theme?: "dark" | "light";
  label?: string;
}) {
  return (
    <div
      role={label ? "img" : undefined}
      aria-label={label}
      className={`relative aspect-[9/19.5] rounded-[16%/7.4%] bg-gradient-to-b from-[#2b3340] via-[#151a22] to-[#262d38] p-[2.6%] shadow-[0_0_0_1px_rgba(255,255,255,0.08)_inset,0_50px_100px_-30px_rgba(0,0,0,0.65),0_30px_60px_-30px_rgba(45,111,247,0.25)] ${className}`}
    >
      {/* side buttons */}
      <span aria-hidden className="absolute -left-[1.2%] top-[18%] h-[6%] w-[1.2%] rounded-l bg-[#2a313c]" />
      <span aria-hidden className="absolute -left-[1.2%] top-[27%] h-[10%] w-[1.2%] rounded-l bg-[#2a313c]" />
      <span aria-hidden className="absolute -right-[1.2%] top-[24%] h-[14%] w-[1.2%] rounded-r bg-[#2a313c]" />
      <div
        className={`app-screen relative h-full w-full overflow-hidden rounded-[13.5%/6.3%] ${theme === "dark" ? "app-dark" : "app-light"}`}
        style={{ containerType: "inline-size" }}
      >
        {/* dynamic island */}
        <span aria-hidden className="absolute left-1/2 top-[1.6%] z-30 h-[3.4%] w-[30%] -translate-x-1/2 rounded-full bg-black" />
        {children}
      </div>
    </div>
  );
}

/** iOS-like status bar, sized in container units so it scales with the phone. */
export function StatusBar() {
  return (
    <div aria-hidden className="relative z-20 flex h-[6.2%] items-end justify-between px-[8%] pb-[1%] text-[3.6cqw] font-semibold text-[var(--a-text)]">
      <span>9:41</span>
      <span className="flex items-center gap-[1.2cqw]">
        <svg viewBox="0 0 18 12" className="h-[2.6cqw] w-auto" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="10" y="3" width="3" height="9" rx="1" />
          <rect x="15" y="0" width="3" height="12" rx="1" />
        </svg>
        <svg viewBox="0 0 27 13" className="h-[2.8cqw] w-auto" fill="none">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3.5" stroke="currentColor" opacity="0.4" />
          <rect x="2" y="2" width="18" height="9" rx="2" fill="currentColor" />
          <path d="M25 4.5v4" stroke="currentColor" strokeLinecap="round" opacity="0.4" />
        </svg>
      </span>
    </div>
  );
}
