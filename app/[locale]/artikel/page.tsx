import React from "react";
import { draftMode } from "next/headers";
import { listPublishedArticles } from "@/lib/articles";
import { ArticleCard } from "../../components/sections/ArticleCard";
import { buildAlternates } from "@/lib/seo/site";
import { HeroSection } from "@/components/sections/HeroSection";
import { Section } from "@/components/ui/Section";

// Force dynamic rendering so draftMode().isEnabled is respected on every request.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    title: "Artikel",
    description:
      "Artikel, wawasan, dan informasi terbaru seputar konsultasi pertanahan dari PT Presisi Konsulindo Prima.",
    alternates: buildAlternates(locale, "artikel"),
    robots: (await draftMode()).isEnabled ? { index: false } : undefined,
  };
}

export default async function ArtikelIndexPage() {
  const posts = await listPublishedArticles();

  const toPreview = (post: (typeof posts)[number]) => ({
    _id: String(post.id),
    title: post.title,
    slug: { current: post.slug },
    excerpt: post.excerpt ?? undefined,
    coverImage: post.coverImageUrl
      ? { asset: { url: post.coverImageUrl } }
      : undefined,
    publishedAt: post.publishedAt?.toISOString() ?? undefined,
  });

  const [lead, ...rest] = posts ?? [];

  return (
    <main>
      <HeroSection
        size="sm"
        title="Artikel"
        subtitle="Wawasan dan informasi terbaru seputar legalitas serta konsultasi pertanahan."
      />

      <Section tone="canvas">
        {!posts || posts.length === 0 ? (
          <div className="border-t border-hairline py-16 text-base text-ink-muted">
            Artikel belum tersedia.
          </div>
        ) : (
          <>
            <ArticleCard post={toPreview(lead)} featured />
            <div className="mt-4">
              {rest.map((post) => (
                <ArticleCard key={post.id} post={toPreview(post)} />
              ))}
            </div>
          </>
        )}
      </Section>
    </main>
  );
}
