import React from "react";
import { getSanityClient, type SanityPortfolioPreview } from "@/lib/sanity/client";
import { portfoliosQuery } from "@/lib/sanity/queries";
import { PortfolioCard } from "../../components/sections/PortfolioCard";

// Enable ISR so newly published portfolios appear in production without a redeploy.
export const revalidate = 60;

// Force dynamic rendering to avoid build-time issues
export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  return {
    title: "Portofolio",
    description: "Daftar portofolio dan proyek yang telah diselesaikan oleh PT Presisi Konsulindo Prima.",
  };
}

export default async function PortofolioIndexPage() {
  const client = getSanityClient(false);
  const portfolios: SanityPortfolioPreview[] = await client.fetch(portfoliosQuery);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-4xl">
          Portofolio Kami
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Beberapa proyek strategis yang telah kami selesaikan dengan profesionalisme dan integritas.
        </p>
      </div>

      {!portfolios || portfolios.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
          <p className="text-zinc-600 dark:text-zinc-400">Portofolio belum tersedia.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolios.map((item) => (
            <PortfolioCard key={item._id} portfolio={item} />
          ))}
        </div>
      )}
    </main>
  );
}
