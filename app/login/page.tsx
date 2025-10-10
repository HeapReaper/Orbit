"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#0d0f13] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm bg-[#181b25] rounded-lg shadow-lg p-6 space-y-6">
        <Image
          src="/logo.png"
          width={100}
          height={100}
          alt="Logo"
          className="mb-5 mx-auto animate-spin-slow"
        />

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Orbit</h1>
          <p className="text-gray-400 text-sm">Log in to manage your bot and server(s)</p>
        </div>

        <button
          type="button"
          onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
          className="w-full py-2 rounded bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium transition"
        >
          Login with Discord
        </button>

        <p className="text-center text-gray-400 text-sm">
          Don't have a Discord account?{" "}
          <a
            href="https://discord.com"
            target="_blank"
            className="text-[var(--primary-color)] hover:text-[var(--hover-color)] transition"
          >
            Register
          </a>
        </p>
      </div>

      <footer className="mt-10 text-gray-400 text-xs text-center">
        © {new Date().getFullYear()} Orbit Dashboard. By HeapReaper
      </footer>
    </div>
  );
}