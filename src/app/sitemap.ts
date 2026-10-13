import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { locales } from "@/lib/i18n";
import { docPages } from "@/content/docs/nav";
import { posts } from "@/content/blog/posts";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "download/", "docs/", ...docPages.map((p) => `docs/${p.slug}/`), "blog/", ...posts.map((p) => `blog/${p.slug}/`), "changelog/", "press/"];
  return paths.map((path) => ({
    url: `${site.url}/en/${path}`,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${site.url}/${l}/${path}`])) },
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
