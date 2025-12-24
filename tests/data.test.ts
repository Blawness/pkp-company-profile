import { expect, test, describe } from "bun:test";
import { company } from "@/lib/data/company";
import { organization } from "@/lib/data/organization";
import { services } from "@/lib/data/services";

describe("Static Data", () => {
  test("company data has correct contact info", () => {
    expect(company.contact.email).toBeDefined();
    expect(company.contact.phone).toBeDefined();
    expect(company.contact.address).toBeDefined();
    expect(company.contact.mapsUrl).toMatch(/^https:\/\//);
  });

  test("organization data has recursive structure", () => {
    expect(organization.children).toBeArray();
    if (organization.children && organization.children[0]) {
      expect(organization.children[0].children).toBeArray();
    }
  });

  test("services data has expected service IDs", () => {
    expect(services).toBeArray();
    expect(services.length).toBeGreaterThan(0);
    const ids = services.map((s) => s.id);
    expect(ids).toContain("konsultasi-hukum-pertanahan");
    expect(ids).toContain("pengurusan-sertifikat-tanah");
    expect(ids).toContain("pengukuran-lahan");
  });
});
