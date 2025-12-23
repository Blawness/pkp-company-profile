import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <div className="rounded-2xl border border-black/10 bg-white p-10 text-center dark:border-white/10 dark:bg-zinc-950">
        <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          Halaman tidak ditemukan
        </div>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
          Tautan yang Anda buka tidak tersedia.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-pkp-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pkp-teal-700"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}


