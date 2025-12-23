import { company } from "@/lib/data/company";
import { organization } from "@/lib/data/organization";
import { OrganizationChart } from "@/components/sections/OrganizationChart";

export default function TentangKamiPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-4xl">
          Tentang Kami
        </h1>
        <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          {company.description}
        </p>
      </div>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-950">
          <div className="text-sm font-semibold text-pkp-green-700 dark:text-pkp-green-400">
            Visi
          </div>
          <p className="mt-3 text-sm leading-7 text-zinc-700 dark:text-zinc-300">
            {company.vision}
          </p>

          <div className="mt-8 text-sm font-semibold text-pkp-green-700 dark:text-pkp-green-400">
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
        </section>

        <section>
          <div className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Struktur Organisasi
          </div>
          <OrganizationChart data={organization} />
        </section>
      </div>
    </main>
  );
}


