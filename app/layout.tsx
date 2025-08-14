import type { Metadata } from "next";
import { Montserrat, Oswald, Outfit, Urbanist } from "next/font/google";
import "./globals.css";

import QueryProvider from "@/components/providers/QueryProvider";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});
const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});
const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
  display: "swap",
});

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
    <html
      lang="en"
      className={`${montserrat.variable} ${oswald.variable} ${outfit.variable} ${urbanist.variable}`}
    >
      <body className={montserrat.className}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
