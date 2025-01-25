import { Card, Spinner } from "@heroui/react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import { Message, ToolInvocation } from "@ai-sdk/ui-utils";
import { useEffect, useRef } from "react";

/**
 * ToolInvocationRenderer - 특정 ToolInvocation을 렌더링하는 컴포넌트
 */

function ToolInvocationRenderer({
  toolInvocation,
}: {
  toolInvocation: ToolInvocation;
}) {
  // 특정 toolName에 따라 동작 분리

  if (
    [
      "getCalendarEventsTool",
      "addEventToCalendarTool",
      "updateEventInCalendarTool",
      "deleteEventFromCalendarTool",
    ].includes(toolInvocation.toolName)
  ) {
    return (
      <div
        key={toolInvocation.toolCallId}
        className="text-primary-600 flex flex-col gap-2"
      >
        {toolInvocation.args.message}

        <div className="flex gap-2">
          {"result" in toolInvocation ? (
            <p className="whitespace-pre-line">{toolInvocation.result}</p>
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    );
  }
}

/**
 * ChatMessageList - 채팅 메시지를 표시하는 리스트 컴포넌트
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

          {m.toolInvocations?.map((toolInvocation) => (
            <ToolInvocationRenderer
              key={toolInvocation.toolCallId}
              toolInvocation={toolInvocation}
            />
          ))}
        </Card>
      ))}
      {/* 스크롤을 끝으로 이동시키는 요소 */}
      <div ref={messageEndRef} />
    </div>
  );
}
