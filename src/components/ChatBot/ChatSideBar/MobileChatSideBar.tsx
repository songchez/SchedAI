"use client";

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from "@heroui/react";
import ChatGroup from "./ChatGroup";
import { Chat } from "@prisma/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface MobileChatSideBarProps {
  groupedChats: Record<string, Chat[]>;
  activeChatId: string;
  editingChat: { chatId: string; title: string } | null;
  onSelectChat: (chatId: string) => void;
  onSetEditingChat: (chatId: string, title: string) => void;
  onRenameSubmit: (chatId: string, newTitle: string) => Promise<void>;
  onDeleteChat: (chatId: string) => Promise<void> | null;
  router: ReturnType<typeof useRouter>;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  loadingChatIds: string[];
}

/** 모바일용 사이드바 컴포넌트 (Drawer 적용) */
export default function MobileChatSideBar({
  groupedChats,
  activeChatId,
  editingChat,
  onSelectChat,
  onSetEditingChat,
  onRenameSubmit,
  onDeleteChat,
  router,
  isSidebarOpen,
  setIsSidebarOpen,
  loadingChatIds,
}: MobileChatSideBarProps) {
  return (
    <div>
      <Drawer
        placement="left"
        isOpen={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
        className="w-3/4"
      >
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="p-4 border-b flex justify-between items-center">
                <Link href={"/chat"}>
                  <Button
                    onPress={async () => {
                      router.push(`/chat`);
                      onClose();
                    }}
                    color="primary"
                    size="sm"
                    className="dark:text-black"
                  >
                    + 새 대화
                  </Button>
                </Link>
              </DrawerHeader>
              <DrawerBody className="overflow-y-auto max-h-[70vh] p-4">
                {Object.entries(groupedChats).map(([group, groupChats]) => (
                  <ChatGroup
                    key={group}
                    groupTitle={group}
                    chats={groupChats}
                    activeChatId={activeChatId}
                    editingChat={editingChat}
                    loadingChatIds={loadingChatIds}
                    onSelectChat={(chatId: string) => {
                      onSelectChat(chatId);
                      onClose();
                    }}
                    onSetEditingChat={onSetEditingChat}
                    onRenameSubmit={onRenameSubmit}
                    onDeleteChat={onDeleteChat}
                  />
                ))}
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
