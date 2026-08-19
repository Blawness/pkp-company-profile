import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { HomeHeroSection } from "@/components/sections/HomeHeroSection";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { Button } from "@/components/ui/Button";
import { IndexedItem } from "@/components/ui/IndexedItem";
import { services } from "@/lib/data/services";
import { getHeroImageUrl } from "@/lib/api/pexels";
import { buildAlternates, localizedUrl } from "@/lib/seo/site";

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
    alternates: buildAlternates(locale, ""),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: localizedUrl(locale, ""),
    },
  };
}

export default function Home() {
  const t = useTranslations("Home");
  const tCompany = useTranslations("Company");
  const tButtons = useTranslations("Common.buttons");
  const tServices = useTranslations("Services");

  return (
    <main>
      <HomeHero />

      <Section tone="canvas">
        <div className="grid gap-14 md:grid-cols-12 md:items-center">
          <div className="relative aspect-[4/5] overflow-hidden md:col-span-5">
            <AboutImage />
          </div>
          <div className="md:col-span-7">
            <SectionHead
              eyebrow={t("about.eyebrow")}
              title={tCompany("name")}
              lead={tCompany("description")}
            />
            <div className="mt-8">
              <Button href="/tentang-kami" variant="link">
                {tButtons("moreAboutUs")}
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <SectionHead
          eyebrow={t("services.eyebrow")}
          title={t("services.title")}
          lead={t("services.lead")}
        />
        <div className="mt-16">
          {services.map((s, i) => (
            <IndexedItem
              key={s.id}
              index={i + 1}
              title={tServices(`list.${s.id}.title`)}
              href={`/layanan#${s.id}`}
            >
              {tServices(`list.${s.id}.description`)}
            </IndexedItem>
          ))}
        </div>
      </Section>

      <Section tone="canvas">
        <SectionHead
          eyebrow={t("visionMission.eyebrow")}
          title={t("visionMission.vision")}
          lead={tCompany("vision")}
        />
        <div className="mt-16">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">
            {t("visionMission.mission")}
          </div>
          <ol className="mt-8 grid gap-0">
            {tCompany.raw("mission").map((m: string, i: number) => (
              <li
                key={m}
                className="grid gap-4 border-t border-hairline py-8 md:grid-cols-[6rem_1fr] md:gap-10"
              >
                <span className="font-display text-xl text-brass">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="max-w-3xl text-base leading-8 text-ink-muted">
                  {m}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section tone="forest">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <div className="font-display text-h2 text-balance">
              {tCompany("tagline")}
            </div>
            <p className="mt-6 max-w-xl text-base leading-8 text-white/70">
              {t("visionMission.ctaDescription")}
            </p>
          </div>
          <div className="md:col-span-4 md:justify-self-end">
            <Button href="/kontak" variant="solid" tone="light">
              {tButtons("contact")}
            </Button>
          </div>
        </div>
      </Section>
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
  const imageUrl =
    (await getHeroImageUrl("business meeting documents contract").catch(() => undefined)) ??
    "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg";
  const t = await getTranslations("Home.hero");
  const tButtons = await getTranslations("Common.buttons");

  return (
    <HomeHeroSection
      imageUrl={imageUrl}
      priority
      title={t("title")}
      subtitle={t("subtitle")}
      primaryHref="/kontak"
      primaryLabel={tButtons("contact")}
      secondaryHref="/layanan"
      secondaryLabel={tButtons("seeServices")}
    />
  );
}
