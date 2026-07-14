import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { localizedUrl } from "@/lib/seo/site";

const stableLastModified =
  process.env.NEXT_PUBLIC_BUILD_TIME &&
  !Number.isNaN(Date.parse(process.env.NEXT_PUBLIC_BUILD_TIME))
    ? new Date(process.env.NEXT_PUBLIC_BUILD_TIME)
    : new Date("2025-01-01T00:00:00.000Z");

const routes = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "tentang-kami", changeFrequency: "monthly", priority: 0.7 },
  { path: "layanan", changeFrequency: "monthly", priority: 0.9 },
  { path: "kontak", changeFrequency: "monthly", priority: 0.8 },
  { path: "portofolio", changeFrequency: "monthly", priority: 0.7 },
  { path: "artikel", changeFrequency: "weekly", priority: 0.6 },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap((route) => {
    // hreflang alternates: every locale variant of this same page.
    const languages = Object.fromEntries(
      routing.locales.map((locale) => [locale, localizedUrl(locale, route.path)]),
    );

    return routing.locales.map((locale) => ({
      url: localizedUrl(locale, route.path),
      lastModified: stableLastModified,
      changeFrequency:
        route.changeFrequency as MetadataRoute.Sitemap[number]["changeFrequency"],
      priority: route.priority,
      alternates: { languages },
    }));
  });
}
