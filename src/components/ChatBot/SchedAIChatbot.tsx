"use client";

import { useState } from "react";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";
import { useChat } from "ai/react";
import { SessionProvider } from "next-auth/react";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { useDisclosure } from "@heroui/react";
import { PaymentModal } from "./PaymentModal";
import { RecommendationList } from "./RecommendationList";
import { AIModels } from "@/lib/chatApiHandlers/constants";

// AIModels 타입은 프로젝트에 맞게 선언되어 있어야 합니다.
export default function SchedAIChatbot() {
  const [selectedModel, setSelectedModel] =
    useState<AIModels>("gemini-1.5-flash");

  // heroUI의 useDisclosure 훅으로 모달 상태 관리
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { messages, input, handleInputChange, handleSubmit, stop, isLoading } =
    useChat({
      body: { model: selectedModel },
      onResponse: (response) => {
        if (response.status === 402) {
          onOpen();
        }
      },
    });

  // 추천 문구 클릭 시 input 변경 처리
  const handleRecommendationSelect = (recommendation: string) => {
    const simulatedEvent = {
      target: { value: recommendation },
    } as React.ChangeEvent<HTMLInputElement>;
    handleInputChange(simulatedEvent);
  };

  return (
    <div className="flex flex-col justify-end w-full max-w-3xl mx-auto p-4 rounded-lg">
      {/* 결제 모달 */}
      <PaymentModal isOpen={isOpen} onOpenChange={onOpenChange} />

      {/* 채팅 메시지 영역 */}
      <ScrollShadow hideScrollBar className="h-[82vh]">
        <ChatMessageList messages={messages} isLoading={isLoading} />
      </ScrollShadow>

      {/* 입력창 및 추천 문구 영역 */}
      <div className="sticky bottom-16 flex flex-col">
        {messages.length === 0 && (
          <RecommendationList onSelect={handleRecommendationSelect} />
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
