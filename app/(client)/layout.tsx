// app/(client)/layout.tsx
"use client";

import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
// if you want a client-only header alternative
import Footer from "@/components/Footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <div className="flex flex-col min-h-screen font-poppins bg-white text-black">
        {/* Optionally, use a client header here if needed */}
        {/* <HeaderClient /> */}
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </ClerkProvider>
  );
}





