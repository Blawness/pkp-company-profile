/**
 * Drizzle schema: re-export admin-kit's built-in schema + extend with the
 * app-specific `portfolios` table.
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

import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Portfolio projects. Mirrors the `articles` shape (status + slug +
 * Tiptap HTML content + cover/gallery URLs) but adds portfolio-specific
 * metadata (client, location, year, tags).
 *
 * Cover and gallery images store absolute URLs. Until Cloudflare R2 is
 * wired up via admin-kit's media screen, set these to URLs hosted on
 * Pexels / Imgur / any CDN you control — see
 * `next.config.ts > images.remotePatterns` for the allow-list.
 *
 * Note: this table is NOT managed by admin-kit's built-in CRUD screens.
 * If you want a portfolio editor inside /admin, either:
 *   (a) extend admin-kit by wrapping `articles` with a `kind: 'portfolio'`
 *       discriminator column (schema change in admin-kit itself), or
 *   (b) build a custom admin screen that calls Drizzle directly.
 */
export const portfolios = pgTable("portfolios", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt"),
  client: text("client"),
  location: text("location"),
  year: text("year"),
  tags: text("tags").array().notNull().default([]),
  coverImageUrl: text("cover_image_url"),
  // JSON array of { url, alt?, caption? }
  gallery: text("gallery").array().notNull().default([]),
  // Tiptap HTML body. Sanitised on render via admin-kit's sanitizeHtml.
  content: text("content"),
  status: text("status").notNull().default("draft"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  // FK to admin-kit's categories
  categoryId: integer("category_id"),
  // FK to admin-kit's users
  authorId: integer("author_id").notNull(),
});

/**
 * Singleton AI-settings row. Mirrors the old Sanity `aiSettings`
 * document. Fixed primary key `id='singleton'` ensures we always
 * upsert the same row.
 *
 * `fieldOverrides` is a JSON-encoded array of
 * `{ documentType, fieldName, enabled, promptTemplate }`.
 */
export const aiSettings = pgTable("ai_settings", {
  id: text("id").primaryKey(), // always 'singleton'
  enabled: text("enabled").notNull().default("true"),
  defaultLanguage: text("default_language").notNull().default("id"),
  tone: text("tone").notNull().default("professional"),
  model: text("model").notNull().default("gemini-3-flash-preview"),
  temperature: text("temperature").notNull().default("0.7"),
  maxTokens: text("max_tokens").notNull().default("1024"),
  companyContext: text("company_context"),
  styleGuide: text("style_guide"),
  imageSearchEnabled: text("image_search_enabled").notNull().default("true"),
  fieldOverrides: text("field_overrides").array().notNull().default([]),
});