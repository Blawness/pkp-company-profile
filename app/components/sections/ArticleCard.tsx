import { Link } from "@/i18n/routing";
import React from "react";
import Image from "next/image";

/**
 * Article card for the public list page. Reads from Postgres via
 * `lib/articles.ts` — the article data shape is `{ id, slug, coverImageUrl }`
 * with coverImageUrl already resolved to an absolute URL.
 */
export type PostPreview = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  excerpt?: string;
  publishedAt?: string;
  coverImageUrl?: string;
  coverImage?: { asset?: { url?: string } };
};

export const ArticleCard: React.FC<{
  post: PostPreview;
  featured?: boolean;
}> = ({ post, featured = false }) => {
  const slug = post.slug?.current ?? "";
  const href = `/artikel/${slug}`;
  // Accept either a flat `coverImageUrl` (from Drizzle) or the legacy
  // nested `coverImage.asset.url` shape (kept for backward compat).
  const imageUrl =
    post.coverImageUrl ??
    (post.coverImage &&
    typeof post.coverImage === "object" &&
    "asset" in post.coverImage
      ? post.coverImage.asset?.url ?? undefined
      : undefined);

  const published = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <article className="group border-t border-hairline py-8">
      <Link href={href} className="block no-underline">
        {featured && imageUrl ? (
          <div className="relative mb-6 aspect-[16/8] w-full overflow-hidden">
            <Image
              src={imageUrl}
              alt={post.title ?? "Artikel cover"}
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
            />
          </div>
        ) : null}

        {published && (
          <div className="text-xs uppercase tracking-[0.18em] text-brass">
            {published}
          </div>
        )}
        <h3
          className={
            featured
              ? "font-display mt-3 text-3xl text-ink transition-colors group-hover:text-forest-700 md:text-4xl"
              : "font-display mt-3 text-2xl text-ink transition-colors group-hover:text-forest-700"
          }
        >
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-3 max-w-2xl text-base leading-8 text-ink-muted">
            {post.excerpt}
          </p>
        )}
      </Link>
    </article>
  );
};
