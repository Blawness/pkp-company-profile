import Link from "next/link";
import { company } from "@/lib/data/company";

export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white dark:border-white/10 dark:bg-black">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            PT Presisi Konsulindo Prima
          </div>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Solusi presisi untuk lingkungan masa depan — konsultasi hukum pertanahan dan
            pengurusan sertifikat tanah secara profesional, transparan, dan berintegritas.
          </p>
        </div>

        <div>
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Menu</div>
          <div className="mt-3 grid gap-2 text-sm">
            <Link className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100" href="/">
              Beranda
            </Link>
            <Link className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100" href="/layanan">
              Layanan
            </Link>
            <Link className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100" href="/tentang-kami">
              Tentang Kami
            </Link>
            <Link className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100" href="/kontak">
              Kontak
            </Link>
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Kontak</div>
          <div className="mt-3 grid gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <div>{company.contact.email}</div>
            <div>{company.contact.phone}</div>
          </div>
        </div>
      </div>
      <div className="border-t border-black/10 py-4 text-center text-xs text-zinc-500 dark:border-white/10 dark:text-zinc-500">
        © {new Date().getFullYear()} PT Presisi Konsulindo Prima. All rights reserved.
      </div>
    </footer>
  );
}


