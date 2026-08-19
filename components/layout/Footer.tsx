import { Link } from "@/i18n/routing";
import { company } from "@/lib/data/company";
import { credentials } from "@/lib/data/credentials";
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
    <footer className="bg-forest-950 text-white">
      <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-10 md:py-24">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="font-display text-2xl leading-snug">
              {tCompany("name")}
            </div>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/70">
              {tFooter("description")}
            </p>
          </div>

          <div className="md:col-span-3">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">
              {tFooter("menu")}
            </div>
            <div className="mt-6 grid gap-3 text-sm">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  className="text-white/70 transition hover:text-white"
                  href={item.href}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="md:col-span-4">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">
              {tFooter("contact")}
            </div>
            <div className="mt-6 grid gap-3 text-sm text-white/70">
              <div>{company.contact.email}</div>
              <div>{company.contact.phone}</div>
              <div className="leading-7">{company.contact.address}</div>
              <a
                className="w-fit border-b border-white/40 pb-1 text-white transition hover:border-white"
                href={company.contact.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Maps
              </a>
            </div>

            {credentials.enabled && credentials.legalEntities.length > 0 && (
              <dl className="mt-8 grid gap-2 text-xs text-white/60">
                {credentials.legalEntities.map((entity) => (
                  <div key={entity.label} className="flex gap-2">
                    <dt className="uppercase tracking-[0.14em]">
                      {entity.label}
                    </dt>
                    <dd>{entity.value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1200px] px-6 py-6 text-xs text-white/50 md:px-10">
          {tFooter("rights", { year: new Date().getFullYear() })}
        </div>
      </div>
    </footer>
  );
}
