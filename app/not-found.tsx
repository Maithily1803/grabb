"use client";

import Logo from "@/components/Logo";
import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center px-4 py-10">
      <div className="max-w-md w-full space-y-8 text-center">
        <Logo className="mx-auto" />

        <div className="relative my-8">
          <h1 className="text-9xl font-black text-shop_dark_yellow/20">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="w-20 h-20 text-shop_dark_yellow animate-pulse" />
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-gray-900">
          Page Not Found
        </h2>
        <p className="text-sm text-gray-600">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="space-y-4">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 text-white bg-shop_dark_yellow hover:bg-shop_dark_yellow/90 rounded-md font-semibold hoverEffect"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>

          <Link
            href="/shop"
            className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-md font-semibold hoverEffect"
          >
            <Search className="w-5 h-5" />
            Browse Products
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 text-shop_dark_yellow hover:text-shop_dark_yellow/80 font-medium hoverEffect"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
