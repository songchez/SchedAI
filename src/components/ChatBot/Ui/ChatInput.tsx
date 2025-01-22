import { Input, Button, Select, SelectItem } from "@heroui/react";
import { ChangeEvent } from "react";

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
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="flex gap-2 items-end"
    >
      {/* 모델 선택 */}
      <div className="w-36 bottom-3 ">
        <Select
          isRequired
          defaultSelectedKeys={[selectedModel]}
          value={selectedModel}
          color="primary"
          variant="underlined"
          label="Select AI Model"
          onChange={(e) => onModelChange(e.target.value as AIModels)}
        >
          <SelectItem key="gemini-2.0-flash-exp">Gemini 2.0</SelectItem>
          <SelectItem key="gpt-4o-mini">GPT 4o mini</SelectItem>
        </Select>
      </div>

      <Input
        fullWidth
        color="primary"
        value={input}
        autoComplete="off"
        placeholder="Type your message..."
        onChange={onInputChange}
        variant="underlined"
        className="flex-1"
        size="lg"
      />
      {isLoading ? (
        <Button onPress={stop} color="primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z"
            />
          </svg>
        </Button>
      ) : (
        <Button type="submit" color="primary" variant="solid">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
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
    </form>
  );
}
