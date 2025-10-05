// app/page.tsx (Next.js 13+ with app directory)
"use client";

import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-[#0d0f13] text-white">
      {/* Hero section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-20">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Welcome to Orbit
          </h1>
          <p className="text-gray-400 text-lg md:text-xl">
            Manage Aether
          </p>
        </div>

        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <Image
            src="/logo.png"
            alt="Orbit Logo"
            width={300}
            height={300}
            className=""
          />
        </div>
      </section>

      {/* Features section */}
      <section className="px-6 md:px-20 py-16">
        <h2 className="text-3xl font-bold text-white mb-8">Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-[#14171f] p-6 rounded-lg hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Dashboard</h3>
            <p className="text-gray-400">
              Access a clean dashboard to manage your servers and bot modules.
            </p>
          </div>
          <div className="bg-[#14171f] p-6 rounded-lg hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Server Management</h3>
            <p className="text-gray-400">
              View and configure only the servers where your bot is present.
            </p>
          </div>
          <div className="bg-[#14171f] p-6 rounded-lg hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Modules</h3>
            <p className="text-gray-400">
              Enable, disable, or configure bot modules directly from Orbit.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#14171f] text-gray-500 text-center py-6 mt-auto">
        &copy; {new Date().getFullYear()} Orbit. By HeapReaper.
      </footer>
    </main>
  );
}
