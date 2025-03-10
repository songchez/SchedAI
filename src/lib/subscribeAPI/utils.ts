import crypto from "crypto";

// Input 결제 정보를 AES-256으로 암호화하는 함수(카드번호, 날짜, 비밀번호 등)
export const encrypt = (text: string, key: string, iv: string): string => {
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

// Basic 해독 Authentication을 만드는 함수: Header로 들어감
export const generateAuthHeader = (): string => {
  const clientId = process.env.NICEPAY_CLIENT_ID;
  const secretKey = process.env.NICEPAY_SECRET_KEY;
  if (!clientId || !secretKey) {
    throw new Error("NICEPAY API 인증 정보가 설정되어 있지 않습니다.");
  }
  return "Basic " + Buffer.from(`${clientId}:${secretKey}`).toString("base64");
};

// 정기 결제 금액 TODO: 테스트끝나면 29000으로 변경
export const MONTHLY_SUBSCRIPTION_AMOUNT = 1000;
