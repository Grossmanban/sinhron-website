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
    slug: "hello-sinhron",
    date: "2026-10-13",
    title: { ru: "Привет, Sinhron", en: "Hello, Sinhron" },
    summary: {
      ru: "Зачем мы делаем ещё один мессенджер, что уже работает и чего пока нет.",
      en: "Why we’re building another messenger, what already works and what doesn’t yet.",
    },
  },
];
