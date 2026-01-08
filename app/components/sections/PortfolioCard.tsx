import Link from "next/link";
import React from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { SanityPortfolioPreview } from "@/lib/sanity/client";

export const PortfolioCard: React.FC<{ portfolio: SanityPortfolioPreview; locale: string }> = ({
  portfolio,
  locale,
}) => {
  const slug = portfolio.slug?.current ?? "";
  const href = `/${locale}/portofolio/${slug}`;
  const imageUrl =
    portfolio.coverImage && (portfolio.coverImage as any).asset
      ? urlFor(portfolio.coverImage).width(800).height(500).url()
      : null;

  return (
    <article className="group rounded-2xl border border-zinc-200 dark:border-white/10 overflow-hidden bg-white dark:bg-zinc-900 transition hover:shadow-md">
      <Link href={href} className="block no-underline">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={portfolio.title ?? "Portfolio cover"}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
             <div className="flex h-full items-center justify-center text-zinc-400">
               No Image
             </div>
          )}
        </div>
        <div className="p-5">
          <div className="flex flex-wrap gap-2 mb-3">
            {portfolio.tags?.slice(0, 3).map((tag) => (
              <span key={tag} className="text-[10px] font-bold uppercase tracking-wider text-pkp-teal-600 dark:text-pkp-teal-400">
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-pkp-teal-600 dark:group-hover:text-pkp-teal-400 transition-colors">
            {portfolio.title}
          </h3>
          {portfolio.client && (
            <p className="mt-2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Klien: {portfolio.client}
            </p>
          )}
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
            {portfolio.excerpt ?? ""}
          </p>
          <div className="mt-4 flex items-center text-sm font-semibold text-pkp-teal-700 dark:text-pkp-teal-500">
            Lihat Detail →
          </div>
        </div>
      </Link>
    </article>
  );
};
