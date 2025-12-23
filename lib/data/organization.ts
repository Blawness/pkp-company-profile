export type OrgNode = {
  title: string;
  name?: string;
  children?: OrgNode[];
};

/**
 * Catatan: Nama dapat diisi/diupdate sesuai struktur organisasi resmi PT PKP.
 */
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
      title: "Divisi Layanan Klien",
      children: [{ title: "Customer Support" }, { title: "Quality Assurance" }],
    },
  ],
};
