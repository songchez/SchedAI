"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ChatInput from "@/components/ChatBot/ChatInput";
import { RecommendationList } from "@/components/ChatBot/RecommendationList";
import { AIModels } from "@/lib/chatApiHandlers/constants";
import { useChat } from "ai/react";
import { PaymentModal } from "@/components/ChatBot/PaymentModal";
import { useDisclosure } from "@heroui/react";

export default function FirstPage() {
  const router = useRouter();
  const [selectedModel, setSelectedModel] =
    useState<AIModels>("gemini-1.5-flash");
  const [input, setInput] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // useChat 훅을 사용하여 새 채팅 생성 엔드포인트 호출
  const {
    input: chatInput,
    handleInputChange,
    handleSubmit,
    isLoading,
    messages,
  } = useChat({
    body: {
      model: selectedModel,
      firstMessage: { content: input, role: "user" },
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
        // AI 응답 스트리밍이 진행되는 동안 내부적으로 messages 상태가 업데이트되고,
        // 스트리밍이 완료되면 해당 채팅 ID로 동적 라우팅
        router.push(`chat/${newChatId}`);
      } else {
        console.error(
          "[useChat onResponse] 새 채팅 ID가 응답 헤더에 없습니다."
        );
      }
    },
  });

  // 추천 문구 클릭 시 처리
  const handleRecommendationSelect = (recommendation: string) => {
    setInput(recommendation);
    handleInputChange({ target: { value: recommendation } } as any);
  };

  // onSubmit: useChat 훅 내의 handleSubmit를 호출하면 POST 요청이 전송됩니다.
  const onSubmitHandler = () => {
    handleSubmit();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <PaymentModal isOpen={isOpen} onOpenChange={onOpenChange} />
      <div className="w-full max-w-xl">
        <RecommendationList onSelect={handleRecommendationSelect} />
        <ChatInput
          input={input}
          selectedModel={selectedModel}
          onInputChange={(e) => {
            setInput(e.target.value);
            handleInputChange(e);
          }}
          onModelChange={setSelectedModel}
          onSubmit={onSubmitHandler}
          stop={() => {}}
          isLoading={isLoading}
        />
        {/* 스트리밍 중 AI 응답 텍스트 표시 (실시간 업데이트용) */}
        {messages && messages.length > 0 && (
          <div className="mt-4 p-4 border rounded">
            <h3 className="text-sm font-semibold">AI 응답 스트리밍:</h3>
            <pre className="whitespace-pre-wrap">
              {messages.map((msg) => msg.content).join("\n")}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
