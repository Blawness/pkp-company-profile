import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServiceCard } from "@/components/sections/ServiceCard";
import { services } from "@/lib/data/services";
import { getHeroImageUrl } from "@/lib/api/pexels";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home" });

  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: "/",
    },
  };
}

export default function Home() {
  const t = useTranslations("Home");
  const tCompany = useTranslations("Company");
  const tButtons = useTranslations("Common.buttons");

  return (
    <main>
      <HomeHero />

      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="relative aspect-square overflow-hidden rounded-2xl md:aspect-[4/3]">
            <AboutImage />
          </div>

          <div>
            <div className="text-sm font-semibold text-pkp-green-700">
              {t("about.label")}
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              {tCompany("name")}
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              {tCompany("description")}
            </p>
            <div className="mt-6">
              <Link
                href="/tentang-kami"
                className="text-sm font-semibold text-pkp-teal-700 hover:text-pkp-teal-600 dark:text-pkp-teal-600 dark:hover:text-pkp-teal-600/90"
              >
                {tButtons("moreAboutUs")} →
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>
      </section>

      <section className="border-t border-black/10 bg-zinc-50 dark:border-white/10 dark:bg-zinc-950/40">
        <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <div className="text-sm font-semibold text-pkp-green-700 dark:text-pkp-green-400">
                {t("visionMission.vision")}
              </div>
              <p className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                {tCompany("vision")}
              </p>
            </div>
            <div>
              <div className="text-sm font-semibold text-pkp-green-700 dark:text-pkp-green-400">
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
          </div>

          <div className="mt-10 rounded-2xl bg-pkp-green-900 p-8 text-white shadow-sm">
            <div className="text-lg font-semibold">{tCompany("tagline")}</div>
            <p className="mt-2 text-sm text-white/80">
              {t("visionMission.ctaDescription")}
            </p>
            <div className="mt-6">
              <Link
                href="/kontak"
                className="inline-flex items-center justify-center rounded-full bg-pkp-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pkp-teal-700"
              >
                {tButtons("contact")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function AboutImage() {
  const imageUrl = "https://i.imgur.com/exlWDil.png";
  return (
    <Image
      src={imageUrl}
      alt="Tentang PT Presisi Konsulindo Prima"
      fill
      className="object-cover"
    />
  );
}

async function HomeHero() {
  // Use a fallback image during build time to avoid API calls
  const imageUrl = await getHeroImageUrl("business meeting documents contract").catch(() =>
    "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg"
  );
  const t = await getTranslations("Home.hero");
  const tButtons = await getTranslations("Common.buttons");

  return (
    <HeroSection
      imageUrl={imageUrl}
      priority
      title={t("title")}
      subtitle={t("subtitle")}
      ctaHref="/kontak"
      ctaLabel={tButtons("contact")}
    />
  );
}
