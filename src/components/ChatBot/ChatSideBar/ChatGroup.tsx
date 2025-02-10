"use client";

import { Chat } from "@prisma/client";
import ChatItem from "./ChatItem";

/** 편집 상태 타입 */
interface EditingChat {
  chatId: string;
  title: string;
}

/** ChatGroup에 필요한 Prop들 */
interface ChatGroupProps {
  groupTitle: string;
  chats: Chat[];
  activeChatId?: string;
  editingChat: EditingChat | null;

  // 이벤트 핸들러
  onSelectChat: (chatId: string) => void;
  onSetEditingChat: (chatId: string, title: string) => void;
  onRenameSubmit: (chatId: string, newTitle: string) => void;
  onDeleteChat: (chatId: string) => void;
}

/** 날짜 그룹 하나(예: 오늘, 어제 등)를 렌더링 */
export default function ChatGroup({
  groupTitle,
  chats,
  activeChatId,
  editingChat,
  onSelectChat,
  onSetEditingChat,
  onRenameSubmit,
  onDeleteChat,
}: ChatGroupProps) {
  return (
    <div className="mb-6">
      <h3 className="text-xs font-medium text-gray-500 mb-2">{groupTitle}</h3>
      <div className="space-y-1">
        {chats.map((chat) => {
          const isActive = activeChatId === chat.id;
          const isEditing = editingChat?.chatId === chat.id;
          return (
            <ChatItem
              key={chat.id}
              chat={chat}
              isActive={isActive}
              isEditing={isEditing}
              editingChat={isEditing ? editingChat : null}
              onSelect={onSelectChat}
              onSetEditingChat={onSetEditingChat}
              onRenameSubmit={onRenameSubmit}
              onDelete={onDeleteChat}
            />
          );
        })}
      </div>
    </div>
  );
}
