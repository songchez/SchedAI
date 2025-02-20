"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface ChatStore {
  chats: Chat[];
  fetchChats: (userId?: string) => Promise<void>;
  createChat: (newChat: Chat) => Promise<Chat>;
  updateChat: (
    chatId: string,
    updateData: Partial<{
      title: string;
      aiModel: string;
      messageCount: number;
      isArchived: boolean;
    }>
  ) => Promise<void>;
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
     * 새로운 채팅 생성 (옵티미스틱 업데이트)
     * ---------------------------------------- */
    createChat: async (newChat) => {
      try {
        set((state) => ({
          chats: [newChat, ...state.chats],
        }));
        console.log("New Chat 생성 완료!");
        return newChat;
      } catch (error) {
        console.error("채팅 생성 오류:", error);
        return null;
      }
    },

    /** -----------------------------------------
     * 채팅 업데이트 (title, aiModel, messageCount, isArchived 등 동적 업데이트)
     * ---------------------------------------- */
    updateChat: async (chatId, updateData) => {
      try {
        const res = await fetch(`/api/chat-handler?chatId=${chatId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        });
        if (!res.ok) {
          console.error("채팅 업데이트 실패:", await res.text());
          return;
        }
        // 업데이트 후 전체 목록 다시 불러오기
        const updatedList = await fetch(`/api/chat-handler`);
        if (updatedList.ok) {
          const data = await updatedList.json();
          set({ chats: data });
        }
      } catch (error) {
        console.error("채팅 업데이트 오류:", error);
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
