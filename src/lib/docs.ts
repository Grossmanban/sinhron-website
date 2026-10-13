import "server-only";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import GithubSlugger from "github-slugger";
import type { Locale } from "./i18n";

const DOCS_DIR = join(process.cwd(), "src/content/docs");

export interface Heading {
  depth: 2 | 3;
  text: string;
  id: string;
}

/** Reads a doc in the requested language, falling back to the other one if it isn't translated yet. */
export async function readDoc(locale: Locale, slug: string): Promise<{ source: string; lang: Locale; translated: boolean } | null> {
  const order: Locale[] = locale === "ru" ? ["ru", "en"] : ["en", "ru"];
  for (const lang of order) {
    const file = join(DOCS_DIR, lang, `${slug}.mdx`);
    if (existsSync(file)) return { source: await readFile(file, "utf8"), lang, translated: lang === locale };
  }
  return null;
}

/** Markdown with fenced code removed (so `# comments` inside code aren't taken for headings). */
function withoutCode(source: string) {
  return source.replace(/^```[\s\S]*?^```/gm, "");
}

/** Same ids rehype-slug produces (both use github-slugger). */
export function extractHeadings(source: string): Heading[] {
  const slugger = new GithubSlugger();
  const out: Heading[] = [];
  for (const line of withoutCode(source).split("\n")) {
    const m = /^(#{2,3})\s+(.+?)\s*#*$/.exec(line);
    if (!m) continue;
    const text = stripInline(m[2]!);
    out.push({ depth: m[1]!.length as 2 | 3, text, id: slugger.slug(text) });
  }
  return out;
}

function stripInline(s: string) {
  return s
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_~]/g, "")
    .trim();
}

export interface SearchEntry {
  slug: string;
  page: string;
  heading: string;
  id: string;
  text: string;
}

/** Splits a page into sections (by ## / ###) of plain text for the client-side search index. */
export function toSearchEntries(slug: string, page: string, source: string): SearchEntry[] {
  const slugger = new GithubSlugger();
  const entries: SearchEntry[] = [];
  let cur: SearchEntry = { slug, page, heading: page, id: "", text: "" };
  const plain = (s: string) =>
    stripInline(
      s
        .replace(/<\/?Callout[^>]*>/g, " ")
        .replace(/^\s*[-*+]\s+/gm, "")
        .replace(/^\s*\d+\.\s+/gm, "")
        .replace(/\|/g, " ")
        .replace(/^-{3,}$/gm, ""),
    );
  for (const line of withoutCode(source).split("\n")) {
    const m = /^(#{2,3})\s+(.+?)\s*#*$/.exec(line);
    if (m) {
      if (cur.text.trim()) entries.push(cur);
      const text = stripInline(m[2]!);
      cur = { slug, page, heading: text, id: slugger.slug(text), text: "" };
    } else {
      cur.text += " " + plain(line);
    }
  }
  if (cur.text.trim() || cur.id) entries.push(cur);
  return entries.map((e) => ({ ...e, text: e.text.replace(/\s+/g, " ").trim().slice(0, 1200) }));
}

/** Reads any MDX under src/content (e.g. "blog/ru/hello.mdx"); null if missing. */
export async function readContent(rel: string): Promise<string | null> {
  const file = join(process.cwd(), "src/content", rel);
  return existsSync(file) ? readFile(file, "utf8") : null;
}
