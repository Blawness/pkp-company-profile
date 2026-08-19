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
    <article className="group border-t border-hairline py-10">
      <Link href={href} className="block no-underline">
        {portfolio.coverImageUrl ? (
          <div className="relative aspect-[3/2] w-full overflow-hidden bg-forest-950/5">
            <Image
              src={portfolio.coverImageUrl}
              alt={portfolio.title}
              fill
              className="object-cover"
            />
          </div>
        ) : null}

        {portfolio.year && (
          <div className="mt-6 text-xs uppercase tracking-[0.18em] text-brass">
            {portfolio.year}
          </div>
        )}
        <h3 className="font-display mt-3 text-2xl text-ink transition group-hover:text-forest-700">
          {portfolio.title}
        </h3>
        {portfolio.excerpt && (
          <p className="mt-3 max-w-2xl text-base leading-8 text-ink-muted">
            {portfolio.excerpt}
          </p>
        )}
      </Link>
    </article>
  );
};
