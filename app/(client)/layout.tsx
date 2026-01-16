import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  title: {
    template: "%s | GRABB - Your Fashion Destination",
    default: "GRABB - Online Fashion Shopping | Latest Trends & Styles",
  },
  description:
    "GRABB your fit. GRABB your moment. Shop the latest fashion trends for men, women, and kids. Exclusive deals on clothing, shoes, bags, and accessories. Free shipping on orders over ₹499.",
  keywords: [
    "fashion",
    "online shopping",
    "clothing",
    "shoes",
    "bags",
    "accessories",
    "GRABB",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="flex flex-col min-h-screen font-poppins antialiased">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}