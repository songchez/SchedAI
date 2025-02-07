import { Button, Spinner } from "@heroui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Chat } from "@prisma/client";

export default function ChatSideBar({
  onSelectChat,
  activeChatId,
}: {
  onSelectChat: (chatId: string | null) => void;
  activeChatId: string | null;
}) {
  const { data: session } = useSession();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);

  // 채팅 목록 불러오기
  useEffect(() => {
    const fetchChats = async () => {
      if (session?.user?.email) {
        setLoading(true);
        const response = await fetch(`/api/chats?userId=${session.user.email}`);
        const data = await response.json();
        setChats(data);
        setLoading(false);
      }
    };
    fetchChats();
  }, [session]);

  // 새 채팅 생성
  const createNewChat = async () => {
    const response = await fetch("/api/chats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: session?.user?.email,
        title: "새 채팅",
      }),
    });
    const newChat = await response.json();
    setChats([newChat, ...chats]);
    onSelectChat(newChat.id);
  };

  return (
    <div className="w-64 h-screen bg-background p-4 border-r">
      <Button onPress={createNewChat} color="primary" className="w-full mb-4">
        + 새 채팅
      </Button>

      {loading ? (
        <Spinner />
      ) : (
        <div className="space-y-2">
          {chats.map((chat) => (
            <Button
              key={chat.id}
              variant={activeChatId === chat.id ? "solid" : "light"}
              color="primary"
              className="w-full text-left justify-start truncate"
              onPress={() => onSelectChat(chat.id)}
            >
              {chat.title}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
