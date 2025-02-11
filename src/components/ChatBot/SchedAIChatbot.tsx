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
  const storedMessages = useMessageStore((state) => state.messages);

  // AI 스트리밍 요청 (채팅 시작)
  const {
    messages: liveMessages,
    input,
    handleInputChange,
    handleSubmit,
    stop,
    isLoading,
  } = useChat({
    api: "/api/chat/stream",
    body: {
      chatId,
      model: selectedModel,
    },
    onResponse: (response) => {
      if (response.status === 402) {
        onOpen();
      }
    },
  });

  const [preloadedMessages, setPreloadedMessages] = useState([]);
  const [isPreloading, setIsPreloading] = useState<boolean>(true);

  useEffect(() => {
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

          // ✅ 사용자의 첫 번째 메시지(role: "user")가 있을 경우 AI 응답 요청
          const hasUserMessage = data.some(
            (msg: { role: string }) => msg.role === "user"
          );
          if (hasUserMessage) {
            handleSubmit();
          }
        })
        .catch((error) => {
          console.error("Error fetching preloaded messages:", error);
          setIsPreloading(false);
        });
    } else {
      setIsPreloading(false);
    }
  }, [chatId]);

  const baseMessages =
    storedMessages.length > 0 ? storedMessages : preloadedMessages;
  const finalMessages = [...baseMessages, ...liveMessages];

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
