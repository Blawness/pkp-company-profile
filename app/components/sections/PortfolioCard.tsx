import { Link } from "@/i18n/routing";
import React from "react";
import Image from "next/image";

/**
 * Portfolio card for the public list page. Reads from Postgres via
 * `lib/portfolios.ts` — the portfolio shape is flat (coverImageUrl
 * already resolved to an absolute URL).
 */
export type PortfolioCardData = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  year: string | null;
  tags: string[];
};

export const PortfolioCard: React.FC<{ portfolio: PortfolioCardData }> = ({
  portfolio,
}) => {
  const href = `/portofolio/${portfolio.slug}`;
  return (
    <article className="group rounded-2xl overflow-hidden border border-black/5 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
      <Link href={href} className="block no-underline">
        {portfolio.coverImageUrl ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100">
            <Image
              src={portfolio.coverImageUrl}
              alt={portfolio.title}
              fill
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="aspect-[4/3] bg-zinc-100 dark:bg-zinc-800" />
        )}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {portfolio.title}
          </h3>
          {portfolio.excerpt && (
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
              {portfolio.excerpt}
            </p>
          )}
          {portfolio.year && (
            <p className="mt-3 text-xs text-zinc-500">{portfolio.year}</p>
          )}
        </div>
      </Link>
    </article>
  );
};