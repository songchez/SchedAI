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
      <div className="flex-1">{children}</div>
    </SessionProvider>
  );
}
