import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { Button, Spinner } from "@heroui/react";
import { Chat } from "@prisma/client";
import { useRouter } from "next/navigation";
import ChatGroup from "./ChatGroup";

/** 편집 상태 타입 */
interface EditingChat {
  chatId: string;
  title: string;
}

/** 데스크탑용 사이드바 컴포넌트 (UI 변경 없이 기존 모양 유지) */
export default function DesktopChatSideBar({
  groupedChats,
  loading,
  activeChatId,
  editingChat,
  onSelectChat,
  onSetEditingChat,
  onRenameSubmit,
  onDeleteChat,
  router,
  setIsSidebarOpen,
}: {
  groupedChats: Record<string, Chat[]>;
  loading: boolean;
  activeChatId: string;
  editingChat: EditingChat | null;
  onSelectChat: (chatId: string) => void;
  onSetEditingChat: (chatId: string, title: string) => void;
  onRenameSubmit: (chatId: string, newTitle: string) => Promise<void>;
  onDeleteChat: (chatId: string) => Promise<void>;
  router: ReturnType<typeof useRouter>;
  setIsSidebarOpen: (open: boolean) => void;
}) {
  return (
    <div className="w-80 flex flex-col bg-background border-r min-h-screen">
      {/* 상단 헤더 */}
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
          {/* 닫기 버튼 */}
          <Button
            variant="light"
            size="sm"
            isIconOnly
            onPress={() => setIsSidebarOpen(false)}
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>
      {/* 채팅 목록 */}
      <div className="overflow-y-auto flex-grow p-4">
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
              onSelectChat={onSelectChat}
              onSetEditingChat={onSetEditingChat}
              onRenameSubmit={onRenameSubmit}
              onDeleteChat={onDeleteChat}
            />
          ))
        )}
      </div>
    </div>
  );
}
