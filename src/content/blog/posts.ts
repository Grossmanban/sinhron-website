import type { Locale } from "@/lib/i18n";

export interface Post {
  slug: string;
  /** ISO date */
  date: string;
  title: Record<Locale, string>;
  summary: Record<Locale, string>;
}

// Newest first. To publish: add `<slug>.mdx` to blog/ru and blog/en and an entry here.
export const posts: Post[] = [
  {
    slug: "october-13-update",
    date: "2026-10-13",
    title: { ru: "Упоминания, фото профиля и запись экрана", en: "Mentions, profile photos and screen recording" },
    summary: {
      ru: "Что появилось и что исправлено за день работы — и что ещё ждёт проверки на iPhone.",
      en: "What a day of work added and fixed, and what still waits for an iPhone.",
    },
  },
  {
    slug: "hello-sinhron",
    date: "2026-10-13",
    title: { ru: "Привет, Sinhron", en: "Hello, Sinhron" },
    summary: {
      ru: "Зачем мы делаем ещё один мессенджер, что уже работает и чего пока нет.",
      en: "Why we’re building another messenger, what already works and what doesn’t yet.",
    },
  },
];
