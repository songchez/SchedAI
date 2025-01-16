"use client";

import { useChat } from "ai/react";
import { Input, Button, Card } from "@nextui-org/react";

export default function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch bg-white/10 backdrop-blur-lg p-4 rounded-lg shadow-lg">
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
              <strong>{m.role === "user" ? "User: " : "AI: "}</strong>
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
