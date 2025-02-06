// api/subscribe/[bid]/payments/route.ts
import { prisma } from "@/lib/prisma";
import { generateAuthHeader } from "@/lib/subscribeAPI/utils";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(
  request: Request,
  { params }: { params: { bid: string } }
) {
  try {
    const { bid } = params;
    const { amount, goodsName } = await request.json();

    if (!amount || !goodsName) {
      return NextResponse.json(
        { resultCode: "E001", resultMsg: "필수 필드가 누락되었습니다." },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NICEPAY_BASE_URL;
    if (!baseUrl) {
      return NextResponse.json(
        { resultCode: "E003", resultMsg: "NICEPAY_BASE_URL 설정 누락" },
        { status: 500 }
      );
    }

    const apiResponse = await fetch(`${baseUrl}/v1/subscribe/${bid}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: generateAuthHeader(),
      },
      body: JSON.stringify({
        orderId: crypto.randomUUID(),
        amount,
        goodsName,
        cardQuota: 0,
        useShopInterest: false,
      }),
    });

    const result = await apiResponse.json();

    // 거래 기록 저장 (스키마에 맞게 수정)
    await prisma.transaction.create({
      data: {
        bid,
        amount: Number(amount),
        status: "scheduled",
        tid: result.tid || null,
        scheduledAt: new Date(),
      },
    });

    // 다음 결제일 업데이트 (스키마에 맞게 수정)
    await prisma.billing.update({
      where: { bid },
      data: {
        nextPaymentDate: new Date(
          new Date().setMonth(new Date().getMonth() + 1)
        ),
      },
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) {
      console.error("결제 처리 에러:", error);
      return NextResponse.json(
        { resultCode: "E500", resultMsg: error.message },
        { status: 500 }
      );
    }
  }
}
