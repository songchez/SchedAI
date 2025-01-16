"use client";

import { signIn } from "next-auth/react";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-6">로그인</h1>
      <button
        className="btn btn-primary"
        onClick={() => signIn("google", { callbackUrl: "/" })}
      >
        Google로 로그인
      </button>
    </div>
  );
}
