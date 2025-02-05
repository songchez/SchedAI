import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { cardNo, expYear, expMonth, idNo, cardPw, userId } = body;

    // 암호화 처리
    const secretKey = process.env.PAYMENT_CLIENT_SECRET!;
    const key = secretKey.substring(0, 32);
    const iv = secretKey.substring(0, 16);
    const plainText = `cardNo=${cardNo}&expYear=${expYear}&expMonth=${expMonth}&idNo=${idNo}&cardPw=${cardPw}`;

    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
    let encrypted = cipher.update(plainText, "utf8", "hex");
    encrypted += cipher.final("hex");

    // 나이스페이 API 호출
    const nicepayResponse = await fetch(
      "https://sandbox-api.nicepay.co.kr/v1/subscribe/regist",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.PAYMENT_CLIENT_ID}:${secretKey}`
          ).toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          encData: encrypted,
          orderId: crypto.randomUUID(),
          encMode: "A2",
        }),
      }
    );

    const nicepayData = await nicepayResponse.json();

    if (nicepayData.resultCode !== "0000") {
      throw new Error(nicepayData.resultMsg);
    }

    // 프리즈마로 구독 정보 업데이트
    await prisma.$transaction([
      prisma.subscription.upsert({
        where: { userId },
        update: {
          planType: "premium",
          startDate: new Date(),
          endDate: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          ),
          paymentStatus: "active",
        },
        create: {
          userId,
          planType: "premium",
          startDate: new Date(),
          endDate: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          ),
          paymentStatus: "active",
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { availableTokens: { increment: 1000 } },
      }),
    ]);

    return NextResponse.json({
      success: true,
      bid: nicepayData.BID,
      tokens: 1000,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message || "Payment processing failed",
        },
        { status: 500 }
      );
    }
    console.error("Payment processing error:", error);
  }
}
