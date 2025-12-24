import type { Metadata } from "next";
import Image from "next/image";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServiceCard } from "@/components/sections/ServiceCard";
import { company } from "@/lib/data/company";
import { services } from "@/lib/data/services";
import { getHeroImageUrl } from "@/lib/api/pexels";

export const metadata: Metadata = {
  title: "Beranda",
  description:
    "Konsultasi pertanahan & pengurusan sertifikat tanah secara profesional, transparan, dan sesuai regulasi.",
  openGraph: {
    title: "Beranda",
    description:
      "Konsultasi pertanahan & pengurusan sertifikat tanah secara profesional, transparan, dan sesuai regulasi.",
    url: "/",
  },
};

export default async function Home() {
  const aboutImageUrl = await getHeroImageUrl(
    "modern office building professional environment",
  );

  return (
    <main>
      <HomeHero />

      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="relative aspect-square overflow-hidden rounded-2xl md:aspect-[4/3]">
            {aboutImageUrl && (
              <Image
                src={aboutImageUrl}
                alt="Tentang PT Presisi Konsulindo Prima"
                fill
                className="object-cover"
              />
            )}
          </div>

          <div>
            <div className="text-sm font-semibold text-pkp-green-700">
              Tentang Kami
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              {company.name}
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              {company.description}
            </p>
            <div className="mt-6">
              <a
                href="/tentang-kami"
                className="text-sm font-semibold text-pkp-teal-700 hover:text-pkp-teal-600 dark:text-pkp-teal-600 dark:hover:text-pkp-teal-600/90"
              >
                Selengkapnya tentang kami →
              </a>
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
                Visi
              </div>
              <p className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
                {company.vision}
              </p>
            </div>
            <div>
              <div className="text-sm font-semibold text-pkp-green-700 dark:text-pkp-green-400">
                Misi
              </div>
              <ul className="mt-3 grid gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                {company.mission.map((m) => (
                  <li key={m} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-pkp-teal-600" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 rounded-2xl bg-pkp-green-900 p-8 text-white shadow-sm">
            <div className="text-lg font-semibold">{company.tagline}</div>
            <p className="mt-2 text-sm text-white/80">
              Konsultasikan kebutuhan Anda—kami bantu dari analisis hingga
              dokumen siap proses.
            </p>
            <div className="mt-6">
              <a
                href="/kontak"
                className="inline-flex items-center justify-center rounded-full bg-pkp-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pkp-teal-700"
              >
                Hubungi
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

async function HomeHero() {
  const imageUrl = await getHeroImageUrl("business meeting documents contract");

  return (
    <HeroSection
      imageUrl={imageUrl}
      priority
      title="Konsultasi Pertanahan & Pengurusan Sertifikat Tanah"
      subtitle="Pendampingan legalitas lahan dari analisis dokumen hingga proses sertifikasi. Transparan, sesuai regulasi, dan terukur."
      ctaHref="/kontak"
      ctaLabel="Hubungi"
    />
  );
}
