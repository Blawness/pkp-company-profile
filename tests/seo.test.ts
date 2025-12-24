import { expect, test, describe } from "bun:test";
import {
  buildOrganizationSchema,
  buildProfessionalServiceSchema,
} from "@/lib/seo/schema";

const siteUrl = "https://example.com";
const data = {
  name: "Test Company",
  description: "Test Description",
  email: "test@example.com",
  phone: "+62 123 456 789",
  address: "Test Address",
  mapsUrl: "https://maps.google.com/test",
};

describe("SEO Schema Utilities", () => {
  test("buildOrganizationSchema returns correct structure", () => {
    const schema = buildOrganizationSchema(siteUrl, data);
    expect(schema["@type"]).toBe("Organization");
    expect(schema.name).toBe(data.name);
    expect(schema.url).toBe(siteUrl);
    expect(schema.contactPoint).toBeArray();
    expect(schema.address).toEqual({
      "@type": "PostalAddress",
      streetAddress: data.address,
      addressCountry: "ID",
    });
  });

  test("buildProfessionalServiceSchema returns correct structure", () => {
    const schema = buildProfessionalServiceSchema(siteUrl, data);
    expect(schema["@type"]).toContain("ProfessionalService");
    expect(schema.name).toBe(data.name);
    expect(schema.telephone).toBe(data.phone);
    expect(schema.hasMap).toBe(data.mapsUrl);
  });
});
