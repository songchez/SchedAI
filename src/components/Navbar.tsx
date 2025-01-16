"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="p-4 bg-blue-500 text-white flex justify-between items-center">
      <h1 className="text-lg font-bold">SchedAI</h1>
      <div>
        {session ? (
          <>
            <span className="mr-4">안녕하세요, {session.user?.name}님!</span>
            <button className="btn btn-outline" onClick={() => signOut()}>
              로그아웃
            </button>
          </>
        ) : (
          <button className="btn btn-primary" onClick={() => signIn("google")}>
            로그인
          </button>
        )}
      </div>
    </nav>
  );
}
