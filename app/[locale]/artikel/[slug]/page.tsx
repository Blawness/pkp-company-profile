import React from "react";
import { draftMode } from "next/headers";
import { getArticleBySlugForRender } from "@/lib/articles";
import Image from "next/image";
import { ArticleContent } from "@/components/article/ArticleContent";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildAlternates } from "@/lib/seo/site";

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
      <main className="mx-auto max-w-6xl px-4 py-8">
        <p>Artikel tidak ditemukan.</p>
      </main>
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
        {post.coverImageUrl && (
          <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-2xl">
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        )}
        <section className="mt-8">
          <ArticleContent html={post.content} />
        </section>
        <JsonLd data={jsonLd} />
      </article>
    </main>
  );
}