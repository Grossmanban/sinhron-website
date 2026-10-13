"use client";

import { m, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { href } from "@/lib/i18n";
import { site } from "@/config/site";
import { useI18n } from "../DictProvider";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { Reveal, RevealItem, Stagger } from "../ui/Reveal";

type Line = { kind: "cmd" | "out" | "ok"; text: string };

/** Commands follow docs/deploy-guide.md; production always runs with -f docker-compose.yml. */
function script(done: string): Line[] {
  return [
    { kind: "cmd", text: `git clone ${site.repo}.git && cd sinhron/server` },
    { kind: "cmd", text: "cp .env.example .env && nano .env" },
    { kind: "cmd", text: "docker compose -f docker-compose.yml up -d" },
    { kind: "out", text: "✔ postgres        Started" },
    { kind: "out", text: "✔ sinhron-server  Started" },
    { kind: "out", text: "✔ livekit         Started" },
    { kind: "out", text: "✔ coturn          Started" },
    { kind: "out", text: "✔ caddy           Started  (TLS: Let’s Encrypt)" },
    { kind: "ok", text: done },
  ];
}

function Terminal() {
  const { dict } = useI18n();
  const lines = script(dict.selfHost.done);
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  // progress: [line index, chars typed in that line]
  const [pos, setPos] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    if (!on || reduce) return;
    let li = 0;
    let ch = 0;
    let t: ReturnType<typeof setTimeout>;
    const step = () => {
      const line = lines[li];
      if (!line) return;
      if (line.kind === "cmd" && ch < line.text.length) {
        ch += 1 + Math.floor(Math.random() * 2);
        setPos([li, ch]);
        t = setTimeout(step, 22 + Math.random() * 40);
      } else {
        li += 1;
        ch = 0;
        setPos([li, 0]);
        const next = lines[li];
        t = setTimeout(step, line.kind === "cmd" ? 420 : next?.kind === "ok" ? 500 : 160);
      }
    };
    t = setTimeout(step, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, reduce]);

  const [li, ch] = reduce ? [lines.length, 0] : pos;
  return (
    <div ref={ref} className="overflow-hidden rounded-[22px] border border-white/10 bg-[#0a0f15] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.55)]">
      <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 truncate font-mono text-[12px] text-white/45">{dict.selfHost.terminalTitle}</span>
      </div>
      <div className="min-h-[19rem] overflow-x-auto px-4 py-4 font-mono text-[12.5px] leading-[1.9] text-[#d6dde8] sm:px-5 sm:text-[13.5px]" role="img" aria-label={lines.filter((l) => l.kind === "cmd").map((l) => l.text).join("; ")}>
        {lines.map((l, i) => {
          if (i > li) return null;
          const typing = i === li;
          const text = l.kind === "cmd" ? (typing ? l.text.slice(0, ch) : l.text) : l.text;
          if (typing && l.kind !== "cmd") return null;
          return (
            <m.div
              key={i}
              initial={l.kind === "cmd" ? false : { opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className={`whitespace-pre ${l.kind === "out" ? "text-[#8fa3bd]" : l.kind === "ok" ? "font-semibold text-[#2bc58a]" : ""}`}
            >
              {l.kind === "cmd" && <span className="mr-2 select-none text-[#4f8aff]">$</span>}
              {l.kind === "ok" && <span className="mr-2">✓</span>}
              {text}
              {typing && <span className="ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-[#d6dde8]" style={{ animation: "blink 1s steps(1) infinite" }} />}
            </m.div>
          );
        })}
        {li >= lines.length && (
          <div>
            <span className="mr-2 text-[#4f8aff]">$</span>
            <span className="inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-[#d6dde8]" style={{ animation: "blink 1s steps(1) infinite" }} />
          </div>
        )}
      </div>
    </div>
  );
}

export function SelfHost() {
  const { locale, dict } = useI18n();
  const s = dict.selfHost;
  const icons = ["terminal", "user", "server"] as const;
  return (
    <section id="self-host" className="section" aria-labelledby="selfhost-title">
      <div className="container-x grid grid-cols-[minmax(0,1fr)] items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16">
        <div>
          <Reveal>
            <p className="t-eyebrow">{s.eyebrow}</p>
            <h2 id="selfhost-title" className="t-display mt-4">
              {s.title}
            </h2>
            <p className="t-lead mt-5 max-w-xl">{s.lead}</p>
          </Reveal>
          <Stagger className="mt-10 grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
            {s.points.map((pt, i) => (
              <RevealItem key={pt.title} className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent">
                  <Icon name={icons[i] ?? "server"} size={20} />
                </span>
                <div>
                  <h3 className="text-[16px] font-semibold text-text">{pt.title}</h3>
                  <p className="mt-1 text-[14.5px] leading-relaxed text-text-2">{pt.text}</p>
                </div>
              </RevealItem>
            ))}
          </Stagger>
          <Reveal className="mt-10">
            <Button href={href(locale, "/docs/self-hosting")} variant="secondary">
              {s.cta}
              <Icon name="arrowRight" size={18} />
            </Button>
          </Reveal>
        </div>
        <Reveal y={48}>
          <Terminal />
        </Reveal>
      </div>
    </section>
  );
}
