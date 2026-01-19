import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getAiSettings } from "@/lib/ai/aiSettings";
import { generateTextWithRetry, parseJsonResponse } from "@/lib/ai/gemini";
import { getSanityClient } from "@/lib/sanity/client";
import { z } from "zod";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

const planIdeasSchema = z.object({
  count: z.number().min(1).max(10).optional(),
  seed: z.string().max(500, "Seed idea is too long").optional(),
});

const normalizeTitle = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

export async function POST(req: Request) {
  if (!process.env.GOOGLE_API_KEY) {
    return NextResponse.json(
      { error: "GOOGLE_API_KEY is not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const result = planIdeasSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { count = 6, seed } = result.data;

    const settings = await getAiSettings();
    if (!settings.enabled) {
      return NextResponse.json({ error: "AI is disabled in settings" }, { status: 403 });
    }

    const client = getSanityClient(true);
    const published = await client.fetch(
      `*[_type == "post" && !(_id in path("drafts.**"))]{title}`
    );
    const drafts = await client.fetch(
      `*[_type == "post" && _id in path("drafts.**")]{title}`
    );

    const existingTitles = [...published, ...drafts]
      .map((item) => item?.title)
      .filter((title): title is string => typeof title === "string");

    const existingNormalized = new Set(existingTitles.map(normalizeTitle));

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
    const seedPrompt = seed ? `\nSeed idea:\n${seed}` : "";
    const existingList = existingTitles.length
      ? `\nExisting titles (avoid these topics):\n- ${existingTitles.join("\n- ")}`
      : "";

    const systemPrompt = `
You are a content strategist for PT Presisi Konsulindo Prima (PKP).
Language: ${language}
Tone: ${settings.tone}
Task: propose ${count} unique article ideas that have not been published or drafted yet.
${companyContext}
${styleGuide}
${seedPrompt}
${existingList}

Return valid JSON with shape:
{
  "ideas": [
    {"title": "...", "angle": "..."}
  ]
}
    `.trim();

    const text = await generateTextWithRetry(() => model.generateContent(systemPrompt));
    const data = parseJsonResponse<{
      ideas?: Array<{ title?: string; angle?: string }>
    }>(text);

    const ideas =
      data.ideas?.filter((idea) => typeof idea.title === "string") ?? [];

    const uniqueIdeas = ideas.filter((idea) => {
      const normalized = normalizeTitle(idea.title as string);
      return normalized && !existingNormalized.has(normalized);
    });

    return NextResponse.json({ ideas: uniqueIdeas.slice(0, count) });
  } catch (error: unknown) {
    console.error("AI Plan Ideas Error:", error);
    // Secure error handling
    return NextResponse.json(
      { error: "Failed to plan ideas. Please try again later." },
      { status: 500 }
    );
  }
}
