import { NextResponse } from "next/server";
import { executePayment } from "@/lib/subscribeAPI/paymentScheduler";

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

    // 공통 결제 처리 함수 호출
    const result = await executePayment({ bid, amount, goodsName });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error) {
      console.error("Payment process error:", error);
      return NextResponse.json(
        { resultCode: "E500", resultMsg: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { resultCode: "E500", resultMsg: "Unknown error" },
      { status: 500 }
    );
  }
}
