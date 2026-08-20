export type StatItem = { value: string; label: string };
export type LegalEntity = { label: string; value: string };

export type Credentials = {
  /** Set ke true hanya setelah tim legal mengonfirmasi angka di bawah. */
  enabled: boolean;
  foundedYear: number | null;
  legalEntities: LegalEntity[];
  stats: StatItem[];
};

export const credentials: Credentials = {
  enabled: false,
  foundedYear: null,
  legalEntities: [],
  stats: [],
};
