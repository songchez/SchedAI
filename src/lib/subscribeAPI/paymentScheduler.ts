import { prisma } from "@/lib/prisma";
import { generateAuthHeader, MONTHLY_SUBSCRIPTION_AMOUNT } from "./utils";
import crypto from "crypto";

// 결제 요청을 위한 타입 정의
interface PaymentParams {
  bid: string;
  amount: number;
  goodsName: string;
}

interface PaymentResult {
  resultCode: string;
  resultMsg: string;
}

/**
 * NICEPAY API를 호출하여 결제를 수행하는 함수
 */
async function fetchPaymentResult(
  bid: string,
  amount: number,
  goodsName: string
) {
  const baseUrl = process.env.NICEPAY_TEST_BASE_URL;
  if (!baseUrl)
    throw new Error("NICEPAY_TEST_BASE_URL 환경 변수가 설정되지 않음");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

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
    signal: controller.signal,
  });
  clearTimeout(timeout);

  if (!response) throw new Error("결제 API 호출 실패");
  return response.json();
}

/**
 * 특정 BID에 대한 결제 실행 및 후속 처리 (트랜잭션 생성, 결제 일정 업데이트)
 * 구독상태 Refresh : updateUserSubscriptionStatus
 */
export async function executePayment(
  params: PaymentParams
): Promise<PaymentResult> {
  const { bid, amount, goodsName } = params;

  try {
    const billing = await prisma.billing.findUnique({ where: { bid } });
    if (!billing) throw new Error(`BID ${bid}에 대한 청구 정보 없음`);

    // 동일한 날짜에 중복 결제 방지
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingTransaction = await prisma.transaction.findFirst({
      where: { bid, status: "scheduled", scheduledAt: { gte: today } },
    });

    if (existingTransaction) {
      console.log(`BID ${bid} 결제가 이미 예약됨`);
      return { resultCode: "DUPLICATE", resultMsg: "오늘 이미 결제 예약됨" };
    }

    // 결제 API 호출
    const result = await fetchPaymentResult(bid, amount, goodsName);
    console.log(`결제 결과:`, result);

    // 트랜잭션 생성
    await prisma.transaction.create({
      data: {
        bid,
        amount,
        status: result.resultCode === "0000" ? "paid" : "failed",
        tid: result.tid || null,
        scheduledAt: new Date(),
      },
    });

    // 다음 결제일 업데이트 (한 달 후)
    await prisma.billing.update({
      where: { bid },
      data: {
        nextPaymentDate: new Date(
          new Date().setMonth(new Date().getMonth() + 1)
        ),
      },
    });

    // 결제 성공 시 구독 상태 업데이트 호출 추가
    if (result.resultCode === "0000") {
      await updateUserSubscriptionStatus(billing.userId);
    }

    return {
      resultCode: result.resultCode,
      resultMsg: result.resultMsg || "결제 완료",
    };
  } catch (error) {
    console.error(`결제 실패:`, error);
    throw error;
  }
}

/**
 * 사용자 구독 상태 업데이트 (결제 성공 여부 반영)
 * 결제시 실행
 */
async function updateUserSubscriptionStatus(userId: string) {
  const traceId = crypto.randomUUID();

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        billing: {
          include: {
            transactions: { orderBy: { scheduledAt: "desc" }, take: 1 },
          },
        },
        subscription: true,
      },
    });

    if (
      !user ||
      !user.billing?.length ||
      !user.billing[0].transactions?.length
    ) {
      console.log(`[${traceId}] 사용자 ID ${userId}의 청구 내역 없음`);
      return;
    }

    const latestTransaction = user.billing[0].transactions[0];
    const newStatus =
      latestTransaction.status === "paid" ? "active" : "inactive";
    const nextMonthDate = new Date(
      new Date().setMonth(new Date().getMonth() + 1)
    );

    await prisma.subscription.upsert({
      where: { userId },
      update: { paymentStatus: newStatus, endDate: nextMonthDate },
      create: {
        userId,
        planType: "premium",
        startDate: new Date(),
        paymentStatus: newStatus,
        endDate: nextMonthDate,
      },
    });

    console.log(`[${traceId}] 사용자 ${userId} 구독 상태 업데이트 완료`);
  } catch (error) {
    console.error(`[${traceId}] 사용자 구독 업데이트 실패:`, error);
    throw error;
  }
}

/**
 * 매일 실행되는 결제 처리 함수 (청구 날짜가 지난 사용자 대상)
 */
export async function handleDailyPayments() {
  const traceId = crypto.randomUUID();

  try {
    const today = new Date();
    console.log(
      `[${traceId}] 오늘(${today.toLocaleDateString()}) 예정된 결제 확인`
    );

    const dueBillings = await prisma.billing.findMany({
      where: { nextPaymentDate: { lte: today } },
    });
    if (dueBillings.length === 0)
      return console.log(`[${traceId}] 오늘 결제 대상 없음`);

    console.log(`[${traceId}] ${dueBillings.length}건의 결제 처리 시작`);
    for (const billing of dueBillings) {
      try {
        await executePayment({
          bid: billing.bid,
          amount: MONTHLY_SUBSCRIPTION_AMOUNT,
          goodsName: "SchedAI 월간 구독",
        });
        console.log(`[${traceId}] BID ${billing.bid} 결제 성공`);
      } catch (error) {
        console.error(`[${traceId}] BID ${billing.bid} 결제 실패:`, error);
      }
    }
  } catch (error) {
    console.error(`[${traceId}] 일일 결제 처리 실패:`, error);
    throw error;
  }
}
