import { create } from "zustand";

type ChatInputStore = {
  value: string;
  setInput: (value: string) => void;
  clearInput: () => void;
};

export const useChatInputStore = create<ChatInputStore>((set) => ({
  value: "",
  setInput: (inputValue) => set({ value: inputValue }),
  clearInput: () => set({ value: "" }),
}));
