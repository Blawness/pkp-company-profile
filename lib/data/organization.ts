export type OrgNode = {
  title: string;
  name?: string;
  children?: OrgNode[];
};

// Organization structure for non-localized pages
export const organization: OrgNode = {
  title: "Direktur Utama",
  children: [
    {
      title: "Divisi Legal & Kepatuhan",
      children: [
        { title: "Legal Officer" },
        { title: "Dokumentasi & Administrasi" },
      ],
    },
    {
      title: "Divisi Sertifikasi & Perizinan",
      children: [
        { title: "Pengurusan Sertifikat" },
        { title: "Perizinan KKPR/LSD" },
      ],
    },
    {
      title: "Divisi Pengukuran & Survei",
      children: [
        { title: "Surveyor" },
        { title: "Teknisi Pengukuran" },
      ],
    },
  ],
};
