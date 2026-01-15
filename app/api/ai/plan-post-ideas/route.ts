import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getAiSettings } from "@/lib/ai/aiSettings";
import { getSanityClient } from "@/lib/sanity/client";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

type PlanIdeasPayload = {
  count?: number;
  seed?: string;
};

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
    const { count = 6, seed } = (await req.json()) as PlanIdeasPayload;
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

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(text) as { ideas?: Array<{ title?: string; angle?: string }> };

    const ideas =
      data.ideas?.filter((idea) => typeof idea.title === "string") ?? [];

    const uniqueIdeas = ideas.filter((idea) => {
      const normalized = normalizeTitle(idea.title as string);
      return normalized && !existingNormalized.has(normalized);
    });

    return NextResponse.json({ ideas: uniqueIdeas.slice(0, count) });
  } catch (error: unknown) {
    console.error("AI Plan Ideas Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: "Failed to plan ideas: " + errorMessage },
      { status: 500 }
    );
  }
}
