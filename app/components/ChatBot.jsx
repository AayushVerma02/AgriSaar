"use client";

import { useState } from "react";
import { generateResponse } from "../actions/generate";

export default function ChatBox() {
  const [messages, setMessages] = useState([]); // Stores chat history
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!prompt.trim()) return;

    const userMessage = { role: "user", text: prompt };
    setMessages((prev) => [...prev, userMessage]); // Add user message

    setLoading(true);
    const botResponse = await generateResponse(prompt);
    setMessages((prev) => [...prev, userMessage, { role: "bot", text: botResponse }]); // Add bot response
    setPrompt(""); // Clear input
    setLoading(false);
  }

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto p-4 border rounded-md shadow-md">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 p-2">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`p-3 rounded-lg max-w-xs ${
                msg.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Box at Bottom */}
      <form onSubmit={handleSubmit} className="flex items-center space-x-2 p-2 border-t">
        <textarea
          className="flex-1 p-2 border rounded-md resize-none"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type a message..."
          rows={1}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}