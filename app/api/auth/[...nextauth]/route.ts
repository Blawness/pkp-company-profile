/**
 * NextAuth v5 route handler. Delegates all /api/auth/* requests
 * (sign-in, sign-out, callback, session, csrf, providers) to admin-kit.
 */
import { handlers } from "@blawness/admin-kit/auth";

export const { GET, POST } = handlers;
