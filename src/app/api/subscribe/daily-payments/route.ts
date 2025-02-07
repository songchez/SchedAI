import { NextRequest, NextResponse } from "next/server";
import { handleDailyPayments } from "@/lib/subscribeAPI/paymentScheduler";

export async function GET(request: NextRequest) {
  // 🔒 Authorization 헤더 검증
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    await handleDailyPayments();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cron job execution failed:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
