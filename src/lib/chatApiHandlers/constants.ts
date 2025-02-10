// app/api/chat/constants.ts
import { ToolInvocation } from "ai";

// 객체로 사용하기 위해 상수로 정의
export const AI_MODELS = {
  GEMINI_20_FLASH: "gemini-2.0-flash-exp",
  GEMINI_15_FLASH: "gemini-1.5-flash",
  GPT_4O_MINI: "gpt-4o-mini",
} as const;
export type AIModels = (typeof AI_MODELS)[keyof typeof AI_MODELS];

/** 최대 스트리밍 시간 (초) */
export const MAX_DURATION = 30;
