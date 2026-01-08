"use client";

import { useLocale } from "next-intl";
import { routing, usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { Languages } from "lucide-react";
import * as React from "react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const isUnlocalized = pathname.startsWith("/artikel") || pathname.startsWith("/portofolio");

  if (isUnlocalized) {
    return null;
  }

  function onLanguageChange(newLocale: string) {
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <Languages className="hidden h-4 w-4 text-white/70 sm:block" />
      <select
        value={locale}
        onChange={(e) => onLanguageChange(e.target.value)}
        className={cn(
          "bg-transparent text-sm font-medium text-white/90 outline-none transition hover:text-white",
          "appearance-none cursor-pointer",
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
