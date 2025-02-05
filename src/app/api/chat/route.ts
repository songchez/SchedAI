// app/api/chat/route.ts
"use server";

import { NextRequest } from "next/server";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { LanguageModelV1, streamText } from "ai";
import { AIModels, Message } from "@/lib/chatApiHandlers/constants";
import {
  getCalendarEventsTool,
  addEventToCalendarTool,
  updateEventInCalendarTool,
  deleteEventFromCalendarTool,
  getTasksFromListTool,
  addTaskToListTool,
  updateTaskInListTool,
  deleteTaskFromListTool,
  // clearCompletedTasksTool,
} from "@/lib/chatApiHandlers/tools";
import { auth } from "@/auth";
import { getCalendarList } from "@/lib/googleClient";
import { prisma } from "@/lib/prisma";

/**
 * providersMap: 모델 키 -> 실제 모델 인스턴스 생성 함수
 * (오픈AI, PaLM 등)
 */
const providersMap: Record<AIModels, () => LanguageModelV1> = {
  "gemini-2.0-flash-thinking-exp": () =>
    google("gemini-2.0-flash-thinking-exp"),
  "gpt-4o-mini": () => openai("gpt-4o-mini"),
};

export async function POST(req: NextRequest): Promise<Response> {
  try {
    // 사용자 인증 확인 + get userId
    const session = await auth();
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }
    const userId = session.user.id;

    // 토큰 및 구독 상태 확인
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    // 프리미엄 아닌 경우 토큰 체크
    if (user.subscription?.planType !== "premium") {
      if (user.availableTokens <= 0) {
        return new Response(
          "토큰이 부족합니다. 프리미엄으로 업그레이드하고 무제한으로 사용해보세요!",
          {
            status: 402,
          }
        );
      }

      // 토큰 차감
      await prisma.user.update({
        where: { id: userId },
        data: { availableTokens: { decrement: 1 } },
      });

      // TODO: 일일토큰 - 만약 마지막 요청이 어제였다면, 토큰 100개로 초기화
    }

    // body 파싱
    const { messages, model }: { messages: Message[]; model: AIModels } =
      await req.json();

    // 모델 유효성 검사
    if (!(model in providersMap)) {
      return new Response(`Invalid model: ${model}`, { status: 400 });
    }
    const calendars = await getCalendarList(userId);
    // 타입 안전한 모델 인스턴스 생성
    const modelInstance = providersMap[model]();

    // 시스템 메시지 동적 생성
    const systemMessage = `You are SchedAI (${model}). 
      Professional schedule assistant. 
      Current time: ${new Date().toISOString()}
      User calendar id is ${calendars[0].id?.toString()}`;

    // streamText를 이용해 AI 호출
    const result = streamText({
      model: modelInstance,
      system: systemMessage,
      messages,
      tools: {
        getCalendarEventsTool,
        addEventToCalendarTool,
        updateEventInCalendarTool,
        deleteEventFromCalendarTool,
        getTasksFromListTool,
        addTaskToListTool,
        updateTaskInListTool,
        deleteTaskFromListTool,
      },
    });

    // 스트리밍 응답
    return result.toDataStreamResponse();
  } catch (err) {
    const session = await auth();
    const userId = session?.user.id;
    if (err instanceof Error) {
      if (userId) {
        // 에러발생시 토큰 복구
        await prisma.user.update({
          where: { id: userId },
          data: { availableTokens: { increment: 1 } },
        });
      }
      console.error("/api/chat POST Error:", err);
      return new Response(err.message || "Internal Server Error", {
        status: 500,
      });
    } else {
      throw new Error("알수없는 오류");
    }
  }
}
