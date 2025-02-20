import { useRouter, usePathname } from "next/navigation";
import { useChatStore } from "@/lib/store/ChatStore";
import { useChatUIStore } from "@/lib/store/ChatUIStore";

export function useChatActions() {
  const updateChat = useChatStore((state) => state.updateChat);
  const deleteChat = useChatStore((state) => state.deleteChat);
  const setEditingChat = useChatUIStore((state) => state.setEditingChat);
  const addLoadingChatId = useChatUIStore((state) => state.addLoadingChatId);
  const removeLoadingChatId = useChatUIStore(
    (state) => state.removeLoadingChatId
  );
  const pathname = usePathname();
  const router = useRouter();

  const activeChatId = pathname.split("/chat/")[1];

  const handleRenameSubmit = async (chatId: string, newTitle: string) => {
    setEditingChat(null);
    addLoadingChatId(chatId);
    try {
      await updateChat(chatId, { title: newTitle });
    } catch (error) {
      if (error instanceof Error) alert("채팅 제목 변경에 실패했습니다.");
    } finally {
      removeLoadingChatId(chatId);
    }
  };

  const handleDelete = async (chatId: string) => {
    addLoadingChatId(chatId);
    try {
      await deleteChat(chatId);
      if (activeChatId === chatId) {
        router.push("/chat");
      }
    } catch (error) {
      if (error instanceof Error) alert("채팅 삭제에 실패했습니다.");
    } finally {
      removeLoadingChatId(chatId);
    }
  };

  return { handleRenameSubmit, handleDelete, setEditingChat };
}
