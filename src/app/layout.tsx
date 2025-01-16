import CustomNavbar from "@/components/Navbar/CustomNavbar";
import { Providers } from "./providers";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>
          <CustomNavbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
