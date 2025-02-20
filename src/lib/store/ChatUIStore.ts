import { create } from "zustand";

export interface EditingChat {
  chatId: string;
  title: string;
}

interface ChatUIState {
  editingChat: EditingChat | null;
  loadingChatIds: string[];
  setEditingChat: (chat: EditingChat | null) => void;
  addLoadingChatId: (id: string) => void;
  removeLoadingChatId: (id: string) => void;
}

export const useChatUIStore = create<ChatUIState>((set) => ({
  editingChat: null,
  loadingChatIds: [],
  setEditingChat: (chat) => set({ editingChat: chat }),
  addLoadingChatId: (id) =>
    set((state) => ({ loadingChatIds: [...state.loadingChatIds, id] })),
  removeLoadingChatId: (id) =>
    set((state) => ({
      loadingChatIds: state.loadingChatIds.filter((x) => x !== id),
    })),
}));
