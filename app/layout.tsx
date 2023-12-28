import type { Metadata } from "next";
import { metadata as config } from "@/backend/config";
import "./globals.css";

export const metadata: Metadata = {
  title: config.title,
  description: config.description,
};

export default function Layout({ children }: IProps) {
  return (
    <html dir="ltr" lang="es-ES">
      <body>{children}</body>
    </html>
  );
}

interface IProps {
  children: React.ReactNode;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;