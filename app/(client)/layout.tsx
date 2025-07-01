// app/(client)/layout.tsx
"use client";

import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css"; // make sure you have Tailwind directives here

export const metadata: Metadata = {
  title: {
    template: "%s - GRABB Online Store",
    default: "GRABB Online Store",
  },
  description:
    "GRABB your fit. GRABB your moment. Because fashion isn't just worn — it's owned.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="flex flex-col min-h-screen font-sans text-black bg-white">
          <Header />
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}






