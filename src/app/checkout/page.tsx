"use client";

import { useState } from "react";

interface CardInfo {
  cardNo: string;
  expYear: string;
  expMonth: string;
  idNo: string;
  cardPw: string;
}

export default function BillingForm() {
  const [cardInfo, setCardInfo] = useState<CardInfo>({
    cardNo: "",
    expYear: "",
    expMonth: "",
    idNo: "",
    cardPw: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardInfo({ ...cardInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/subscribe/regist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...cardInfo }),
      });

      const result = await response.json();
      if (result.resultCode === "0000") {
        alert("빌키 발급 성공!");
      } else {
        setErrorMsg(result.resultMsg || "빌키 발급에 실패했습니다.");
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg("빌키 발급 중 에러가 발생했습니다.");
      } else {
        console.error("빌키 발급 중 에러:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <div>
        <label className="block text-sm font-medium">카드번호</label>
        <input
          type="text"
          name="cardNo"
          value={cardInfo.cardNo}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">만료년도</label>
        <input
          type="text"
          name="expYear"
          value={cardInfo.expYear}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">만료월</label>
        <input
          type="text"
          name="expMonth"
          value={cardInfo.expMonth}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">생년월일/사업자번호</label>
        <input
          type="text"
          name="idNo"
          value={cardInfo.idNo}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">카드 비밀번호</label>
        <input
          type="password"
          name="cardPw"
          value={cardInfo.cardPw}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>
      {errorMsg && <p className="text-red-500">{errorMsg}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
      >
        {loading ? "처리 중..." : "빌키 발급하기"}
      </button>
    </form>
  );
}
