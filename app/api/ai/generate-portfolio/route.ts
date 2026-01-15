import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getHeroImageUrl } from "@/lib/api/pexels";
import { getAiSettings } from "@/lib/ai/aiSettings";
import { generateTextWithRetry, parseJsonResponse } from "@/lib/ai/gemini";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: Request) {
  if (!process.env.GOOGLE_API_KEY) {
    return NextResponse.json(
      { error: "GOOGLE_API_KEY is not configured" },
      { status: 500 }
    );
  }

  try {
    const { prompt, context } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

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
      Anda adalah asisten konten portofolio profesional untuk profil perusahaan PKP (Prasasti Kusuma Pelangi).
      Buatlah portofolio proyek dalam ${language} berdasarkan brief yang diberikan.
      Nada tulisan: ${settings.tone}.
      ${companyContext}
      ${styleGuide}
      ${draftContext}

      Respon harus dalam format JSON yang valid dengan struktur berikut:
      {
        "title": "Judul proyek yang jelas",
        "excerpt": "Ringkasan singkat proyek (1-2 kalimat)",
        "client": "Nama klien atau instansi",
        "location": "Lokasi proyek",
        "year": "Tahun proyek (string, contoh: 2024)",
        "tags": ["tag1", "tag2", "tag3"],
        "body": [
          {
            "_type": "block",
            "style": "normal",
            "children": [{ "_type": "span", "text": "Deskripsi paragraf pertama..." }]
          },
          {
            "_type": "block",
            "style": "h2",
            "children": [{ "_type": "span", "text": "Ruang Lingkup" }]
          }
        ],
        "imagePrompt": "A highly detailed English description for finding a relevant project image"
      }

      Penting:
      1. Body harus mengikuti format Sanity Portable Text (array of blocks).
      2. Jangan sertakan properti _key, itu akan ditambahkan oleh Studio.
      3. Tulis profesional dan relevan dengan layanan konsultasi pertanahan.
    `;

    const text = await generateTextWithRetry(() =>
      model.generateContent([systemPrompt, `Brief: ${prompt}`])
    );
    const data = parseJsonResponse<Record<string, unknown>>(text);

    if (typeof data.tags === "string") {
      data.tags = data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
    }

    // Fetch a relevant image from Pexels if imagePrompt is present
    let imageUrl = undefined;
    if (data.imagePrompt && settings.imageSearchEnabled !== false) {
      imageUrl = await getHeroImageUrl(String(data.imagePrompt));
    }

    return NextResponse.json({ ...data, imageUrl });
  } catch (error: unknown) {
    console.error("AI Portfolio Generation Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Failed to generate content: " + errorMessage },
      { status: 500 }
    );
  }
}
