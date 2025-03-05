"use client";

import { UIMessage } from "@ai-sdk/ui-utils";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import { Card } from "@heroui/react";
import { useEffect, useRef } from "react";
import ToolInvocationRenderer from "./ChatMessageList/ToolInvocationRenderer";

/**
 * ChatMessageList
 * - 메시지 목록을 렌더링하며, 메시지는 message.parts 배열 내 text/tool-invocation으로 구성
 */
export default function ChatMessageList({
  messages,
  isLoading,
  addToolResult,
}: {
  messages: UIMessage[];
  isLoading: boolean;
  addToolResult: (args: { toolCallId: string; result: string }) => void;
}) {
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col gap-4 overflow-y-auto p-6">
      {messages.map((message) => {
        console.log("야호", messages);
        return (
          <>
            <Card
              key={`${message.id}`}
              className={`p-4 ${
                message.role === "user"
                  ? "self-end shadow-none bg-opacity-50"
                  : "bg-transparent shadow-none self-start"
              }`}
            >
              <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                {message.content || ""}
              </ReactMarkdown>
            </Card>
            {message.parts?.map((part) => {
              switch (part.type) {
                case "tool-invocation":
                  if (!part.toolInvocation) return null;
                  return (
                    <ToolInvocationRenderer
                      key={part.toolInvocation.toolCallId}
                      toolInvocation={part.toolInvocation}
                      addToolResult={addToolResult}
                    />
                  );
              }
            })}
          </>
        );
      })}

      {isLoading && (
        <span className="p-4 bg-transparent self-start animate-pulse text-gray-500">
          생각중...
        </span>
      )}

      {/* 스크롤 하단 ref */}
      <div ref={messageEndRef} />
    </div>
  );
}
