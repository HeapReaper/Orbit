import "./globals.css";
import Script from "next/script";

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
        `}</Script>

    {children}
    </body>
    </html>
  );
}
