import React from "react";
import { draftMode } from "next/headers";
import { listPublishedPortfolios } from "@/lib/portfolios";
import { PortfolioCard } from "../../components/sections/PortfolioCard";
import { buildAlternates } from "@/lib/seo/site";
import { HeroSection } from "@/components/sections/HeroSection";
import { Section } from "@/components/ui/Section";

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
    <main>
      <HeroSection
        size="sm"
        title="Portofolio Kami"
        subtitle="Beberapa proyek strategis yang telah kami selesaikan dengan profesionalisme dan integritas."
      />

      <Section tone="canvas">
        {!portfolios || portfolios.length === 0 ? (
          <div className="border-t border-hairline py-16 text-base text-ink-muted">
            Portofolio belum tersedia.
          </div>
        ) : (
          <div className="grid gap-x-14 md:grid-cols-2">
            {portfolios.map((item) => (
              <PortfolioCard key={item.id} portfolio={item} />
            ))}
          </div>
        )}
      </Section>
    </main>
  );
}
