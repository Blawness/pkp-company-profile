import React from "react";
import { draftMode } from "next/headers";
import { listPublishedPortfolios } from "@/lib/portfolios";
import { PortfolioCard } from "../../components/sections/PortfolioCard";
import { buildAlternates } from "@/lib/seo/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    title: "Portofolio",
    description:
      "Daftar portofolio dan proyek yang telah diselesaikan oleh PT Presisi Konsulindo Prima.",
    alternates: buildAlternates(locale, "portofolio"),
    robots: (await draftMode()).isEnabled ? { index: false } : undefined,
  };
}

export default async function PortofolioIndexPage() {
  const portfolios = await listPublishedPortfolios();

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-4xl">
          Portofolio Kami
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Beberapa proyek strategis yang telah kami selesaikan dengan
          profesionalisme dan integritas.
        </p>
      </div>

      {!portfolios || portfolios.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
          <p className="text-zinc-600 dark:text-zinc-400">
            Portofolio belum tersedia.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolios.map((item) => (
            <PortfolioCard key={item.id} portfolio={item} />
          ))}
        </div>
      )}
    </main>
  );
}