"use client";

import { useLocale } from "next-intl";
import { routing, usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { Languages } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const tCommon = useTranslations("Common");

  // Articles and portfolio entries are authored in one language only, so there
  // is nothing to switch to. The control stays on screen but inert — removing
  // it shifted the whole masthead sideways whenever a visitor opened one of
  // those pages.
  const isUnlocalized =
    pathname.startsWith("/artikel") || pathname.startsWith("/portofolio");

  function onLanguageChange(newLocale: string) {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1 sm:gap-2",
        isUnlocalized && "opacity-40",
      )}
    >
      <Languages className="hidden h-4 w-4 text-white/70 sm:block" />
      <select
        value={locale}
        onChange={(e) => onLanguageChange(e.target.value)}
        disabled={isUnlocalized}
        title={isUnlocalized ? tCommon("languageUnavailable") : undefined}
        aria-label={tCommon("languageLabel")}
        className={cn(
          "bg-transparent text-sm font-medium text-white/90 outline-none transition hover:text-white",
          "appearance-none cursor-pointer disabled:cursor-default disabled:hover:text-white/90",
        )}
      >
        {routing.locales.map((cur) => (
          <option key={cur} value={cur} className="bg-zinc-900 text-white">
            {cur.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
