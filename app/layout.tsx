import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { ThemeApplier } from "@/components/ThemeController";

export const metadata: Metadata = {
  title: "Samuraidoku | Japanese Samurai Sudoku Platform",
  description:
    "Train your mind like a samurai with classic, diagonal, killer and daily Sudoku challenges."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeApplier />
        <Header />
        {children}
      </body>
    </html>
  );
}
