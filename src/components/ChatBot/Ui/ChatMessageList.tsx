import { Card } from "@nextui-org/react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import { Message } from "@ai-sdk/ui-utils";

/**
 * 채팅 메시지를 표시하는 리스트
 * - role === "user" → 오른쪽 정렬
 * - role === "assistant" → 왼쪽 정렬
 * - Markdown + 코드 하이라이트
 */
export default function ChatMessageList({ messages }: { messages: Message[] }) {
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
        </Card>
      ))}
    </div>
  );
}
