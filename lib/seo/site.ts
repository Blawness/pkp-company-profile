import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

/**
 * Canonical site origin used for metadata, sitemap and robots.
 * MUST be set via NEXT_PUBLIC_SITE_URL in production (it is inlined at build time).
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.presisikonsulindoprima.com";

/**
 * Build an absolute URL for a given locale + path that matches the actual
 * routing (localePrefix: "as-needed" → the default locale has NO prefix).
 *
 * @param locale current locale (saat ini hanya "id")
 * @param path   path WITHOUT leading slash and WITHOUT locale (e.g. "" | "tentang-kami")
 */
export function localizedUrl(locale: string, path = ""): string {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  const suffix = path ? `/${path}` : "";
  const url = `${siteUrl}${prefix}${suffix}`;
  // Root of the default locale should still carry a trailing slash.
  return url === siteUrl ? `${siteUrl}/` : url;
}

/**
 * Build `alternates` metadata. Situs hanya melayani satu bahasa (id), jadi
 * cukup canonical yang menunjuk ke dirinya sendiri — hreflang butuh minimal
 * dua variasi bahasa untuk punya arti.
 */
export function buildAlternates(
  locale: string,
  path = "",
): NonNullable<Metadata["alternates"]> {
  return {
    canonical: localizedUrl(locale, path),
  };
}
