"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useBreakpoint } from "@/lib/hooks/useBreakPoint";
import { Chat } from "@prisma/client";
import { useChatStore } from "@/lib/store/ChatStore";
import { useSidebarStore } from "@/lib/store/SideBarHandleStore";
import DesktopChatSideBar from "./ChatSideBar/DesktopChatSideBar";
import MobileChatSideBar from "./ChatSideBar/MobileChatSideBar";

/** 날짜별 그룹화 함수 */
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

/**
 * ChatSideBar 컴포넌트
 * - Desktop과 Mobile 버전을 모두 지원하며,
 *   채팅 생성, 업데이트, 삭제 시 개별 로딩 상태를 관리합니다.
 */
export default function ChatSideBar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isDesktop = useBreakpoint("(min-width: 768px)");

  // updateChat를 포함하여 zustand 스토어에서 필요한 함수를 가져옵니다.
  const { chats, fetchChats, deleteChat, updateChat } = useChatStore();
  const { isSidebarOpen, closeSidebar } = useSidebarStore();

  // 편집 중인 채팅 상태
  const [editingChat, setEditingChat] = useState<{
    chatId: string;
    title: string;
  } | null>(null);
  // 개별 채팅 업데이트 시 로딩 상태 관리 배열
  const [loadingChatIds, setLoadingChatIds] = useState<string[]>([]);

  const activeChatId = pathname.split("/chat/")[1];

  // 세션 에러 처리
  useEffect(() => {
    if (session?.error === "RefreshTokenError") {
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      signOut({ callbackUrl: "/" });
    }
  }, [session]);

  // 채팅 데이터 fetch (세션 사용자 ID가 있을 때)
  useEffect(() => {
    if (!session?.user?.id) return;
    (async () => {
      await fetchChats(session.user.id);
    })();
  }, [session?.user?.id, fetchChats]);

  // 채팅 선택
  const handleSelectChat = useCallback(
    (chatId: string) => {
      router.push(`/chat/${chatId}`);
    },
    [router]
  );

  // 편집 상태 설정
  const handleSetEditingChat = useCallback((chatId: string, title: string) => {
    setEditingChat({ chatId, title });
  }, []);

  // 채팅 업데이트 (제목 변경 예시, 다른 필드는 updateChat 함수 사용 시 확장 가능)
  const handleRenameSubmit = useCallback(
    async (chatId: string, newTitle: string) => {
      setEditingChat(null);
      setLoadingChatIds((prev) => [...prev, chatId]);
      try {
        // updateChat을 호출하여 title 업데이트 (필요에 따라 다른 필드도 업데이트 가능)
        await updateChat(chatId, { title: newTitle });
      } catch (error) {
        if (error instanceof Error) alert("채팅 제목 변경에 실패했습니다.");
      } finally {
        setLoadingChatIds((prev) => prev.filter((id) => id !== chatId));
      }
    },
    [updateChat]
  );

  // 채팅 삭제
  const handleDelete = useCallback(
    async (chatId: string) => {
      setLoadingChatIds((prev) => [...prev, chatId]);
      try {
        await deleteChat(chatId);
        if (activeChatId === chatId) {
          router.push("/chat");
        }
      } catch (error) {
        if (error instanceof Error) alert("채팅 삭제에 실패했습니다.");
      } finally {
        setLoadingChatIds((prev) => prev.filter((id) => id !== chatId));
      }
    },
    [deleteChat, activeChatId, router]
  );

  const groupedChats = groupChatsByDate(chats);

  if (!pathname.startsWith("/chat")) return null;

  return (
    <>
      {isSidebarOpen && isDesktop ? (
        <DesktopChatSideBar
          groupedChats={groupedChats}
          activeChatId={activeChatId}
          editingChat={editingChat}
          onSelectChat={handleSelectChat}
          onSetEditingChat={handleSetEditingChat}
          onRenameSubmit={handleRenameSubmit}
          onDeleteChat={handleDelete}
          router={router}
          setIsSidebarOpen={closeSidebar}
          loadingChatIds={loadingChatIds}
        />
      ) : (
        <MobileChatSideBar
          groupedChats={groupedChats}
          activeChatId={activeChatId}
          editingChat={editingChat}
          onSelectChat={handleSelectChat}
          onSetEditingChat={handleSetEditingChat}
          onRenameSubmit={handleRenameSubmit}
          onDeleteChat={handleDelete}
          router={router}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={closeSidebar}
          loadingChatIds={loadingChatIds}
        />
      )}
    </>
  );
}
