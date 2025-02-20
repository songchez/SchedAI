"use client";

import { Chat } from "@prisma/client";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { MouseEvent, KeyboardEvent } from "react";
import { Spinner } from "@heroui/react";

/** 편집 상태 타입 */
interface EditingChat {
  chatId: string;
  title: string;
}

/** ChatItem에 필요한 Prop들 */
interface ChatItemProps {
  chat: Chat; // 채팅 데이터
  isActive: boolean; // 현재 경로의 채팅과 일치하는지 여부
  isEditing: boolean; // 현재 편집 중인 채팅인지 여부
  editingChat?: EditingChat | null;
  isLoading?: boolean; // 개별 로딩 상태

  // 이벤트 핸들러
  onSelect: (chatId: string) => void; // 채팅 선택
  onSetEditingChat: (chatId: string, title: string) => void; // 편집 모드로 전환
  onRenameSubmit: (chatId: string, newTitle: string) => void; // 실제 수정 API 호출
  onDelete: (chatId: string) => void; // 삭제
}

export default function ChatItem({
  chat,
  isActive,
  isEditing,
  editingChat,
  isLoading = false,
  onSelect,
  onSetEditingChat,
  onRenameSubmit,
  onDelete,
}: ChatItemProps) {
  /** 전체 영역 클릭: 편집 중이 아닐 때만 onSelect */
  const handleClick = () => {
    if (!isEditing) {
      onSelect(chat.id);
    }
  };

  /** 연필 아이콘 클릭 -> 편집 모드 진입 */
  const handleEditClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // 부모 클릭(라우팅) 막기
    onSetEditingChat(chat.id, chat.title);
  };

  /** 휴지통 아이콘 클릭 -> 삭제 */
  const handleDeleteClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // 부모 클릭(라우팅) 막기
    onDelete(chat.id);
  };

  /** input에서 포커스 이탈 시 => 제목 수정 */
  const handleBlur = () => {
    if (editingChat) {
      onRenameSubmit(chat.id, editingChat.title);
    }
  };

  /** input에서 Enter 입력 시 => 제목 수정 */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && editingChat) {
      onRenameSubmit(chat.id, editingChat.title);
    }
  };

  /** 채팅 생성 시간 표시 */
  const createdTime = new Date(chat.createdAt).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="relative rounded-md ">
      {/* group 클래스를 추가해야 내부에서 group-hover가 작동 */}
      <button
        onClick={handleClick}
        className={`
          group w-full px-3 py-2 text-left flex items-center justify-between rounded-xl 
          ${
            isActive
              ? "bg-primary text-white"
              : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }
          transition-colors
        `}
      >
        {/* 편집 중이면 input과 로딩 스피너를 함께 렌더링 */}
        {isEditing ? (
          <div className="flex items-center w-full">
            <input
              type="text"
              autoFocus
              value={editingChat?.title || ""}
              onChange={(e) => onSetEditingChat(chat.id, e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className={`
                flex-1 bg-transparent outline-none text-sm
                ${
                  isActive
                    ? "text-white dark:text-black"
                    : "text-black dark:text-white"
                }
              `}
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

        {/* 오른쪽 영역: 시간 또는 로딩 스피너 / 아이콘(Hover) */}
        <div className="ml-2 flex items-center relative">
          {/* 시간 또는 스피너: hover시 사라짐 (isLoading이면 항상 보임) */}
          <span
            className={`
              text-xs transition-opacity
              ${
                isActive
                  ? "text-white/80 dark:text-black/90"
                  : "text-gray-500 dark:text-white/40"
              }
              ${!isLoading ? "group-hover:opacity-0" : ""}
            `}
          >
            {!isEditing && isLoading ? (
              <Spinner
                size="sm"
                className="inline-block"
                color={`${isActive ? "white" : "default"}`}
              />
            ) : (
              createdTime
            )}
          </span>

          {/* 아이콘들: 기본은 투명, Hover시 나타남 */}
          <div
            className={`
              absolute right-0 flex items-center space-x-2
              opacity-0 group-hover:opacity-100 transition-opacity
            `}
          >
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
