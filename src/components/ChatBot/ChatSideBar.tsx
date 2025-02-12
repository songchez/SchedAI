"use client";

import { Button, Spinner } from "@heroui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { Chat } from "@prisma/client";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useRouter, usePathname } from "next/navigation";

// Zustand 스토어
import { useChatStore } from "@/lib/store/ChatStore";
import ChatGroup from "./ChatSideBar/ChatGroup";

/** 편집 상태 타입 */
interface EditingChat {
  chatId: string;
  title: string;
}

/** -----------------------------------------
 * 날짜 범위별 그룹화 함수
 * ---------------------------------------- */
function groupChatsByDate(chats: Chat[]): Record<string, Chat[]> {
  const today = new Date();

  return chats.reduce((acc, chat) => {
    const chatDate = new Date(chat.createdAt);
    const diffDays = Math.floor(
      (today.getTime() - chatDate.getTime()) / (1000 * 3600 * 24)
    );

    let group: string;
    if (diffDays === 0) group = "오늘";
    else if (diffDays === 1) group = "어제";
    else if (diffDays <= 5) group = "지난 5일";
    else if (diffDays <= 7) group = "지난 7일";
    else if (diffDays <= 30) group = "지난 30일";
    else group = "30일 이전";

    if (!acc[group]) acc[group] = [];
    acc[group].push(chat);
    return acc;
  }, {} as Record<string, Chat[]>);
}

/** 사이드바 메인 컴포넌트 */
export default function ChatSideBar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  // Zustand 스토어에서 state 및 actions 가져오기
  const { chats, fetchChats, renameChat, deleteChat } = useChatStore();

  // 로딩 상태
  const [loading, setLoading] = useState(false);

  // 편집 중인 채팅 ID/제목
  const [editingChat, setEditingChat] = useState<EditingChat | null>(null);

  // 현재 활성화된 채팅 ID ("/chat/[id]" 경로)
  const activeChatId = pathname.split("/chat/")[1];

  /** 사이드바 최초 로드 (또는 session 변경) 시 채팅 목록 가져오기 */
  useEffect(() => {
    if (!session?.user?.id) return;
    (async () => {
      setLoading(true);
      await fetchChats(session.user.id);
      setLoading(false);
    })();
  }, [session?.user?.id, fetchChats]);

  /** 채팅 선택 -> 라우팅 */
  const handleSelectChat = useCallback(
    (chatId: string) => {
      router.push(`/chat/${chatId}`);
    },
    [router]
  );

  /** 채팅 편집 모드 진입 */
  const handleSetEditingChat = useCallback((chatId: string, title: string) => {
    setEditingChat({ chatId, title });
  }, []);

  /** 채팅 제목 수정 요청 */
  const handleRenameSubmit = useCallback(
    async (chatId: string, newTitle: string) => {
      setEditingChat(null);
      setLoading(true);
      await renameChat(chatId, newTitle);
      setLoading(false);
    },
    [renameChat]
  );

  /** 채팅 삭제 요청 */
  const handleDelete = useCallback(
    async (chatId: string) => {
      setLoading(true);
      await deleteChat(chatId);
      setLoading(false);
      // 현재 열려있는 채팅을 지웠다면 /chat 기본 경로로
      if (activeChatId === chatId) {
        router.push("/chat");
      }
    },
    [deleteChat, activeChatId, router]
  );

  // 날짜별 그룹화
  const groupedChats = groupChatsByDate(chats);

  return (
    <div
      className={
        pathname.startsWith("/chat")
          ? "w-80 flex flex-col bg-background border-r min-h-screen"
          : "hidden"
      }
    >
      {/* 상단 헤더 (고정) */}
      <div className="p-4 flex-shrink-0 sticky top-0 bg-background z-10 border-b">
        <div className="flex justify-between items-center">
          <Button
            onPress={() => router.push("/chat")}
            color="primary"
            size="sm"
            className="dark:text-black"
          >
            + 새 대화
          </Button>
          <Button variant="light" size="sm" isIconOnly>
            <ChevronLeftIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 채팅 목록 스크롤 영역 */}
      <div className="overflow-y-auto flex-grow p-4">
        {/* 로딩중이면 Spinner 표시, 아니면 그룹별 채팅 목록 */}
        {loading ? (
          <Spinner />
        ) : (
          Object.entries(groupedChats).map(([group, groupChats]) => (
            <ChatGroup
              key={group}
              groupTitle={group}
              chats={groupChats}
              activeChatId={activeChatId}
              editingChat={editingChat}
              onSelectChat={handleSelectChat}
              onSetEditingChat={handleSetEditingChat}
              onRenameSubmit={handleRenameSubmit}
              onDeleteChat={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
