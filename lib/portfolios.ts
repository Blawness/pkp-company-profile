/**
 * Portfolio query helpers. Mirrors `lib/articles.ts` but reads from the
 * app-specific `portfolios` table (admin-kit's built-in schema has no
 * portfolio model).
 */
import { and, desc, eq, isNotNull } from "drizzle-orm";
import { db } from "@/db";
import { portfolios, categories } from "@/db/schema";

/** Safely parse a JSON-encoded gallery item, returning null on parse failure. */
const parseGalleryItem = (raw: string | null): GalleryImage | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<GalleryImage>;
    if (typeof parsed.url !== "string" || !parsed.url) return null;
    return {
      url: parsed.url,
      alt: typeof parsed.alt === "string" ? parsed.alt : undefined,
      caption: typeof parsed.caption === "string" ? parsed.caption : undefined,
    };
  } catch {
    return null;
  }
};

const mapGallery = (rows: string[] | null | undefined): GalleryImage[] =>
  (rows ?? [])
    .map(parseGalleryItem)
    .filter((g): g is GalleryImage => g !== null);

export type GalleryImage = { url: string; alt?: string; caption?: string };

export type PortfolioPreview = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  publishedAt: Date | null;
  client: string | null;
  year: string | null;
  tags: string[];
  categoryName: string | null;
};

export type PortfolioDetail = PortfolioPreview & {
  location: string | null;
  gallery: GalleryImage[];
  content: string | null; // Tiptap HTML
};

/** List published portfolios, newest first. */
export async function listPublishedPortfolios(): Promise<PortfolioPreview[]> {
  const rows = await db
    .select({
      id: portfolios.id,
      title: portfolios.title,
      slug: portfolios.slug,
      excerpt: portfolios.excerpt,
      coverImageUrl: portfolios.coverImageUrl,
      publishedAt: portfolios.publishedAt,
      client: portfolios.client,
      year: portfolios.year,
      tags: portfolios.tags,
      categoryName: categories.name,
    })
    .from(portfolios)
    .leftJoin(categories, eq(portfolios.categoryId, categories.id))
    .where(
      and(
        eq(portfolios.status, "published"),
        isNotNull(portfolios.publishedAt),
      ),
    )
    .orderBy(desc(portfolios.publishedAt));
  return rows;
}

export async function getPublishedPortfolioBySlug(
  slug: string,
): Promise<PortfolioDetail | null> {
  const rows = await db
    .select({
      id: portfolios.id,
      title: portfolios.title,
      slug: portfolios.slug,
      excerpt: portfolios.excerpt,
      coverImageUrl: portfolios.coverImageUrl,
      publishedAt: portfolios.publishedAt,
      client: portfolios.client,
      year: portfolios.year,
      tags: portfolios.tags,
      location: portfolios.location,
      gallery: portfolios.gallery,
      content: portfolios.content,
      categoryName: categories.name,
    })
    .from(portfolios)
    .leftJoin(categories, eq(portfolios.categoryId, categories.id))
    .where(and(eq(portfolios.slug, slug), eq(portfolios.status, "published")))
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  return { ...row, gallery: mapGallery(row.gallery) };
}

export async function getPortfolioBySlugForRender(
  slug: string,
  preview: boolean,
): Promise<PortfolioDetail | null> {
  const statusFilter = preview ? undefined : eq(portfolios.status, "published");
  const rows = await db
    .select({
      id: portfolios.id,
      title: portfolios.title,
      slug: portfolios.slug,
      excerpt: portfolios.excerpt,
      coverImageUrl: portfolios.coverImageUrl,
      publishedAt: portfolios.publishedAt,
      client: portfolios.client,
      year: portfolios.year,
      tags: portfolios.tags,
      location: portfolios.location,
      gallery: portfolios.gallery,
      content: portfolios.content,
      categoryName: categories.name,
    })
    .from(portfolios)
    .leftJoin(categories, eq(portfolios.categoryId, categories.id))
    .where(
      statusFilter
        ? and(eq(portfolios.slug, slug), statusFilter)
        : eq(portfolios.slug, slug),
    )
    .limit(1);
  const row = rows[0];
  if (!row) return null;
  return { ...row, gallery: mapGallery(row.gallery) };
}
