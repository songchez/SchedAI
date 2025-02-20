import { AIModels } from "../chatApiHandlers/constants";

export {};

declare global {
  interface Chat {
    id: string;
    userId: string;
    title: string;
    aiModel: AIModels;
    messageCount: number;
    isArchived: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
}
