"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import { usePathname } from "next/navigation";

export default function AuthenticatorWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Only wrap with Authenticator on the login page
  if (pathname === "/login") {
    return <Authenticator>{children}</Authenticator>;
  }

  // For other pages, just render children directly
  return <>{children}</>;
}
