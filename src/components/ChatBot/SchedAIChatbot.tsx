"use client";

import { useState } from "react";
import ChatMessageList from "./Ui/ChatMessageList";
import ChatInput from "./Ui/ChatInput";
import { useChat } from "ai/react";
import { SessionProvider } from "next-auth/react";

export default function SchedAIChatbot() {
  const [selectedModel, setSelectedModel] = useState<AIModels>(
    "gemini-2.0-flash-exp"
  );

  const { messages, input, handleInputChange, handleSubmit, stop, isLoading } =
    useChat({
      body: {
        model: selectedModel,
      },
    });

  return (
    <div className="flex flex-col justify-end w-full max-w-4xl mx-auto p-4 rounded-lg">
      <ChatMessageList messages={messages} />

      <div className="sticky bottom-14 flex flex-col">
        {messages.length === 0 && (
          <p className="flex justify-center text-2xl">
            어떤 일정이 있으신가요?
          </p>
        )}
        <SessionProvider>
          <ChatInput
            input={input}
            selectedModel={selectedModel}
            onInputChange={handleInputChange}
            onModelChange={setSelectedModel}
            onSubmit={handleSubmit}
            stop={stop}
            isLoading={isLoading}
          />
        </SessionProvider>
      </div>
    </div>
  );
}
