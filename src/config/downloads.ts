import { site } from "./site";

export type PlatformId = "ios" | "android" | "macos" | "windows" | "linux";
export type DownloadStatus = "available" | "soon";

export interface Download {
  id: PlatformId;
  name: string;
  /** Asset formats published on GitHub Releases. */
  formats: string[];
  /** Matches a release asset file name; used to light up the button when a release appears. */
  assetPattern: RegExp;
  /** Where the button leads once available. */
  url: string;
  status: DownloadStatus;
}

// Single source of truth for download buttons. No releases exist yet, so everything is "soon";
// flip `status` (or let the live GitHub check do it) once a build is published.
export const downloads: Download[] = [
  { id: "ios", name: "iPhone & iPad", formats: ["TestFlight"], assetPattern: /\.ipa$/i, url: `${site.releases}/latest`, status: "soon" },
  { id: "android", name: "Android", formats: [".apk"], assetPattern: /\.apk$/i, url: `${site.releases}/latest`, status: "soon" },
  { id: "macos", name: "macOS", formats: [".dmg"], assetPattern: /\.dmg$/i, url: `${site.releases}/latest`, status: "soon" },
  { id: "windows", name: "Windows", formats: [".msix", ".exe"], assetPattern: /\.(msix|exe)$/i, url: `${site.releases}/latest`, status: "soon" },
  { id: "linux", name: "Linux", formats: [".AppImage", ".deb", ".rpm"], assetPattern: /\.(AppImage|deb|rpm)$/i, url: `${site.releases}/latest`, status: "soon" },
];

export function detectPlatform(ua: string, maxTouchPoints = 0): PlatformId | null {
  const s = ua.toLowerCase();
  if (/iphone|ipad|ipod/.test(s)) return "ios";
  // iPadOS 13+ reports itself as a Mac; touch support gives it away.
  if (s.includes("macintosh") && maxTouchPoints > 1) return "ios";
  if (s.includes("android")) return "android";
  if (s.includes("windows")) return "windows";
  if (s.includes("mac os") || s.includes("macintosh")) return "macos";
  if (s.includes("linux") || s.includes("x11")) return "linux";
  return null;
}
