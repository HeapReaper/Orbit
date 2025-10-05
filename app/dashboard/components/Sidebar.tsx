"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Play, Package, Home, SquareChevronRight, ScrollText, ClipboardClock, Bot } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import modules from "../data/modules";
import Cookies from "js-cookie";
import SelectInput from "@/app/dashboard/components/inputs/Select";
import Link from "next/link";

// temp guilds where bot is in
const botGuildIds = ["1373949549495844954", "1332406393105289236"];

interface Guild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
}

export default function Sidebar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [modulesOpen, setModulesOpen] = useState(false);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [selectedGuild, setSelectedGuild] = useState<string>("");

  useEffect(() => {
    // @ts-ignore
    if (!session?.accessToken) return;

    fetch("https://discord.com/api/users/@me/guilds", {
      // @ts-ignore
      headers: { Authorization: `Bearer ${session.accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => setGuilds(data))
      .catch(console.error);
  }, [session]);

  return (
    <>
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        ></div>
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-[#14171f] p-4 transform transition-transform duration-200 ease-in-out z-40 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 text-2xl font-bold text-white">
            <img src="/logo.png" alt="Logo" className="h-8 w-8" />
            <span className="px-2 py-1">Orbit</span>
          </div>

          {/* User avatar */}
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || "User Avatar"}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full border"
              style={{ borderColor: "var(--primary-color)" }}
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-700 border" />
          )}

          <button className="md:hidden ml-2" onClick={() => setOpen(false)}>
            ✖
          </button>
        </div>

        <SelectInput
          label=""
          value={selectedGuild}
          onChange={(value: string) => setSelectedGuild(value)}
          options={
            Array.isArray(guilds)
              ? guilds
                .filter((guild) => botGuildIds.includes(guild.id))
                .map((guild) => ({ value: guild.id, label: guild.name }))
              : []
          }
        />

        <nav className="flex flex-col space-y-2 text-gray-400">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 hover:text-white px-2 py-1 rounded-md"
          >
            <Home className="w-6 h-6 text-[var(--primary-color)]" />
            Dashboard
          </Link>

          <div>
            <button
              onClick={() => setModulesOpen(!modulesOpen)}
              className="flex justify-between items-center w-full px-2 py-1 hover:text-white rounded-md"
            >
              <div className="flex items-center gap-2">
                <Package className="w-6 h-6 text-[var(--primary-color)]" />
                <span>Modules</span>
              </div>
              <span className={`transition-transform duration-200 ${modulesOpen ? "rotate-90" : ""}`}>
                <Play className="w-6 h-6 text-[var(--primary-color)]" />
              </span>
            </button>
            {modulesOpen && (
              <div className="flex flex-col ml-4 mt-1 space-y-1 text-gray-300">
                {modules.map((module, index: number) => (
                  <Link
                    key={index}
                    href={`/dashboard/modules/${module.url}`}
                    className="hover:text-white px-2 py-1 rounded-md"
                  >
                    {module.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/dashboard/bot"
            className="flex items-center gap-2 hover:text-white px-2 py-1 rounded-md"
          >
            <Bot className="w-6 h-6 text-[var(--primary-color)]" />
            Bot
          </Link>

          <Link
            href="#"
            className="flex items-center gap-2 hover:text-white px-2 py-1 rounded-md"
          >
            <SquareChevronRight className="w-6 h-6 text-[var(--primary-color)]" />
            Commands
          </Link>

          <Link
            href="#"
            className="flex items-center gap-2 hover:text-white px-2 py-1 rounded-md"
          >
            <ScrollText className="w-6 h-6 text-[var(--primary-color)]" />
            Server Listing
          </Link>

          <Link
            href="#"
            className="flex items-center gap-2 hover:text-white px-2 py-1 rounded-md"
          >
            <ClipboardClock className="w-6 h-6 text-[var(--primary-color)]" />
            Logs
          </Link>
        </nav>


        <div className="absolute bottom-4 flex flex-col gap-2 text-xs text-gray-500">
          <span>By HeapReaper</span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-red-500 hover:text-red-400 text-left"
          >
            Logout
          </button>
        </div>
      </aside>

      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-[#181b25] p-2 rounded-lg"
      >
        ☰
      </button>
    </>
  );
}
