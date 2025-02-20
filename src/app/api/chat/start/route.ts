// /src/app/api/chat/start.ts
"use server";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request): Promise<Response> {
  const session = await auth();
  const userId = session?.user.id;
  const { title, aiModel } = await req.json();

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
      title,
      aiModel, // 기본 모델 설정 (프론트에서 변경 가능)
      messageCount: 0,
      isArchived: false,
    },
  });

  return NextResponse.json({ newChat });
}
