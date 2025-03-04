import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { Button } from "@heroui/react";
import Link from "next/link";
import { Chat } from "@prisma/client";
import ChatGroup from "./ChatGroup";

interface DesktopChatSideBarProps {
  groupedChats: Record<string, Chat[]>;
  activeChatId: string;
  onSelectChat: (chatId: string) => void;
  setIsSidebarOpen: (open: boolean) => void;
}

export default function DesktopChatSideBar({
  groupedChats,
  activeChatId,
  onSelectChat,
  setIsSidebarOpen,
}: DesktopChatSideBarProps) {
  return (
    <div className="w-80 flex flex-col bg-background border-r min-h-screen transition-all duration-300">
      <div className="p-4 flex-shrink-0 sticky top-0 bg-background z-10 border-b">
        <div className="flex justify-between items-center">
          <Link href="/chat">
            <Button color="primary" size="sm" className="dark:text-black">
              + 새 대화
            </Button>
          </Link>
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
      <div className="overflow-y-auto flex-grow p-4">
        {Object.entries(groupedChats).map(([group, groupChats]) => (
          <ChatGroup
            key={group}
            groupTitle={group}
            chats={groupChats}
            activeChatId={activeChatId}
            onSelectChat={onSelectChat}
          />
        ))}
      </div>
    </div>
  );
}
