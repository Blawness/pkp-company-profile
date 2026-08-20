import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep the admin area and internal API out of the index.
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
    host: new URL(siteUrl).host,
  };
}
