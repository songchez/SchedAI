"use client";

import { useState, useEffect, useRef } from "react";
import { useChat } from "ai/react";
import { UIMessage } from "@ai-sdk/ui-utils";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { useDisclosure } from "@heroui/react";
import { PaymentModal } from "./PaymentModal";
import { AIModels } from "@/lib/chatApiHandlers/constants";
import { useChatInputStore } from "@/lib/store/ChatInputStore";
import { useChatStore } from "@/lib/store/ChatStore";
import { prisma } from "@/lib/prisma";
import { extractPlainToolResult } from "@/lib/chatApiHandlers/utils";

interface SchedAIChatbotProps {
  chatId?: string;
}

export default function SchedAIChatbot({ chatId }: SchedAIChatbotProps) {
  // 1) zustand에서 chatId에 해당하는 정보 가져오기
  const { chats, updateChat } = useChatStore();
  const currentChat = chats.find((chat) => chat.id === chatId);

  const [selectedModel, setSelectedModel] = useState<AIModels>(
    currentChat?.aiModel
  );
  const [preloadedMessages, setPreloadedMessages] = useState<UIMessage[]>([]);
  const [isPreloading, setIsPreloading] = useState<boolean>(true);
  // 2) 결제 모달/Disclosure 관련 state
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // 3) ChatInputStore (바깥에서 입력된 메시지가 저장됨)
  const storedChatInput = useChatInputStore((state) => state.value);
  const { clearInput } = useChatInputStore();

  // 4) form ref
  const formRef = useRef<HTMLFormElement>(null);
  //   동일 메시지 중복 제출 방지 ref
  const lastSubmittedUserMessage = useRef<string>("");

  // 5) ai-sdk/react에서 제공하는 useChat
  const {
    messages,
    addToolResult,
    input,
    handleInputChange,
    handleSubmit,
    stop,
    isLoading,
  } = useChat({
    initialMessages: preloadedMessages,
    // 엔드포인트와 추가 body
    api: "/api/chat/stream",
    body: {
      chatId,
      model: selectedModel,
    },
    onResponse: async (response) => {
      // 서버 응답 후 처리 (예: 결제 에러)
      if (chatId && currentChat?.aiModel !== selectedModel) {
        await updateChat(chatId, { aiModel: selectedModel });
      }
      if (response.status === 402) {
        onOpen();
      }
    },
  });

  // 6) ChatInputStore를 통한 외부 입력 -> 자동 제출 로직
  useEffect(() => {
    if (
      storedChatInput &&
      storedChatInput !== lastSubmittedUserMessage.current
    ) {
      lastSubmittedUserMessage.current = storedChatInput;

      // 타입 단언으로 이벤트 객체 형식을 맞춰준다
      handleInputChange({
        target: { value: storedChatInput },
      } as React.ChangeEvent<HTMLInputElement>);

      setTimeout(() => {
        if (formRef.current) {
          formRef.current.dispatchEvent(
            new Event("submit", { bubbles: true, cancelable: true })
          );
        }
      }, 0);

      clearInput();
    }
  }, [storedChatInput, handleInputChange, clearInput]);

  // 7) 기존 메시지(서버에서 불러오기) 관리

  useEffect(() => {
    if (chatId) {
      fetch(`/api/chat/stream?chatId=${chatId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch preloaded messages");
          }
          return res.json();
        })
        .then((data: UIMessage[]) => {
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

  // 최종 표시할 메시지: uniqueMessages (이미 setMessages로 반영됨)
  // ChatMessageList에 isLoading과 함께 넘김
  return (
    <div className="flex flex-col justify-end w-full max-w-3xl mx-auto rounded-lg px-2">
      <PaymentModal isOpen={isOpen} onOpenChange={onOpenChange} />

      <ScrollShadow hideScrollBar className="h-[65vh]">
        {isPreloading ? (
          <div className="p-4 text-center animate-pulse">
            메시지 불러오는 중...
          </div>
        ) : (
          <ChatMessageList
            messages={messages}
            isLoading={isLoading}
            addToolResult={addToolResult}
          />
        )}
      </ScrollShadow>

      <div className="isolate flex flex-col">
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
      </div>
    </div>
  );
}
