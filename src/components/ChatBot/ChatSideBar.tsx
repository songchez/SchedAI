"use client";

import { Button, Spinner } from "@heroui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { Chat } from "@prisma/client";
import {
  ChevronLeftIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useRouter, usePathname } from "next/navigation";
import { useRef } from "react";

/**
 * 채팅 목록을 날짜 범위별로 그룹화
 */
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
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  // editingChat: 현재 편집 중인 채팅의 id와 편집 중인 제목을 저장
  const [editingChat, setEditingChat] = useState<{
    chatId: string;
    title: string;
  } | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const hasFetchedChats = useRef(false);

  // 현재 활성 채팅 ID 추출 (/chat/[chatId] 형태)
  const activeChatId = pathname.split("/chat/")[1];

  // 채팅 목록 불러오기
  const fetchChats = useCallback(async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    try {
      const response = await fetch("/api/chat-handler");
      if (response.ok) {
        const data = await response.json();
        setChats(data);
      } else {
        console.error("채팅 목록 불러오기 실패:", await response.text());
      }
    } catch (error) {
      console.error("채팅 목록 불러오기 실패:", error);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session?.user?.id && !hasFetchedChats.current) {
      fetchChats();
      hasFetchedChats.current = true;
    }
  }, [fetchChats, session?.user?.id]);

  // 채팅 이름 수정 제출 함수 (PUT 요청)
  const handleRenameSubmit = async (chatId: string, newTitle: string) => {
    try {
      const res = await fetch(`/api/chat-handler?chatId=${chatId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newTitle }),
      });
      if (res.ok) {
        fetchChats();
        setEditingChat(null);
      } else {
        console.error("채팅 이름 변경 실패:", await res.text());
      }
    } catch (error) {
      console.error("채팅 이름 변경 오류:", error);
    }
  };

  // 채팅 삭제 함수 (DELETE 요청)
  const handleDelete = async (chatId: string) => {
    if (!window.confirm("정말로 이 채팅을 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`/api/chat-handler?chatId=${chatId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchChats();
        if (activeChatId === chatId) {
          router.push("/chat");
        }
      } else {
        console.error("채팅 삭제 실패:", await res.text());
      }
    } catch (error) {
      console.error("채팅 삭제 오류:", error);
    }
  };

  return (
    <div className="w-64 h-screen bg-background p-4 border-r">
      {/* 사이드바 헤더 */}
      <div className="flex justify-between items-center mb-4">
        <Button
          onPress={() => router.push("/chat")}
          color="primary"
          size="sm"
          className="dark:text-black"
        >
          + 새 대화
        </Button>
        <Button variant="light" size="sm" isIconOnly>
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* 채팅 목록 */}
      {loading ? (
        <Spinner />
      ) : (
        <div className="space-y-4">
          {Object.entries(groupChatsByDate(chats)).map(
            ([group, groupChats]) => (
              <div key={group}>
                <h3 className="text-xs font-medium text-gray-500 mb-2">
                  {group}
                </h3>
                <div className="space-y-1">
                  {groupChats.map((chat) => (
                    <Button
                      key={chat.id}
                      variant={activeChatId === chat.id ? "solid" : "light"}
                      color="primary"
                      className={`w-full text-left justify-between ${
                        activeChatId === chat.id ? "dark:text-black" : ""
                      }`}
                      onPress={() => {
                        // 편집 중이 아닐 때만 채팅 이동
                        if (!editingChat || editingChat.chatId !== chat.id) {
                          router.push(`/chat/${chat.id}`);
                        }
                      }}
                    >
                      {/* 채팅 제목 영역: 편집 중이면 input, 아니면 텍스트 표시 */}
                      {editingChat && editingChat.chatId === chat.id ? (
                        <input
                          type="text"
                          value={editingChat.title}
                          autoFocus
                          onChange={(e) =>
                            setEditingChat({
                              chatId: chat.id,
                              title: e.target.value,
                            })
                          }
                          onBlur={() => {
                            if (editingChat) {
                              handleRenameSubmit(chat.id, editingChat.title);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleRenameSubmit(chat.id, editingChat.title);
                            }
                          }}
                          className="w-full bg-transparent text-left outline-none"
                        />
                      ) : (
                        <span className="truncate">{chat.title}</span>
                      )}

                      {/* 오른쪽 영역을 별도의 div로 감싸 hover 이벤트를 처리 */}
                      <div className="relative flex items-center">
                        {/* 기본 상태: 생성시간 표시 */}
                        <span className="text-xs text-gray-500 transition-opacity duration-200 group-hover:opacity-0">
                          {new Date(chat.createdAt).toLocaleTimeString(
                            "ko-KR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                        {/* Hover 상태: 편집 및 삭제 아이콘 */}
                        <span className="absolute right-0 flex items-center space-x-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingChat({
                                chatId: chat.id,
                                title: chat.title,
                              });
                            }}
                            className="hover:text-green-600"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(chat.id);
                            }}
                            className="hover:text-red-600"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
