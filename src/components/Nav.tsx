"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { href } from "@/lib/i18n";
import { site } from "@/config/site";
import { useI18n } from "./DictProvider";
import { Logo } from "./ui/Logo";
import { Icon } from "./ui/Icon";
import { Button } from "./ui/Button";
import { ThemeButton } from "./ThemeControl";
import { LanguageSwitch } from "./LanguageSwitch";

/**
 * Sticky glass bar. Hides while scrolling down, returns on scroll up, and switches to its dark
 * appearance over sections marked `data-nav-dark` (hero, calls, final CTA).
 */
export function Nav() {
  const { locale, dict } = useI18n();
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [overDark, setOverDark] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const delta = y - lastY.current;
      if (Math.abs(delta) > 6) {
        setHidden(delta > 0 && y > 160);
        lastY.current = y;
      }
      setScrolled(y > 8);
      let dark = false;
      document.querySelectorAll<HTMLElement>("[data-nav-dark]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top <= 28 && r.bottom >= 28) dark = true;
      });
      setOverDark(dark);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  // Close the menu on navigation (state adjusted during render, per React docs).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const links = [
    { label: dict.nav.features, to: href(locale, "/#features") },
    { label: dict.nav.security, to: href(locale, "/#security") },
    { label: dict.nav.selfHost, to: href(locale, "/#self-host") },
    { label: dict.nav.docs, to: href(locale, "/docs") },
  ];

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[100] rounded-full bg-button px-4 py-2 text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {dict.common.skip}
      </a>
      <m.header
        className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] ${overDark && !open ? "sn-dark !bg-transparent" : ""}`}
        animate={{ y: hidden && !open ? "-110%" : "0%" }}
        transition={{ type: "spring", stiffness: 380, damping: 40 }}
      >
        <div
          className={`absolute inset-0 -z-10 transition-[opacity,background-color] duration-500 ${
            scrolled || open ? "glass border-b border-divider opacity-100" : "opacity-0"
          } ${overDark && !open ? "!bg-[rgba(5,8,12,0.55)]" : ""}`}
        />
        <nav className="container-x flex h-14 items-center gap-2 md:h-16" aria-label="Main">
          <Link href={href(locale)} aria-label={dict.nav.home} className="mr-auto -ml-1 rounded-full p-1">
            <Logo />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  href={l.to}
                  className="rounded-full px-3.5 py-2 text-[14.5px] text-text-2 transition-colors hover:text-text"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={site.github} rel="noopener" className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[14.5px] text-text-2 transition-colors hover:text-text">
                <Icon name="github" size={17} />
                {dict.nav.github}
              </a>
            </li>
          </ul>

          <div className="ml-1 flex items-center gap-1">
            <div className="hidden items-center gap-1 md:flex">
              <LanguageSwitch id="nav-lang" />
              <ThemeButton />
            </div>
            <div className="ml-1 hidden min-[400px]:block">
              <Button href={href(locale, "/download")} size="sm">
                {dict.nav.download}
              </Button>
            </div>
            <button
              type="button"
              className="grid size-11 place-items-center rounded-full text-text lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? dict.nav.closeMenu : dict.nav.openMenu}
              onClick={() => setOpen((v) => !v)}
            >
              <m.span animate={{ rotate: open ? 90 : 0 }}>
                <Icon name={open ? "close" : "menu"} size={22} />
              </m.span>
            </button>
          </div>
        </nav>
      </m.header>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            className="glass fixed inset-0 z-40 flex flex-col overflow-y-auto px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[calc(5rem+env(safe-area-inset-top))] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            <m.ul
              className="flex flex-col"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } } }}
            >
              {[...links, { label: dict.nav.download, to: href(locale, "/download") }].map((l) => (
                <m.li
                  key={l.to}
                  variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
                  className="border-b border-divider"
                >
                  <Link href={l.to} onClick={() => setOpen(false)} className="flex items-center justify-between py-4 text-[28px] font-semibold tracking-[-0.03em] text-text">
                    {l.label}
                    <Icon name="chevronRight" size={22} className="text-text-3" />
                  </Link>
                </m.li>
              ))}
              <m.li variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}>
                <a href={site.github} rel="noopener" className="flex items-center gap-2 py-4 text-[20px] font-medium text-text-2">
                  <Icon name="github" size={20} /> GitHub
                </a>
              </m.li>
            </m.ul>
            <div className="mt-auto flex items-center justify-between gap-4 pt-8">
              <LanguageSwitch id="menu-lang" />
              <ThemeButton />
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
