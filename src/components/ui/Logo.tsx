// The app's "two arcs in sync" mark (design_handoff_sinhron/design/app/entry.jsx → SinhronMark).
export function LogoMark({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" aria-hidden className={className}>
      <circle cx="22" cy="28" r="14" stroke="var(--sn-accent)" strokeWidth="3" />
      <circle cx="34" cy="28" r="14" fill="var(--sn-accent)" />
      <circle cx="34" cy="28" r="14" stroke="var(--sn-accent)" strokeWidth="3" />
      <path d="M22 14a14 14 0 010 28" stroke="var(--sn-bg)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <LogoMark size={28} />
      <span className="text-[19px] font-semibold tracking-[-0.03em] text-text">Sinhron</span>
    </span>
  );
}
