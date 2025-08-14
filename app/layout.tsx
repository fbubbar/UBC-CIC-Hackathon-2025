
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import AuthenticatorWrapper from "./AuthenticatorWrapper";
import QueryProvider from "@/components/providers/QueryProvider";
import "@aws-amplify/ui-react/styles.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "[TODO]",
  description: "[TODO]",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <AuthenticatorWrapper>{children}</AuthenticatorWrapper>
        </QueryProvider>
      </body>
    </html>
  );
}
