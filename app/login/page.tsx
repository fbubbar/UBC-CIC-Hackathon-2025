"use client";

import React from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
  const { user, authStatus } = useAuthenticator();
  const router = useRouter();

  useEffect(() => {
    // If user is authenticated, redirect to dashboard
    if (authStatus === "authenticated" && user) {
      router.push("/dashboard");
    }
  }, [authStatus, user, router]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your AI-powered document analysis tools
          </p>
        </div>
        <div className="mt-8 space-y-6">
          {/* Amplify Authenticator will render here */}
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Please sign in to continue
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
