import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const routes = ["/", "/tentang-kami", "/layanan", "/kontak", "/artikel"];

  return routes.map((path) => ({
    url: new URL(path, siteUrl).toString(),
    lastModified,
  }));
}
