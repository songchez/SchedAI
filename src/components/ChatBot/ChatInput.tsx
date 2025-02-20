"use client";

import {
  Textarea,
  Button,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { ChangeEvent, useEffect, useRef, useCallback } from "react";
import { useSession, signIn } from "next-auth/react";
import SchedAILogdo from "@/images/SchedAILogo.png";
import Image from "next/image";
import { AI_MODELS, AIModels } from "@/lib/chatApiHandlers/constants";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";

interface ChatInputProps {
  input: string;
  selectedModel: AIModels;
  onInputChange: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => void;
  onModelChange: (value: AIModels) => void;
  onSubmit: () => void;
  stop: () => void;
  isLoading: boolean;
}

/**
 * 사용자 입력창 + 모델 선택 UI
 * form 태그 없이 구현하여 하이드레이션 오류를 피함.
 */
export default function ChatInput({
  input,
  selectedModel,
  onInputChange,
  onModelChange,
  onSubmit,
  stop,
  isLoading,
}: ChatInputProps) {
  const { data: session } = useSession();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const currentAIModel = Object.values(AI_MODELS).find(
    (model) => model.value === selectedModel
  );

  // 실제 제출 함수: 로그인하지 않은 경우 모달을 열고, 그렇지 않으면 onSubmit 호출
  const chatSubmit = useCallback(() => {
    if (!session) {
      // 모달을 열기 전에 입력창의 포커스를 제거합니다.
      inputRef.current?.blur();
      onOpen();
      return;
    }
    onSubmit();
  }, [session, onOpen, onSubmit]);

  // 엔터키로 전송 처리 (Shift+Enter는 줄바꿈 허용)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      chatSubmit();
    }
  };

  // 로딩이 끝난 후 입력창에 포커스 이동
  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  return (
    <div className="flex gap-2 items-end justify-center">
      {/* 텍스트 입력창 */}
      <Textarea
        aria-label="메시지를 입력하세요"
        classNames={{ inputWrapper: "pl-5 pt-5" }}
        ref={inputRef}
        isDisabled={isLoading}
        fullWidth
        color="primary"
        value={input}
        autoComplete="off"
        placeholder="➤ 메시지를 적어주세요"
        onChange={onInputChange}
        onKeyDown={handleKeyDown}
        variant="bordered"
        className="flex-1 max-w-2xl bg-white dark:bg-black rounded-2xl"
        minRows={4}
        maxRows={6}
        size="lg"
        endContent={
          <div className="flex bottom-2 right-2 absolute">
            <div>
              <Select
                className="w-28"
                isRequired
                value={selectedModel}
                color="primary"
                aria-label="aiModels"
                defaultSelectedKeys={currentAIModel && [currentAIModel?.key]}
                variant="underlined"
                onChange={(e) => {
                  const key = e.target.value;
                  const modelSelected = Object.values(AI_MODELS).find(
                    (model) => {
                      return model.key === key;
                    }
                  );
                  onModelChange(modelSelected?.value as AIModels);
                }}
                renderValue={(items) => {
                  return items.map((item) => (
                    <span key={item.key}>{item.key}</span>
                  ));
                }}
              >
                {Object.values(AI_MODELS).map((model) => {
                  return (
                    <SelectItem key={model.key} textValue={model.value}>
                      <span className="hover:text-blue-500">{model.key}</span>
                    </SelectItem>
                  );
                })}
              </Select>
            </div>
            {/* 전송 또는 중지 버튼 */}
            {isLoading ? (
              <Button
                onPress={stop}
                color="primary"
                className="w-12"
                isIconOnly
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="primary-500"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 dark:text-black"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z"
                  />
                </svg>
              </Button>
            ) : (
              <Button
                className="w-10 rounded-full bg-transparent"
                isIconOnly
                onPress={chatSubmit}
              >
                <ArrowUpCircleIcon />
              </Button>
            )}
          </div>
        }
      />

      {/* 비로그인 상태일 때 띄우는 모달 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="text-center text-xl font-bold text-primary-500 dark:text-amber-300">
            <div className="flex gap-3 items-center">
              <Image
                src={SchedAILogdo}
                alt="SchedAI 로고"
                height={30}
                width={30}
              />
              <span>SchedAI에 오신 것을 환영합니다!</span>
            </div>
          </ModalHeader>
          <ModalBody>
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="text-gray-700 dark:text-primary-300">
                SchedAI를 사용하면 Google 캘린더와의 통합을 통해 <br />
                <span className="font-semibold text-primary-500 dark:text-amber-300">
                  스마트하고 간편한 일정 관리
                </span>
                를 경험할 수 있습니다!
              </p>
              <div className="w-full flex flex-col items-start px-6">
                <p>🤖 AI 기반 자동 일정 추가 및 수정</p>
                <p>📆 구글 캘린더 + TASK 완벽 연동</p>
                <p>👍 직관적인 UI로 편리한 사용</p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="flex flex-col gap-3">
            <Button
              className="bg-primary-500 text-white text-lg w-full py-3 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-all"
              onPress={() => signIn("google")}
              variant="flat"
              size="lg"
            >
              Google 계정으로 로그인
            </Button>
            <Button
              color="danger"
              variant="light"
              onPress={onClose}
              className="w-full py-3 rounded-lg"
            >
              취소
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
