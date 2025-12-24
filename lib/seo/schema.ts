type Schema = Record<string, unknown>;

function absoluteUrl(path: string, siteUrl: string) {
  return new URL(path, siteUrl).toString();
}

export function buildOrganizationSchema(
  siteUrl: string,
  data: {
    name: string;
    description: string;
    email: string;
    phone: string;
    address: string;
    mapsUrl: string;
  }
): Schema {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: data.name,
    url: siteUrl,
    logo: absoluteUrl("/logo.png", siteUrl),
    description: data.description,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: data.email,
        telephone: data.phone,
        areaServed: "ID",
        availableLanguage: ["id", "en"],
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: data.address,
      addressCountry: "ID",
    },
    sameAs: [data.mapsUrl],
  };
}

export function buildProfessionalServiceSchema(
  siteUrl: string,
  data: {
    name: string;
    description: string;
    phone: string;
    address: string;
    mapsUrl: string;
  }
): Schema {
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": `${siteUrl}/#professional-service`,
    name: data.name,
    url: siteUrl,
    image: absoluteUrl("/logo.png", siteUrl),
    description: data.description,
    telephone: data.phone,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: data.address,
      addressCountry: "ID",
    },
    openingHours: ["Mo-Fr 09:00-17:00"],
    hasMap: data.mapsUrl,
  };
}
