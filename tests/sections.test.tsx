import { expect, test, describe } from "bun:test";
import { render, screen } from "./test-utils";
import React from "react";
import { ServiceCard } from "@/components/sections/ServiceCard";
import { HeroSection } from "@/components/sections/HeroSection";

describe("Section Components", () => {
  describe("ServiceCard", () => {
    test("renders service card with title and link", () => {
      const service = {
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
});
