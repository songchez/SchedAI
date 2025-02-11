// /src/app/FirstPage.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ChatInput from "@/components/ChatBot/ChatInput";
import { RecommendationList } from "@/components/ChatBot/RecommendationList";
import { AIModels } from "@/lib/chatApiHandlers/constants";
import { useChat } from "ai/react";
import { PaymentModal } from "@/components/ChatBot/PaymentModal";
import { useDisclosure } from "@heroui/react";
import { useMessageStore } from "@/lib/store/MessageStore";

export default function FirstPage() {
  const router = useRouter();
  const [selectedModel, setSelectedModel] =
    useState<AIModels>("gemini-1.5-flash");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const setMessages = useMessageStore((state) => state.setMessages);

  // useChat 훅을 사용하여 새 채팅 생성 엔드포인트 호출
  const { input, handleInputChange, handleSubmit, isLoading, messages } =
    useChat({
      body: {
        model: selectedModel,
      },
      onResponse: async (response) => {
        // 토큰 부족 상태 처리
        if (response.status === 402) {
          onOpen();
        }
        // 응답 헤더에서 새 채팅 ID 추출
        const newChatId = response.headers.get("X-New-Chat-Id");
        console.log("[useChat onResponse] 새 채팅 ID:", newChatId);
        if (newChatId) {
          // 현재까지의 메시지를 Zustand 스토어에 저장
          setMessages(messages);
          // 채팅 응답 스트리밍이 완료되면 해당 채팅 ID로 동적 라우팅
          router.push(`chat/${newChatId}`);
        } else {
          console.error(
            "[useChat onResponse] 새 채팅 ID가 응답 헤더에 없습니다."
          );
        }
      },
    });

  // 추천 문구 클릭 시 처리
  const handleRecommendationSelect = (r: string) => {
    handleInputChange({
      target: { value: r },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  // onSubmit: useChat 훅 내의 handleSubmit를 호출하면 POST 요청이 전송됩니다.
  const onSubmitHandler = () => {
    handleSubmit();
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 mt-20">
      <PaymentModal isOpen={isOpen} onOpenChange={onOpenChange} />
      <div className="w-full max-w-3xl">
        <RecommendationList onSelect={handleRecommendationSelect} />
        <ChatInput
          input={input}
          selectedModel={selectedModel}
          onInputChange={handleInputChange}
          onModelChange={setSelectedModel}
          onSubmit={onSubmitHandler}
          stop={() => {}}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
