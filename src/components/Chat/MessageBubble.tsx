import { Card } from "@nextui-org/react";

interface MessageBubbleProps {
  content: string;
  isUser?: boolean;
}

export default function MessageBubble({ content, isUser }: MessageBubbleProps) {
  return (
    <Card
      className={`p-4 rounded-lg ${
        isUser ? "bg-blue-500 text-white" : "bg-gray-200"
      }`}
    >
      {content}
    </Card>
  );
}
