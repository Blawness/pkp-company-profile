import React from "react";
import { getSanityClient } from "@/lib/sanity/client";
import { portfolioBySlugQuery } from "@/lib/sanity/queries";
import Image from "next/image";
import { PortableText, type PortableTextComponents } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import type { TypedObject } from "@portabletext/types";
import { Calendar, MapPin, User, Tag } from "lucide-react";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

// Enable ISR so newly published/updated portfolios appear in production without a redeploy.
export const revalidate = 60;

type PortfolioGalleryImage = SanityImageSource & {
  _key?: string;
  alt?: string;
  caption?: string;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug } = await params;
  const client = getSanityClient(false);
  const portfolio = (await client.fetch(portfolioBySlugQuery, { slug })) as Portfolio | null;

  if (!portfolio) return { title: "Portofolio Tidak Ditemukan" };

  return {
    title: portfolio.title,
    description: portfolio.excerpt || `Detail proyek portofolio: ${portfolio.title}`,
    openGraph: {
      title: portfolio.title,
      description: portfolio.excerpt,
      images:
        portfolio.coverImage && (portfolio.coverImage as any).asset
          ? [urlFor(portfolio.coverImage).width(1200).height(630).url()]
          : [],
    },
  };
}

type Portfolio = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  excerpt?: string;
  coverImage?: SanityImageSource;
  gallery?: PortfolioGalleryImage[];
  client?: string;
  location?: string;
  year?: string;
  tags?: string[];
  publishedAt?: string;
  body?: unknown[];
};

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-zinc-700 dark:text-zinc-300 leading-7 mb-4">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-8 mb-4 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 mb-3 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-pkp-teal-500 pl-4 italic text-zinc-700 dark:text-zinc-300 my-6">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 space-y-2 text-zinc-700 dark:text-zinc-300 mb-4">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 space-y-2 text-zinc-700 dark:text-zinc-300 mb-4">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    link: ({ value, children }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      return (
        <a
          href={href}
          className="underline underline-offset-4 text-pkp-teal-600 hover:text-pkp-teal-700 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    },
  },
};

export default async function PortofolioDetailPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug } = await params;
  const client = getSanityClient(false);
  const portfolio = (await client.fetch(portfolioBySlugQuery, { slug })) as Portfolio | null;

  if (!portfolio) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-center text-lg">Portofolio tidak ditemukan.</p>
      </main>
    );
  }

  const bodyBlocks: TypedObject[] = Array.isArray(portfolio.body) ? (portfolio.body as TypedObject[]) : [];
  const imageUrl =
    portfolio.coverImage && (portfolio.coverImage as any).asset
      ? urlFor(portfolio.coverImage).width(1200).height(600).url()
      : null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <article>
        <div className="mb-10 max-w-3xl">
          <div className="flex flex-wrap gap-2 mb-4">
            {portfolio.tags?.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-pkp-teal-50 dark:bg-pkp-teal-900/30 px-3 py-1 text-xs font-semibold text-pkp-teal-700 dark:text-pkp-teal-400">
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-5xl">
            {portfolio.title}
          </h1>
          {portfolio.excerpt && (
            <p className="mt-6 text-xl text-zinc-600 dark:text-zinc-400 leading-8">
              {portfolio.excerpt}
            </p>
          )}
        </div>

        {imageUrl && (
          <div className="relative aspect-[2/1] w-full overflow-hidden rounded-3xl mb-12 shadow-sm border border-black/5 dark:border-white/5">
            <Image
              src={imageUrl}
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
              {bodyBlocks.length > 0 ? (
                <PortableText value={bodyBlocks} components={portableTextComponents} />
              ) : (
                <p className="italic text-zinc-500">Detail proyek belum tersedia.</p>
              )}
            </div>

            {portfolio.gallery && portfolio.gallery.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-semibold mb-6 text-zinc-900 dark:text-zinc-100">Galeri Proyek</h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {portfolio.gallery
                    .filter((img) => (img as any).asset)
                    .map((img, idx) => {
                      const galleryImgUrl = urlFor(img)
                        .width(800)
                        .height(600)
                        .url();
                      return (
                        <div key={img._key || idx} className="space-y-2">
                          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-black/5 dark:border-white/5 shadow-sm">
                            <Image
                              src={galleryImgUrl}
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
                      );
                    })}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-start-3">
            <div className="sticky top-24 rounded-3xl bg-zinc-50 p-8 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-6 uppercase tracking-wider text-sm">Informasi Proyek</h3>
              <dl className="space-y-6">
                {portfolio.client && (
                  <div>
                    <dt className="flex items-center gap-2 text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-1">
                      <User className="h-4 w-4" />
                      Klien
                    </dt>
                    <dd className="text-zinc-900 dark:text-zinc-100 font-medium">{portfolio.client}</dd>
                  </div>
                )}
                {portfolio.location && (
                  <div>
                    <dt className="flex items-center gap-2 text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-1">
                      <MapPin className="h-4 w-4" />
                      Lokasi
                    </dt>
                    <dd className="text-zinc-900 dark:text-zinc-100 font-medium">{portfolio.location}</dd>
                  </div>
                )}
                {portfolio.year && (
                  <div>
                    <dt className="flex items-center gap-2 text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-1">
                      <Calendar className="h-4 w-4" />
                      Tahun
                    </dt>
                    <dd className="text-zinc-900 dark:text-zinc-100 font-medium">{portfolio.year}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
