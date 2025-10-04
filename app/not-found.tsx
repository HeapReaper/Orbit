"use client";

import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0d0f13] text-white p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-extrabold mb-4">404</h1>
        <p className="text-xl md:text-2xl mb-6 text-gray-400">
          Oeps! De pagina die je zoekt bestaat niet.
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-[#14171f] hover:bg-[#1e2129] transition-colors px-6 py-3 rounded-md font-semibold"
        >
          Terug naar Dashboard
        </Link>
      </div>
    </div>
  );
}
