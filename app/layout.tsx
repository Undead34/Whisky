import type { Metadata } from "next";
import "./ui/globals.css";

export const metadata: Metadata = {
  title: "Iniciar sesión en la cuenta",
  description: "Para iniciar sesión en Outlook.com o Hotmail, necesitarás el nombre de usuario y la contraseña de tu cuenta de Microsoft.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html dir="ltr" lang="es-ES">
      <body>{children}</body>
    </html>
  );
}
