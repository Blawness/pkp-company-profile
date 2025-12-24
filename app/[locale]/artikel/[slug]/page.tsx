import React from "react";
import { getSanityClient } from "@/lib/sanity/client";
import { postBySlugQuery } from "@/lib/sanity/queries";

type Post = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  excerpt?: string;
  coverImage?: { asset?: { url?: string } };
  publishedAt?: string;
  body?: unknown[];
};

export default async function ArtikelDetailPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug } = await params;
  const client = getSanityClient(false);
  const post = (await client.fetch(postBySlugQuery, { slug })) as Post | null;

  if (!post) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <p>Artikel tidak ditemukan.</p>
      </main>
    );
  }

  const bodyBlocks = (post?.body ?? []) as unknown[];
  const renderPortableText = (blocks: unknown[]) => {
    if (!Array.isArray(blocks)) return null;
    return (blocks as unknown[]).map((blk, idx) => {
      const b = blk as { _type?: string; children?: { text?: string }[] };
      if (b._type === "block") {
        const textParts = (b.children ?? []).map((c) =>
          typeof c === "object" && c && "text" in (c as any) ? (c as any).text : ""
        );
        const text = textParts.join("");
        return (
          <p key={idx} className="mt-4 text-zinc-700 dark:text-zinc-300">
            {text}
          </p>
        );
      }
      return null;
    });
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <article>
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-100">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {post.excerpt}
          </p>
        )}
        {bodyBlocks.length > 0 && (
          <section className="mt-6">{renderPortableText(bodyBlocks)}</section>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": post.title,
              "description": post.excerpt,
              "image": post.coverImage?.asset?.url ?? "",
              "datePublished": post.publishedAt,
              "author": { "@type": "Person", "name": "PKP" }
            })
          }}
        />
      </article>
    </main>
  );
}


