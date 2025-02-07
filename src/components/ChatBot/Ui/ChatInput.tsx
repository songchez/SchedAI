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
import { ChangeEvent, useEffect } from "react";
import { useRef } from "react";
import { useSession, signIn } from "next-auth/react";
import SchedAILogdo from "@/images/SchedAILogo.png";
import Image from "next/image";
import { AI_MODELS, AIModels } from "@/lib/chatApiHandlers/constants";

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
 * 사용자가 챗 메시지를 입력하고, 모델을 선택하는 UI
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

  // textarea에서 쉬프트엔터가 아니면 바로 입력
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // 기본 엔터 동작(새 줄 추가) 방지
      chatSubmit();
    }
  };
  // chat input submit 함수
  const chatSubmit = () => {
    if (!session) {
      onOpen();
      return;
    }
    onSubmit();
  };

  // 로딩 상태가 끝난 후 포커스 이동
  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  return (
    <form
      // 버튼 눌렀을때
      onSubmit={(e) => {
        e.preventDefault();
        chatSubmit();
      }}
      className="flex gap-2 items-end"
    >
      {/* 모델 선택 */}
      <div className="w-36 hidden md:inline-block bottom-3">
        <Select
          isRequired
          defaultSelectedKeys={[selectedModel]}
          value={selectedModel}
          color="primary"
          variant="underlined"
          label="AI 모델 선택"
          onChange={(e) => onModelChange(e.target.value as AIModels)}
          renderValue={() => selectedModel}
        >
          {Object.values(AI_MODELS).map((model) => {
            // 텍스트 길이가 17자보다 길면 애니메이션 적용
            const shouldAnimate = model.length > 17;

            return (
              <SelectItem key={model} textValue={model}>
                <div className="relative max-w-full overflow-hidden group">
                  <span
                    className={`block truncate transition-transform duration-700 ${
                      shouldAnimate ? "group-hover:translate-x-[-15%]" : ""
                    }`}
                  >
                    {model}
                  </span>
                  {shouldAnimate && (
                    <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background via-background/80 to-transparent group-hover:from-transparent" />
                  )}
                </div>
              </SelectItem>
            );
          })}
        </Select>
      </div>

      <Textarea
        ref={inputRef}
        isDisabled={isLoading}
        fullWidth
        color="primary"
        value={input}
        autoComplete="off"
        placeholder="➤ 메시지를 적어주세요"
        onChange={onInputChange}
        onKeyDown={handleKeyDown} // 추가
        variant="underlined"
        className="flex-1"
        size="lg"
        rows={2} // 기본 3줄 표시
      />
      {isLoading ? (
        <Button
          onPress={stop}
          color="primary"
          className="w-12"
          isIconOnly={true}
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
          className="w-12"
          type="submit"
          color="primary"
          isIconOnly={true}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="size-6 dark:text-black"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 18.75 7.5-7.5 7.5 7.5"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 12.75 7.5-7.5 7.5 7.5"
            />
          </svg>
        </Button>
      )}
      {/* 로그인 안되어있을때 모달 등장 */}
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
    </form>
  );
}
