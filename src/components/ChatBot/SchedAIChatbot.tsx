"use client";

import { useState, useEffect } from "react";
import ChatMessageList from "./Ui/ChatMessageList";
import ChatInput from "./Ui/ChatInput";
import { useChat } from "ai/react";
import { SessionProvider } from "next-auth/react";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Card, CardBody } from "@heroui/react";

export default function SchedAIChatbot() {
  const [selectedModel, setSelectedModel] = useState<AIModels>(
    "gemini-2.0-flash-exp"
  );
  // 대화 시작 전 보이는 recommendations
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const { messages, input, handleInputChange, handleSubmit, stop, isLoading } =
    useChat({
      body: {
        model: selectedModel,
      },
    });

  useEffect(() => {
    // 대화 시작 전 보이는 recommendations: 랜덤 3개 고르기
    const allRecommendations = [
      `"📆이번 주 스케줄 브리핑해줘"`,
      `"🌈오늘 하루를 계획해줘"`,
      `"🧐이번 주 스케줄 보여줘"`,
      `"🚗주말에 갈 만한 여행지를 추천해줘."`,
      `"🏃🏻‍♀️운동 일정을 추가해줘."`,
      `"💁🏻나한테 어떤 도움을 줄 수 있어?"`,
      `"💍기념일을 추가하려고 해"`,
      `"📑저번달 스케줄을 분석해줘"`,
      `"👔미팅일정을 잡으려하는데, 언제가 좋을까?"`,
    ];

    // 클라이언트에서만 랜덤으로 선택
    const randomItems = allRecommendations
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    setRecommendations(randomItems);
  }, []); // 클라이언트에서만 실행

  return (
    <div className="flex flex-col justify-end w-full max-w-4xl mx-auto p-4 rounded-lg">
      <ScrollShadow hideScrollBar className="h-[82vh]">
        <ChatMessageList messages={messages} isLoading={isLoading} />
      </ScrollShadow>

      <div className="sticky bottom-14 flex flex-col">
        {messages.length === 0 && (
          <div className="flex gap-4 flex-wrap justify-center mb-36">
            {recommendations.map((recommendation) => (
              <Card
                isPressable
                key={recommendation}
                onPress={() => {
                  const simulatedEvent = {
                    target: { value: recommendation },
                  } as React.ChangeEvent<HTMLInputElement>; // 강제 타입 캐스팅
                  handleInputChange(simulatedEvent);
                  handleSubmit();
                }}
                className="px-4 py-2 text-sm rounded-lg shadow-md transition-all hover:scale-105"
              >
                <CardBody>{recommendation}</CardBody>
              </Card>
            ))}
          </div>
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
