"use client";

import * as React from "react";
import Image from "next/image";
import { usePathname } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import { Menu, X } from "lucide-react";
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
  const tCompany = useTranslations("Company");

  // Transparent while it sits over the hero, solid once the page moves —
  // so the masthead reads as part of the hero, not a bar bolted on top.
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { href: "/", label: t("home") },
    { href: "/tentang-kami", label: t("about") },
    { href: "/layanan", label: t("services") },
    { href: "/portofolio", label: t("portfolio") },
    { href: "/artikel", label: t("articles") },
    { href: "/kontak", label: t("contact") },
  ] as const;

  return (
    <header
      className={cn(
        // Only colours animate. Animating height would relayout the whole
        // page on every scroll frame — the jank is not worth the shrink.
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300 ease-out",
        scrolled
          ? "border-b border-white/10 bg-forest-950/95 backdrop-blur"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div
        className={cn(
          // The gap is load-bearing: without it the truncated company name butts
          // straight against the first nav item with zero space between them.
          "mx-auto flex h-20 max-w-[1200px] items-center justify-between gap-4 px-6 md:px-10 lg:gap-6",
        )}
      >
        {/* `min-w-0` lets the name actually truncate. Without it this flex item
            refuses to shrink below its text width and shoves the language
            switcher and the menu button clean off a phone screen. */}
        <Link href="/" className="flex min-w-0 items-center gap-3">
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
            <div className="truncate text-[13px] font-semibold uppercase tracking-[0.14em] text-white sm:text-sm">
              PT PRESISI KONSULINDO PRIMA
            </div>
            <div className="hidden truncate text-[11px] text-white/70 md:block">
              {tCompany("tagline")}
            </div>
          </div>
        </Link>

        <div className="hidden shrink-0 items-center gap-4 lg:flex xl:gap-6">
          <NavigationMenu>
            <NavigationMenuList className="gap-3 xl:gap-5">
              {navItems.map((item) => {
                const active = pathname === item.href;

                return (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          // Tighter between lg and xl so six uppercase items
                          // plus the full company name fit one row.
                          "whitespace-nowrap text-[12px] font-medium uppercase tracking-[0.08em] text-white/70 transition hover:text-white xl:text-[13px] xl:tracking-[0.12em]",
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

        <div className="flex shrink-0 items-center gap-3 lg:hidden">
          <LanguageSwitcher />
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/90 backdrop-blur transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                aria-label={t("openMenu")}
              >
                <Menu className="h-4 w-4" />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              {/* Above the masthead's own z-50, or the header paints straight
                  through the panel and the menu opens underneath it. */}
              <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/50" />
              <Dialog.Content className="fixed right-0 top-0 z-[60] h-full w-[85%] max-w-sm border-l border-hairline bg-canvas p-8 outline-none">
                <div className="flex items-center justify-between">
                  <Dialog.Title className="text-xs font-semibold uppercase tracking-[0.18em] text-brass">
                    {t("menu")}
                  </Dialog.Title>
                  <Dialog.Close
                    className="-mr-2 inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-700/40"
                    aria-label={t("closeMenu")}
                  >
                    <X className="h-4 w-4" />
                  </Dialog.Close>
                </div>
                <Dialog.Description className="sr-only">
                  {t("mobileMenuDescription")}
                </Dialog.Description>
                <nav className="mt-8 flex flex-col">
                  {navItems.map((item) => {
                    const active = pathname === item.href;

                    return (
                      <Dialog.Close asChild key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "font-display border-b border-hairline py-4 text-2xl",
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
