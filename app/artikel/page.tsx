import React from "react";
import { getSanityClient, type SanityPostPreview } from "@/lib/sanity/client";
import { postsQuery } from "@/lib/sanity/queries";
import { ArticleCard } from "../components/sections/ArticleCard";

// Enable ISR so newly published articles appear in production without a redeploy.
export const revalidate = 60;

export default async function ArtikelIndexPage() {
  const client = getSanityClient(false);
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
