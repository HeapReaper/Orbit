import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Script from "next/script";
import Navbar from "@/components/Nav";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Orbit – Dashboard and bot for Your Discord Server",
  description: "Orbit is a powerful Discord bot with a sleek web panel that lets you manage your server effortlessly. Send automated messages, handle support tickets, send birthday notifications, track server analytics, and more. Perfect for keeping your community engaged and organized.",
  keywords: ["Discord", "Dashboard", "Server management", "Orbit", "Automation", "Bots", "Analytics", "Tickets", "Notifications"],
  authors: [{ name: "HeapReaper", url: "https://heapreaper.nl" }],
  creator: "HeapReaper",
  publisher: "HeapReaper",
  openGraph: {
    type: "website",
    title: "Orbit – Dashboard and bot for Your Discord Server",
    description: "Orbit is a powerful Discord bot with a sleek web panel that lets you manage your server effortlessly. Send automated messages, handle support tickets, send birthday notifications, track server analytics, and more. Perfect for keeping your community engaged and organized.",
    url: "https://botinorbit.com",
    siteName: "Orbit",
    images: [
      {
        url: "https://botinorbit.com/banner-v2.png",
        width: 1200,
        height: 630,
        alt: "Orbit Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Orbit – Dashboard and bot for Your Discord Server",
    description: "Orbit is a powerful Discord bot with a sleek web panel that lets you manage your server effortlessly. Send automated messages, handle support tickets, send birthday notifications, track server analytics, and more. Perfect for keeping your community engaged and organized.",
    creator: "@HeapReaper",
    images: ["https://botinorbit.com/banner-v2.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
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
            <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
            <span>|</span>
            <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
          </div>
        </div>
      </footer>
      </body>
    </html>
  );
}
