"use client";

import { useRef, useState, type ComponentProps } from "react";
import { useI18n } from "../DictProvider";
import { Icon } from "../ui/Icon";

/** <pre> with a language tag and a copy button (code is highlighted at build time by Shiki). */
export function CodeBlock(props: ComponentProps<"pre"> & { "data-language"?: string }) {
  const { dict } = useI18n();
  const ref = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const lang = props["data-language"];
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ref.current?.innerText ?? "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked */
    }
  };
  return (
    <div className="group relative">
      <div className="pointer-events-none absolute left-4 top-0 z-10 -translate-y-1/2 rounded-full border border-white/10 bg-[#141b25] px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-white/60">
        {lang && lang !== "plaintext" ? lang : "text"}
      </div>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? dict.docs.copied : dict.docs.copyCode}
        className="absolute right-2 top-2 z-10 grid size-11 place-items-center rounded-xl text-white/55 transition-colors hover:bg-white/10 hover:text-white"
      >
        <Icon name={copied ? "check" : "copy"} size={18} />
      </button>
      <pre ref={ref} {...props} className={`${props.className ?? ""} pr-14`} />
    </div>
  );
}
