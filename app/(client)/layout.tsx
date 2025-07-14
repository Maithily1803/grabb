
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "../globals.css"; // make sure you have Tailwind directives here

export const metadata: Metadata = {
  title: {
    template: "%s - GRABB | Online Shopping",
    default: "GRABB | Online Shopping",
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
        <body className="flex flex-col min-h-screen font-sans">
          <Header />
          <main className="flex-1 ">
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}






