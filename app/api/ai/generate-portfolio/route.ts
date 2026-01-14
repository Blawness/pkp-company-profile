import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getHeroImageUrl } from "@/lib/api/pexels";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: Request) {
  if (!process.env.GOOGLE_API_KEY) {
    return NextResponse.json(
      { error: "GOOGLE_API_KEY is not configured" },
      { status: 500 }
    );
  }

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const systemPrompt = `
      Anda adalah asisten konten portofolio profesional untuk profil perusahaan PKP (Prasasti Kusuma Pelangi).
      Buatlah portofolio proyek dalam Bahasa Indonesia berdasarkan brief yang diberikan.

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

    const result = await model.generateContent([systemPrompt, `Brief: ${prompt}`]);
    const response = await result.response;
    let text = response.text();

    // Clean up markdown code blocks if Gemini returns them
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const data = JSON.parse(text) as Record<string, unknown>;

    if (typeof data.tags === "string") {
      data.tags = data.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
    }

    // Fetch a relevant image from Pexels if imagePrompt is present
    let imageUrl = undefined;
    if (data.imagePrompt) {
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
