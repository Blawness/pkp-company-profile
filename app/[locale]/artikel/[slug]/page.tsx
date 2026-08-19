import React from "react";
import { draftMode } from "next/headers";
import { getArticleBySlugForRender } from "@/lib/articles";
import Image from "next/image";
import { ArticleContent } from "@/components/article/ArticleContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildAlternates } from "@/lib/seo/site";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

// Force dynamic rendering so draftMode().isEnabled is respected on every request.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const preview = (await draftMode()).isEnabled;
  const post = await getArticleBySlugForRender(slug, preview);

  if (!post) {
    return { title: "Artikel Tidak Ditemukan", robots: { index: false } };
  }

  return {
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt ?? `Artikel: ${post.title}`,
    alternates: buildAlternates(locale, `artikel/${slug}`),
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt ?? undefined,
      publishedTime: post.publishedAt?.toISOString(),
      images: post.ogImage ? [post.ogImage] : post.coverImageUrl ? [post.coverImageUrl] : [],
    },
  };
}

export default async function ArtikelDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const preview = (await draftMode()).isEnabled;
  const post = await getArticleBySlugForRender(slug, preview);

  if (!post) {
    return (
      <Section tone="canvas">
        <p className="text-base text-ink-muted">Artikel tidak ditemukan.</p>
      </Section>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.ogImage ?? post.coverImageUrl,
    datePublished: post.publishedAt?.toISOString(),
    author: { "@type": "Person", name: post.authorName ?? "PKP" },
  };

  const published = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <main>
      <article>
        <header className="bg-forest-950 text-white">
          <div className="mx-auto max-w-[1200px] px-6 pb-20 pt-28 md:px-10 md:pb-24 md:pt-36">
            {published && (
              <div className="text-xs uppercase tracking-[0.18em] text-brass">
                {published}
              </div>
            )}
            <h1 className="font-display text-display mt-6 max-w-4xl text-balance">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="mt-7 max-w-2xl text-pretty text-base leading-8 text-white/70">
                {post.excerpt}
              </p>
            )}
            {post.authorName && (
              <div className="mt-10 border-t border-white/15 pt-6 text-sm text-white/60">
                {post.authorName}
              </div>
            )}
          </div>
        </header>

        {post.coverImageUrl && (
          <div className="relative aspect-[16/7] w-full overflow-hidden">
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        )}

        <Section tone="canvas">
          <div className="mx-auto max-w-[68ch]">
            <ArticleContent html={post.content} />
          </div>
        </Section>

        <Section tone="forest">
          <div className="grid gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <div className="font-display text-h2 text-balance">
                Butuh pendampingan legalitas tanah?
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
