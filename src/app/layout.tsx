import CustomNavbar from "@/components/Navbar/CustomNavbar";
import { Providers } from "./providers";
import "./globals.css";
import { Gowun_Batang } from "next/font/google";

export const gowunBatang = Gowun_Batang({
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
      <body>
        <Providers>
          <CustomNavbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
