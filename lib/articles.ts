/**
 * Article query helpers. Read published articles from Postgres for the
 * public site. Replaces the previous Sanity GROQ queries.
 *
 * Status semantics (mirrors admin-kit's built-in `articles.status`):
 *   - "draft"    : visible only via /api/draft preview
 *   - "published": visible to the public
 *
 * `publishedAt` is a timestamp; we use it to ORDER BY most-recent.
 * Slug is the public-facing identifier.
 */
import { and, desc, eq, isNotNull } from "drizzle-orm";
import { db } from "@/db";
import { articles, users, categories } from "@blawness/admin-kit/schema";

export type ArticlePreview = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  publishedAt: Date | null;
  categoryName: string | null;
  authorName: string | null;
};

export type ArticleDetail = ArticlePreview & {
  content: string | null; // Tiptap HTML
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
};

/** List published articles, newest first. */
export async function listPublishedArticles(): Promise<ArticlePreview[]> {
  const rows = await db
    .select({
      id: articles.id,
      title: articles.title,
      slug: articles.slug,
      excerpt: articles.excerpt,
      coverImageUrl: articles.coverImageUrl,
      publishedAt: articles.publishedAt,
      categoryName: categories.name,
      authorName: users.name,
    })
    .from(articles)
    .leftJoin(categories, eq(articles.categoryId, categories.id))
    .leftJoin(users, eq(articles.authorId, users.id))
    .where(
      and(eq(articles.status, "published"), isNotNull(articles.publishedAt)),
    )
    .orderBy(desc(articles.publishedAt));
  return rows;
}

/** Single published article by slug, or null. */
export async function getPublishedArticleBySlug(
  slug: string,
): Promise<ArticleDetail | null> {
  const rows = await db
    .select({
      id: articles.id,
      title: articles.title,
      slug: articles.slug,
      excerpt: articles.excerpt,
      coverImageUrl: articles.coverImageUrl,
      publishedAt: articles.publishedAt,
      content: articles.content,
      metaTitle: articles.metaTitle,
      metaDescription: articles.metaDescription,
      ogImage: articles.ogImage,
      categoryName: categories.name,
      authorName: users.name,
    })
    .from(articles)
    .leftJoin(categories, eq(articles.categoryId, categories.id))
    .leftJoin(users, eq(articles.authorId, users.id))
    .where(
      and(eq(articles.slug, slug), eq(articles.status, "published")),
    )
    .limit(1);
  return rows[0] ?? null;
}

/**
 * Article fetch that respects Next.js Draft Mode. When `preview` is true,
 * any status is returned (so editors can preview drafts). When false,
 * only `published` rows are returned.
 *
 * Used by the public detail page so admins get a working preview via the
 * admin-kit article screen.
 */
export async function getArticleBySlugForRender(
  slug: string,
  preview: boolean,
): Promise<ArticleDetail | null> {
  const statusFilter = preview
    ? undefined
    : eq(articles.status, "published");
  const rows = await db
    .select({
      id: articles.id,
      title: articles.title,
      slug: articles.slug,
      excerpt: articles.excerpt,
      coverImageUrl: articles.coverImageUrl,
      publishedAt: articles.publishedAt,
      content: articles.content,
      metaTitle: articles.metaTitle,
      metaDescription: articles.metaDescription,
      ogImage: articles.ogImage,
      categoryName: categories.name,
      authorName: users.name,
    })
    .from(articles)
    .leftJoin(categories, eq(articles.categoryId, categories.id))
    .leftJoin(users, eq(articles.authorId, users.id))
    .where(
      statusFilter
        ? and(eq(articles.slug, slug), statusFilter)
        : eq(articles.slug, slug),
    )
    .limit(1);
  return rows[0] ?? null;
}