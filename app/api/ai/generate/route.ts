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
8
    const systemPrompt = `
      Anda adalah asisten penulis artikel profesional untuk profil perusahaan PKP (Prasasti Kusuma Pelangi).
      Buatlah artikel dalam Bahasa Indonesia berdasarkan topik yang diberikan.
      
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

    const result = await model.generateContent([systemPrompt, `Topik: ${prompt}`]);
    const response = await result.response;
    let text = response.text();

    // Clean up markdown code blocks if Gemini returns them
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const data = JSON.parse(text);

    // Fetch a relevant image from Pexels if imagePrompt is present
    let imageUrl = undefined;
    if (data.imagePrompt) {
      imageUrl = await getHeroImageUrl(data.imagePrompt);
    }

    return NextResponse.json({ ...data, imageUrl });
  } catch (error: unknown) {
    console.error("AI Generation Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Failed to generate content: " + errorMessage },
      { status: 500 }
    );
  }
}
