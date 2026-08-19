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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-forest-950">
      <div className="mx-auto flex h-20 max-w-[1200px] items-center justify-between px-6 md:px-10">
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
            <div className="font-display truncate text-[15px] tracking-tight text-white sm:text-base lg:whitespace-nowrap">
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
                          "whitespace-nowrap text-[13px] font-medium uppercase tracking-[0.12em] text-white/70 transition hover:text-white",
                          active && "text-white",
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
          </div>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <LanguageSwitcher />
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
              <Dialog.Content className="fixed right-0 top-0 h-full w-[85%] max-w-sm border-l border-hairline bg-canvas p-8 outline-none">
                <Dialog.Title className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">
                  Menu
                </Dialog.Title>
                <Dialog.Description className="sr-only">
                  Navigasi menu untuk perangkat seluler
                </Dialog.Description>
                <nav className="mt-8 flex flex-col">
                  {navItems.map((item) => {
                    const active = pathname === item.href;

                    return (
                      <Dialog.Close asChild key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "font-display border-b border-hairline py-4 text-xl",
                            active ? "text-forest-700" : "text-ink",
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
