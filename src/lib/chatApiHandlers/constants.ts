// app/api/chat/constants.ts
import { ToolInvocation } from "ai";

/** Message 인터페이스 */
export interface Message {
  role: "user" | "assistant";
  content: string;
  toolInvocations?: ToolInvocation[]; // ToolInvocation[] 타입이지만, 여기에선 단순화
}

// 객체로 사용하기 위해 상수로 정의
export const AI_MODELS = {
  GEMINI_20_FLASH_THINKING: "gemini-2.0-flash-thinking-exp",
  GPT_4O_MINI: "gpt-4o-mini",
} as const;
export type AIModels = (typeof AI_MODELS)[keyof typeof AI_MODELS];

/** 최대 스트리밍 시간 (초) */
export const MAX_DURATION = 30;
