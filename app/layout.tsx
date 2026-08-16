import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700']
});

export const metadata: Metadata = {
  title: "Adopta Salamanca",
  description: "Tu nuevo mejor amigo está aquí",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={fredoka.className}>{children}</body>
    </html>
  );
}