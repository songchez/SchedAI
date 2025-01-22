import { Card, Spinner } from "@heroui/react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import { Message, ToolInvocation } from "@ai-sdk/ui-utils";
import { useEffect, useRef } from "react";

/**
 * 채팅 메시지를 표시하는 리스트
 * - role === "user" → 오른쪽 정렬
 * - role === "assistant" → 왼쪽 정렬
 * - Markdown + 코드 하이라이트
 * - 새로운 메시지가 생성되면 화면을 자동으로 스크롤
 */
export default function ChatMessageList({ messages }: { messages: Message[] }) {
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  // 새로운 메시지가 추가될 때 스크롤
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
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
          <div className="whitespace-pre-wrap">
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {m.content}
            </ReactMarkdown>
          </div>
          {m.toolInvocations?.map((toolInvocation: ToolInvocation) => {
            const toolCallId = toolInvocation.toolCallId;

            // render confirmation tool (client-side tool with user interaction)
            if (toolInvocation.toolName === "getCalendarEventsTool") {
              return (
                <div
                  key={toolCallId}
                  className="text-gray-500 flex flex-col gap-2"
                >
                  {toolInvocation.args.message}
                  <div className="flex gap-2">
                    {"result" in toolInvocation ? (
                      <p className="whitespace-pre-line">
                        {toolInvocation.result}
                      </p>
                    ) : (
                      <Spinner />
                    )}
                  </div>
                </div>
              );
            }
            if (toolInvocation.toolName === "addEventToCalendarTool") {
              return (
                <div
                  key={toolCallId}
                  className="text-primary-800 flex flex-col gap-2"
                >
                  {toolInvocation.args.message}
                  <div className="flex gap-2">
                    {"result" in toolInvocation ? (
                      <p className="whitespace-pre-line">
                        {toolInvocation.result}
                      </p>
                    ) : (
                      <Spinner />
                    )}
                  </div>
                </div>
              );
            }
          })}
        </Card>
      ))}
      {/* 스크롤을 끝으로 이동시키는 요소 */}
      <div ref={messageEndRef} />
    </div>
  );
}
