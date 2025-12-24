import { Link } from "@/i18n/routing";
import type { MainService } from "@/lib/data/services";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export function ServiceCard({ service }: { service: MainService }) {
  const t = useTranslations(`Services.list.${service.id}`);
  const tCommon = useTranslations("Common.buttons");

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1 dark:border-white/10 dark:bg-zinc-950">
      <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        {t("title")}
      </div>
      <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {t("description")}
      </p>

      <div className="mt-5">
        <Link
          href={`/layanan#${service.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-pkp-teal-700 hover:text-pkp-teal-600 dark:text-pkp-teal-600 dark:hover:text-pkp-teal-600/90"
        >
          {tCommon("seeDetail")} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
