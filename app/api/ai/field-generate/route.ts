import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { findFieldOverride, getAiSettings } from "@/lib/ai/aiSettings";
import { generateTextWithRetry, parseJsonResponse } from "@/lib/ai/gemini";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

type FieldGeneratePayload = {
  documentType?: string;
  fieldName?: string;
  fieldType?: string;
  arrayItemType?: string;
  currentValue?: unknown;
  document?: Record<string, unknown> | null;
  instruction?: string;
  mode?: "generate" | "improve";
};

const serializeValue = (value: unknown) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

const fieldTypeHint = (fieldType?: string, arrayItemType?: string) => {
  if (fieldType === "blockContent") {
    return "Return a Sanity Portable Text array (no _key fields).";
  }
  if (fieldType === "slug") {
    return "Return a slug string (lowercase, dash-separated, no spaces).";
  }
  if (fieldType === "array" && arrayItemType === "string") {
    return "Return an array of strings.";
  }
  return "Return a plain string.";
};

export async function POST(req: Request) {
  if (!process.env.GOOGLE_API_KEY) {
    return NextResponse.json(
      { error: "GOOGLE_API_KEY is not configured" },
      { status: 500 }
    );
  }

  try {
    const payload = (await req.json()) as FieldGeneratePayload;
    const {
      documentType,
      fieldName,
      fieldType,
      arrayItemType,
      currentValue,
      document,
      instruction,
      mode = "generate",
    } = payload;

    if (!documentType || !fieldName || !fieldType) {
      return NextResponse.json(
        { error: "documentType, fieldName, and fieldType are required" },
        { status: 400 }
      );
    }

    const settings = await getAiSettings();
    if (!settings.enabled) {
      return NextResponse.json({ error: "AI is disabled in settings" }, { status: 403 });
    }

    const override = findFieldOverride(settings, documentType, fieldName);
    if (override && override.enabled === false) {
      return NextResponse.json(
        { error: "AI is disabled for this field in settings" },
        { status: 403 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: settings.model,
      generationConfig: {
        temperature: settings.temperature,
        maxOutputTokens: settings.maxTokens,
        responseMimeType: "application/json",
      },
    });

    const language = settings.defaultLanguage === "en" ? "English" : "Bahasa Indonesia";
    const companyContext = settings.companyContext ? `\nCompany context:\n${settings.companyContext}` : "";
    const styleGuide = settings.styleGuide ? `\nStyle guide:\n${settings.styleGuide}` : "";
    const documentContext = document ? `\nDraft context (JSON):\n${serializeValue(document)}` : "";
    const fieldHint = fieldTypeHint(fieldType, arrayItemType);
    const overridePrompt = override?.promptTemplate ? `\nOverride prompt:\n${override.promptTemplate}` : "";
    const userInstruction = instruction ? `\nUser instruction:\n${instruction}` : "";

    const systemPrompt = `
You are an AI writing assistant for PT Presisi Konsulindo Prima (PKP).
Language: ${language}
Tone: ${settings.tone}
Task: ${mode === "improve" ? "Improve the existing field." : "Generate content for the field."}
Field: ${fieldName} (${fieldType})
${fieldHint}
${companyContext}
${styleGuide}
${overridePrompt}
${userInstruction}
${documentContext}

Current value:
${serializeValue(currentValue)}

Return valid JSON with the following shape:
{
  "value": <field output>
}
    `.trim();

    const text = await generateTextWithRetry(() => model.generateContent(systemPrompt));
    const data = parseJsonResponse<{ value?: unknown }>(text);

    if (data.value === undefined) {
      return NextResponse.json(
        { error: "AI response did not include a value" },
        { status: 500 }
      );
    }

    return NextResponse.json({ value: data.value });
  } catch (error: unknown) {
    console.error("AI Field Generation Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Failed to generate field: " + errorMessage },
      { status: 500 }
    );
  }
}
