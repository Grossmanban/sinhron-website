import { Suspense, type ComponentType } from "react";
import type { Metadata } from "next";
import { alternates } from "@/lib/seo";
import type { Locale } from "@/lib/i18n";
import { Hero } from "@/components/sections/Hero";
import { ServerSees } from "@/components/sections/ServerSees";
import { Features } from "@/components/sections/Features";
import { Security } from "@/components/sections/Security";
import { Calls } from "@/components/sections/Calls";
import { SelfHost } from "@/components/sections/SelfHost";
import { Platforms } from "@/components/sections/Platforms";
import { OpenSource } from "@/components/sections/OpenSource";
import { FinalCta } from "@/components/sections/FinalCta";

// Order of the landing page. Sections are independent — add, remove or reorder here.
const sections: ComponentType[] = [Hero, ServerSees, Features, Security, Calls, SelfHost, Platforms, OpenSource, FinalCta];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: alternates(locale as Locale, "") };
}

export default function Home() {
  return (
    <>
      {/* One Suspense boundary per section → React hydrates them in separate chunks and yields to
          the browser in between, instead of one long main-thread task (lower TBT on phones). */}
      {sections.map((S, i) => (
        <Suspense key={i}>
          <S />
        </Suspense>
      ))}
    </>
  );
}
