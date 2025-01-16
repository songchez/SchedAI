"use client";

import React, { useState } from "react";
import MessageBubble from "./MessageBubble";
import { Input, Button, CircularProgress } from "@nextui-org/react";

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    { content: "Hello! How can I assist you?", isUser: false },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { content: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: input }],
        }),
      });

      const data = await response.json();
      const botMessage = { content: data.completion, isUser: false };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { content: "Something went wrong. Please try again.", isUser: false },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6 bg-white/10 backdrop-blur-lg rounded-lg shadow-lg w-full max-w-4xl">
      {/* 메시지 출력 */}
      <div className="flex flex-col gap-2 overflow-y-auto max-h-96">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} content={msg.content} isUser={msg.isUser} />
        ))}
      </div>

      {/* 입력 및 전송 버튼 */}
      <div className="flex gap-2">
        <Input
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <Button onPress={sendMessage} disabled={isLoading}>
          {isLoading ? <CircularProgress /> : "Send"}
        </Button>
      </div>
    </div>
  );
}
