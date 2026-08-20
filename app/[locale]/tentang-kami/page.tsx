import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { HeroSection } from "@/components/sections/HeroSection";
import {
  OrganizationChart,
  type OrgNode,
} from "@/components/sections/OrganizationChart";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { Button } from "@/components/ui/Button";
import { FrameReveal } from "@/components/animations/FrameReveal";
import { getHeroImageUrl } from "@/lib/api/pexels";
import { buildAlternates, localizedUrl } from "@/lib/seo/site";

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
    alternates: buildAlternates(locale, "tentang-kami"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: localizedUrl(locale, "tentang-kami"),
    },
  };
}

export default function TentangKamiPage() {
  const t = useTranslations("About");
  const tCompany = useTranslations("Company");
  const tButtons = useTranslations("Common.buttons");

  return (
    <main>
      <TentangKamiHero />

      <Section tone="canvas">
        <div className="grid gap-14 md:grid-cols-12 md:items-center">
          <div className="md:col-span-7">
            <SectionHead
              eyebrow={t("title")}
              title={tCompany("name")}
              lead={tCompany("description")}
            />
          </div>
          <div className="md:col-span-5">
            <AboutImage />
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <SectionHead
          eyebrow={t("visionMission.vision")}
          title={tCompany("vision")}
        />

        <div className="mt-16">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">
            {t("visionMission.mission")}
          </div>
          <ol className="mt-8">
            {tCompany.raw("mission").map((m: string, i: number) => (
              <li
                key={m}
                className="grid gap-4 border-t border-hairline py-8 md:grid-cols-[6rem_1fr] md:gap-10"
              >
                <span className="text-sm font-semibold tracking-[0.14em] text-brass">
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
        <SectionHead
          eyebrow={t("title")}
          title={t("organization.title")}
          className="mb-16"
        />
        <OrganizationChart data={t.raw("organization.chart") as OrgNode} />
      </Section>

      <Section tone="canvas">
        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <div className="font-display text-h2 text-balance">
              {tCompany("tagline")}
            </div>
          </div>
          <div className="md:col-span-4 md:justify-self-end">
            <Button href="/kontak" variant="solid">
              {tButtons("contact")}
            </Button>
          </div>
        </div>
      </Section>
    </main>
  );
}

function AboutImage() {
  return (
    <FrameReveal className="aspect-[4/5] w-full">
      <Image
        src="https://i.imgur.com/zWVfFts.png"
        alt="Tim PT Presisi Konsulindo Prima"
        fill
        sizes="(max-width: 768px) 100vw, 42vw"
        className="object-cover"
      />
    </FrameReveal>
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
