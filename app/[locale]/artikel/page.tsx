import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { HeroSection } from "@/components/sections/HeroSection";
import { getHeroImageUrl } from "@/lib/api/pexels";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Articles" });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: "/artikel",
    },
  };
}

export default function ArtikelPage() {
  const t = useTranslations("Articles");

  return (
    <main>
      <ArtikelHero />

      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
            {t("comingSoon.description")}
          </p>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div className="flex items-center justify-center rounded-2xl border border-dashed border-black/15 bg-zinc-50 p-10 text-center text-sm text-zinc-600 dark:border-white/15 dark:bg-zinc-950/40 dark:text-zinc-400">
            {t("comingSoon.title")}
          </div>

          <ArticleImage />
        </div>
      </div>
    </main>
  );
}

async function ArticleImage() {
  const placeholderImageUrl = await getHeroImageUrl(
    "writing documents library office",
  );
  if (!placeholderImageUrl) return null;
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl shadow-sm">
      <Image
        src={placeholderImageUrl}
        alt="Artikel Coming Soon"
        fill
        className="object-cover"
      />
    </div>
  );
}

async function ArtikelHero() {
  const imageUrl = await getHeroImageUrl("reading documents notebook pen");
  const t = await getTranslations("Articles.hero");
  const tButtons = await getTranslations("Common.buttons");

  return (
    <HeroSection
      size="sm"
      imageUrl={imageUrl}
      title={t("title")}
      subtitle={t("subtitle")}
      ctaHref="/layanan"
      ctaLabel={tButtons("seeServices")}
    />
  );
}
