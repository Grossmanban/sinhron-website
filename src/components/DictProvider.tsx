"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Dictionary } from "@/content/dict";
import type { Locale } from "@/lib/i18n";

const Ctx = createContext<{ locale: Locale; dict: Dictionary } | null>(null);

export function DictProvider({ locale, dict, children }: { locale: Locale; dict: Dictionary; children: ReactNode }) {
  return <Ctx.Provider value={{ locale, dict }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n outside DictProvider");
  return v;
}
