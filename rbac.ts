/**
 * RBAC configuration. Single source of truth for roles + permissions.
 *
 * Uses admin-kit's `presets.adminEditor` which defines the two-role model:
 *   - admin   : everything (`*`)
 *   - editor  : read all, create/update articles + categories, upload media,
 *               edit own profile (no publish, no delete)
 *
 * Built-in screens (ArticlesScreen, MediaLibraryScreen, UsersScreen, ...)
 * look up permissions through `getActiveRbac()` which is registered by
 * the import in `instrumentation.ts` (node runtime) — required so server
 * actions resolve permissions on cold start.
 */
import { defineRbac, presets } from "@blawness/admin-kit/rbac";

export const rbac = defineRbac({
  roles: { ...presets.adminEditor },
  fallbackRole: "editor", // role assigned to users with NULL role (per 0.8 migration 0004)
  protectedPermission: "users.delete", // can't remove the last role holding this
});