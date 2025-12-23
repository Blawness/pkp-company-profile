import { company } from "@/lib/data/company";
import { ContactForm } from "@/components/forms/ContactForm";

export default function KontakPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-4xl">
          Kontak
        </h1>
        <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          Hubungi kami untuk informasi lebih lanjut. Kami akan merespons secepat mungkin.
        </p>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950">
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Kirim Permintaan Anda
          </div>
          <div className="mt-4">
            <ContactForm />
          </div>
        </section>

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
          </div>

          <div className="mt-8 text-xs text-zinc-500">
            Map lokasi dapat ditambahkan kemudian sesuai alamat kantor.
          </div>
        </section>
      </div>
    </main>
  );
}


