// /src/app/api/chat/start.ts
"use server";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Message } from "ai";

export async function POST(req: NextRequest): Promise<Response> {
  const session = await auth();
  const userId = session?.user.id;

  const { messages } = (await req.json()) as {
    messages: Message[];
  };

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
    console.log("[POST] 토큰 차감 완료(chat생성하는데 토큰사용)");
  }
  console.log("[POST] 토큰 및 구독 상태 확인 완료");

  // ✅ 1️⃣ 새로운 채팅 ID 생성
  const newChat = await prisma.chat.create({
    data: {
      userId,
      title: "새 채팅",
      aiModel: "gemini-1.5-flash", // 기본 모델 설정 (프론트에서 변경 가능)
      messageCount: 0,
      isArchived: false,
    },
  });
  // 첫 번째 유저 메시지를 DB에 저장 (예: messages[0])
  if (messages.length > 0) {
    const firstMessage = messages[0];
    console.log("[POST] 첫 번째 유저 메시지 저장 시작");
    await prisma.messageEntity.create({
      data: {
        content: firstMessage.content,
        role: firstMessage.role,
        chatId: newChat.id,
        createdAt: firstMessage.createdAt
          ? new Date(firstMessage.createdAt)
          : new Date(),
      },
    });
    console.log("[POST] 첫 번째 유저 메시지 저장 완료");
  }

  return NextResponse.json({ newChatId: newChat.id }); // 채팅 ID만 반환
}
