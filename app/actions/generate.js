"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateResponse(prompt) {
  if (!prompt) return "Prompt is required.";

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Missing GEMINI_API_KEY in environment variables");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chatSession = model.startChat({
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      },
      history: [],
    });

    const result = await chatSession.sendMessage(prompt);

    if (!result.response) return "No response received from API.";

    return result.response.text() || "No meaningful response.";
  } catch (error) {
    console.error("Gemini API error:", error);
    return `Error: ${error.message}`;
  }
}