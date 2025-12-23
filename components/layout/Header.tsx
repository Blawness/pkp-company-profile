"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/NavigationMenu";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/tentang-kami", label: "Tentang Kami" },
  { href: "/kontak", label: "Kontak" },
  { href: "/artikel", label: "Artikel" },
  { href: "/layanan", label: "Layanan" },
] as const;

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-pkp-green-900/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="PT Presisi Konsulindo Prima"
            width={128}
            height={40}
            priority
            className="h-9 w-auto"
          />
          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide text-white">
              PT PRESISI KONSULINDO PRIMA
            </div>
            <div className="text-xs text-white/70">Konsultasi pertanahan & sertifikat tanah</div>
          </div>
        </Link>

        <div className="hidden items-center gap-4 md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              {navItems.map((item) => {
                const active = pathname === item.href;
                return (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          active && "text-white underline underline-offset-8 decoration-white/60",
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
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-3 md:hidden">
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
                <div className="mb-6 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  Menu
                </div>
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


