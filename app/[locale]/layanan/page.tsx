import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { services, type MainService } from "@/lib/data/services";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { HeroSection } from "@/components/sections/HeroSection";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { Button } from "@/components/ui/Button";
import { getHeroImageUrl } from "@/lib/api/pexels";
import { buildAlternates, localizedUrl } from "@/lib/seo/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Services" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: buildAlternates(locale, "layanan"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: localizedUrl(locale, "layanan"),
    },
  };
}

export default function LayananPage() {
  const t = useTranslations("Services");

  return (
    <main>
      <LayananHero />

      <Section tone="canvas">
        <SectionHead
          eyebrow={t("title")}
          title={t("hero.title")}
          lead={t("pageDescription")}
        />
      </Section>

      {services.map((service, i) => (
        <ServiceSection key={service.id} service={service} index={i + 1} />
      ))}

      <Cta />
    </main>
  );
}

function Cta() {
  const tCompany = useTranslations("Company");
  const tButtons = useTranslations("Common.buttons");

  return (
    <Section tone="forest">
      <div className="grid gap-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <div className="font-display text-h2 text-balance">
            {tCompany("tagline")}
          </div>
        </div>
        <div className="md:col-span-4 md:justify-self-end">
          <Button href="/kontak" variant="solid" tone="light">
            {tButtons("consultation")}
          </Button>
        </div>
      </div>
    </Section>
  );
}

async function ServiceSection({
  service,
  index,
}: {
  service: MainService;
  index: number;
}) {
  const imageUrl = await getHeroImageUrl(service.imageQuery);
  const t = await getTranslations(`Services.list.${service.id}`);

  const sectionsRaw = t.raw("sections") as Record<
    string,
    { title: string; items: (string | { question: string; answer: string })[] }
  >;
  const sectionKeys = Object.keys(sectionsRaw);

  return (
    <Section
      id={service.id}
      tone={index % 2 === 1 ? "paper" : "canvas"}
      className="scroll-mt-24"
    >
      <div className="grid gap-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <SectionHead
            eyebrow={String(index).padStart(2, "0")}
            title={t("title")}
            lead={t("description")}
          />
          {imageUrl && (
            <div className="relative mt-10 aspect-[3/2] w-full overflow-hidden">
              <Image
                src={imageUrl}
                alt={t("title")}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>

        <div className="md:col-span-7">
          <Accordion type="multiple" className="w-full border-t border-hairline">
            {sectionKeys.map((key) => {
              const sec = sectionsRaw[key];
              return (
                <AccordionItem key={key} value={key}>
                  <AccordionTrigger>{sec.title}</AccordionTrigger>
                  <AccordionContent>
                    <ul className="grid gap-6">
                      {sec.items.map((it, idx) => {
                        if (typeof it === "string") {
                          return (
                            <li key={idx} className="flex gap-4">
                              <span
                                aria-hidden
                                className="mt-4 h-px w-6 shrink-0 bg-brass"
                              />
                              <span>{it}</span>
                            </li>
                          );
                        }
                        return (
                          <li
                            key={idx}
                            className="border-t border-hairline pt-6 first:border-0 first:pt-0"
                          >
                            <div className="text-base font-semibold text-ink">
                              {it.question}
                            </div>
                            <div className="mt-2 text-ink-muted">
                              {it.answer}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
    </Section>
  );
}

async function LayananHero() {
  const imageUrl = await getHeroImageUrl("documents contract signature");
  const t = await getTranslations("Services.hero");
  const tButtons = await getTranslations("Common.buttons");

  return (
    <HeroSection
      size="sm"
      imageUrl={imageUrl}
      title={t("title")}
      subtitle={t("subtitle")}
      ctaHref="/kontak"
      ctaLabel={tButtons("consultation")}
    />
  );
}
