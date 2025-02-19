import { Gowun_Batang } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import CustomNavbar from "@/components/Navbar/CustomNavbar";
import ChatSideBar from "@/components/ChatBot/ChatSideBar";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const gowunBatang = Gowun_Batang({
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="ko" className="dark">
      <body className={gowunBatang.className}>
        <Providers>
          <div className="flex w-screen">
            <SessionProvider session={session}>
              <ChatSideBar />
            </SessionProvider>
            <div className="w-full relative h-screen">
              <CustomNavbar />
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
