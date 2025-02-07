// src/lib/subscribeAPI/paymentScheduler.ts
import { prisma } from "@/lib/prisma";
import { generateAuthHeader, MONTHLY_SUBSCRIPTION_AMOUNT } from "./utils";
import crypto from "crypto";

/**
 * BID에 대한 결제 실행 및 후처리 (거래 기록 생성, 다음 결제일 업데이트)
 */
export async function executePayment(params: {
  bid: string;
  amount: number;
  goodsName: string;
}): Promise<{ resultCode: string; resultMsg: string }> {
  const { bid, amount, goodsName } = params;

  // billing 정보 확인
  const billing = await prisma.billing.findUnique({ where: { bid } });
  if (!billing) {
    throw new Error("Billing information not found");
  }

  // 중복 실행 방지: 오늘 이미 결제 시도가 있었는지 확인 (예: status가 "scheduled"인 거래)
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const existingTransaction = await prisma.transaction.findFirst({
    where: {
      bid,
      status: "scheduled",
      scheduledAt: {
        gte: startOfToday,
        lte: endOfToday,
      },
    },
  });

  if (existingTransaction) {
    console.log(
      `Payment already scheduled for BID ${bid} today. Skipping duplicate execution.`
    );
    return {
      resultCode: "DUPLICATE",
      resultMsg: "Payment already scheduled for today",
    };
  }

  // NICEPAY API 호출 (테스트 URL 사용 – 운영 시에는 process.env.NICEPAY_BASE_URL로 변경)
  const baseUrl = process.env.NICEPAY_TEST_BASE_URL;
  if (!baseUrl) {
    throw new Error("NICEPAY_TEST_BASE_URL is not configured");
  }
  const response = await fetch(`${baseUrl}/v1/subscribe/${bid}/payments`, {
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

  const result = await response.json();
  // console.log("Payment attempt result:", result);

  // 거래 기록 생성
  await prisma.transaction.create({
    data: {
      bid,
      amount: Number(amount),
      status: result.resultCode === "0000" ? "paid" : "failed",
      tid: result.tid || null,
      scheduledAt: new Date(),
    },
  });

  // 다음 결제일 업데이트 (현재 기준 한 달 뒤로 설정)
  await prisma.billing.update({
    where: { bid },
    data: {
      nextPaymentDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    },
  });

  return result;
}

/**
 * DB에서 오늘 결제일이 도래한 빌링 정보를 조회하여 결제 처리
 */
export async function handleDailyPayments() {
  const today = new Date();
  const dueBillings = await prisma.billing.findMany({
    where: {
      nextPaymentDate: {
        lte: today,
      },
    },
  });

  for (const billing of dueBillings) {
    try {
      await executePayment({
        bid: billing.bid,
        amount: MONTHLY_SUBSCRIPTION_AMOUNT, // 정기 결제 금액 (utils에서 상수로 정의)
        goodsName: "SchedAI 월 정기결제",
      });
    } catch (error) {
      console.error(`Payment failed for BID ${billing.bid}:`, error);
    }
  }
}

// TODO:prisma에서 오늘이 월 결제일인 슨생님 찾기. 맵핑해서 결제 로직 돌리기. -> 하루에 한번 실행
