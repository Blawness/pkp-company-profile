"use client";

import Image from "next/image";
import { usePathname } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { Menu } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/cn";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/NavigationMenu";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { useTranslations } from "next-intl";

export function Header() {
  const pathname = usePathname();
  const t = useTranslations("Common.nav");

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/tentang-kami", label: t("about") },
    { href: "/layanan", label: t("services") },
    { href: "/portofolio", label: t("portfolio") },
    { href: "/artikel", label: t("articles") },
    { href: "/kontak", label: t("contact") },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-pkp-green-900/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white p-1.5">
            <Image
              src="/logo-square.png"
              alt="PT Presisi Konsulindo Prima"
              width={40}
              height={40}
              priority
              className="h-full w-auto object-contain"
            />
          </div>
          <div className="leading-tight min-w-0">
            <div className="truncate text-[13px] font-semibold tracking-wide text-white sm:text-sm lg:whitespace-nowrap">
              PT PRESISI KONSULINDO PRIMA
            </div>
            <div className="hidden text-[11px] text-white/70 md:block">
              {useTranslations("Company")("tagline")}
            </div>
          </div>
        </Link>

        <div className="hidden items-center gap-4 lg:flex xl:gap-6">
          <NavigationMenu>
            <NavigationMenuList className="gap-4 xl:gap-6">
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "whitespace-nowrap text-sm font-medium text-white/80 transition hover:text-white",
                          active &&
                            "text-white underline underline-offset-8 decoration-white/60",
                        )}
                      >
                        {item.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
          <div className="flex items-center gap-4 border-l border-white/20 pl-4">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <LanguageSwitcher />
          <ThemeToggle />
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/90 backdrop-blur transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                aria-label="Buka menu"
              >
                <Menu className="h-4 w-4" />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/50" />
              <Dialog.Content className="fixed right-0 top-0 h-full w-[85%] max-w-sm bg-white p-6 shadow-xl outline-none dark:bg-zinc-950">
                <Dialog.Title className="mb-6 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Menu
                </Dialog.Title>
                <Dialog.Description className="sr-only">
                  Navigasi menu untuk perangkat seluler
                </Dialog.Description>
                <nav className="flex flex-col gap-2">
                  {navItems.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Dialog.Close asChild key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "rounded-lg px-3 py-2 text-sm font-medium",
                            active
                              ? "bg-zinc-900 text-white dark:bg-white dark:text-black"
                              : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/10",
                          )}
                        >
                          {item.label}
                        </Link>
                      </Dialog.Close>
                    );
                  })}
                </nav>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
