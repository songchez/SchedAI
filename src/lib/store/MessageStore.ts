// /src/store/chatStore.ts
import { Message } from "ai";
import { create } from "zustand";

interface MessageStore {
  messages: Message[];
  setMessages: (messages: Message[]) => void;
}

export const useMessageStore = create<MessageStore>(
  (set: (arg0: { messages: Message[] }) => unknown) => ({
    messages: [],
    setMessages: (messages: Message[]) => set({ messages }),
  })
);
