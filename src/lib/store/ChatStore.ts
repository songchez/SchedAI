// /src/store/chatStore.ts
import { Message } from "ai";
import { create } from "zustand";

interface ChatStore {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
}

export const useChatStore = create<ChatStore>(
  (set: (arg0: { messages: Message[] }) => unknown) => ({
    messages: [],
    setMessages: (messages: Message[]) => set({ messages }),
  })
);
