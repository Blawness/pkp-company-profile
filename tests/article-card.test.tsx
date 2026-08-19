import { expect, test, describe } from "bun:test";
import { render, screen } from "./test-utils";
import React from "react";
import {
  ArticleCard,
  type PostPreview,
} from "@/app/components/sections/ArticleCard";

const post: PostPreview = {
  _id: "1",
  title: "Syarat Pendaftaran Tanah Pertama Kali",
  slug: { current: "syarat-pendaftaran-tanah" },
  excerpt: "Dokumen yang perlu disiapkan sebelum mengajukan.",
  publishedAt: "2026-01-10",
};

describe("ArticleCard", () => {
  test("renders without card chrome", () => {
    const { container } = render(<ArticleCard post={post} />);
    expect(container.innerHTML).not.toContain("rounded-2xl");
    expect(container.innerHTML).not.toContain("rounded-lg");
    expect(container.innerHTML).not.toContain("shadow");
    expect(container.innerHTML).not.toContain("dark:");
  });

  test("links to the article using its slug", () => {
    render(<ArticleCard post={post} />);
    expect(screen.getByRole("link").getAttribute("href")).toBe(
      "/artikel/syarat-pendaftaran-tanah",
    );
  });

  test("featured variant renders a larger serif title", () => {
    const { container } = render(<ArticleCard post={post} featured />);
    expect(container.innerHTML).toContain("font-display");
    expect(container.innerHTML).toContain("text-3xl");
  });
});
