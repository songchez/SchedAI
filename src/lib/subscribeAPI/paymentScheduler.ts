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
async function updateUserSubscriptionStatus(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      billing: {
        include: {
          transactions: {
            // 🔹 필드명 수정 (Transaction → transactions)
            orderBy: { scheduledAt: "desc" },
            take: 1,
          },
        },
      },
      subscription: true,
    },
  });

  // Billing과 Transactions가 없는 경우 처리
  if (!user?.billing?.length || !user.billing[0].transactions?.length) return;

  // 🔹 최신 거래 내역 가져오기 (배열이므로 [0] 추가)
  const latestTransaction = user.billing[0].transactions[0];
  const newStatus = latestTransaction.status === "paid" ? "active" : "inactive";

  // 🔹 endDate 계산 (현재 날짜 + 1개월)
  const nextMonthDate = new Date();
  nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);

  await prisma.subscription.upsert({
    where: { userId },
    update: {
      paymentStatus: newStatus,
      endDate: nextMonthDate,
    },
    create: {
      userId,
      planType: "premium",
      startDate: new Date(),
      paymentStatus: newStatus,
      endDate: nextMonthDate,
    },
  });
}
