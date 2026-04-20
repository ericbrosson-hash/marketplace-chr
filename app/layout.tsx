import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "CHR Occasion — Matériel de restauration d'occasion",
  description: "Marketplace de matériel CHR d'occasion entre professionnels",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className={`${inter.className} min-h-full flex flex-col bg-[#F4F3F0]`}>
        {children}
      </body>
    </html>
  );
}