"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Chat } from "@prisma/client";

interface ChatStore {
  chats: Chat[];
  fetchChats: (userId?: string) => Promise<void>;
  renameChat: (chatId: string, newTitle: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  setChats: (chats: Chat[]) => void;
}

export const useChatStore = create<ChatStore>()(
  devtools((set) => ({
    chats: [],
    /** -----------------------------------------
     * 채팅 목록 가져오기
     * ---------------------------------------- */
    fetchChats: async (userId) => {
      if (!userId) return;
      try {
        const response = await fetch("/api/chat-handler");
        if (!response.ok) {
          console.error("채팅 목록 불러오기 실패:", await response.text());
          return;
        }
        const data = await response.json();
        set({ chats: data });
      } catch (error) {
        console.error("채팅 목록 불러오기 오류:", error);
      }
    },

    /** -----------------------------------------
     * 채팅 이름 수정
     * ---------------------------------------- */
    renameChat: async (chatId, newTitle) => {
      try {
        const res = await fetch(`/api/chat-handler?chatId=${chatId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newTitle }),
        });
        if (!res.ok) {
          console.error("채팅 이름 변경 실패:", await res.text());
          return;
        }
        // 수정 후 전체 목록 다시 불러오기
        const updatedList = await fetch(`/api/chat-handler`);
        if (updatedList.ok) {
          const data = await updatedList.json();
          set({ chats: data });
        }
      } catch (error) {
        console.error("채팅 이름 변경 오류:", error);
      }
    },

    /** -----------------------------------------
     * 채팅 삭제
     * ---------------------------------------- */
    deleteChat: async (chatId) => {
      if (!window.confirm("정말로 이 채팅을 삭제하시겠습니까?")) return;
      try {
        const res = await fetch(`/api/chat-handler?chatId=${chatId}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          console.error("채팅 삭제 실패:", await res.text());
          return;
        }
        // 삭제 후 전체 목록 다시 불러오기
        const updatedList = await fetch(`/api/chat-handler`);
        if (updatedList.ok) {
          const data = await updatedList.json();
          set({ chats: data });
        }
      } catch (error) {
        console.error("채팅 삭제 오류:", error);
      }
    },

    /** -----------------------------------------
     * (옵션) chats를 직접 세팅하는 Setter
     * ---------------------------------------- */
    setChats: (chats) => set({ chats }),
  }))
);
