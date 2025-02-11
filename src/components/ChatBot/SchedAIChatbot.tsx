"use client";

import { useState, useEffect, useRef } from "react";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";
import { useChat } from "ai/react";
import { SessionProvider } from "next-auth/react";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { useDisclosure } from "@heroui/react";
import { PaymentModal } from "./PaymentModal";
import { RecommendationList } from "./RecommendationList";
import { AIModels } from "@/lib/chatApiHandlers/constants";
import { useChatInputStore } from "@/lib/store/ChatInputStore";

interface SchedAIChatbotProps {
  chatId?: string;
}

export default function SchedAIChatbot({ chatId }: SchedAIChatbotProps) {
  const [selectedModel, setSelectedModel] =
    useState<AIModels>("gemini-1.5-flash");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const storedChatInput = useChatInputStore((state) => state.value);

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

  // 동일 메시지에 대해 중복 제출을 막기 위한 ref

  const lastSubmittedUserMessage = useRef<string>("");

  const formRef = useRef<HTMLFormElement>(null);
  // storedMessages가 첫 메시지 일 때(챗시작) 응답요청하기
  useEffect(() => {
    if (
      storedChatInput &&
      storedChatInput !== lastSubmittedUserMessage.current
    ) {
      console.log("Zustand로 저장된 메시지", storedChatInput);
      // input에 마지막 메시지 내용을 넣기
      lastSubmittedUserMessage.current = storedChatInput;
      handleInputChange({
        target: { value: storedChatInput },
      } as React.ChangeEvent<HTMLInputElement>);
      // submit 실행
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.dispatchEvent(
            new Event("submit", { bubbles: true, cancelable: true })
          );
        }
      }, 0);
    }
  }, [storedChatInput, handleInputChange, handleSubmit]);
  const [preloadedMessages, setPreloadedMessages] = useState([]);
  const [isPreloading, setIsPreloading] = useState<boolean>(true);
  useEffect(() => {
    // [GET]: 기존 메시지들 가져오기
    if (chatId) {
      fetch(`/api/chat/stream?chatId=${chatId}`)
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
  const finalMessages = [...preloadedMessages, ...liveMessages];
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
          <form ref={formRef} onSubmit={handleSubmit}>
            <ChatInput
              input={input}
              selectedModel={selectedModel}
              onInputChange={handleInputChange}
              onModelChange={setSelectedModel}
              onSubmit={handleSubmit}
              stop={stop}
              isLoading={isLoading}
            />
          </form>
        </SessionProvider>
      </div>
    </div>
  );
}
