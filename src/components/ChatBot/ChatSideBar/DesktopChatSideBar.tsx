import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { Button } from "@heroui/react";
import { Chat } from "@prisma/client";
import { useRouter } from "next/navigation";
import ChatGroup from "./ChatGroup";
import Link from "next/link";

/** 편집 상태 타입 */
interface EditingChat {
  chatId: string;
  title: string;
}

/**
 * 데스크탑용 사이드바 컴포넌트
 * - 각 채팅 항목의 로딩 상태에 따라 스피너를 개별적으로 표시합니다.
 */
interface DesktopChatSideBarProps {
  groupedChats: Record<string, Chat[]>;
  activeChatId: string;
  editingChat: EditingChat | null;
  onSelectChat: (chatId: string) => void;
  onSetEditingChat: (chatId: string, title: string) => void;
  onRenameSubmit: (chatId: string, newTitle: string) => Promise<void>;
  onDeleteChat: (chatId: string) => Promise<void>;
  router: ReturnType<typeof useRouter>;
  setIsSidebarOpen: (open: boolean) => void;
  loadingChatIds: string[];
}

export default function DesktopChatSideBar({
  groupedChats,
  activeChatId,
  editingChat,
  onSelectChat,
  onSetEditingChat,
  onRenameSubmit,
  onDeleteChat,
  setIsSidebarOpen,
  loadingChatIds,
}: DesktopChatSideBarProps) {
  return (
    <div className="w-80 flex flex-col bg-background border-r min-h-screen">
      {/* 상단 헤더 */}
      <div className="p-4 flex-shrink-0 sticky top-0 bg-background z-10 border-b">
        <div className="flex justify-between items-center">
          <Link href={"/chat"}>
            <Button
              // 새 대화 생성 핸들러 호출
              color="primary"
              size="sm"
              className="dark:text-black"
            >
              + 새 대화
            </Button>
          </Link>
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
      {/* 채팅 목록 (각 그룹 및 채팅 항목에서 개별 스피너 표시) */}
      <div className="overflow-y-auto flex-grow p-4">
        {Object.entries(groupedChats).map(([group, groupChats]) => (
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
            loadingChatIds={loadingChatIds}
          />
        ))}
      </div>
    </div>
  );
}
