import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import QueryProvider from "@/components/providers/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI-Powered Document Analysis",
  description: "Upload PDFs and ask questions to get AI-powered answers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
