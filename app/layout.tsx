import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Navbar from "@/components/Nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Orbit",
  description: "The dashboard for Lumix",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* Plausible analytics */}
      <Script
        defer
        data-domain="orbit.heapreaper.nl"
        src="https://analytics.heapreaper.nl/js/script.outbound-links.js"
      />
      <Script id="plausible-init">
        {`
            window.plausible = window.plausible || function() { 
              (window.plausible.q = window.plausible.q || []).push(arguments) 
            }
          `}
      </Script>
      <link rel="icon" href="/favicon.ico" />

      <body className="bg-[#0d0f13] text-gray-200">{children}</body>

    </html>
  );
}
