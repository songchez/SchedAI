// app/api/chat/constants.ts
import { LanguageModelV1, ToolInvocation } from "ai";

/** Message 인터페이스 */
export interface Message {
  role: "user" | "assistant";
  content: string;
  toolInvocations?: ToolInvocation[]; // ToolInvocation[] 타입이지만, 여기에선 단순화
}

/** 최대 스트리밍 시간 (초) */
export const MAX_DURATION = 30;

/** 모델 키 상수 정의 */
export const MODEL_KEYS = {
  GEMINI: "gemini-2.0-flash-exp",
  GPT4_MINI: "gpt-4o-mini",
} as const;

/** 모델 제공자 매핑 함수 */
export function getModelWithProvider(
  modelKey: string,
  providersMap: Record<string, () => LanguageModelV1>
): LanguageModelV1 {
  const provider = providersMap[modelKey];
  if (!provider) {
    throw new Error(`Unsupported model: ${modelKey}`);
  }
  return provider();
}
