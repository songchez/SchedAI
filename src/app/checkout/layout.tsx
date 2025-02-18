import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import Image from "next/image";
import rocketicon from "@/images/rocketicon-404.png";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return session ? (
    <SessionProvider session={session}>
      <div className="absolute w-[600px] h-[600px] bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full blur-3xl opacity-20 top-[-200px] left-[-200px]"></div>
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-blue-500 to-green-500 rounded-full blur-3xl opacity-20 bottom-[-150px] right-[-150px]"></div>
      {children}
    </SessionProvider>
  ) : (
    <div className="flex flex-col items-center gap-5">
      <Image
        className="w-1/2 p-3"
        src={rocketicon}
        alt="background"
        height={512}
        width={512}
      ></Image>

      <p className="md:text-3xl text-xl font-bold">로그인 해주세요</p>
      <a
        href="https://www.flaticon.com/"
        title="로켓 아이콘"
        className="text-xs"
      >
        로켓 아이콘 제작자: Pixel Buddha - Flaticon
      </a>
    </div>
  );
}
