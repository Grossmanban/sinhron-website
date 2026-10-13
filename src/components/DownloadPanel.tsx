"use client";

import { m } from "motion/react";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { detectPlatform, downloads, type Download, type PlatformId } from "@/config/downloads";
import { site } from "@/config/site";
import { useI18n } from "./DictProvider";
import { Button } from "./ui/Button";
import { Icon, PlatformIcon } from "./ui/Icon";
import { RevealItem, Stagger } from "./ui/Reveal";

interface Release {
  tag_name: string;
  html_url: string;
  assets: { name: string; browser_download_url: string }[];
}

/** Live check of GitHub Releases. Any failure (no release yet → 404, rate limit, offline) is silent. */
function useLatestRelease() {
  const [state, setState] = useState<{ status: "checking" | "none" | "found"; release?: Release }>({ status: "checking" });
  useEffect(() => {
    const ctrl = new AbortController();
    fetch(site.releasesApi, { signal: ctrl.signal, headers: { Accept: "application/vnd.github+json" } })
      .then((r) => (r.ok ? r.json() : []))
      .then((list: (Release & { draft?: boolean; prerelease?: boolean })[]) => {
        const rel = Array.isArray(list) ? list.find((x) => !x.draft) : undefined;
        setState(rel?.tag_name ? { status: "found", release: rel } : { status: "none" });
      })
      .catch(() => !ctrl.signal.aborted && setState({ status: "none" }));
    return () => ctrl.abort();
  }, []);
  return state;
}

const noop = () => () => {};

function resolve(d: Download, release?: Release) {
  const asset = release?.assets.find((a) => d.assetPattern.test(a.name));
  if (asset) return { available: true, url: asset.browser_download_url };
  return { available: d.status === "available", url: d.url };
}

export function DownloadPanel() {
  const { dict } = useI18n();
  const t = dict.download;
  const rel = useLatestRelease();
  // Client-only value: null during prerender, the visitor's platform after hydration.
  const detected = useSyncExternalStore<PlatformId | null | "pending">(
    noop,
    () => detectPlatform(navigator.userAgent, navigator.maxTouchPoints),
    () => "pending",
  );
  const mine = detected === "pending" ? null : detected;

  const ordered = useMemo(() => (mine ? [...downloads].sort((a, b) => Number(b.id === mine) - Number(a.id === mine)) : downloads), [mine]);
  const shownPrimary = downloads.find((d) => d.id === mine) ?? downloads[0]!;

  return (
    <>
      <div className="mt-8 flex items-center justify-center gap-2 text-center text-[14px] text-text-3" aria-live="polite">
        {rel.status === "checking" && (
          <>
            <span className="size-2 animate-pulse rounded-full bg-accent" />
            {t.checking}
          </>
        )}
        {rel.status === "found" && rel.release && (
          <a href={rel.release.html_url} rel="noopener" className="inline-flex items-center gap-2 font-medium text-success">
            <span className="size-2 rounded-full bg-success" />
            {t.found.replace("{version}", rel.release.tag_name)}
          </a>
        )}
        {rel.status === "none" && <span>{t.none}</span>}
      </div>

      {/* Space is reserved before the platform is known (prerender), so nothing shifts on hydration. */}
      {detected !== null && (() => {
        const primary = shownPrimary;
        return (
        <m.div
          key={primary.id}
          initial={mine ? { opacity: 0, scale: 0.98 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 26 }}
          aria-hidden={!mine || undefined}
          className={`mx-auto mt-10 max-w-xl rounded-[28px] border border-accent/25 bg-card p-7 text-center shadow-lift md:p-9 ${mine ? "" : "invisible"}`}
        >
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-accent">{t.recommended}</p>
          <div className="mt-5 flex justify-center text-text">
            <PlatformIcon id={primary.id} size={48} />
          </div>
          <h2 className="mt-4 text-[26px] font-semibold tracking-[-0.025em] text-text">{primary.name}</h2>
          <p className="mt-1 font-mono text-[13px] text-text-3">{primary.formats.join(" · ")}</p>
          <div className="mt-7 flex flex-col items-center gap-3">
            {(() => {
              const r = resolve(primary, rel.release);
              return r.available ? (
                <Button href={r.url} size="lg" magnetic>
                  <Icon name="download" size={19} />
                  {t.get}
                </Button>
              ) : (
                <>
                  <Button size="lg" disabled ariaLabel={`${primary.name}: ${t.soon}`}>
                    {t.soon}
                  </Button>
                  <a href={site.releases} rel="noopener" className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-accent">
                    <Icon name="github" size={17} />
                    {t.watch}
                  </a>
                </>
              );
            })()}
          </div>
        </m.div>
        );
      })()}

      <h2 className="mt-20 text-center text-[13px] font-semibold uppercase tracking-[0.08em] text-text-3">{t.all}</h2>
      <Stagger className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" gap={0.05}>
        {ordered.map((d) => {
          const r = resolve(d, rel.release);
          return (
            <RevealItem key={d.id}>
              <div className="flex h-full items-center gap-4 rounded-[22px] border border-divider bg-card p-5 shadow-soft">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-bg-soft text-text">
                  <PlatformIcon id={d.id} size={26} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[16px] font-semibold text-text">{d.name}</p>
                  <p className="truncate font-mono text-[12px] text-text-3">{d.formats.join(" · ")}</p>
                </div>
                {r.available ? (
                  <Button href={r.url} size="sm">
                    {t.get}
                  </Button>
                ) : (
                  <span className="shrink-0 rounded-full bg-accent-soft px-3 py-1.5 text-[12.5px] font-semibold text-accent">{t.soon}</span>
                )}
              </div>
            </RevealItem>
          );
        })}
      </Stagger>
    </>
  );
}
