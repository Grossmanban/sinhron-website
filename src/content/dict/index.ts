import type { Locale } from "@/lib/i18n";
import { en, type Dictionary } from "./en";
import { ru } from "./ru";

const dictionaries: Record<Locale, Dictionary> = { en, ru };

export function getDict(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
