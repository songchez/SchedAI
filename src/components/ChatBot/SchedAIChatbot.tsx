"use client";

import { useState, useEffect } from "react";
import ChatMessageList from "./Ui/ChatMessageList";
import ChatInput from "./Ui/ChatInput";
import { useChat } from "ai/react";
import { SessionProvider } from "next-auth/react";
import { ScrollShadow } from "@heroui/scroll-shadow";
import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import Link from "next/link";

export default function SchedAIChatbot() {
  const [selectedModel, setSelectedModel] = useState<AIModels>(
    "gemini-2.0-flash-exp"
  );
  // 대화 시작 전 보이는 recommendations
  const [recommendations, setRecommendations] = useState<string[]>([]);

  // heroUI의 useDisclosure 훅을 사용하여 모달 열고 닫기 관리
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { messages, input, handleInputChange, handleSubmit, stop, isLoading } =
    useChat({
      body: {
        model: selectedModel,
      },
      onResponse: (response) => {
        if (response.status === 402) {
          onOpen();
        }
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
      `"👍저번달 스케줄을 분석해줘"`,
      `"👔미팅일정을 잡으려하는데, 언제가 좋을까?"`,
    ];

    // 클라이언트에서만 랜덤으로 선택
    const randomItems = allRecommendations
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    setRecommendations(randomItems);
  }, []); // 클라이언트에서만 실행

  return (
    <div className="flex flex-col justify-end w-full max-w-3xl mx-auto p-4 rounded-lg">
      {/* 결제 모달: 응답 상태가 402일 경우 표시 */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                토큰이 부족합니다. 계정을 업그레이드 하고 무제한으로
                사용해보세요!
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-4 w-full">
                  {/* 무료 플랜 카드 */}
                  <Card
                    className="border border-gray-200 rounded-lg shadow-md p-4 hover:border-primary-500"
                    isPressable
                  >
                    <CardBody>
                      <h3 className="text-xl font-bold mb-2">Free</h3>
                      <p className="text-2xl font-bold mb-4">
                        $0 <span className="text-sm">KRW/월</span>
                      </p>
                      <ul className="list-image-none pl-6 text-sm mb-6">
                        <li>✅ 최대 5개의 대화 스레드</li>
                        <li>✅ 일일 요청 토큰 100개</li>
                        <li>✅ Gemini 2.0 Flash, GPT-4o Mini</li>
                        <li>✅ 대시보드 기능 사용가능</li>
                        <br />
                      </ul>
                      <Button
                        color="primary"
                        className="w-full"
                        onPress={onClose}
                      >
                        Free 플랜 선택
                      </Button>
                    </CardBody>
                  </Card>
                  {/* 프리미엄 플랜 카드 */}
                  <Card
                    className="border border-gray-200 rounded-lg shadow-md p-4 bg-gray-50 hover:border-primary-500"
                    isPressable
                  >
                    <CardBody>
                      <h3 className="text-xl font-bold mb-2">Premium</h3>
                      <p className="text-2xl font-bold mb-4">
                        $29,000{" "}
                        <span className="text-small font-thin">KRW/월</span>
                      </p>
                      <ul className="list-image-none pl-6 text-sm mb-6">
                        <li>✅ 무제한 대화 스레드</li>
                        <li>✅ 무제한 일일 요청 토큰</li>
                        <li>✅ 다양한 최신 LLM모델 사용가능</li>
                        <li>✅ 대시보드 기능 사용가능</li>
                        <li>✅ 추가기능 얼리엑세스</li>
                      </ul>
                      <Link href="/checkout" passHref>
                        <Button
                          color="success"
                          className="w-full"
                          onPress={onClose}
                        >
                          Premium 플랜 선택
                        </Button>
                      </Link>
                    </CardBody>
                  </Card>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  닫기
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

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
                  // 추천 문구 클릭 시 입력창에 값 채워 넣기
                  const simulatedEvent = {
                    target: { value: recommendation },
                  } as React.ChangeEvent<HTMLInputElement>;
                  handleInputChange(simulatedEvent);
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
