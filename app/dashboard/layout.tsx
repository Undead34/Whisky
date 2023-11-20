import { Noto_Sans } from "next/font/google";
import type { Metadata } from "next";
import { Toaster } from "sonner";

import Sidebar from "./components/Sidebar";

const NotoSans = Noto_Sans({ subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Admin Dashboard",
};

export default function RootLayout({ children }: any) {
  return (
    <html lang="es">
      <body className={NotoSans.className}>
        <main className="flex">
          <Sidebar />
          {children}
          <Toaster richColors />
        </main>
      </body>
    </html>
  );
}
