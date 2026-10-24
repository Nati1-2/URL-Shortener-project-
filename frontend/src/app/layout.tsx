import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "LinkPulse — Enterprise URL Shortener & Click Telemetry Platform",
  description:
    "Shorten branded links, track real-time click telemetry, generate custom vector QR codes, and scale your growth infrastructure.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" style={{ colorScheme: "dark" }}>
      <body className="min-h-screen bg-[#080c14] text-slate-100 antialiased selection:bg-blue-500 selection:text-white">
        <AppProviders>
          <Navbar />
          {children}
          <Footer />
        </AppProviders>
      </body>
    </html>
  );
}
