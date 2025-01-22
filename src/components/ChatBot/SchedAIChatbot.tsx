"use client";

import { useState } from "react";
import ChatMessageList from "./Ui/ChatMessageList";
import ChatInput from "./Ui/ChatInput";
import RequestCard from "./Ui/RequestCard";
import { useChat } from "ai/react";

export default function SchedAIChatbot() {
  const [responseChatData, setResponseChatData] = useState();
  const [isGoogleApiLoading, setIsGoogleApiLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModels>(
    "gemini-2.0-flash-exp"
  );

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    stop,
    isLoading,
    addToolResult,
  } = useChat({
    body: {
      model: selectedModel,
    },
    // run client-side tools that are automatically executed:
    async onToolCall({ toolCall }) {
      if (toolCall.toolName === "getCalendarList") {
      }
    },
  });

  return (
    <div className="flex flex-col justify-end w-full max-w-4xl mx-auto p-4 rounded-lg">
      <ChatMessageList messages={messages} addToolResult={addToolResult} />

      <div className="sticky bottom-14 flex flex-col">
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
