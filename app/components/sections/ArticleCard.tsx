import Link from "next/link";
import React from "react";

type CoverImage = { asset?: { url?: string } };
type PostPreview = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  excerpt?: string;
  publishedAt?: string;
  coverImage?: CoverImage;
};

export const ArticleCard: React.FC<{ post: PostPreview; locale: string }> = ({
  post,
  locale,
}) => {
  const slug = post.slug?.current ?? "";
  const href = `/${locale}/artikel/${slug}`;
  return (
    <article className="rounded-lg border border-gray-200 p-4 hover:shadow-sm">
      <Link href={href} className="block no-underline">
        {post.coverImage?.asset?.url ? (
          <div className="h-40 w-full rounded-md overflow-hidden mb-3 bg-gray-100">
            <img
              src={post.coverImage.asset.url}
              alt={post.title ?? "Artikel cover"}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
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


