"use client";

import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                AI-Powered Document Analysis
              </h1>
              <p className="text-sm text-gray-600">Welcome to our platform</p>
            </div>
            <Link
              href="/login"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm font-medium"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Our Platform
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              This is the public home page. Login to access the full features.
            </p>
            <Link
              href="/login"
              className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 text-lg font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
