import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { company } from "@/lib/data/company";
import { ContactForm } from "@/components/forms/ContactForm";
import { HeroSection } from "@/components/sections/HeroSection";
import { getHeroImageUrl } from "@/lib/api/pexels";

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
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: "/kontak",
    },
  };
}

export default function KontakPage() {
  const t = useTranslations("Contact");
  const tCompany = useTranslations("Company");

  return (
    <main>
      <KontakHero />

      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
            {t("pageDescription")}
          </p>
        </div>

        <div id="info" className="mt-10 grid gap-8 lg:grid-cols-3">
          <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950 lg:col-span-2">
            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {t("form.title")}
            </div>
            <div className="mt-4">
              <ContactForm />
            </div>
          </section>

          <div className="space-y-8 lg:col-span-1">
            <section className="rounded-2xl border border-black/10 bg-zinc-50 p-6 dark:border-white/10 dark:bg-zinc-950/40">
              <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {t("info.title")}
              </div>
              <div className="mt-4 grid gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                <div>
                  <div className="text-xs text-zinc-500">{t("info.email")}</div>
                  <div>{company.contact.email}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-500">{t("info.phone")}</div>
                  <div>{company.contact.phone}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-500">
                    {t("info.address")}
                  </div>
                  <div className="leading-6">{company.contact.address}</div>
                  <a
                    className="mt-2 inline-flex text-xs font-semibold text-pkp-teal-700 hover:text-pkp-teal-600 dark:text-pkp-teal-600 dark:hover:text-pkp-teal-600/90"
                    href={company.contact.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("info.maps")}
                  </a>
                </div>
                <div>
                  <div className="text-xs text-zinc-500">
                    {t("info.operational")}
                  </div>
                  <div>{tCompany("operational.days")}</div>
                  <div>{tCompany("operational.hours")}</div>
                </div>
              </div>
            </section>

            <ContactImage />
          </div>
        </div>
      </div>
    </main>
  );
}

async function ContactImage() {
  const contactImageUrl = await getHeroImageUrl("customer service assistance");
  if (!contactImageUrl) return null;
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-sm">
      <Image
        src={contactImageUrl}
        alt="Kontak Kami"
        fill
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
