// api/subscribe/regist/route.ts
import { prisma } from "@/lib/prisma";
import { encrypt, generateAuthHeader } from "@/lib/subscribeAPI/utils";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { auth } from "@/auth";

export async function POST(request: Request) {
  try {
    const { cardNo, expYear, expMonth, idNo, cardPw } = await request.json();

    if (!cardNo || !expYear || !expMonth || !idNo || !cardPw) {
      return NextResponse.json(
        { resultCode: "E001", resultMsg: "필수 필드가 누락되었습니다." },
        { status: 400 }
      );
    }

    const session = await auth();
    const userId = session?.user.id;

    // 암호화 키 및 IV 준비
    const secretKey = process.env.NICEPAY_SECRET_KEY;
    if (!secretKey || secretKey.length < 32) {
      return NextResponse.json(
        { resultCode: "E002", resultMsg: "잘못된 SECRET_KEY" },
        { status: 500 }
      );
    }
    const key = secretKey.substring(0, 32);
    const iv = secretKey.substring(0, 16);

    const plainText = `cardNo=${cardNo}&expYear=${expYear}&expMonth=${expMonth}&idNo=${idNo}&cardPw=${cardPw}`;
    const encData = encrypt(plainText, key, iv);

    // NICEPAY API 호출
    const baseUrl = process.env.NICEPAY_BASE_URL;
    // Test넷(샌드박스 url)
    const testBaseUrl = process.env.NICEPAY_TEST_BASE_URL;
    if (!baseUrl) {
      return NextResponse.json(
        { resultCode: "E003", resultMsg: "NICEPAY_BASE_URL 설정 누락" },
        { status: 500 }
      );
    }
    // 현재 test로 구현중. 프로덕션에서는 bashUrl 사용해야함(계약도 완료해야함)
    // const apiResponse = await fetch(`${baseUrl}/v1/subscribe/regist`, {
    const apiResponse = await fetch(`${testBaseUrl}/v1/subscribe/regist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: generateAuthHeader(),
      },
      body: JSON.stringify({
        encData,
        orderId: crypto.randomUUID(),
        encMode: "A2",
        buyerName: session?.user.name,
        buyerEmail: session?.user.email,
      }),
    });

    const result = await apiResponse.json();
    console.log("빌키발급결과:", result);

    if (result.resultCode === "0000") {
      console.log("빌키발급성공! BID데이터를 저장합니다");
      // NICEPAY API 성공 시 Billing 정보 저장
      await prisma.billing.create({
        data: {
          bid: result.bid,
          userId,
          cardNumber: `${cardNo.slice(0, 4)}****${cardNo.slice(-4)}`,
          cardCompany: result.cardName,
        },
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) {
      console.error("빌링키 발급 에러:", error);
      return NextResponse.json(
        { resultCode: "E500", resultMsg: error.message },
        { status: 500 }
      );
    }
  }
}
