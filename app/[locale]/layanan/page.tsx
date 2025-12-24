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
import { getHeroImageUrl } from "@/lib/api/pexels";

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
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: "/layanan",
    },
  };
}

export default function LayananPage() {
  const t = useTranslations("Services");

  return (
    <main>
      <LayananHero />

      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
            {t("pageDescription")}
          </p>
        </div>

        <div className="mt-10 grid gap-12">
          {services.map((service) => (
            <ServiceSection key={service.id} service={service} />
          ))}
        </div>
      </div>
    </main>
  );
}

async function ServiceSection({ service }: { service: MainService }) {
  const imageUrl = await getHeroImageUrl(service.imageQuery);
  const t = await getTranslations(`Services.list.${service.id}`);

  // Get raw sections from translation
  const sectionsRaw = t.raw("sections") as Record<string, { title: string; items: (string | { question: string; answer: string })[] }>;
  const sectionKeys = Object.keys(sectionsRaw);

  return (
    <section
      id={service.id}
      className="scroll-mt-24 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-950 md:grid md:grid-cols-2"
    >
      <div className="relative h-64 w-full md:h-full">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={t("title")}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className="flex flex-col p-6 md:p-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            {t("title")}
          </h2>
          <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-400">
            {t("description")}
          </p>
        </div>

        <div className="mt-6">
          <Accordion type="multiple" className="w-full">
            {sectionKeys.map((key) => {
              const sec = sectionsRaw[key];
              return (
                <AccordionItem key={key} value={key}>
                  <AccordionTrigger>{sec.title}</AccordionTrigger>
                  <AccordionContent>
                    <ul className="grid gap-2">
                      {sec.items.map((it, idx) => {
                        if (typeof it === "string") {
                          return (
                            <li key={idx} className="flex gap-2">
                              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-pkp-teal-600" />
                              <span>{it}</span>
                            </li>
                          );
                        }
                        return (
                          <li key={idx} className="space-y-1 py-1">
                            <div className="font-medium text-zinc-900 dark:text-zinc-100">
                              {it.question}
                            </div>
                            <div className="text-sm text-zinc-600 dark:text-zinc-400">
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
    </section>
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
