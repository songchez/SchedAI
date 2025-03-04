import { Providers } from "./providers";
import "./globals.css";
import CustomNavbar from "@/components/Navbar/CustomNavbar";
import ChatSideBar from "@/components/ChatBot/ChatSideBar";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import SideBarHandleBtn from "@/components/Navbar/SideBarHandleBtn";
import { IBM_Plex_Sans_KR, Gowun_Batang } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";

const gowunSerif = Gowun_Batang({
  display: "swap",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const ibmFlexSans = IBM_Plex_Sans_KR({
  display: "swap",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-ibm-sans",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="ko" className="dark">
      <body className={`${ibmFlexSans.variable} ${gowunSerif.className}`}>
        <Providers>
          <div className="flex w-screen">
            <SessionProvider session={session}>
              <ChatSideBar />
            </SessionProvider>
            <div className="w-full transition-width duration-300">
              <div className="flex">
                <SideBarHandleBtn />
                <CustomNavbar />
              </div>
              {children}
            </div>
          </div>
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
