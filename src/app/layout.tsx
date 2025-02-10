import { Gowun_Batang } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
