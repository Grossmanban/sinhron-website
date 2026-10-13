import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { site } from "@/config/site";
import { themeBootScript } from "@/lib/theme";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(`${site.url}/`),
  title: "Sinhron",
  description: "Sinhron — private messenger on your own server · Приватный мессенджер на вашем сервере",
  alternates: { languages: { ru: `${site.url}/ru/`, en: `${site.url}/en/` } },
};

export default function GateLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
