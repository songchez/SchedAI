import { prisma } from "@/lib/prisma";
import { generateAuthHeader, MONTHLY_SUBSCRIPTION_AMOUNT } from "./utils";

export async function processPayment(params: {
  bid: string;
  amount: number;
  goodsName: string;
}) {
  const { bid, amount, goodsName } = params;

  const billing = await prisma.billing.findUnique({ where: { bid } });
  if (!billing) throw new Error("Billing information not found");

  // NicePay API 호출
  // const baseUrl = process.env.NICEPAY_BASE_URL; 프로덕션할때 바꾸기
  const baseUrl = process.env.NICEPAY_TEST_BASE_URL;
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
  console.log("결제시도 결과:", result);

  // 거래 기록 업데이트
  await prisma.transaction.updateMany({
    where: { bid, status: "scheduled" },
    data: {
      status: result.resultCode === "0000" ? "paid" : "failed",
      approvedAt: result.paidAt ? new Date(result.paidAt) : null,
    },
  });

  return result;
}

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
      await processPayment({
        bid: billing.bid,
        amount: MONTHLY_SUBSCRIPTION_AMOUNT, // 정기 결제 금액
        goodsName: "SchedAI 월 정기결제",
      });
    } catch (error) {
      console.error(`결제 실패 BID: ${billing.bid}`, error);
    }
  }
}
