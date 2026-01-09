import { Link } from "@/i18n/routing";
import { company } from "@/lib/data/company";
import { useTranslations } from "next-intl";

export function Footer() {
  const tCommon = useTranslations("Common");
  const tCompany = useTranslations("Company");
  const tFooter = useTranslations("Common.footer");

  const menuItems = [
    { href: "/", label: tCommon("nav.home") },
    { href: "/layanan", label: tCommon("nav.services") },
    { href: "/tentang-kami", label: tCommon("nav.about") },
    { href: "/portofolio", label: tCommon("nav.portfolio") },
    { href: "/artikel", label: tCommon("nav.articles") },
    { href: "/kontak", label: tCommon("nav.contact") },
  ];

  return (
    <footer className="border-t border-black/10 bg-white dark:border-white/10 dark:bg-black">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {tCompany("name")}
          </div>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {tFooter("description")}
          </p>
        </div>

        <div>
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {tFooter("menu")}
          </div>
          <div className="mt-3 grid gap-2 text-sm">
            {menuItems.map((item) => {
              return (
                <Link
                  key={item.href}
                  className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  href={item.href}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {tFooter("contact")}
          </div>
          <div className="mt-3 grid gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <div>{company.contact.email}</div>
            <div>{company.contact.phone}</div>
            <div className="leading-6">{company.contact.address}</div>
            <a
              className="text-sm font-semibold text-pkp-teal-700 hover:text-pkp-teal-600 dark:text-pkp-teal-600 dark:hover:text-pkp-teal-600/90"
              href={company.contact.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Maps
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-black/10 py-4 text-center text-xs text-zinc-500 dark:border-white/10 dark:text-zinc-500">
        {tFooter("rights", { year: new Date().getFullYear() })}
      </div>
    </footer>
  );
}
