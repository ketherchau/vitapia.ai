import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vitapia.ai | Synthetic Societies",
  description: "Asia’s First Population-Scale AI Prediction Platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0a0a0a] text-white antialiased selection:bg-[#00E5FF] selection:text-[#0a0a0a]`}>
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
