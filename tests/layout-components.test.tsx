import { expect, test, describe, mock } from "bun:test";
import { render, screen, fireEvent } from "./test-utils";
import React from "react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

// We'll re-mock these specifically to check calls if needed,
// though setup.ts already has basic mocks.
const mockSetTheme = mock(() => {});
mock.module("next-themes", () => ({
  useTheme: () => ({
    theme: "dark",
    setTheme: mockSetTheme,
    resolvedTheme: "dark",
  }),
}));

const mockReplace = mock(() => {});
mock.module("@/i18n/routing", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  usePathname: () => "/test",
  routing: {
    locales: ["id", "en"],
  },
}));

describe("Layout Components", () => {
  describe("ThemeToggle", () => {
    test("renders theme toggle button", () => {
      render(<ThemeToggle />);
      expect(screen.getByLabelText("Toggle tema")).toBeInTheDocument();
    });

    test("calls setTheme when clicked", () => {
      render(<ThemeToggle />);
      fireEvent.click(screen.getByLabelText("Toggle tema"));
      expect(mockSetTheme).toHaveBeenCalled();
    });
  });

  describe("LanguageSwitcher", () => {
    test("renders language select", () => {
      render(<LanguageSwitcher />);
      const select = screen.getByRole("combobox");
      expect(select).toBeInTheDocument();
      expect(screen.getByText("ID")).toBeInTheDocument();
      expect(screen.getByText("EN")).toBeInTheDocument();
    });

    test("calls router.replace on change", () => {
      render(<LanguageSwitcher />);
      fireEvent.change(screen.getByRole("combobox"), {
        target: { value: "en" },
      });
      expect(mockReplace).toHaveBeenCalledWith("/test", { locale: "en" });
    });
  });
});
