"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useBreakpoint } from "@/lib/hooks/useBreakPoint";
import { Chat } from "@prisma/client";
import { useChatStore } from "@/lib/store/ChatStore";
import { useSidebarStore } from "@/lib/store/SideBarHandleStore";
import DesktopChatSideBar from "./ChatSideBar/DesktopChatSideBar";
import MobileChatSideBar from "./ChatSideBar/MobileChatSideBar";

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

export default function ChatSideBar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isDesktop = useBreakpoint("(min-width: 768px)");

  const { chats, fetchChats } = useChatStore();
  const { isSidebarOpen, closeSidebar } = useSidebarStore();

  const activeChatId = pathname.split("/chat/")[1];

  useEffect(() => {
    if (session?.error === "RefreshTokenError") {
      alert("세션이 만료되었습니다. 다시 로그인해주세요.");
      signOut({ callbackUrl: "/" });
    }
  }, [session]);

  useEffect(() => {
    if (!session?.user?.id) return;
    (async () => {
      await fetchChats(session.user.id);
    })();
  }, [session?.user?.id, fetchChats]);

  const handleSelectChat = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  const groupedChats = groupChatsByDate(chats);

  if (!pathname.startsWith("/chat")) return null;

  return (
    <>
      {isSidebarOpen && isDesktop ? (
        <DesktopChatSideBar
          groupedChats={groupedChats}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          setIsSidebarOpen={closeSidebar}
        />
      ) : (
        <MobileChatSideBar
          groupedChats={groupedChats}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={closeSidebar}
        />
      )}
    </>
  );
}
