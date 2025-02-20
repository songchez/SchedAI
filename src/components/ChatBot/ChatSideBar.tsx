"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useCallback, useState } from "react";
import { Chat } from "@prisma/client";
import { useRouter, usePathname } from "next/navigation";

// Zustand 스토어
import { useChatStore } from "@/lib/store/ChatStore";
import { useBreakpoint } from "@/lib/hooks/useBreakPoint";
import DesktopChatSideBar from "./ChatSideBar/DesktopChatSideBar";
import MobileChatSideBar from "./ChatSideBar/MobileChatSideBar";
import { useSidebarStore } from "@/lib/store/SideBarHandleStore";

/** 편집 상태 타입 */
interface EditingChat {
  chatId: string;
  title: string;
}

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

/** 상위 ChatSideBar 컴포넌트
 * - 공통 상태 및 액션을 관리하고, 화면 크기에 따라 데스크탑/모바일 버전을 렌더링
 */
export default function ChatSideBarWrapper() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isDesktop = useBreakpoint("(min-width: 768px)");

  const { chats, fetchChats, renameChat, deleteChat } = useChatStore();
  const [loading, setLoading] = useState(false);
  const [editingChat, setEditingChat] = useState<EditingChat | null>(null);
  const activeChatId = pathname.split("/chat/")[1];

  // Zustand를 통한 사이드바 상태 관리
  const { isSidebarOpen, closeSidebar } = useSidebarStore();

  useEffect(() => {
    if (session?.error === "RefreshTokenError") {
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      signOut({ callbackUrl: "/" });
    }
  }, [session]);

  useEffect(() => {
    if (!session?.user?.id) return;
    (async () => {
      setLoading(true);
      await fetchChats(session.user.id);
      setLoading(false);
    })();
  }, [session?.user?.id, fetchChats]);

  const handleSelectChat = useCallback(
    (chatId: string) => {
      router.push(`/chat/${chatId}`);
    },
    [router]
  );

  const handleSetEditingChat = useCallback((chatId: string, title: string) => {
    setEditingChat({ chatId, title });
  }, []);

  const handleRenameSubmit = useCallback(
    async (chatId: string, newTitle: string) => {
      setEditingChat(null);
      setLoading(true);
      await renameChat(chatId, newTitle);
      setLoading(false);
    },
    [renameChat]
  );

  const handleDelete = useCallback(
    async (chatId: string) => {
      setLoading(true);
      await deleteChat(chatId);
      setLoading(false);
      if (activeChatId === chatId) {
        router.push("/chat");
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
          loading={loading}
          activeChatId={activeChatId}
          editingChat={editingChat}
          onSelectChat={handleSelectChat}
          onSetEditingChat={handleSetEditingChat}
          onRenameSubmit={handleRenameSubmit}
          onDeleteChat={handleDelete}
          router={router}
          setIsSidebarOpen={closeSidebar} // 데스크탑 닫기 시 closeSidebar 사용
        />
      ) : (
        <MobileChatSideBar
          groupedChats={groupedChats}
          loading={loading}
          activeChatId={activeChatId}
          editingChat={editingChat}
          onSelectChat={handleSelectChat}
          onSetEditingChat={handleSetEditingChat}
          onRenameSubmit={handleRenameSubmit}
          onDeleteChat={handleDelete}
          router={router}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={closeSidebar}
        />
      )}
    </>
  );
}
