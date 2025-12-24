export type ServiceSection = {
  id: string; // Used as key for translation
};

export type MainService = {
  id:
    | "konsultasi-hukum-pertanahan"
    | "pengurusan-sertifikat-tanah"
    | "pengukuran-lahan";
  imageQuery: string;
  sectionIds: string[];
};

export const services: MainService[] = [
  {
    id: "konsultasi-hukum-pertanahan",
    imageQuery: "lawyer desk documents",
    sectionIds: ["faq", "legal-study"],
  },
  {
    id: "pengurusan-sertifikat-tanah",
    imageQuery: "land certificate map",
    sectionIds: ["first-time", "rights", "transfer", "split-merge", "lsd"],
  },
  {
    id: "pengukuran-lahan",
    imageQuery: "land surveyor measurement",
    sectionIds: ["scope", "docs"],
  },
] as const;
