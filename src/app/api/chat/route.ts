// app/api/chat/route.ts
"use server";

import { NextRequest } from "next/server";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import {
  Message,
  MODEL_KEYS,
  getModelWithProvider,
} from "@/lib/chatApiHandlers/constants";
import {
  getCalendarsListTool,
  getCalendarEventsTool,
  addEventToCalendarTool,
  updateEventInCalendarTool,
  deleteEventFromCalendarTool,
  addTaskToListTool,
  updateTaskInListTool,
  deleteTaskFromListTool,
  clearCompletedTasksTool,
} from "@/lib/chatApiHandlers/tools";

/**
 * providersMap: 모델 키 -> 실제 모델 인스턴스 생성 함수
 * (오픈AI, PaLM 등)
 */
const providersMap = {
  [MODEL_KEYS.GEMINI]: () => google(MODEL_KEYS.GEMINI),
  [MODEL_KEYS.GPT4_MINI]: () => openai(MODEL_KEYS.GPT4_MINI),
};

export async function POST(req: NextRequest): Promise<Response> {
  try {
    // body 파싱
    const { messages, model }: { messages: Message[]; model: string } =
      await req.json();
    if (!messages || !model) {
      return new Response("Invalid request payload", { status: 400 });
    }

    // 모델 준비
    const modelWithProvider = getModelWithProvider(model, providersMap);
    const today = new Date();

    // streamText를 이용해 AI 호출
    const result = streamText({
      model: modelWithProvider,
      system: `You are SchedAI. Today is ${today.toISOString()}.`,
      messages,
      tools: {
        getCalendarsListTool,
        getCalendarEventsTool,
        addEventToCalendarTool,
        updateEventInCalendarTool,
        deleteEventFromCalendarTool,
        addTaskToListTool,
        updateTaskInListTool,
        deleteTaskFromListTool,
        clearCompletedTasksTool,
      },
    });

    // 스트리밍 응답
    return result.toDataStreamResponse();
  } catch (err) {
    if (err instanceof Error) {
      console.error("/api/chat POST Error:", err);
      return new Response(err.message || "Internal Server Error", {
        status: 500,
      });
    } else {
      throw new Error("알수없는 오류");
    }
  }
}
