import type { ReactNode } from "react";
import { Icon, type IconName } from "../ui/Icon";

const look: Record<string, { icon: IconName; cls: string }> = {
  note: { icon: "sparkle", cls: "border-accent/25 bg-accent-soft/60 [&_.c-icon]:text-accent" },
  tip: { icon: "check", cls: "border-success/30 bg-[color-mix(in_srgb,var(--sn-success)_9%,transparent)] [&_.c-icon]:text-success" },
  warning: { icon: "shield", cls: "border-[#d97706]/35 bg-[rgba(217,119,6,0.09)] [&_.c-icon]:text-[#c2410c] dark:[&_.c-icon]:text-[#f59e0b]" },
};

export function Callout({ type = "note", title, label, children }: { type?: string; title?: string; label: string; children: ReactNode }) {
  const l = look[type] ?? look.note!;
  return (
    <aside className={`not-prose my-7 rounded-2xl border px-5 py-4 ${l.cls}`} role="note">
      <div className="flex items-center gap-2 text-[15px] font-semibold text-text">
        <Icon name={l.icon} size={18} className="c-icon shrink-0" />
        {title ?? label}
      </div>
      <div className="callout-body mt-1.5 text-[15.5px] leading-relaxed text-text-2 [&>*+*]:mt-2 [&_a]:text-accent [&_a]:underline [&_code]:font-mono [&_code]:text-[0.9em] [&_strong]:text-text">
        {children}
      </div>
    </aside>
  );
}
