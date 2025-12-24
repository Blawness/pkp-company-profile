import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Apply the locale middleware to all pages (but not static assets)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
