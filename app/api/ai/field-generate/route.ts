import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { findFieldOverride, getAiSettings } from "@/lib/ai/aiSettings";
import { generateTextWithRetry, parseJsonResponse } from "@/lib/ai/gemini";
import { z } from "zod";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

// Cap field name/document-type length, and the user-instruction length,
// to prevent prompt-bloat DoS / cost amplification.
const fieldGenerateSchema = z.object({
  documentType: z.string().min(1).max(100),
  fieldName: z.string().min(1).max(100),
  fieldType: z.string().min(1).max(50),
  arrayItemType: z.string().max(50).optional(),
  currentValue: z.unknown().optional(),
  document: z.record(z.string(), z.unknown()).nullable().optional(),
  instruction: z.string().max(1000, "Instruction is too long (max 1000 chars)").optional(),
  mode: z.enum(["generate", "improve"]).optional(),
});

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
    console.error("GOOGLE_API_KEY is not configured");
    return NextResponse.json(
      { error: "AI service is not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json().catch(() => null);
    const parsed = fieldGenerateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request body" },
        { status: 400 }
      );
    }
    const {
      documentType,
      fieldName,
      fieldType,
      arrayItemType,
      currentValue,
      document,
      instruction,
      mode = "generate",
    } = parsed.data;

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
    return NextResponse.json(
      { error: "Failed to generate field. Please try again later." },
      { status: 500 }
    );
  }
}
