/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, test, describe, mock } from "bun:test";
import { render, screen, fireEvent } from "./test-utils";
import React from "react";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const mockReplace = mock(() => {});
mock.module("@/i18n/routing", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  usePathname: () => "/test",
  Link: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
  routing: {
    locales: ["id", "en"],
  },
}));

describe("Layout Components", () => {
  describe("LanguageSwitcher", () => {
    test("renders language select", () => {
      render(<LanguageSwitcher />);
      const select = screen.getByRole("combobox");
      expect(select).toBeInTheDocument();
    });

    test("calls router.replace on change", () => {
      render(<LanguageSwitcher />);
      const select = screen.getByRole("combobox");
      fireEvent.change(select, { target: { value: "en" } });
      expect(mockReplace).toHaveBeenCalled();
    });
  });

  describe("Header", () => {
    test("renders the main navigation links", () => {
      render(<Header />);
      expect(screen.getAllByText("Common.nav.home").length).toBeGreaterThan(0);
      expect(
        screen.getAllByText("Common.nav.contact").length,
      ).toBeGreaterThan(0);
    });

    test("no longer renders a theme toggle", () => {
      const { container } = render(<Header />);
      const themeButton = container.querySelector(
        '[aria-label*="tema" i], [aria-label*="theme" i]',
      );
      expect(themeButton).toBeNull();
    });
  });

  describe("Footer", () => {
    test("renders contact details and menu links", () => {
      render(<Footer />);
      expect(screen.getByText("Common.footer.menu")).toBeInTheDocument();
      expect(
        screen.getAllByText("Common.nav.contact").length,
      ).toBeGreaterThan(0);
    });

    test("hides legal credentials while they are unconfirmed", () => {
      const { container } = render(<Footer />);
      expect(container.textContent).not.toContain("NIB");
    });
  });
});
