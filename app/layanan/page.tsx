import type { Metadata } from "next";
import Image from "next/image";
import { services } from "@/lib/data/services";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/Accordion";
import { HeroSection } from "@/components/sections/HeroSection";
import { getHeroImageUrl } from "@/lib/api/pexels";

export const metadata: Metadata = {
  title: "Layanan",
  description:
    "Layanan konsultasi hukum pertanahan dan pengurusan sertifikat tanah oleh PT Presisi Konsulindo Prima.",
  openGraph: {
    title: "Layanan",
    description:
      "Layanan konsultasi hukum pertanahan dan pengurusan sertifikat tanah oleh PT Presisi Konsulindo Prima.",
    url: "/layanan",
  },
};

export default async function LayananPage() {
  const servicesWithImages = await Promise.all(
    services.map(async (s) => ({
      ...s,
      imageUrl: await getHeroImageUrl(s.imageQuery),
    })),
  );

  return (
    <main>
      <LayananHero />

      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-4xl">
            Layanan
          </h1>
          <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
            Layanan utama PT Presisi Konsulindo Prima untuk kebutuhan konsultasi
            hukum pertanahan dan pengurusan sertifikat tanah.
          </p>
        </div>

        <div className="mt-10 grid gap-12">
          {servicesWithImages.map((service) => {
            const serviceTitles: Record<string, string> = {
              "konsultasi-hukum-pertanahan": "Konsultasi Hukum Pertanahan",
              "pengurusan-sertifikat-tanah": "Pengurusan Sertifikat Tanah",
              "pengukuran-lahan": "Pengukuran Lahan",
            };
            const title = serviceTitles[service.id] || service.id;
            
            return (
              <section
                key={service.id}
                id={service.id}
                className="scroll-mt-24 overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-950 md:grid md:grid-cols-2"
              >
                <div className="relative h-64 w-full md:h-full">
                  {service.imageUrl && (
                    <Image
                      src={service.imageUrl}
                      alt={title}
                      fill
                      className="object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                <div className="flex flex-col p-6 md:p-8">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                      {title}
                    </h2>
                    <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                      Informasi detail tersedia di halaman layanan berbahasa.
                    </p>
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}

async function LayananHero() {
  const imageUrl = await getHeroImageUrl("documents contract signature");

  return (
    <HeroSection
      size="sm"
      imageUrl={imageUrl}
      title="Layanan Konsultasi dan Pengukuran Tanah"
      subtitle="Pendampingan konsultasi pertanahan, pengukuran lahan, kajian hukum, dan pengurusan sertifikat—disusun rapi sesuai kebutuhan proses Anda."
      ctaHref="/kontak"
      ctaLabel="Konsultasi"
    />
  );
}
