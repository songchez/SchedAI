"use server";

import { NextRequest, NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { LanguageModelV1, Message, streamText } from "ai";

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

/**
 * AI 모델별 실제 LanguageModelV1 인스턴스를 생성하는 함수 맵
 */
const providersMap: Record<AIModels, () => LanguageModelV1> = {
  "gemini-1.5-flash": () => google("gemini-1.5-flash"),
  "gemini-2.0-flash-exp": () => google("gemini-2.0-flash-exp"),
  "gpt-4o-mini": () => openai("gpt-4o-mini"),
};

/** GET: 특정 chatId의 메시지(Message타입)를 반환 : 동적라우팅(page.tsx) 렌더전에 호출 */
export async function GET(request: Request) {
  try {
    console.log("[GET] 시작");
    const { searchParams } = new URL(request.url);

    // chatId 파싱
    const chatId = searchParams.get("chatId");
    console.log("[GET] chatId:", chatId);
    if (!chatId) {
      console.error("[GET] chatId 누락");
      return NextResponse.json({ error: "Missing chatId" }, { status: 400 });
    }
    // messageEntities 가져오기
    const messageEntities = await prisma.messageEntity.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
    });
    console.log("[GET] messageEntities:", messageEntities);

    if (!messageEntities) {
      console.error("[GET] 채팅 없음");
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    console.log("[GET] 완료");
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
 * POST: 새 메시지 전송 (새 채팅 생성 또는 기존 채팅 업데이트) 후 AI 답변 스트리밍
 * 요청 본문에는 유저가 보낸 메시지 배열, 사용된 AI 모델, 그리고 채팅 ID(없으면 새 채팅 생성)가 포함됩니다.
 * AI 응답이 완전히 생성되면 최종 AI 응답 메시지를 DB에 저장합니다.
 */
export async function POST(req: NextRequest): Promise<Response> {
  let userId: string | undefined;
  console.log("[POST] 요청 시작");

  try {
    // 사용자 인증 확인
    const session = await auth();
    userId = session?.user.id;
    console.log("[POST] 인증된 사용자 ID:", userId);
    if (!userId) {
      console.error("[POST] 사용자 ID 누락");
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // 요청 본문 파싱
    const { messages, model, chatId } = (await req.json()) as {
      messages: Message[];
      model: AIModels;
      chatId: string;
    };
    console.log("[POST] 요청 본문 파싱 완료:", { messages, model, chatId });

    // 모델 유효성 검사
    if (!(model in providersMap)) {
      console.error("[POST] 잘못된 모델:", model);
      return new Response(`Invalid model: ${model}`, { status: 400 });
    }
    const modelInstance = providersMap[model]();
    console.log("[POST] 모델 인스턴스 생성 완료");

    // 사용자의 구글 캘린더 목록 가져오기
    const calendars = await getCalendarList(userId);
    console.log("[POST] 구글 캘린더 목록:", calendars);

    console.log("[POST] 기존 채팅에 메시지 추가, chatId:", chatId);
    // 기존 채팅에 새 메시지 추가: 마지막 유저 메시지를 추가하는 예시
    if (messages.length > 0) {
      const userMessage = messages[messages.length - 1];
      console.log("[POST] 새 유저 메시지 저장 시작");
      await prisma.messageEntity.create({
        data: {
          content: userMessage.content,
          role: userMessage.role,
          chatId: chatId,
          createdAt: userMessage.createdAt
            ? new Date(userMessage.createdAt)
            : new Date(),
        },
      });
      console.log("[POST] 새 유저 메시지 저장 완료");
    }

    // 토큰 및 구독 상태 확인
    console.log("[POST] 토큰 및 구독 상태 확인 시작");
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });
    if (!user) {
      console.error("[POST] 사용자 없음");
      return new Response("User not found", { status: 404 });
    }
    if (user.subscription?.planType !== "premium") {
      if (user.availableTokens <= 0) {
        const errMsg =
          "토큰이 부족합니다. 프리미엄으로 업그레이드 후 무제한 사용 가능합니다.";
        console.error("[POST] 토큰 부족:", errMsg);
        return new Response(errMsg, { status: 402 });
      }
      await prisma.user.update({
        where: { id: userId },
        data: { availableTokens: { decrement: 1 } },
      });
      console.log("[POST] 토큰 차감 완료");
    }
    console.log("[POST] 토큰 및 구독 상태 확인 완료");

    // 시스템 프롬프트 메시지 생성
    const systemMessage = `You are SchedAI (${model}).
Professional schedule assistant.
Current time: ${new Date().toISOString()}
User calendar id is: ${calendars?.[0]?.id?.toString() ?? "(No calendar id)"} `;
    console.log("[POST] 시스템 메시지 생성:", systemMessage);

    // AI에 보낼 메시지
    console.log("[POST] AI에 보낼 메시지:", messages);

    // AI 호출: streamText를 통해 스트리밍 결과를 받습니다.
    console.log("[POST] AI 호출 시작");
    const result = streamText({
      model: modelInstance,
      system: systemMessage,
      messages: messages,
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

    // 🛠️ **비동기적으로 DB 저장 (스트리밍 반환 후 실행)**
    result.text.then(async (fullText) => {
      try {
        await prisma.messageEntity.create({
          data: {
            content: fullText,
            role: "assistant",
            chatId: chatId!,
            createdAt: new Date(),
          },
        });

        // 채팅의 messageCount 업데이트
        await prisma.chat.update({
          where: { id: chatId },
          data: { messageCount: { increment: 1 } },
        });
        console.log("[POST] AI 응답 메시지 DB 저장 완료");
      } catch (err) {
        console.error("[POST] DB 저장 중 오류 발생:", err);
      }
    });

    // 스트리밍 응답을 클라이언트로 전달합니다.
    console.log("[POST] 스트리밍 응답 클라이언트 전달");
    return result.toDataStreamResponse();
  } catch (err) {
    if (userId && err instanceof Error) {
      console.error("[POST] /api/chat POST Error:", err);
      return new Response(err.message || "Internal Server Error", {
        status: 500,
      });
    }
    console.error("[POST] Unknown Error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
