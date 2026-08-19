/**
 * Drizzle schema: re-export admin-kit's built-in schema.
 *
 * admin-kit ships its own tables (`users`, `articles`, `categories`, `media`,
 * `tags`, `articleTags`, `auditLogs`, `loginAttempts`). We re-export them
 * here so the rest of the app imports from a single stable path.
 *
 * To extend the schema, import admin-kit's tables and add new ones; do not
 * redefine existing tables or migrations will conflict.
 */
export {
  users,
  media,
  categories,
  tags,
  articles,
  articleTags,
  auditLogs,
  loginAttempts,
} from "@blawness/admin-kit/schema";