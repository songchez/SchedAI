import { Card } from "@nextui-org/react";

interface MessageBubbleProps {
  content: string;
  isUser?: boolean;
}

export default function MessageBubble({ content, isUser }: MessageBubbleProps) {
  return (
    <Card
      className={`p-4 ${
        isUser ? "bg-blue-500 text-white ml-auto" : "bg-gray-200 text-black"
      } rounded-lg`}
    >
      {content}
    </Card>
  );
}
