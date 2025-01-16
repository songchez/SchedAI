"use client";

import React, { useState } from "react";
import MessageBubble from "@/components/Chat/MessageBubble";
import { Button, Input } from "@nextui-org/react";
import GlassContainer from "../GlassContainer";

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    { content: "Hello! How can I assist you?", isUser: false },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    const userMessage = { content: input, isUser: true };
    setMessages((prev) => [...prev, userMessage]);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await response.json();
    const botMessage = { content: data.gptResponse, isUser: false };

    setMessages((prev) => [...prev, botMessage]);
    setInput("");
  };

  return (
    <GlassContainer className="flex flex-col gap-4 p-4 w-full max-w-4xl">
      <div className="flex flex-col gap-2 overflow-y-auto max-h-96">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} content={msg.content} isUser={msg.isUser} />
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <Button onPress={sendMessage}>Send</Button>
      </div>
    </GlassContainer>
  );
}
