import { getSanityClient } from "@/lib/sanity/client";

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

export async function getAiSettings(): Promise<AiSettings> {
  try {
    const client = getSanityClient(true);
    const settings = await client.fetch(
      `*[_type == "aiSettings"][0]{
        enabled,
        defaultLanguage,
        tone,
        model,
        temperature,
        maxTokens,
        companyContext,
        styleGuide,
        imageSearchEnabled,
        fieldOverrides
      }`
    );

    if (!settings) return DEFAULT_SETTINGS;
    return {
      ...DEFAULT_SETTINGS,
      ...settings,
      fieldOverrides: Array.isArray(settings.fieldOverrides) ? settings.fieldOverrides : [],
    };
  } catch (error) {
    console.warn("Failed to load AI settings, using defaults.", error);
    return DEFAULT_SETTINGS;
  }
}

export function findFieldOverride(
  settings: AiSettings,
  documentType?: string,
  fieldName?: string
) {
  if (!settings.fieldOverrides || !documentType || !fieldName) return undefined;
  return settings.fieldOverrides.find(
    (item) => item?.documentType === documentType && item?.fieldName === fieldName
  );
}
