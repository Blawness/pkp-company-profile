import type { Metadata } from "next";
import Image from "next/image";
import { company } from "@/lib/data/company";
import { ContactForm } from "@/components/forms/ContactForm";
import { HeroSection } from "@/components/sections/HeroSection";
import { getHeroImageUrl } from "@/lib/api/pexels";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kontak",
  description:
    "Hubungi PT Presisi Konsulindo Prima untuk konsultasi pertanahan dan pengurusan sertifikat tanah.",
  openGraph: {
    title: "Kontak",
    description:
      "Hubungi PT Presisi Konsulindo Prima untuk konsultasi pertanahan dan pengurusan sertifikat tanah.",
    url: "/kontak",
  },
};

export default async function KontakPage() {
  const contactImageUrl = await getHeroImageUrl("customer service assistance");

  return (
    <main>
      <KontakHero />

      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-4xl">
            Kontak
          </h1>
          <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
            Hubungi kami untuk informasi lebih lanjut. Kami akan merespons
            secepat mungkin.
          </p>
        </div>

        <div id="info" className="mt-10 grid gap-8 lg:grid-cols-3">
          <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950 lg:col-span-2">
            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Kirim Permintaan Anda
            </div>
            <div className="mt-4">
              <ContactForm />
            </div>
          </section>

          <div className="space-y-8 lg:col-span-1">
            <section className="rounded-2xl border border-black/10 bg-zinc-50 p-6 dark:border-white/10 dark:bg-zinc-950/40">
              <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Informasi Kontak
              </div>
              <div className="mt-4 grid gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                <div>
                  <div className="text-xs text-zinc-500">Email</div>
                  <div>{company.contact.email}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-500">Telepon</div>
                  <div>{company.contact.phone}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-500">Alamat</div>
                  <div className="leading-6">{company.contact.address}</div>
                  <a
                    className="mt-2 inline-flex text-xs font-semibold text-pkp-teal-700 hover:text-pkp-teal-600 dark:text-pkp-teal-600 dark:hover:text-pkp-teal-600/90"
                    href={company.contact.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Buka di Google Maps
                  </a>
                </div>
                <div>
                  <div className="text-xs text-zinc-500">Operasional</div>
                  <div>{company.contact.operational.days}</div>
                  <div>{company.contact.operational.hours}</div>
                </div>
              </div>
            </section>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-sm">
              {contactImageUrl && (
                <Image
                  src={contactImageUrl}
                  alt="Kontak Kami"
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

async function KontakHero() {
  const imageUrl = await getHeroImageUrl("customer service office desk");

  return (
    <HeroSection
      size="sm"
      imageUrl={imageUrl}
      title="Hubungi Kami"
      subtitle="Sampaikan kebutuhan Anda—kami bantu evaluasi awal, estimasi proses, dan langkah berikutnya."
      ctaHref="/kontak#info"
      ctaLabel="Lihat Detail Kontak"
    />
  );
}
