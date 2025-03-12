"use server";

import { NextRequest, NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { anthropic } from "@ai-sdk/anthropic";
import { LanguageModelV1, streamText } from "ai";
import { UIMessage } from "@ai-sdk/ui-utils";
import { AIModels } from "@/lib/chatApiHandlers/constants";
import {
  getCalendarEventsTool,
  addEventToCalendarTool,
  updateEventInCalendarTool,
  deleteEventFromCalendarTool,
  getTasksFromListTool,
  addTaskToListTool,
  updateTaskInListTool,
  deleteTaskFromListTool,
} from "@/lib/chatApiHandlers/tools";
import { auth } from "@/auth";
import { getCalendarList } from "@/lib/googleClient";
import { prisma } from "@/lib/prisma";
import { extractPlainToolResult } from "@/lib/chatApiHandlers/utils";
import { MessageEntity } from "@prisma/client";

// 메모이제이션을 위한 캐시 맵 (인메모리 캐싱)
// 실제 프로덕션에서는 Redis 등의 외부 캐시 사용 권장
const messageCache = new Map<
  string,
  { data: MessageEntity[]; timestamp: number }
>();
const CACHE_TTL = 60 * 1000; // 60초 캐시 유지

/**
 * AI 모델별 실제 LanguageModelV1 인스턴스를 생성하는 함수 맵
 * 지연 초기화(lazy initialization)로 최적화
 */
const getModelInstance = (model: AIModels): LanguageModelV1 => {
  switch (model) {
    case "gemini-1.5-flash":
      return google("gemini-1.5-flash");
    case "gemini-2.0-flash-001":
      return google("gemini-2.0-flash-001");
    case "gpt-4o-mini":
      return openai("gpt-4o-mini");
    case "claude-3-5-haiku-20241022":
      return anthropic("claude-3-5-haiku-20241022") as LanguageModelV1;
    default:
      throw new Error(`Invalid model: ${model}`);
  }
};

/** GET: 특정 chatId의 메시지(Message타입)를 반환 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get("chatId");

    if (!chatId) {
      return NextResponse.json({ error: "Missing chatId" }, { status: 400 });
    }

    // 캐시 확인 (인메모리 캐싱)
    const cacheKey = `messages:${chatId}`;
    const cachedData = messageCache.get(cacheKey);
    const now = Date.now();

    if (cachedData && now - cachedData.timestamp < CACHE_TTL) {
      return NextResponse.json(cachedData.data);
    }

    // 캐시 미스: DB에서 조회
    const messageEntities = await prisma.messageEntity.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
      // 필요한 필드만 선택적으로 가져오기
      select: {
        chatId: true,
        id: true,
        content: true,
        role: true,
        parts: true,
        createdAt: true,
      },
    });

    if (!messageEntities || messageEntities.length === 0) {
      return NextResponse.json([]);
    }

    // 결과 캐싱
    messageCache.set(cacheKey, {
      data: messageEntities,
      timestamp: now,
    });

    return NextResponse.json(messageEntities);
  } catch (error) {
    console.error("[GET] Error fetching chat:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST: 새 메시지 전송 및 AI 답변 스트리밍
 */
export async function POST(req: NextRequest): Promise<Response> {
  let userId: string | undefined;

  try {
    // 사용자 인증 확인
    const session = await auth();
    userId = session?.user.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 요청 본문 파싱
    const { messages, model, chatId } = (await req.json()) as {
      messages: UIMessage[];
      model: AIModels;
      chatId: string;
    };

    // 병렬로 처리할 수 있는 초기 요청들 한 번에 실행
    const [user, calendars] = await Promise.all([
      // 사용자 및 구독 정보 가져오기 (필요한 필드만)
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          availableTokens: true,
          subscription: {
            select: {
              planType: true,
            },
          },
        },
      }),
      // 사용자의 구글 캘린더 목록 가져오기
      getCalendarList(userId),
    ]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 트랜잭션으로 메시지 저장 및 토큰 처리
    try {
      await prisma.$transaction(async (tx) => {
        // 1. 사용자 메시지 저장
        if (messages.length > 0) {
          const userMessage = messages[messages.length - 1];
          await tx.messageEntity.create({
            data: {
              content: userMessage.content,
              role: userMessage.role,
              parts: JSON.parse(JSON.stringify(userMessage.parts)),
              chatId,
              createdAt: userMessage.createdAt
                ? new Date(userMessage.createdAt)
                : new Date(),
            },
          });
        }

        // 2. 토큰 검사 및 차감 (프리미엄 사용자가 아닌 경우)
        if (user.subscription?.planType !== "premium") {
          if (user.availableTokens <= 0) {
            throw new Error(
              "토큰이 부족합니다. 프리미엄으로 업그레이드 후 무제한 사용 가능합니다."
            );
          }

          await tx.user.update({
            where: { id: userId },
            data: { availableTokens: { decrement: 1 } },
          });
        }
      });
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("토큰이 부족합니다")
      ) {
        return new Response(error.message, { status: 402 });
      }
      throw error;
    }

    // 시스템 프롬프트 생성
    const systemPrompt = `You are SchedAI. Professional schedule assistant.
한국기준 현재시간: ${new Date().toLocaleString("ko-KR")}
User calendar id is: ${calendars?.[0]?.id?.toString() ?? "(No calendar id)"} `;

    // AI 모델 인스턴스 생성 (필요할 때만)
    const modelInstance = getModelInstance(model);

    // AI 호출 및 스트리밍
    const result = streamText({
      model: modelInstance,
      system: systemPrompt,
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

    // 응답 저장 처리 (비동기)
    result.text.then(async (finalText) => {
      try {
        // 도구 결과 처리
        const toolResultsData = result.toolResults
          ? await result.toolResults.then((results) => {
              return Array.isArray(results)
                ? results.map(extractPlainToolResult)
                : [extractPlainToolResult(results)];
            })
          : [];

        // 트랜잭션으로 한 번에 처리
        await prisma.$transaction([
          prisma.messageEntity.create({
            data: {
              parts: toolResultsData,
              role: "assistant",
              content: finalText || "---",
              chatId,
              createdAt: new Date(),
            },
          }),
          prisma.chat.update({
            where: { id: chatId },
            data: { messageCount: { increment: 1 } },
          }),
        ]);

        // 응답 저장 후 캐시 무효화
        messageCache.delete(`messages:${chatId}`);
      } catch (err) {
        console.error("[POST] DB 저장 중 오류 발생:", err);
      }
    });

    // 스트리밍 응답 전달
    return result.toDataStreamResponse({ sendReasoning: true });
  } catch (err) {
    console.error("[POST] /api/chat/stream Error:", err);
    return new Response(
      err instanceof Error ? err.message : "Internal Server Error",
      { status: 500 }
    );
  }
}
