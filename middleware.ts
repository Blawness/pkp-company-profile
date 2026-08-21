/**
 * Combined middleware:
 *   - Admin paths (/admin, /login): NextAuth attaches session to req.auth.
 *     Actual gating happens in the admin layout via `requireUser()`.
 *   - Public paths: next-intl handles locale detection / redirects.
 *
 * NextAuth v5's `auth(handler)` is the only way to invoke middleware-side
 * session lookup — calling `auth(req)` directly is not supported.
 */
import createIntlMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { routing } from "./i18n/routing";
import { rbac } from "./rbac";

const intlMiddleware = createIntlMiddleware(routing);

const { auth: combinedAuth } = NextAuth(rbac.authConfig);

export default combinedAuth((req) => {
  const { pathname } = req.nextUrl;
  // Admin / login: session is now on req.auth via the wrapper above.
  // We just let the request through — the admin layout calls requireUser().
  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    return NextResponse.next();
  }
  // Public: hand off to next-intl for locale handling.
  return intlMiddleware(req);
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|studio|.*\\..*).*)"],
};
