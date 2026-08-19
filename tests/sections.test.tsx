import { expect, test, describe } from "bun:test";
import { render, screen } from "./test-utils";
import React from "react";
import { ServiceCard } from "@/components/sections/ServiceCard";
import { HeroSection } from "@/components/sections/HeroSection";
import { HomeHeroSection } from "@/components/sections/HomeHeroSection";
import type { MainService } from "@/lib/data/services";

describe("Section Components", () => {
  describe("ServiceCard", () => {
    test("renders service card with title and link", () => {
      const service: MainService = {
        id: "konsultasi-hukum-pertanahan",
        imageQuery: "test",
        sectionIds: ["faq"],
      };
      render(<ServiceCard service={service} />);

      expect(
        screen.getByText("Services.list.konsultasi-hukum-pertanahan.title"),
      ).toBeInTheDocument();
      const link = screen.getByRole("link");
      expect(link.getAttribute("href")).toBe(
        "/layanan#konsultasi-hukum-pertanahan",
      );
    });
  });

  describe("HeroSection", () => {
    test("renders hero title and description", () => {
      render(
        <HeroSection
          title="Home.hero.title"
          subtitle="Home.hero.description"
        />,
      );
      expect(screen.getByText("Home.hero.title")).toBeInTheDocument();
      expect(screen.getByText("Home.hero.description")).toBeInTheDocument();
    });
  });

  describe("HomeHeroSection", () => {
    test("renders title, subtitle, and both calls to action", () => {
      render(
        <HomeHeroSection
          imageUrl="/hero.jpg"
          title="Kepastian Hukum"
          subtitle="Pendampingan legalitas lahan."
          primaryHref="/kontak"
          primaryLabel="Konsultasi"
          secondaryHref="/layanan"
          secondaryLabel="Lihat Layanan"
        />,
      );
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading.textContent).toBe("Kepastian Hukum");
      expect(heading.className).toContain("font-display");
      expect(screen.getByText("Konsultasi").getAttribute("href")).toBe(
        "/kontak",
      );
      expect(screen.getByText("Lihat Layanan").getAttribute("href")).toBe(
        "/layanan",
      );
    });
  });
});
