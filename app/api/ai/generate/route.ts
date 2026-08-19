import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getHeroImageUrl } from "@/lib/api/pexels";
import { getAiSettings } from "@/lib/ai/aiSettings";
import { generateTextWithRetry, parseJsonResponse } from "@/lib/ai/gemini";
import { z } from "zod";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

// Input schema: cap prompt length to prevent abuse / huge tokens,
// and limit context to a small JSON object.
const generateSchema = z.object({
  prompt: z
    .string()
    .min(1, "Prompt is required")
    .max(2000, "Prompt is too long (max 2000 chars)"),
  context: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(req: Request) {
  if (!process.env.GOOGLE_API_KEY) {
    console.error("GOOGLE_API_KEY is not configured");
    // Generic message — don't leak which env var is missing in production.
    return NextResponse.json(
      { error: "AI service is not configured" },
      { status: 500 }
    );
  }

  try {
    // Parse + validate body. Reject malformed / oversized payloads.
    const body = await req.json().catch(() => null);
    const parsed = generateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request body" },
        { status: 400 }
      );
    }
    const { prompt, context } = parsed.data;

    const settings = await getAiSettings();
    if (!settings.enabled) {
      return NextResponse.json({ error: "AI is disabled in settings" }, { status: 403 });
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
    const companyContext = settings.companyContext ? `\nContext perusahaan:\n${settings.companyContext}` : "";
    const styleGuide = settings.styleGuide ? `\nPanduan gaya:\n${settings.styleGuide}` : "";
    const draftContext = context ? `\nKonteks draft (JSON):\n${JSON.stringify(context, null, 2)}` : "";

    const systemPrompt = `
      Anda adalah asisten penulis artikel profesional untuk profil perusahaan PKP (Prasasti Kusuma Pelangi).
      Buatlah artikel dalam ${language} berdasarkan topik yang diberikan.
      Nada tulisan: ${settings.tone}.
      ${companyContext}
      ${styleGuide}
      ${draftContext}
      
      Respon harus dalam format JSON yang valid dengan struktur berikut:
      {
        "title": "Judul artikel yang menarik",
        "excerpt": "Ringkasan singkat artikel (1-2 kalimat)",
        "body": [
          {
            "_type": "block",
            "style": "normal",
            "children": [{ "_type": "span", "text": "Isi paragraf pertama..." }]
          },
          {
            "_type": "block",
            "style": "h2",
            "children": [{ "_type": "span", "text": "Sub-judul" }]
          }
        ],
        "imagePrompt": "A highly detailed English description for finding a relevant image (e.g., construction site, modern building, architectural design)"
      }

      Penting:
      1. Body harus mengikuti format Sanity Portable Text (array of blocks).
      2. Jangan sertakan properti _key, itu akan ditambahkan oleh Studio.
      3. Artikel harus profesional dan informatif.
    `;

    const text = await generateTextWithRetry(() =>
      model.generateContent([systemPrompt, `Topik: ${prompt}`])
    );
    const data = parseJsonResponse<Record<string, unknown>>(text);

    // Fetch a relevant image from Pexels if imagePrompt is present
    let imageUrl = undefined;
    if (data.imagePrompt && settings.imageSearchEnabled !== false) {
      imageUrl = await getHeroImageUrl(String(data.imagePrompt));
    }

    return NextResponse.json({ ...data, imageUrl });
  } catch (error: unknown) {
    // Log full error server-side, but never echo internal details back to the client.
    console.error("AI Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate content. Please try again later." },
      { status: 500 }
    );
  }
}
