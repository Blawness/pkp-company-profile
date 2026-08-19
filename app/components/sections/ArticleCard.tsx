import { Link } from "@/i18n/routing";
import React from "react";
import Image from "next/image";

/**
 * Article card for the public list page. Reads from Postgres via
 * `lib/articles.ts` — the article data shape is `{ id, slug, coverImageUrl }`
 * with coverImageUrl already resolved to an absolute URL.
 */
type PostPreview = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  excerpt?: string;
  publishedAt?: string;
  coverImageUrl?: string;
  coverImage?: { asset?: { url?: string } };
};

export const ArticleCard: React.FC<{ post: PostPreview }> = ({
  post,
}) => {
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

  return (
    <article className="rounded-lg border border-gray-200 p-4 hover:shadow-sm">
      <Link href={href} className="block no-underline">
        {imageUrl ? (
          <div className="relative h-40 w-full rounded-md overflow-hidden mb-3 bg-gray-100">
            <Image
              src={imageUrl}
              alt={post.title ?? "Artikel cover"}
              fill
              className="object-cover"
            />
          </div>
        ) : null}
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {post.title}
        </h3>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          {post.excerpt ?? ""}
        </p>
      </Link>
    </article>
  );
};