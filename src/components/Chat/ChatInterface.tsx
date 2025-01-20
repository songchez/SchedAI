"use client";

import { useChat } from "ai/react";
import { Input, Button, Card, Select, SelectItem } from "@nextui-org/react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

type Models = "gemini-2.0-flash-exp" | "gpt-4o-mini";

export default function ChatInterface() {
  const [selectedModel, setSelectedModel] = useState<Models>(
    "gemini-2.0-flash-exp"
  ); // 기본값 설정
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    body: {
      model: selectedModel,
    },
  });

  const handleModelChange = (value: Models) => {
    setSelectedModel(value);
  };
  console.log(messages);
  return (
    <div className="flex flex-col justify-end w-full max-w-4xl mx-auto p-4 rounded-lg">
      {/* 메시지 표시 영역 */}
      <div className="flex flex-col gap-4 overflow-y-auto p-6 mb-28">
        {messages.map((m) => (
          <Card
            key={m.id}
            className={`p-4 ${
              m.role === "user"
                ? "self-end shadow-none bg-opacity-50"
                : "bg-transparent shadow-none self-start"
            }`}
          >
            <div className="whitespace-pre-wrap font-GowunBatang">
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {m.content}
              </ReactMarkdown>
            </div>
          </Card>
        ))}
      </div>

      {/* 입력 필드 및 전송 버튼 */}
      <div className="sticky bottom-14 flex flex-col">
        <h2
          className={`text-2xl self-center p-3 ${
            messages.length > 0 ? "hidden" : ""
          }`}
        >
          어떤 일정을 잡아드릴까요?
        </h2>
        <Card className="p-4">
          <form onSubmit={handleSubmit} className="flex gap-2 items-end">
            {/* 모델 선택 */}
            <div className="w-36 bottom-3">
              <Select
                defaultSelectedKeys={["gemini-2.0-flash-exp"]}
                value={selectedModel}
                label="Select AI Model"
                onChange={(e) => handleModelChange(e.target.value as Models)}
              >
                <SelectItem key="gemini-2.0-flash-exp">Gemini 2.0</SelectItem>
                <SelectItem key="gpt-4o-mini">GPT 4o mini</SelectItem>
              </Select>
            </div>
            <Input
              fullWidth
              value={input}
              placeholder="Type your message..."
              onChange={handleInputChange}
              className="flex-1"
              size="lg"
            />
            <Button type="submit" color="primary">
              Send
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
