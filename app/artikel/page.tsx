import { HeroSection } from "@/components/sections/HeroSection";
import { searchPexelsPhotos } from "@/lib/api/pexels";

export default function ArtikelPage() {
  return (
    <main>
      <ArtikelHero />

      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-4xl">
            Artikel
          </h1>
          <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
            Halaman artikel akan tersedia segera. Nantinya berisi edukasi
            singkat seputar pertanahan, sertifikasi, dan update regulasi.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-dashed border-black/15 bg-zinc-50 p-10 text-center text-sm text-zinc-600 dark:border-white/15 dark:bg-zinc-950/40 dark:text-zinc-400">
          Coming soon.
        </div>
      </div>
    </main>
  );
}

async function ArtikelHero() {
  const data = await searchPexelsPhotos("reading documents notebook pen", 1);
  const imageUrl = data.photos[0]?.src?.large2x ?? data.photos[0]?.src?.large;

  return (
    <HeroSection
      size="sm"
      imageUrl={imageUrl}
      title="Artikel & Edukasi"
      subtitle="Ringkasan topik penting seputar pertanahan, sertifikasi, dan proses legalitas—untuk membantu Anda mengambil langkah yang tepat."
      ctaHref="/layanan"
      ctaLabel="Lihat Layanan"
    />
  );
}
