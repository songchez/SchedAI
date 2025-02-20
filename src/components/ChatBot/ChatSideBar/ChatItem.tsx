import { Chat } from "@prisma/client";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { MouseEvent, KeyboardEvent } from "react";
import { Spinner } from "@heroui/react";
import { useChatUIStore } from "@/lib/store/ChatUIStore";
import { useChatActions } from "@/lib/hooks/useChatAction";

interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  onSelect: (chatId: string) => void;
}

export default function ChatItem({ chat, isActive, onSelect }: ChatItemProps) {
  const { editingChat, setEditingChat, loadingChatIds } = useChatUIStore();
  const { handleRenameSubmit, handleDelete } = useChatActions();

  const isEditing = editingChat?.chatId === chat.id;
  const isLoading = loadingChatIds.includes(chat.id);

  const handleClick = () => {
    if (!isEditing) {
      onSelect(chat.id);
    }
  };

  const handleEditClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setEditingChat({ chatId: chat.id, title: chat.title });
  };

  const handleDeleteClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    handleDelete(chat.id);
  };

  const handleBlur = () => {
    if (editingChat) {
      handleRenameSubmit(chat.id, editingChat.title);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && editingChat) {
      handleRenameSubmit(chat.id, editingChat.title);
    }
  };

  const createdTime = new Date(chat.createdAt).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="relative rounded-md ">
      <button
        onClick={handleClick}
        className={`group w-full px-3 py-2 text-left flex items-center justify-between rounded-xl ${
          isActive
            ? "bg-primary text-white"
            : "hover:bg-gray-100 dark:hover:bg-gray-700"
        } transition-colors`}
      >
        {isEditing ? (
          <div className="flex items-center w-full">
            <input
              type="text"
              autoFocus
              value={editingChat?.title || ""}
              onChange={(e) =>
                setEditingChat({ chatId: chat.id, title: e.target.value })
              }
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className={`flex-1 bg-transparent outline-none text-sm ${
                isActive
                  ? "text-white dark:text-black"
                  : "text-black dark:text-white"
              }`}
            />
            {isLoading && <Spinner size="sm" className="ml-2" />}
          </div>
        ) : (
          <span
            className={`truncate text-sm ${
              isActive
                ? "text-white dark:text-black/90"
                : "text-black dark:text-white/40"
            }`}
          >
            {chat.title}
          </span>
        )}
        <div className="ml-2 flex items-center relative">
          <span
            className={`text-xs transition-opacity ${
              isActive
                ? "text-white/80 dark:text-black/90"
                : "text-gray-500 dark:text-white/40"
            } ${!isLoading ? "group-hover:opacity-0" : ""}`}
          >
            {!isEditing && isLoading ? (
              <Spinner
                size="sm"
                className="inline-block"
                color={isActive ? "white" : "default"}
              />
            ) : (
              createdTime
            )}
          </span>
          <div className="absolute right-0 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span
              onClick={handleEditClick}
              className={`hover:text-green-600 ${
                isActive
                  ? "text-white hover:text-green-200 dark:text-black/90 dark:hover:text-green-600"
                  : "text-gray-500"
              }`}
            >
              <PencilIcon className="w-4 h-4" />
            </span>
            <span
              onClick={handleDeleteClick}
              className={`hover:text-red-600 ${
                isActive
                  ? "text-white hover:text-red-200 dark:text-black/90 dark:hover:text-red-700"
                  : "text-gray-500"
              }`}
            >
              <TrashIcon className="w-4 h-4" />
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}
