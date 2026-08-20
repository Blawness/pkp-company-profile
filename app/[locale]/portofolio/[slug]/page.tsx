import React from "react";
import { draftMode } from "next/headers";
import { getPortfolioBySlugForRender } from "@/lib/portfolios";
import Image from "next/image";
import { ArticleContent } from "@/components/article/ArticleContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildAlternates } from "@/lib/seo/site";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

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
      <Section tone="canvas">
        <p className="text-base text-ink-muted">Portofolio tidak ditemukan.</p>
      </Section>
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
    <main>
      <article>
        <header className="bg-forest-950 text-white">
          <div className="mx-auto max-w-[1200px] px-6 pb-20 pt-28 md:px-10 md:pb-24 md:pt-36">
            {portfolio.tags.length > 0 && (
              <div className="text-xs uppercase tracking-[0.18em] text-brass">
                {portfolio.tags.join(" · ")}
              </div>
            )}
            <h1 className="font-display text-display mt-6 max-w-[18ch] text-balance">
              {portfolio.title}
            </h1>
            {portfolio.excerpt && (
              <p className="mt-7 max-w-2xl text-pretty text-base leading-8 text-white/70">
                {portfolio.excerpt}
              </p>
            )}

            <dl className="mt-14 flex flex-wrap gap-x-12 gap-y-8 border-t border-white/15 pt-8">
              {portfolio.client && (
                <div>
                  <dt className="text-xs uppercase tracking-[0.14em] text-white/50">
                    Klien
                  </dt>
                  <dd className="mt-2 text-base font-medium">
                    {portfolio.client}
                  </dd>
                </div>
              )}
              {portfolio.location && (
                <div>
                  <dt className="text-xs uppercase tracking-[0.14em] text-white/50">
                    Lokasi
                  </dt>
                  <dd className="mt-2 text-base font-medium">
                    {portfolio.location}
                  </dd>
                </div>
              )}
              {portfolio.year && (
                <div>
                  <dt className="text-xs uppercase tracking-[0.14em] text-white/50">
                    Tahun
                  </dt>
                  <dd className="mt-2 text-base font-medium">
                    {portfolio.year}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </header>

        {portfolio.coverImageUrl && (
          <div className="relative aspect-[16/7] w-full overflow-hidden">
            <Image
              src={portfolio.coverImageUrl}
              alt={portfolio.title ?? "Project Image"}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        )}

        <Section tone="canvas">
          <div className="max-w-[68ch]">
            {portfolio.content ? (
              <ArticleContent html={portfolio.content} />
            ) : (
              <p className="text-base text-ink-muted">
                Detail proyek belum tersedia.
              </p>
            )}
          </div>

          {portfolio.gallery.length > 0 && (
            <div className="mt-20">
              <h2 className="font-display text-h2 border-t border-hairline pt-10">
                Galeri Proyek
              </h2>
              <div className="mt-10 grid gap-10 sm:grid-cols-2">
                {portfolio.gallery.map((img, idx) => (
                  <figure key={img.url + idx}>
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={img.url}
                        alt={img.alt || `Gallery image ${idx + 1}`}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                    {img.caption && (
                      <figcaption className="mt-3 text-sm text-ink-muted">
                        {img.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </div>
          )}
        </Section>

        <Section tone="forest">
          <div className="grid gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <div className="font-display text-h2 text-balance">
                Punya kebutuhan legalitas lahan serupa?
              </div>
            </div>
            <div className="md:col-span-4 md:justify-self-end">
              <Button href="/kontak" variant="solid" tone="light">
                Konsultasi Sekarang
              </Button>
            </div>
          </div>
        </Section>

        <JsonLd data={jsonLd} />
      </article>
    </main>
  );
}
