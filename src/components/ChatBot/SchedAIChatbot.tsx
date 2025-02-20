"use client";

import { useState, useEffect, useRef } from "react";
import ChatMessageList from "./ChatMessageList";
import ChatInput from "./ChatInput";
import { Message, useChat } from "ai/react";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { useDisclosure } from "@heroui/react";
import { PaymentModal } from "./PaymentModal";
import { AIModels } from "@/lib/chatApiHandlers/constants";
import { useChatInputStore } from "@/lib/store/ChatInputStore";
import { useChatStore } from "@/lib/store/ChatStore";

interface SchedAIChatbotProps {
  chatId?: string;
}

export default function SchedAIChatbot({ chatId }: SchedAIChatbotProps) {
  // zustand의 Chats를 가져와서 chatId로 find -> selectedModel의 기본값으로 할당
  const { chats, updateChat } = useChatStore();
  const currentChat = chats.find((chat) => chat.id === chatId);
  const [selectedModel, setSelectedModel] = useState<AIModels>(
    currentChat?.aiModel
  );

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const storedChatInput = useChatInputStore((state) => state.value);
  const { clearInput } = useChatInputStore();

  // AI 스트리밍 요청 (채팅 시작)
  const {
    messages: liveMessages,
    input,
    setMessages,
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
    onResponse: async (response) => {
      if (chatId && currentChat?.aiModel !== selectedModel) {
        await updateChat(chatId, { aiModel: selectedModel });
      }
      if (response.status === 402) {
        onOpen();
      }
    },
  });

  // 동일 메시지 중복 제출 방지용 ref
  const lastSubmittedUserMessage = useRef<string>("");

  // 폼 엘리먼트를 참조하기 위한 ref
  const formRef = useRef<HTMLFormElement>(null);

  // storedChatInput이 변경되면 input 업데이트 후 폼 submit 이벤트 발생
  useEffect(() => {
    if (
      storedChatInput &&
      storedChatInput !== lastSubmittedUserMessage.current
    ) {
      console.log("Store에 저장된 메시지", storedChatInput);
      lastSubmittedUserMessage.current = storedChatInput;
      handleInputChange({
        target: { value: storedChatInput },
      } as React.ChangeEvent<HTMLInputElement>);
      // 상태 업데이트 후 폼 제출 (submit 이벤트 발생)
      setTimeout(() => {
        if (formRef.current) {
          formRef.current.dispatchEvent(
            new Event("submit", { bubbles: true, cancelable: true })
          );
        }
      }, 0);
      // 사용한 Input String 삭제
      clearInput();
    }
  }, [storedChatInput, handleInputChange, clearInput]);

  // 기존 메시지들 (preloadedMessages)를 불러오기
  const [preloadedMessages, setPreloadedMessages] = useState<Message[]>([]);
  const [isPreloading, setIsPreloading] = useState<boolean>(true);

  useEffect(() => {
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

  // preloadedMessages와 liveMessages를 합쳐서 중복 제거한 후, store 업데이트 (한번만 실행)
  useEffect(() => {
    const mergedMessages = [...preloadedMessages, ...liveMessages];
    // 중복 제거: 메시지 id를 기준으로 Map에 넣어 고유 메시지만 추출
    const uniqueMessages = Array.from(
      new Map(mergedMessages.map((msg) => [msg.id, msg])).values()
    );
    setMessages(uniqueMessages);
  }, [preloadedMessages, liveMessages, setMessages]);

  // 최종 렌더링할 메시지는 store에 있는 메시지입니다.
  // (이미 중복 제거되어 업데이트되었음)
  // 만약 ChatMessageList가 직접 store의 messages를 사용하지 않고,
  // 여기서 따로 합친 결과를 넘기고 싶다면 아래와 같이 할 수 있습니다.

  return (
    <div className="flex flex-col justify-end w-full max-w-3xl mx-auto rounded-lg px-2">
      <PaymentModal isOpen={isOpen} onOpenChange={onOpenChange} />

      <ScrollShadow hideScrollBar className="h-[74vh]">
        {isPreloading ? (
          <div className="p-4 text-center animate-pulse">
            메시지 불러오는 중...
          </div>
        ) : (
          <ChatMessageList messages={liveMessages} isLoading={isLoading} />
        )}
      </ScrollShadow>

      <div className="sticky bottom-16 flex flex-col">
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
