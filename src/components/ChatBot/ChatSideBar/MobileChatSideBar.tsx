import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
} from "@heroui/react";
import ChatGroup from "./ChatGroup";
import Link from "next/link";
import { Chat } from "@prisma/client";
import { useRouter } from "next/navigation";

interface MobileChatSideBarProps {
  groupedChats: Record<string, Chat[]>;
  activeChatId: string;
  onSelectChat: (chatId: string) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

export default function MobileChatSideBar({
  groupedChats,
  activeChatId,
  onSelectChat,
  isSidebarOpen,
  setIsSidebarOpen,
}: MobileChatSideBarProps) {
  const router = useRouter();
  return (
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
                  onSelectChat={(chatId) => {
                    onSelectChat(chatId);
                    onClose();
                  }}
                />
              ))}
            </DrawerBody>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
