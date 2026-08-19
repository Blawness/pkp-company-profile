import { expect, test, describe } from "bun:test";
import { render, screen } from "./test-utils";
import React from "react";
import {
  PortfolioCard,
  type PortfolioCardData,
} from "@/app/components/sections/PortfolioCard";

const portfolio: PortfolioCardData = {
  id: 1,
  title: "Sertifikasi Lahan Menteng",
  slug: "sertifikasi-lahan-menteng",
  excerpt: "Pendampingan pendaftaran pertama kali.",
  coverImageUrl: null,
  year: "2024",
  tags: ["sertifikat"],
};

describe("PortfolioCard", () => {
  test("renders as a hairline record without card chrome", () => {
    const { container } = render(<PortfolioCard portfolio={portfolio} />);
    expect(container.innerHTML).not.toContain("rounded-2xl");
    expect(container.innerHTML).not.toContain("shadow");
    expect(container.innerHTML).not.toContain("dark:");
  });

  test("links to the portfolio detail page", () => {
    render(<PortfolioCard portfolio={portfolio} />);
    expect(screen.getByRole("link").getAttribute("href")).toBe(
      "/portofolio/sertifikasi-lahan-menteng",
    );
  });

  test("renders title, excerpt, and year", () => {
    render(<PortfolioCard portfolio={portfolio} />);
    expect(screen.getByText("Sertifikasi Lahan Menteng")).toBeInTheDocument();
    expect(
      screen.getByText("Pendampingan pendaftaran pertama kali."),
    ).toBeInTheDocument();
    expect(screen.getByText("2024")).toBeInTheDocument();
  });
});
