"use client";

import "../globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: {
    template: "%s - Grabb Online Store",
    default: "Grabb Online Store",
  },
  description: "Your one-stop shop for fashion and lifestyle.",
};

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <div className="flex flex-col min-h-screen font-poppins bg-white text-black">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </ClerkProvider>
  );
}

