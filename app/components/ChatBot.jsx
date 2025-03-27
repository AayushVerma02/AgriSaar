"use client";

import { useState } from "react";
import { generateResponse } from "../actions/generate";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!prompt.trim()) return;

    const userMessage = { role: "user", text: prompt };
    setMessages((prev) => [...prev, userMessage]); // ✅ Add user message once

    setLoading(true);
    let botResponse = await generateResponse(prompt);

    // ✅ Format bot response into bullet points if applicable
    botResponse = botResponse
      .split("\n")
      .map((line) => (line.trim() ? `• ${line.trim()}` : ""))
      .join("\n");

    setMessages((prev) => [...prev, { role: "bot", text: botResponse }]); // ✅ Add only bot response
    setPrompt("");
    setLoading(false);
  }

  return (
    <div className="flex flex-col h-screen w-screen mx-auto p-4 rounded-md shadow-md">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 p-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`p-3 rounded-lg max-w-2xl ${
                msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-green-200 text-black"
              }`}
              style={{ whiteSpace: "pre-wrap" }} // ✅ Preserve text formatting
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Box at Bottom */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center space-x-2 p-2 border-t"
      >
        <textarea
          className="flex-1 max-h-[30vh] min-h-[5vh] border rounded-md resize-none p-0 pl-2 overflow-hidden leading-[5vh]"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask about farming..."
          rows={1}
          onInput={(e) => {
            e.target.style.height = "5vh"; // Reset height to min before calculating new height
            e.target.style.height = `${e.target.scrollHeight}px`; // Adjust height based on content
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}
