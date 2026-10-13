import type { Locale } from "@/lib/i18n";

type L = Record<Locale, string>;
export interface DocPage {
  slug: string;
  title: L;
  description: L;
}
export interface DocGroup {
  id: string;
  title: L;
  pages: DocPage[];
}

// Docs menu. To add a page: drop `<slug>.mdx` into ru/ and en/ and add one entry here.
export const docsNav: DocGroup[] = [
  {
    id: "start",
    title: { ru: "Начало", en: "Get started" },
    pages: [
      {
        slug: "getting-started",
        title: { ru: "Начало работы", en: "Getting started" },
        description: { ru: "Что такое Sinhron, как установить и что важно знать с первого дня.", en: "What Sinhron is, how to install it and what to know from day one." },
      },
      {
        slug: "features",
        title: { ru: "Возможности", en: "Features" },
        description: { ru: "Чаты, звонки, медиа, исчезающие сообщения, папки и приватность.", en: "Chats, calls, media, disappearing messages, folders and privacy." },
      },
    ],
  },
  {
    id: "security",
    title: { ru: "Безопасность", en: "Security" },
    pages: [
      {
        slug: "security",
        title: { ru: "Как устроена защита", en: "How security works" },
        description: { ru: "Шифрование MLS, что видит сервер, звонки, данные на устройстве.", en: "MLS encryption, what the server sees, calls and data on your device." },
      },
      {
        slug: "threat-model",
        title: { ru: "Модель угроз", en: "Threat model" },
        description: { ru: "От чего Sinhron защищает, а от чего — нет. Честно.", en: "What Sinhron protects against — and what it doesn’t. Honestly." },
      },
    ],
  },
  {
    id: "server",
    title: { ru: "Свой сервер", en: "Self-hosting" },
    pages: [
      {
        slug: "self-hosting",
        title: { ru: "Установка сервера", en: "Running a server" },
        description: { ru: "От чистой VM до работающего сервера: Docker, TLS, звонки, бэкапы.", en: "From a bare VM to a running server: Docker, TLS, calls, backups." },
      },
      {
        slug: "architecture",
        title: { ru: "Архитектура", en: "Architecture" },
        description: { ru: "Как устроены клиент, ядро и сервер и как идёт сообщение.", en: "How the client, core and server fit together and how a message travels." },
      },
    ],
  },
  {
    id: "project",
    title: { ru: "Проект", en: "Project" },
    pages: [
      {
        slug: "roadmap",
        title: { ru: "Дорожная карта", en: "Roadmap" },
        description: { ru: "Что готово, что в работе и что дальше.", en: "What’s done, what’s in progress and what’s next." },
      },
      {
        slug: "faq",
        title: { ru: "Вопросы и ответы", en: "FAQ" },
        description: { ru: "Короткие ответы на частые вопросы.", en: "Short answers to common questions." },
      },
      {
        slug: "glossary",
        title: { ru: "Глоссарий", en: "Glossary" },
        description: { ru: "Термины простыми словами.", en: "The terms, in plain words." },
      },
    ],
  },
];

export const docPages: DocPage[] = docsNav.flatMap((g) => g.pages);
