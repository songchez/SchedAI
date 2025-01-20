"use client";

import { useChat } from "ai/react";
import { Input, Button, Card, Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";

type Models = "gemini-2.0-flash-exp" | "gpt-4o-mini";

export default function ChatInterface() {
  const [selectedModel, setSelectedModel] = useState<Models>(
    "gemini-2.0-flash-exp"
  ); // 기본값 설정
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      body: {
        model: selectedModel,
      },
    });

  const handleModelChange = (value: Models) => {
    setSelectedModel(value);
  };

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch bg-white/10 backdrop-blur-lg p-4 rounded-lg shadow-lg">
      {/* 모델 선택 */}
      <div className="mb-4">
        <Select
          value={selectedModel}
          label="Select AI Model"
          onChange={(e) => handleModelChange(e.target.value as Models)}
        >
          <SelectItem key="gemini-2.0-flash-exp">Gemini 2.0</SelectItem>
          <SelectItem key="gpt-4o-mini">GPT 4o mini</SelectItem>
        </Select>
        <p>고른거 : {selectedModel}</p>
      </div>

      {/* 메시지 표시 영역 */}
      <div className="flex flex-col gap-4 overflow-y-auto max-h-[400px] mb-4">
        {messages.map((m) => (
          <Card
            key={m.id}
            className={`p-4 ${
              m.role === "user"
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 text-black self-start"
            }`}
          >
            <div className="whitespace-pre-wrap">
              <strong>{m.role === "user" ? "me: " : "sched: "}</strong>
              {m.content}
            </div>
          </Card>
        ))}
      </div>

      {/* 입력 필드 및 전송 버튼 */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 items-center"
        style={{ position: "sticky", bottom: 0 }}
      >
        <Input
          fullWidth
          value={input}
          placeholder="Type your message..."
          onChange={handleInputChange}
          className="flex-1"
        />
        <Button type="submit" color="primary">
          Send
        </Button>
      </form>
    </div>
  );
}
