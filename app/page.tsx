import { HeroSection } from "@/components/sections/HeroSection";
import { ServiceCard } from "@/components/sections/ServiceCard";
import { company } from "@/lib/data/company";
import { services } from "@/lib/data/services";
import { searchPexelsPhotos } from "@/lib/api/pexels";

export default function Home() {
  // Server-side fetch for hero image (pexels); falls back gracefully if no API key.
  // NOTE: This is a Server Component by default; safe to fetch here.
  return (
    <main>
      <HomeHero />

      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-3 md:items-start">
          <div className="md:col-span-1">
            <div className="text-sm font-semibold text-pkp-green-700">
              Tentang Kami
            </div>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              {company.name}
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              {company.description}
            </p>
          </div>

          <div className="md:col-span-2 grid gap-4 md:grid-cols-2">
            {services.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
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
              Konsultasikan kebutuhan Anda—kami bantu dari analisis hingga dokumen siap proses.
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
  const data = await searchPexelsPhotos("business meeting documents contract", 1);
  const imageUrl = data.photos[0]?.src?.large2x ?? data.photos[0]?.src?.large;

  return (
    <HeroSection
      imageUrl={imageUrl}
      title="Konsultasi Pertanahan & Pengurusan Sertifikat Tanah"
      subtitle="Pendampingan legalitas lahan dari analisis dokumen hingga proses sertifikasi. Transparan, sesuai regulasi, dan terukur."
      ctaHref="/kontak"
      ctaLabel="Hubungi"
    />
  );
}
