import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  // admin-kit ships compiled JSX/ESM; transpile so the bundler processes it.
  transpilePackages: ["@blawness/admin-kit"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/photos/**",
      },
      {
        protocol: "https",
        hostname: "i.imgur.com",
      },
    ],
  },
  async redirects() {
    return [
      // Locale "en" dihapus. URL /en/* sudah terindeks Google, jadi arahkan
      // permanen ke padanan bahasa Indonesia agar peringkatnya tidak hangus.
      // Redirect di next.config dievaluasi sebelum middleware next-intl.
      {
        source: "/en",
        destination: "/",
        permanent: true,
      },
      {
        source: "/en/:path*",
        destination: "/:path*",
        permanent: true,
      },
      // Konsolidasi sinyal SEO: www dan apex sama-sama melayani 200, sedangkan
      // canonical menunjuk apex. Redirect permanen menyatukan keduanya.
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.presisikonsulindoprima.com",
          },
        ],
        destination: "https://presisikonsulindoprima.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
