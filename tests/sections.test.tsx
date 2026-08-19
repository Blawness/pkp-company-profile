import { expect, test, describe } from "bun:test";
import { render, screen } from "./test-utils";
import React from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { HomeHeroSection } from "@/components/sections/HomeHeroSection";
import {
  OrganizationChart,
  type OrgNode,
} from "@/components/sections/OrganizationChart";

describe("Section Components", () => {
  describe("HeroSection", () => {
    test("renders a serif h1 on the forest band", () => {
      const { container } = render(
        <HeroSection title="Layanan" subtitle="Deskripsi layanan." />,
      );
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading.textContent).toBe("Layanan");
      expect(heading.className).toContain("font-display");
      expect(container.innerHTML).toContain("bg-forest-950");
      expect(screen.getByText("Deskripsi layanan.")).toBeInTheDocument();
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

  describe("OrganizationChart", () => {
    const chart: OrgNode = {
      title: "Direktur Utama",
      children: [
        { title: "Divisi Legal", children: [{ title: "Legal Officer" }] },
      ],
    };

    test("renders divisions as hairline nodes without cards", () => {
      const { container } = render(<OrganizationChart data={chart} />);
      expect(container.innerHTML).not.toContain("rounded-2xl");
      expect(container.innerHTML).not.toContain("shadow");
      expect(container.innerHTML).not.toContain("dark:");
    });

    test("renders every node in the tree", () => {
      render(<OrganizationChart data={chart} />);
      expect(screen.getByText("Direktur Utama")).toBeInTheDocument();
      expect(screen.getByText("Divisi Legal")).toBeInTheDocument();
      expect(screen.getByText("Legal Officer")).toBeInTheDocument();
    });
  });
});
