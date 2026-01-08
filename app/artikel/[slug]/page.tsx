import React from "react";
import { getSanityClient } from "@/lib/sanity/client";
import { postBySlugQuery } from "@/lib/sanity/queries";
import Image from "next/image";
import { PortableText, type PortableTextComponents } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import type { TypedObject } from "@portabletext/types";

// Enable ISR so newly published/updated articles appear in production without a redeploy.
export const revalidate = 60;

type Post = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  excerpt?: string;
  coverImage?: { asset?: { url?: string } };
  publishedAt?: string;
  body?: unknown[];
};

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-zinc-700 dark:text-zinc-300 leading-7">{children}</p>
    ),
    h1: ({ children }) => (
      <h2 className="mt-8 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
        {children}
      </h2>
    ),
    h2: ({ children }) => (
      <h3 className="mt-8 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
        {children}
      </h3>
    ),
    h3: ({ children }) => (
      <h4 className="mt-6 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
        {children}
      </h4>
    ),
    h4: ({ children }) => (
      <h5 className="mt-6 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
        {children}
      </h5>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-zinc-200 pl-4 italic text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 space-y-2 text-zinc-700 dark:text-zinc-300">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 space-y-2 text-zinc-700 dark:text-zinc-300">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-7">{children}</li>,
    number: ({ children }) => <li className="leading-7">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[0.95em] text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
        {children}
      </code>
    ),
    link: ({ value, children }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      const blank = Boolean(value?.blank);
      return (
        <a
          href={href}
          className="underline underline-offset-4 text-pkp-blue-500 hover:text-pkp-blue-500/80"
          rel={blank ? "noopener noreferrer" : undefined}
          target={blank ? "_blank" : undefined}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      const src =
        value && typeof value === "object" && "asset" in value
          ? urlFor(value).width(1400).quality(80).url()
          : "";
      const alt = typeof value?.alt === "string" ? value.alt : "";
      if (!src) return null;
      return (
        <figure className="my-6">
          <Image
            src={src}
            alt={alt}
            width={1400}
            height={800}
            sizes="(max-width: 768px) 100vw, 768px"
            className="h-auto w-full rounded-xl border border-black/10 dark:border-white/10"
          />
          {typeof value?.caption === "string" && value.caption ? (
            <figcaption className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
  },
};

export default async function ArtikelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
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

  const bodyBlocks: TypedObject[] = Array.isArray(post.body) ? (post.body as TypedObject[]) : [];

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
        {bodyBlocks.length > 0 ? (
          <section className="mt-6 space-y-4">
            <PortableText value={bodyBlocks} components={portableTextComponents} />
          </section>
        ) : null}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": post.title,
              "description": post.excerpt,
              "image":
                post.coverImage &&
                typeof post.coverImage === "object" &&
                "asset" in post.coverImage
                  ? urlFor(post.coverImage).url()
                  : "",
              "datePublished": post.publishedAt,
              "author": { "@type": "Person", "name": "PKP" }
            })
          }}
        />
      </article>
    </main>
  );
}
