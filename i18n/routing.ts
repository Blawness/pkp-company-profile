import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ["id", "en"],

  // Used when no locale matches
  defaultLocale: "id",

  // Don't use a prefix for the default locale
  localePrefix: "as-needed",

  // Always fall back to Indonesian instead of inferring from the browser
  localeDetection: false,
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
