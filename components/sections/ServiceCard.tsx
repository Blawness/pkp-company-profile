import { Link } from "@/i18n/routing";
import type { MainService } from "@/lib/data/services";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

export function ServiceCard({ service }: { service: MainService }) {
  const t = useTranslations(`Services.list.${service.id}`);
  const tCommon = useTranslations("Common.buttons");

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition-transform hover:-translate-y-1 dark:border-white/10 dark:bg-zinc-950">
      {service.imageUrl && (
        <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-black/5 dark:border-white/5">
          <Image
            src={service.imageUrl}
            alt={t("title")}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {t("title")}
        </div>
        <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          {t("description")}
        </p>

        <div className="mt-auto pt-5">
          <Link
            href={`/layanan#${service.id}`}
            className="inline-flex items-center gap-2 text-sm font-semibold text-pkp-teal-700 hover:text-pkp-teal-600 dark:text-pkp-teal-600 dark:hover:text-pkp-teal-600/90"
          >
            {tCommon("seeDetail")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
