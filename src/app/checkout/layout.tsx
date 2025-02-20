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
    <SessionProvider session={session}>{children}</SessionProvider>
  ) : (
    <div className="flex flex-col items-center gap-5">
      <Image
        className="w-1/2 p-3"
        src={rocketicon}
        alt="background"
        height={512}
        width={512}
      ></Image>

      <p className="md:text-3xl text-xl font-bold">로그인 필요합니다</p>
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
