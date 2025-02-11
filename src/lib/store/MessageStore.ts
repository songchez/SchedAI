// src/lib/store/MessageStore.ts
import { Message } from "ai";
import { create } from "zustand";

interface MessageStore {
  messages: Message[];
  // 기존 상태를 덮어쓰는 setter
  setMessages: (messages: Message[]) => void;
  // 누적해서 새 메시지를 추가하는 함수
  addMessages: (newMessages: Message[]) => void;
}

export const useMessageStore = create<MessageStore>((set) => ({
  messages: [],
  setMessages: (messages: Message[]) => set({ messages }),
  addMessages: (newMessages: Message[]) =>
    set((state) => ({ messages: [...state.messages, ...newMessages] })),
}));
