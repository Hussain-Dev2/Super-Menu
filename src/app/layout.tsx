import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["300", "400", "600", "700", "800"],
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "Shawarma Nazo Land | شاورما نازو لاند",
  description: "أشهى الوجبات السريعة والشاورما في الموصل - حي المزارع",
  icons: {
    icon: "/land.png",
    shortcut: "/land.png",
    apple: "/land.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} h-full antialiased`}>
      <body className={`${cairo.className} min-h-full flex flex-col bg-brand-darker text-white`}>
        {children}
      </body>
    </html>
  );
}
