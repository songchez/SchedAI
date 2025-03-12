// /src/app/api/chat/start/route.ts
"use server";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request): Promise<Response> {
  try {
    const session = await auth();
    const userId = session?.user.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, aiModel } = await req.json();

    // 단일 트랜잭션으로 토큰 확인 및 채팅 생성 처리
    const result = await prisma.$transaction(async (tx) => {
      // 필요한 필드만 선택적으로 조회하여 성능 개선
      const user = await tx.user.findUnique({
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
      });

      if (!user) {
        throw new Error("User not found");
      }

      // 토큰 검사 및 차감
      if (user.subscription?.planType !== "premium") {
        if (user.availableTokens <= 0) {
          throw new Error(
            "토큰이 부족합니다. 프리미엄으로 업그레이드 후 무제한 사용 가능합니다."
          );
        }

        // 토큰 차감 (트랜잭션 내에서 처리)
        await tx.user.update({
          where: { id: userId },
          data: { availableTokens: { decrement: 1 } },
        });
      }

      // 새 채팅 생성 (같은 트랜잭션 내에서 처리)
      const newChat = await tx.chat.create({
        data: {
          userId,
          title: title || "새 채팅",
          aiModel: aiModel || "gemini-2.0-flash-001",
          messageCount: 0,
          isArchived: false,
        },
      });

      return { newChat };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[Chat Start Error]:", error);

    // 오류 메시지 분류 및 적절한 상태 코드 반환
    if (error instanceof Error) {
      if (error.message === "User not found") {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      } else if (error.message.includes("토큰이 부족합니다")) {
        return NextResponse.json({ error: error.message }, { status: 402 });
      }
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
