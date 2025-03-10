// 객체로 사용하기 위해 상수로 정의
export const AI_MODELS = {
  GEMINI_20_FLASH: { value: "gemini-2.0-flash-001", key: "Gemini2.0 Flash" },
  GEMINI_15_FLASH: { value: "gemini-1.5-flash", key: "Gemini1.5 Flash" },
  GPT_4O_MINI: { value: "gpt-4o-mini", key: "GPT4o Mini" },
  Claude35_Haiku: {
    value: "claude-3-5-haiku-20241022",
    key: "Claude3.5 Haiku",
  },
} as const;
export type AIModels = (typeof AI_MODELS)[keyof typeof AI_MODELS]["value"];

/** 최대 스트리밍 시간 (초) */
export const MAX_DURATION = 30;
