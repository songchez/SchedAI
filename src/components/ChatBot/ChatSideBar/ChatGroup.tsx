import ChatItem from "./ChatItem";
import { Chat } from "@prisma/client";

interface ChatGroupProps {
  groupTitle: string;
  chats: Chat[];
  activeChatId?: string;
  onSelectChat: (chatId: string) => void;
}

export default function ChatGroup({
  groupTitle,
  chats,
  activeChatId,
  onSelectChat,
}: ChatGroupProps) {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-medium text-gray-500 mb-2">{groupTitle}</h3>
      <div className="space-y-1">
        {chats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            isActive={activeChatId === chat.id}
            onSelect={onSelectChat}
          />
        ))}
      </div>
    </div>
  );
}
