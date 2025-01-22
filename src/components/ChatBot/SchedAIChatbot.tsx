"use client";

import { useState } from "react";
import ChatMessageList from "./Ui/ChatMessageList";
import ChatInput from "./Ui/ChatInput";
import { useChat } from "ai/react";

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
          <div className="flex justify-center text-2xl">
            어떤 계획이 있으신가요? 일정을 생성해보세요
          </div>
        )}

        <ChatInput
          input={input}
          selectedModel={selectedModel}
          onInputChange={handleInputChange}
          onModelChange={setSelectedModel}
          onSubmit={handleSubmit}
          stop={stop}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
