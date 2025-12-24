import { company } from "@/lib/data/company";

type Schema = Record<string, unknown>;

function absoluteUrl(path: string, siteUrl: string) {
  return new URL(path, siteUrl).toString();
}

export function buildOrganizationSchema(siteUrl: string): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: company.name,
    url: siteUrl,
    logo: absoluteUrl("/logo.png", siteUrl),
    description: company.description,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: company.contact.email,
        telephone: company.contact.phone,
        areaServed: "ID",
        availableLanguage: ["id"],
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: company.contact.address,
      addressCountry: "ID",
    },
    sameAs: [company.contact.mapsUrl],
  };
}

export function buildProfessionalServiceSchema(siteUrl: string): Schema {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": `${siteUrl}/#professional-service`,
    name: company.name,
    url: siteUrl,
    image: absoluteUrl("/logo.png", siteUrl),
    description: company.description,
    telephone: company.contact.phone,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: company.contact.address,
      addressCountry: "ID",
    },
    openingHours: ["Mo-Fr 09:00-17:00"],
    hasMap: company.contact.mapsUrl,
  };
}

