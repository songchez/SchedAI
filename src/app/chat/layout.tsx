import ChatSideBar from "@/components/ChatBot/ChatSideBar";
import { ChatProvider } from "@/components/context/ChatContext";
import { SessionProvider } from "next-auth/react";

/**
 * /chat/* 에 대한 공통 Layout
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ChatProvider>
        <div className="flex">
          {/* 사이드바 */}
          <ChatSideBar />
          {/* 페이지 내용 */}
          <div className="flex-1">{children}</div>
        </div>
      </ChatProvider>
    </SessionProvider>
  );
}
