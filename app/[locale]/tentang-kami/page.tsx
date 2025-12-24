import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { OrganizationChart } from "@/components/sections/OrganizationChart";
import { HeroSection } from "@/components/sections/HeroSection";
import { getHeroImageUrl } from "@/lib/api/pexels";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: "/tentang-kami",
    },
  };
}

export default function TentangKamiPage() {
  const t = useTranslations("About");
  const tCompany = useTranslations("Company");

  return (
    <main>
      <TentangKamiHero />

      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
            {tCompany("description")}
          </p>
        </div>

        <div className="mt-10 grid gap-10 md:grid-cols-2">
          <section className="space-y-8">
            <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950">
              <div className="text-sm font-semibold text-pkp-green-700 dark:text-pkp-green-400">
                {t("visionMission.vision")}
              </div>
              <p className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                {tCompany("vision")}
              </p>

              <div className="mt-8 text-sm font-semibold text-pkp-green-700 dark:text-pkp-green-400">
                {t("visionMission.mission")}
              </div>
              <ul className="mt-3 grid gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                {tCompany.raw("mission").map((m: string) => (
                  <li key={m} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-pkp-teal-600" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            <AboutImage />
          </section>

          <section>
            <div className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {t("organization.title")}
            </div>
            <OrganizationChart data={t.raw("organization.chart")} />
          </section>
        </div>
      </div>
    </main>
  );
}

async function AboutImage() {
  const profileImageUrl = await getHeroImageUrl(
    "office group meeting professional",
  );
  if (!profileImageUrl) return null;
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl">
      <Image
        src={profileImageUrl}
        alt="Tim PT Presisi Konsulindo Prima"
        fill
        className="object-cover"
      />
    </div>
  );
}

async function TentangKamiHero() {
  const imageUrl = await getHeroImageUrl(
    "legal consultation meeting handshake",
  );
  const t = await getTranslations("About.hero");
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
