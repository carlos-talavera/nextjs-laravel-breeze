import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";

import ParentProvider from "@/components/shared/ParentProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "NextJS - Laravel Breeze",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable}`}>
        <ParentProvider>{children}</ParentProvider>
      </body>
    </html>
  );
}
