"use client";

import Image from "next/image";
import modules from "../app/dashboard/data/modules";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen bg-[#0d0f13] text-white">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-20">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Welcome to Orbit
          </h1>
          <p className="text-gray-400 text-lg md:text-xl">
            Take full control of your servers and Discord bot with ease.
            Enable, configure, and monitor modules, manage members, and keep everything running smoothly.
            All from one clean dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <a
              href="/dashboard"
              className="inline-block px-6 py-3 bg-[var(--primary-color)] hover:bg-[var(--hover-color)] text-white font-semibold rounded-lg transition text-center"
            >
              Go to Dashboard
            </a>

            <a
              href="https://discord.com/oauth2/authorize?client_id=1424327630706184343&scope=bot%20applications.commands&permissions=8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 bg-[var(--primary-color)] hover:bg-[var(--hover-color)] text-white font-semibold rounded-lg transition text-center"
            >
              Add bot to your server
            </a>
          </div>
        </div>

        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <Image
            src="/logo.png"
            alt="Orbit Logo"
            width={300}
            height={300}
            priority
            className="animate-spin-slow"
          />
        </div>
      </section>

      {/* Features */}
      <section className="px-6 md:px-20 py-16 bg-[#101218]">
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

      {/* Bot Modules */}
      <section className="px-6 md:px-20 py-16">
        <h2 className="text-3xl font-bold text-white mb-8">Bot Modules</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {modules.map((mod) => (
            <div
              key={mod.url}
              className={`p-6 rounded-lg hover:shadow-lg transition border ${
                mod.enabled ? "border-green-500" : "border-gray-700"
              } bg-[#14171f]`}
            >
              <h3 className="text-xl font-semibold mb-2">{mod.name}</h3>
              <p className="text-gray-400 mb-4">{mod.description}</p>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  mod.enabled
                    ? "bg-green-500 text-black"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                {mod.enabled ? "Enabled" : "Disabled"}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Screenshots Section */}
      <section className="px-6 md:px-20 py-16 bg-[#101218]">
        <h2 className="text-3xl font-bold text-white mb-8">Configuration Previews</h2>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Bot Settings</h3>
            <p className="text-gray-400">
              Manage global bot preferences, prefixes, and permissions directly from this page.
              Everything is synced automatically with your Discord server.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/screenshots/bot_settings.png"
              alt="Bot Settings Screenshot"
              width={600}
              height={350}
              className="rounded-lg border border-gray-700"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-center mt-16">
          <div className="order-2 md:order-1 rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/screenshots/bump_reminder.png"
              alt="Bump Reminder Screenshot"
              width={600}
              height={350}
              className="rounded-lg border border-gray-700"
            />
          </div>
          <div className="order-1 md:order-2 space-y-4">
            <h3 className="text-2xl font-semibold">Bump Reminder</h3>
            <p className="text-gray-400">
              Set automatic reminders for server bumps, helping your community stay visible on Discord lists.
              Fully configurable and easy to use.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-center mt-16">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Auto message</h3>
            <p className="text-gray-400">
              Send automatic messages to your channels on a schedule.
              Perfect for announcements, server updates, or community engagement.
              Embeds and advanced customization are coming soon!
            </p>
          </div>
          <div className="rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/screenshots/auto_message_2.png"
              alt="Bot Settings Screenshot"
              width={600}
              height={350}
              className="rounded-lg border border-gray-700"
            />
          </div>
        </div>
      </section>

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
    </main>
  );
}
