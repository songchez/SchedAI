// src/lib/subscribeAPI/utils.ts
import crypto from "crypto";

export const encrypt = (text: string, key: string, iv: string): string => {
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

export const generateAuthHeader = (): string => {
  const clientId = process.env.NICEPAY_CLIENT_ID;
  const secretKey = process.env.NICEPAY_SECRET_KEY;
  if (!clientId || !secretKey) {
    throw new Error("NICEPAY API 인증 정보가 설정되어 있지 않습니다.");
  }
  return "Basic " + Buffer.from(`${clientId}:${secretKey}`).toString("base64");
};
