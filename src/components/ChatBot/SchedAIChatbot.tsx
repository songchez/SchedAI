// /src/components/ChatBot/SchedAIChatbot.tsx
"use client";

import { useState, useEffect } from "react";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";
import { useChat } from "ai/react";
import { SessionProvider } from "next-auth/react";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { useDisclosure } from "@heroui/react";
import { PaymentModal } from "./PaymentModal";
import { RecommendationList } from "./RecommendationList";
import { AIModels } from "@/lib/chatApiHandlers/constants";
import { useMessageStore } from "@/lib/store/MessageStore";

interface SchedAIChatbotProps {
  chatId?: string;
}

export default function SchedAIChatbot({ chatId }: SchedAIChatbotProps) {
  const [selectedModel, setSelectedModel] =
    useState<AIModels>("gemini-1.5-flash");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  // Zustand 스토어에서 저장된 메시지 읽기
  const storedMessages = useMessageStore((state) => state.messages);

  // useChat 훅으로 실시간 대화 메시지 관리 (새 메시지, 스트리밍 등)
  const {
    messages: liveMessages,
    input,
    handleInputChange,
    handleSubmit,
    stop,
    isLoading,
  } = useChat({
    body: { model: selectedModel, chatId },
    onResponse: (response) => {
      if (response.status === 402) {
        onOpen(); // 토큰 부족 => 결제 모달 열기
      }
    },
  });

  // 기존에 저장된 메시지를 API로 불러오기 위한 상태
  const [preloadedMessages, setPreloadedMessages] = useState([]);
  const [isPreloading, setIsPreloading] = useState<boolean>(true);

  useEffect(() => {
    // chatId가 있을 경우에만 기존 메시지 불러오기
    if (chatId) {
      fetch(`/api/chat?chatId=${chatId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch preloaded messages");
          }
          return res.json();
        })
        .then((data) => {
          setPreloadedMessages(data);
          setIsPreloading(false);
        })
        .catch((error) => {
          console.error("Error fetching preloaded messages:", error);
          setIsPreloading(false);
        });
    } else {
      setIsPreloading(false);
    }
  }, [chatId]);

  // 저장된 메시지가 있다면 우선 사용, 없으면 API로 불러온 메시지를 사용
  const baseMessages =
    storedMessages.length > 0 ? storedMessages : preloadedMessages;
  // 최종 메시지 배열: 기존 메시지와 실시간 메시지를 병합
  const finalMessages = [...baseMessages, ...liveMessages];

  // 추천 문구 클릭 시 처리
  const handleRecommendationSelect = (r: string) => {
    handleInputChange({
      target: { value: r },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="flex flex-col justify-end w-full max-w-3xl mx-auto rounded-lg">
      <PaymentModal isOpen={isOpen} onOpenChange={onOpenChange} />

      <ScrollShadow hideScrollBar className="h-[74vh]">
        {isPreloading ? (
          <div className="p-4 text-center animate-pulse">
            메시지 불러오는 중...
          </div>
        ) : (
          <ChatMessageList messages={finalMessages} isLoading={isLoading} />
        )}
      </ScrollShadow>

      <div className="sticky bottom-16 flex flex-col">
        {finalMessages.length === 0 && (
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
