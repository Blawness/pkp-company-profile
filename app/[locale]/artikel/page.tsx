import React from "react";
import { draftMode } from "next/headers";
import { listPublishedArticles } from "@/lib/articles";
import { ArticleCard } from "../../components/sections/ArticleCard";
import { buildAlternates } from "@/lib/seo/site";

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

  if (!posts || posts.length === 0) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <p>Artikel belum tersedia.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
        Artikel
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <ArticleCard
            key={post.id}
            post={{
              _id: String(post.id),
              title: post.title,
              slug: { current: post.slug },
              excerpt: post.excerpt ?? undefined,
              coverImage: post.coverImageUrl
                ? { asset: { url: post.coverImageUrl } }
                : undefined,
              publishedAt: post.publishedAt?.toISOString() ?? undefined,
            }}
          />
        ))}
      </div>
    </main>
  );
}