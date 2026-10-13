import "server-only";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import Link from "next/link";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import type { ComponentProps, ReactNode } from "react";
import { href, type Locale } from "./i18n";
import type { Dictionary } from "@/content/dict";
import { Callout } from "@/components/docs/Callout";
import { CodeBlock } from "@/components/docs/CodeBlock";

/** Compiles a doc at build time (static export) into React elements. */
export async function renderMdx(source: string, locale: Locale, dict: Dictionary) {
  const { default: Content } = await evaluate(source, {
    ...runtime,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, [rehypePrettyCode, { theme: "github-dark-dimmed", keepBackground: false, defaultLang: "plaintext" }]],
  });

  const components = {
    a: ({ href: to = "", children, ...rest }: ComponentProps<"a">) => {
      if (to.startsWith("/docs") || to === "/" || to.startsWith("/download")) {
        return <Link href={href(locale, to)}>{children}</Link>;
      }
      if (/^https?:/.test(to)) {
        return (
          <a href={to} rel="noopener" {...rest}>
            {children}
          </a>
        );
      }
      return (
        <a href={to} {...rest}>
          {children}
        </a>
      );
    },
    pre: CodeBlock,
    Callout: ({ type = "note", title, children }: { type?: "note" | "tip" | "warning"; title?: string; children: ReactNode }) => (
      <Callout type={type} title={title} label={dict.docs.callout[type] ?? dict.docs.callout.note}>
        {children}
      </Callout>
    ),
  };

  return <Content components={components} />;
}
