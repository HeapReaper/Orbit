import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
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
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>

      <body className="bg-[#0d0f13] text-gray-200">
      {/* Plausible analytics */}
      <Script
        defer
        data-domain="orbit.heapreaper.nl"
        src="https://analytics.heapreaper.nl/js/script.outbound-links.js"
      />
      <Script id="plausible-init">{`
        window.plausible = window.plausible || function() { 
          (window.plausible.q = window.plausible.q || []).push(arguments) 
        }
      `}
      </Script>

      <Navbar />

      <div>
        {children}
      </div>

      <footer className="bg-[#14171f] text-gray-500 text-center py-6 mt-auto">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Orbit. By HeapReaper.</p>
          <div className="flex gap-4 text-sm">
            <a href="/terms" className="hover:text-white transition">Terms of Service</a>
            <span>|</span>
            <a href="/privacy" className="hover:text-white transition">Privacy Policy</a>
          </div>
        </div>
      </footer>
      </body>
    </html>
  );
}
