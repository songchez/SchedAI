"use client";

import { useState, useRef } from "react";
import {
  Form,
  Input,
  Button,
  RadioGroup,
  Radio,
  Card,
  CardBody,
  CircularProgress,
  CardHeader,
  CardFooter,
} from "@heroui/react";
import { CreditCardIcon } from "@heroicons/react/24/solid";
import { calculatePrices } from "@/lib/utils/priceCalculator";

interface CardInfo {
  cardNo: string; // ex. 1233-2312-1231-1231
  expYear: string; // ex 25
  expMonth: string; // ex 07
  idNo: string; // ex 970709(생년월일) or 513-28-01829(사업자번호)
  cardPw: string; // ex. 28 카드비밀번호 앞 두자리
}

export default function BillingForm() {
  const [cardInfo, setCardInfo] = useState<CardInfo>({
    cardNo: "",
    expYear: "",
    expMonth: "",
    idNo: "",
    cardPw: "",
  });
  const [idType, setIdType] = useState("birth"); // 'birth' or 'business'
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const cardNoRef = useRef<HTMLInputElement>(null);
  const expYearRef = useRef<HTMLInputElement>(null);
  const expMonthRef = useRef<HTMLInputElement>(null);
  const idNoRef = useRef<HTMLInputElement>(null);
  const cardPwRef = useRef<HTMLInputElement>(null);

  const handleCardNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.replace(/(.{4})/g, "$1-").slice(0, 19);
    setCardInfo((prev) => ({ ...prev, cardNo: value }));
    if (value.length === 19) {
      expYearRef.current?.focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, maxLength } = e.target;
    setCardInfo((prev) => ({ ...prev, [name]: value }));
    if (maxLength && value.length === Number(maxLength)) {
      const nextField = {
        cardNo: expYearRef,
        expYear: expMonthRef,
        expMonth: idNoRef,
        idNo: cardPwRef,
        cardPw: null, // No next field after cardPw
      }[name as keyof CardInfo];
      if (nextField) {
        nextField.current?.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/subscribe/regist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...cardInfo,
          cardNo: cardInfo.cardNo.replace(/-/g, ""),
        }),
      });
      const result = await response.json();
      if (result.resultCode === "0000") {
        alert("빌키 발급 성공!");
      } else {
        setErrorMsg(result.resultMsg || "빌키 발급에 실패했습니다.");
      }
    } catch (error) {
      if (error instanceof Error)
        setErrorMsg("빌키 발급 중 에러가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center text-sm">
      <div className="relative w-[500px] aspect-[16/9] flex flex-col">
        <Card className="mt-5 p-6 shadow-lg rounded-xl backdrop-blur-lg bg-white/60 min-w-96 gap-4">
          <CardHeader className="gap-2">
            <CreditCardIcon className="w-6" />
            <h1 className="text-lg font-bold">구독결제하기</h1>
          </CardHeader>
          <CardBody>
            <Form
              onSubmit={handleSubmit}
              validationBehavior="aria"
              className="flex flex-col gap-4"
            >
              <Input
                type="text"
                size="lg"
                variant="bordered"
                placeholder="1234-1234-1234-1234"
                label="카드번호"
                name="cardNo"
                value={cardInfo.cardNo}
                onChange={handleCardNoChange}
                ref={cardNoRef}
                maxLength={19}
                isRequired
              />
              <div className="flex gap-8">
                <div className="flex flex-col items-start gap-1">
                  <label>만료년월</label>
                  <div className="flex items-center gap-2">
                    <Input
                      variant="bordered"
                      className="w-9"
                      classNames={{ inputWrapper: "p-2" }}
                      placeholder="25"
                      type="text"
                      name="expYear"
                      value={cardInfo.expYear}
                      onChange={handleChange}
                      ref={expYearRef}
                      maxLength={2}
                      isRequired
                    />
                    <span>/</span>
                    <Input
                      className="w-9"
                      classNames={{ inputWrapper: "p-2" }}
                      variant="bordered"
                      placeholder="12"
                      type="text"
                      name="expMonth"
                      value={cardInfo.expMonth}
                      onChange={handleChange}
                      ref={expMonthRef}
                      maxLength={2}
                      isRequired
                    />
                  </div>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <span className="text-primary-500">비밀번호</span>
                  <div className="flex gap-3 items-center justify-center">
                    <Input
                      className="w-12"
                      variant="bordered"
                      type="password"
                      name="cardPw"
                      placeholder="77"
                      value={cardInfo.cardPw}
                      onChange={handleChange}
                      ref={cardPwRef}
                      maxLength={2}
                      isRequired
                    />
                    <span>xx</span>
                  </div>
                </div>
              </div>
              <RadioGroup
                size="sm"
                value={idType}
                onValueChange={setIdType}
                orientation="horizontal"
              >
                <Radio value="birth">생년월일</Radio>
                <Radio value="business">사업자번호</Radio>
              </RadioGroup>
              <Input
                variant="bordered"
                label={idType === "birth" ? "생년월일" : "사업자번호"}
                type="text"
                name="idNo"
                value={cardInfo.idNo}
                onChange={handleChange}
                ref={idNoRef}
                maxLength={idType === "birth" ? 6 : 10}
                isRequired
              />
              {errorMsg && <p className="text-red-500">{errorMsg}</p>}
            </Form>
            <div className="px-3 py-3 text-primary-500">
              <div className="flex justify-between">
                가격 : <div>{calculatePrices(29900).price}원</div>
              </div>
              <div className="flex justify-between">
                부가세 : <div>{calculatePrices(29900).tax}원</div>
              </div>
              <div className="flex justify-between">
                총 결제 금액 : <div>{calculatePrices(29900).total}원</div>
              </div>
            </div>
          </CardBody>
          <CardFooter>
            <Button
              type="submit"
              disabled={loading}
              variant="shadow"
              className="w-full bg-primary-500 text-white font-bold"
            >
              {loading ? (
                <CircularProgress />
              ) : (
                `총 ${calculatePrices(29900).total}원 결제`
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
