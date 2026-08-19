import React from "react";
import { draftMode } from "next/headers";
import { getSanityClient, type SanityPostPreview } from "@/lib/sanity/client";
import { postsQuery } from "@/lib/sanity/queries";
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
    // Don't index draft previews.
    robots: (await draftMode()).isEnabled ? { index: false } : undefined,
  };
}

export default async function ArtikelIndexPage() {
  // Honour Next.js Draft Mode: when enabled via /api/draft, fetch drafts.
  const client = getSanityClient((await draftMode()).isEnabled);
  const posts: SanityPostPreview[] = await client.fetch(postsQuery);

  if (!posts || posts.length === 0) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <p>Artikel belum tersedia.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">Artikel</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <ArticleCard key={post._id} post={post} />
        ))}
      </div>
    </main>
  );
}
