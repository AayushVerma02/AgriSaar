"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateResponse(prompt) {
  if (!prompt) return "Prompt is required.";

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing GEMINI_API_KEY in environment variables");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 🌱 Farming-Specific Instructions
    const farmingInstruction = `You are an AI assistant specialized in farming and agriculture.
    Answer only questions related to farming, agriculture, soil health, fertilizers, pesticides, crop rotation, irrigation, and weather conditions affecting crops.
    If a question is not related to farming, politely refuse to answer.`;

    // ❌ Block Non-Farming Questions
    const farmingKeywords = ["crop", "soil", "fertilizer", "irrigation", "weather", "pesticide", "seeds", "farming", "agriculture"];
    const isFarmingRelated = farmingKeywords.some((keyword) => prompt.toLowerCase().includes(keyword));

    if (!isFarmingRelated) return "I can only assist with farming-related queries. Please ask about agriculture.";

    // ✅ Correct API Call Format
    const result = await model.generateContent([farmingInstruction + "\n\n" + prompt]);

    if (!result || !result.response) return "No response received from API.";

    return result.response.text() || "No meaningful response.";
  } catch (error) {
    console.error("Gemini API error:", error);
    return `Error: ${error.message}`;
  }
}