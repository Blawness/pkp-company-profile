import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { company } from "@/lib/data/company";
import { ContactForm } from "@/components/forms/ContactForm";
import { HeroSection } from "@/components/sections/HeroSection";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { getHeroImageUrl } from "@/lib/api/pexels";
import { buildAlternates, localizedUrl } from "@/lib/seo/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates(locale, "kontak"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: localizedUrl(locale, "kontak"),
    },
  };
}

export default function KontakPage() {
  const t = useTranslations("Contact");
  const tCompany = useTranslations("Company");

  return (
    <main>
      <KontakHero />

      <Section tone="canvas" id="info">
        <SectionHead
          eyebrow={t("title")}
          title={t("form.title")}
          lead={t("pageDescription")}
        />

        <div className="mt-16 grid gap-0 md:grid-cols-12">
          <div className="border border-hairline bg-paper p-8 md:col-span-7 md:p-12">
            <ContactForm />
          </div>

          <div className="bg-forest-950 p-8 text-white md:col-span-5 md:p-12">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">
              {t("info.title")}
            </div>

            <dl className="mt-8 grid gap-8 text-sm">
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-white/50">
                  {t("info.email")}
                </dt>
                <dd className="mt-2 text-white/85">{company.contact.email}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-white/50">
                  {t("info.phone")}
                </dt>
                <dd className="mt-2 text-white/85">{company.contact.phone}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-white/50">
                  {t("info.address")}
                </dt>
                <dd className="mt-2 leading-7 text-white/85">
                  {company.contact.address}
                  <a
                    className="mt-4 block w-fit border-b border-white/40 pb-1 text-white transition hover:border-white"
                    href={company.contact.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("info.maps")}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-white/50">
                  {t("info.operational")}
                </dt>
                <dd className="mt-2 text-white/85">
                  <div>{tCompany("operational.days")}</div>
                  <div>{tCompany("operational.hours")}</div>
                </dd>
              </div>
            </dl>

            <ContactImage />
          </div>
        </div>
      </Section>
    </main>
  );
}

async function ContactImage() {
  const contactImageUrl = await getHeroImageUrl("customer service assistance");
  if (!contactImageUrl) return null;
  return (
    <div className="relative mt-12 aspect-[4/3] w-full overflow-hidden">
      <Image
        src={contactImageUrl}
        alt="Kontak Kami"
        fill
        sizes="(max-width: 768px) 100vw, 40vw"
        className="object-cover"
      />
    </div>
  );
}

async function KontakHero() {
  const imageUrl = await getHeroImageUrl("customer service office desk");
  const t = await getTranslations("Contact.hero");
  const tButtons = await getTranslations("Common.buttons");

  return (
    <HeroSection
      size="sm"
      imageUrl={imageUrl}
      title={t("title")}
      subtitle={t("subtitle")}
      ctaHref="/kontak#info"
      ctaLabel={tButtons("seeDetails")}
    />
  );
}
