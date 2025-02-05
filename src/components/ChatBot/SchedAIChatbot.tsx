"use client";

import { useState, useEffect } from "react";
import ChatMessageList from "./Ui/ChatMessageList";
import ChatInput from "./Ui/ChatInput";
import { useChat } from "ai/react";
import { SessionProvider } from "next-auth/react";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { useDisclosure } from "@heroui/react";
import { PaymentModal } from "./Ui/PaymentModal";
import { RecommendationList } from "./Ui/RecommendationList";
import { AIModels } from "@/lib/chatApiHandlers/constants";

// AIModels 타입은 프로젝트에 맞게 선언되어 있어야 합니다.
export default function SchedAIChatbot() {
  const [selectedModel, setSelectedModel] =
    useState<AIModels>("gemini-1.5-flash");
  const [recommendations, setRecommendations] = useState<string[]>([]);

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

  useEffect(() => {
    // 대화 시작 전 보여줄 추천 문구 (랜덤 3개 선택)
    const allRecommendations = [
      `"📆이번 주 스케줄 브리핑해줘"`,
      `"🌈오늘 하루를 계획해줘"`,
      `"🧐이번 주 스케줄 보여줘"`,
      `"🚗주말에 갈 만한 여행지를 추천해줘."`,
      `"🏃🏻‍♀️운동 일정을 추가해줘."`,
      `"💁🏻나한테 어떤 도움을 줄 수 있어?"`,
      `"💍기념일을 추가하려고 해"`,
      `"👍저번달 스케줄을 분석해줘"`,
      `"👔미팅일정을 잡으려하는데, 언제가 좋을까?"`,
    ];

    const randomItems = allRecommendations
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    setRecommendations(randomItems);
  }, []);

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
      <div className="sticky bottom-14 flex flex-col">
        {messages.length === 0 && (
          <RecommendationList
            recommendations={recommendations}
            onSelect={handleRecommendationSelect}
          />
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
