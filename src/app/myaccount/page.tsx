import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import Image from "next/image";

export default async function MyAccount() {
  const session = await auth();

  if (!session?.user?.email) {
    return <p className="text-center mt-10 text-xl">로그인이 필요합니다.</p>;
  }

  // DB에서 사용자 데이터 가져오기 (서버 컴포넌트)
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      subscription: true,
      billing: true,
      chats: true,
    },
  });

  if (!user) {
    return (
      <p className="text-center mt-10 text-lg">
        사용자 정보를 찾을 수 없습니다.
      </p>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* 프로필 카드 */}
      <Card>
        <CardHeader>👤 내 정보</CardHeader>
        <CardBody className="flex items-center gap-4">
          <Image
            src={user.image || "/default-avatar.png"}
            alt="Profile Picture"
            width={80}
            height={80}
            className="rounded-full border"
          />
          <div>
            <p className="text-lg font-semibold">{user.name || "이름 없음"}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p className="text-sm text-gray-500">
              가입일: {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </CardBody>
      </Card>

      {/* 구독 정보 카드 */}
      <Card>
        <CardHeader>📜 구독 정보</CardHeader>
        <CardBody>
          <p>
            현재 플랜:{" "}
            <span className="font-semibold">
              {user.subscription?.planType || "Free"}
            </span>
          </p>
          <p>
            구독 상태:{" "}
            {user.subscription?.paymentStatus === "active"
              ? "✅ 활성화됨"
              : "❌ 미결제"}
          </p>
          {user.subscription?.endDate && (
            <p>
              구독 만료일:{" "}
              {new Date(user.subscription.endDate).toLocaleDateString()}
            </p>
          )}
          <p>
            남은 토큰:{" "}
            <span className="font-semibold">{user.availableTokens}개</span>
          </p>
        </CardBody>
      </Card>

      {/* 결제 정보 카드 */}
      <Card>
        <CardHeader>💳 결제 정보</CardHeader>
        <CardBody>
          {user.billing.length > 0 ? (
            <>
              <p>
                결제 카드: {user.billing[0].cardCompany} (****{" "}
                {user.billing[0].cardNumber.slice(-4)})
              </p>
              <p>
                다음 결제일:{" "}
                {user.billing[0].nextPaymentDate
                  ? new Date(
                      user.billing[0].nextPaymentDate
                    ).toLocaleDateString()
                  : "정보 없음"}
              </p>
            </>
          ) : (
            <p>결제 정보가 없습니다.</p>
          )}
        </CardBody>
      </Card>

      {/* SchedAI 사용 통계 카드 */}
      <Card>
        <CardHeader>📊 사용 통계</CardHeader>
        <CardBody>
          <p>총 대화 수: {user.chats.length}회</p>
        </CardBody>
      </Card>

      {/* 1:1 문의 & 나만의 프롬프트 추가 */}
      <div className="flex justify-between">
        <Button variant="faded">📩 1:1 문의하기</Button>
        <Button variant="faded">⚙️ 나만의 프롬프트 추가</Button>
      </div>
    </div>
  );
}
