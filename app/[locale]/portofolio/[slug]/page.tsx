import React from "react";
import { draftMode } from "next/headers";
import { getPortfolioBySlugForRender } from "@/lib/portfolios";
import Image from "next/image";
import { ArticleContent } from "@/components/article/ArticleContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { Calendar, MapPin, User, Tag } from "lucide-react";
import { buildAlternates } from "@/lib/seo/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const preview = (await draftMode()).isEnabled;
  const portfolio = await getPortfolioBySlugForRender(slug, preview);

  if (!portfolio) {
    return { title: "Portofolio Tidak Ditemukan", robots: { index: false } };
  }

  return {
    title: portfolio.title,
    description:
      portfolio.excerpt || `Detail proyek portofolio: ${portfolio.title}`,
    alternates: buildAlternates(locale, `portofolio/${slug}`),
    openGraph: {
      title: portfolio.title,
      description: portfolio.excerpt ?? undefined,
      images: portfolio.coverImageUrl ? [portfolio.coverImageUrl] : [],
    },
  };
}

export default async function PortofolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const preview = (await draftMode()).isEnabled;
  const portfolio = await getPortfolioBySlugForRender(slug, preview);

  if (!portfolio) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-center text-lg">Portofolio tidak ditemukan.</p>
      </main>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    headline: portfolio.title,
    description: portfolio.excerpt,
    image: portfolio.coverImageUrl,
    datePublished: portfolio.publishedAt?.toISOString(),
    locationCreated: portfolio.location ?? undefined,
    author: { "@type": "Organization", name: "PKP" },
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <article>
        <div className="mb-10 max-w-3xl">
          {portfolio.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {portfolio.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-pkp-teal-50 dark:bg-pkp-teal-900/30 px-3 py-1 text-xs font-semibold text-pkp-teal-700 dark:text-pkp-teal-400"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-5xl">
            {portfolio.title}
          </h1>
          {portfolio.excerpt && (
            <p className="mt-6 text-xl text-zinc-600 dark:text-zinc-400 leading-8">
              {portfolio.excerpt}
            </p>
          )}
        </div>

        {portfolio.coverImageUrl && (
          <div className="relative aspect-[2/1] w-full overflow-hidden rounded-3xl mb-12 shadow-sm border border-black/5 dark:border-white/5">
            <Image
              src={portfolio.coverImageUrl}
              alt={portfolio.title ?? "Project Image"}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="prose prose-zinc dark:prose-invert max-w-none">
              {portfolio.content ? (
                <ArticleContent html={portfolio.content} />
              ) : (
                <p className="italic text-zinc-500">
                  Detail proyek belum tersedia.
                </p>
              )}
            </div>

            {portfolio.gallery.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-semibold mb-6 text-zinc-900 dark:text-zinc-100">
                  Galeri Proyek
                </h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {portfolio.gallery.map((img, idx) => (
                    <div key={img.url + idx} className="space-y-2">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-black/5 dark:border-white/5 shadow-sm">
                        <Image
                          src={img.url}
                          alt={img.alt || `Gallery image ${idx + 1}`}
                          fill
                          className="object-cover transition duration-300 hover:scale-105"
                        />
                      </div>
                      {img.caption && (
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 px-1">
                          {img.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-start-3">
            <div className="sticky top-24 rounded-3xl bg-zinc-50 p-8 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-6 uppercase tracking-wider text-sm">
                Informasi Proyek
              </h3>
              <dl className="space-y-6">
                {portfolio.client && (
                  <div>
                    <dt className="flex items-center gap-2 text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-1">
                      <User className="h-4 w-4" />
                      Klien
                    </dt>
                    <dd className="text-zinc-900 dark:text-zinc-100 font-medium">
                      {portfolio.client}
                    </dd>
                  </div>
                )}
                {portfolio.location && (
                  <div>
                    <dt className="flex items-center gap-2 text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-1">
                      <MapPin className="h-4 w-4" />
                      Lokasi
                    </dt>
                    <dd className="text-zinc-900 dark:text-zinc-100 font-medium">
                      {portfolio.location}
                    </dd>
                  </div>
                )}
                {portfolio.year && (
                  <div>
                    <dt className="flex items-center gap-2 text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-1">
                      <Calendar className="h-4 w-4" />
                      Tahun
                    </dt>
                    <dd className="text-zinc-900 dark:text-zinc-100 font-medium">
                      {portfolio.year}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
        <JsonLd data={jsonLd} />
      </article>
    </main>
  );
}