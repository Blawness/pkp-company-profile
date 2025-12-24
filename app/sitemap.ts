import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://pkp-company-profile.vercel.app";

const stableLastModified =
  process.env.NEXT_PUBLIC_BUILD_TIME &&
  !Number.isNaN(Date.parse(process.env.NEXT_PUBLIC_BUILD_TIME))
    ? new Date(process.env.NEXT_PUBLIC_BUILD_TIME)
    : new Date("2025-01-01T00:00:00.000Z");

const routes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: MetadataRoute.Sitemap[number]["priority"];
}> = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/tentang-kami", changeFrequency: "monthly", priority: 0.7 },
  { path: "/layanan", changeFrequency: "monthly", priority: 0.9 },
  { path: "/kontak", changeFrequency: "monthly", priority: 0.8 },
  { path: "/artikel", changeFrequency: "weekly", priority: 0.6 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: new URL(route.path, siteUrl).toString(),
    lastModified: stableLastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
