/**
 * AI settings loader. Reads the singleton `ai_settings` row from
 * Postgres.
 *
 * `getAiSettings()` is consumed by the four /api/ai/* routes.
 *
 * `fieldOverrides` is stored as a JSON-encoded array of:
 *   { documentType, fieldName, enabled, promptTemplate }
 */
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { aiSettings as aiSettingsTable } from "@/db/schema";

export type AiFieldOverride = {
  documentType?: string;
  fieldName?: string;
  enabled?: boolean;
  promptTemplate?: string;
};

export type AiSettings = {
  enabled: boolean;
  defaultLanguage: string;
  tone: string;
  model: string;
  temperature: number;
  maxTokens: number;
  companyContext?: string;
  styleGuide?: string;
  imageSearchEnabled?: boolean;
  fieldOverrides?: AiFieldOverride[];
};

const DEFAULT_SETTINGS: AiSettings = {
  enabled: true,
  defaultLanguage: "id",
  tone: "professional",
  model: "gemini-3-flash-preview",
  temperature: 0.7,
  maxTokens: 1024,
  companyContext: "",
  styleGuide: "",
  imageSearchEnabled: true,
  fieldOverrides: [],
};

const parseFieldOverrides = (
  rows: string[] | null | undefined,
): AiFieldOverride[] => {
  if (!rows || rows.length === 0) return [];
  const out: AiFieldOverride[] = [];
  for (const raw of rows) {
    try {
      const parsed = JSON.parse(raw) as Partial<AiFieldOverride>;
      out.push({
        documentType:
          typeof parsed.documentType === "string"
            ? parsed.documentType
            : undefined,
        fieldName:
          typeof parsed.fieldName === "string" ? parsed.fieldName : undefined,
        enabled:
          typeof parsed.enabled === "boolean" ? parsed.enabled : undefined,
        promptTemplate:
          typeof parsed.promptTemplate === "string"
            ? parsed.promptTemplate
            : undefined,
      });
    } catch {
      // Skip malformed entries silently.
    }
  }
  return out;
};

export async function getAiSettings(): Promise<AiSettings> {
  try {
    const rows = await db
      .select()
      .from(aiSettingsTable)
      .where(eq(aiSettingsTable.id, "singleton"))
      .limit(1);
    const row = rows[0];
    if (!row) return DEFAULT_SETTINGS;

    return {
      enabled: row.enabled === "true",
      defaultLanguage: row.defaultLanguage,
      tone: row.tone,
      model: row.model,
      temperature: parseFloat(row.temperature),
      maxTokens: parseInt(row.maxTokens, 10),
      companyContext: row.companyContext ?? "",
      styleGuide: row.styleGuide ?? "",
      imageSearchEnabled: row.imageSearchEnabled === "true",
      fieldOverrides: parseFieldOverrides(row.fieldOverrides),
    };
  } catch (error) {
    console.warn("Failed to load AI settings, using defaults.", error);
    return DEFAULT_SETTINGS;
  }
}

export function findFieldOverride(
  settings: AiSettings,
  documentType?: string,
  fieldName?: string,
) {
  if (!settings.fieldOverrides || !documentType || !fieldName) return undefined;
  return settings.fieldOverrides.find(
    (item) =>
      item?.documentType === documentType && item?.fieldName === fieldName,
  );
}
