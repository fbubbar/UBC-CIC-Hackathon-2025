"use client";

import React from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import Link from "next/link";

export default function Results() {
  const { user } = useAuthenticator();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Results Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Welcome, {user?.signInDetails?.loginId}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                href="/intake-form"
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 text-sm font-medium"
              >
                Intake Form
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Results Dashboard
            </h2>
            <p className="text-gray-600 mb-4">
              This is the results dashboard page. Add your results components
              here.
            </p>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <p className="text-gray-500">
                Results dashboard content will be implemented here
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
