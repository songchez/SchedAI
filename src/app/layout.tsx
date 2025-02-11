import { Gowun_Batang } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";
import CustomNavbar from "@/components/Navbar/CustomNavbar";
import ChatSideBar from "@/components/ChatBot/ChatSideBar";
import { SessionProvider } from "next-auth/react";

const gowunBatang = Gowun_Batang({
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="dark">
      <body className={gowunBatang.className}>
        <Providers>
          <div className="flex w-screen">
            <SessionProvider>
              <ChatSideBar />
            </SessionProvider>
            <div className="w-full">
              <CustomNavbar />
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
