import type { Metadata } from "next";
import config from "@/config";
import "./globals.css";

export const metadata: Metadata = {
  title: config.title,
  description: config.description,
};

export default function RootLayout({ children }: IProps) {
  return (
    <html dir="ltr" lang="ES-ES">
      <body>{children}</body>
    </html>
  );
}

interface IProps {
  children: React.ReactNode;
}
