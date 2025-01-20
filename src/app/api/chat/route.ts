import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { LanguageModelV1, streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const MAX_DURATION = 30;

// 모델 키 상수 정의
const MODEL_KEYS = {
  GEMINI: "gemini-2.0-flash-exp",
  GPT4_MINI: "gpt-4o-mini",
} as const;

// 모델 제공자 매핑 함수
const getModelWithProvider = (model: string): LanguageModelV1 => {
  const providers: Record<string, () => LanguageModelV1> = {
    [MODEL_KEYS.GEMINI]: () => google(model),
    [MODEL_KEYS.GPT4_MINI]: () => openai(model),
  };

  const provider = providers[model];
  if (!provider) throw new Error(`Unsupported model: ${model}`);
  return provider();
};

// 에러 핸들러
const errorHandler = (error: unknown): string => {
  if (!error) return "Unknown error occurred.";
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  return JSON.stringify(error);
};

// POST 핸들러
export async function POST(req: Request): Promise<Response> {
  try {
    const { messages, model } = await req.json();

    if (!messages || !model) {
      return new Response("Invalid request payload", { status: 400 });
    }

    const modelWithProvider = getModelWithProvider(model);

    return streamText({
      model: modelWithProvider,
      messages,
    }).toDataStreamResponse({
      getErrorMessage: errorHandler,
    });
  } catch (error) {
    return new Response(errorHandler(error), { status: 500 });
  }
}
