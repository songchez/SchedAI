import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

/**
 * /chat/* 에 대한 공통 Layout
 */
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
