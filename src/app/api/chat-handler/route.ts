import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET: userID받아서 chat목록 줌 -> ChatSideBar.tsx
 */
export async function GET() {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId)
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  try {
    const chats = await prisma.chat.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(chats);
  } catch (error) {
    console.error("채팅 목록 불러오기 실패:", error);
    return NextResponse.json(
      { error: "채팅 목록 불러오기 실패" },
      { status: 500 }
    );
  }
}

/**
 * DELETE: 특정 chatId의 채팅과 관련된 메시지 모두를 삭제합니다.
 */
export async function DELETE(req: NextRequest): Promise<Response> {
  try {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chatId");
    if (!chatId) {
      return NextResponse.json({ error: "Missing chatId" }, { status: 400 });
    }

    // 채팅이 존재하는지 확인 (존재하지 않으면 404 응답)
    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
    });
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    await prisma.chat.delete({
      where: { id: chatId },
    });

    return NextResponse.json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST: 채팅 업데이트
 * 요청 URL: /api/chat-handler?chatId=...
 * 요청 본문: { title?: string, aiModel?: string, messageCount?: number, isArchived?: boolean, ... }
 *  - body에 포함된 필드만 업데이트합니다.
 */
export async function POST(req: NextRequest): Promise<Response> {
  try {
    // URL에서 chatId 추출
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chatId");
    if (!chatId) {
      return NextResponse.json({ error: "Missing chatId" }, { status: 400 });
    }

    // 요청 본문에서 업데이트할 필드 추출
    const body = await req.json();
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "No update fields provided" },
        { status: 400 }
      );
    }

    // 사용자 인증 확인
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 채팅이 존재하는지, 그리고 요청 사용자가 소유한 채팅인지 확인
    const chat = await prisma.chat.findUnique({ where: { id: chatId } });
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }
    if (chat.userId !== session.user.id) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    // 업데이트할 수 있는 필드 목록 (원하는 필드를 추가/제한)
    const allowedFields = ["title", "aiModel", "messageCount", "isArchived"];
    const updateData: Record<string, Chat> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid update fields provided" },
        { status: 400 }
      );
    }

    // 채팅 업데이트
    const updatedChat = await prisma.chat.update({
      where: { id: chatId },
      data: updateData,
    });

    return NextResponse.json({
      message: "Chat updated successfully",
      chat: updatedChat,
    });
  } catch (error) {
    console.error("POST /api/chat-handler Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
