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
 * PUT: 채팅 제목 변경
 * 요청 URL: /api/chat-handler?chatId=...
 * 요청 본문: { newTitle: string }
 */
export async function PUT(req: NextRequest): Promise<Response> {
  try {
    // URL에서 chatId 추출
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get("chatId");
    if (!chatId) {
      return NextResponse.json({ error: "Missing chatId" }, { status: 400 });
    }

    // 요청 본문에서 newTitle 추출
    const body = await req.json();
    const { newTitle } = body;
    if (!newTitle) {
      return NextResponse.json({ error: "Missing newTitle" }, { status: 400 });
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

    // 채팅 제목 업데이트
    const updatedChat = await prisma.chat.update({
      where: { id: chatId },
      data: { title: newTitle },
    });

    return NextResponse.json({
      message: "Chat title updated successfully",
      chat: updatedChat,
    });
  } catch (error) {
    console.error("PUT /api/chat-handler Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
