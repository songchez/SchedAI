"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const [cardInfo, setCardInfo] = useState({
    cardNo: "",
    expYear: "",
    expMonth: "",
    idNo: "",
    cardPw: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...cardInfo,
          userId: session?.user?.id,
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert("결제 성공 및 구독 정보 업데이트 완료");
      } else {
        alert(`결제 실패: ${result.message}`);
      }
    } catch (error) {
      console.error("결제 처리 오류:", error);
      alert("결제 처리 중 오류 발생");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">프리미엄 구독 결제</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">카드번호</label>
          <input
            type="text"
            name="cardNo"
            value={cardInfo.cardNo}
            onChange={(e) =>
              setCardInfo({ ...cardInfo, cardNo: e.target.value })
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        {/* 다른 입력 필드들 추가... */}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          구독 결제하기
        </button>
      </form>
    </div>
  );
}
