/**
 * Type augmentation for NextAuth + admin-kit.
 *
 * admin-kit's shell and helpers read `session.user.role` directly. We
 * extend the built-in `Session` / `User` shapes so TypeScript knows about
 * the `role` field and our `requireUser()` / shell code type-checks.
 *
 * Roles are free-form strings (consumer-defined in rbac.ts); the
 * `RbacConfig['roles']` keys are the source of truth. For practical use
 * we type `role` as `string` and rely on admin-kit's permission helpers
 * (`hasPermission`, `matches`) to do the authorisation check.
 */
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role: string;
    } & DefaultSession["user"];
  }
  interface User {
    role?: string;
  }
}