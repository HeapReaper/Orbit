"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Play, Package, Home, SquareChevronRight, ClipboardClock, Bot } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import modules from "../data/modules";
import SelectInput from "@/app/(dashboard)/dashboard/components/inputs/Select";
import Link from "next/link";
import { useGuild } from "@/app/context/GuildContext";
import AddBot from "@/app/(dashboard)/dashboard/components/buttons/AddBot";
import FreeLabel from "@/app/(dashboard)/dashboard/components/labels/Free";
import PremiumLabel from "@/app/(dashboard)/dashboard/components/labels/Premium";

const botGuildIds = ["1373949549495844954", "1332406393105289236"];

export default function Sidebar() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [modulesOpen, setModulesOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { selectedGuild, setSelectedGuild, guilds } = useGuild();
  const [isPremium, setIsPremium] = useState<boolean | null>(null);

  const filteredModules = modules.filter((module) => module.enabled);

  // Select first guild
  useEffect(() => {
    if (guilds.length > 0 && !selectedGuild) {
      setSelectedGuild(guilds[0].id);
    }
  }, [guilds, selectedGuild]);

  useEffect(() => {
    const checkPremium = async () => {
      if (!selectedGuild) return;

      try {
        const res = await fetch(`/api/premium?guild_id=${selectedGuild}`);
        const data = await res.json();
        setIsPremium(data?.premium ?? false);
      } catch (err) {
        console.error(err);
        setIsPremium(false);
      }
    };

    void checkPremium();
  }, [selectedGuild]);

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
        {/* Logo + Profile */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 text-2xl font-bold text-white">
            <img src="/logo.png" alt="Logo" className="h-8 w-8" />
            <span className="px-2 py-1">Orbit</span>
          </div>

          <div className="relative">
            <button
              className="flex items-center gap-2 focus:outline-none"
              onClick={() => setDropdownOpen((prev) => !prev)}
            >
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
            </button>

            {dropdownOpen && (
              <div className="absolute mt-2 right-0 w-40 bg-[#1f222d] rounded-md shadow-lg z-50 flex flex-col py-2">
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-left px-4 py-2 hover:bg-gray-700 rounded-md text-red-500"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          <button className="md:hidden ml-2" onClick={() => setOpen(false)}>
            ✖
          </button>
        </div>

        {/* Guild select */}
        <SelectInput
          label=""
          value={selectedGuild}
          onChange={setSelectedGuild}
          options={
            guilds
              .filter((g) => botGuildIds.includes(g.id))
              .map((g) => ({ value: g.id, label: g.name }))
          }
        />

        <nav className="flex flex-col space-y-2 text-gray-400 mt-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 hover:text-white px-2 py-1 rounded-md"
          >
            <Home className="w-6 h-6 text-[var(--primary-color)]" />
            Dashboard
          </Link>

          <Link
            href="/dashboard/bot"
            className="flex items-center gap-2 hover:text-white px-2 py-1 rounded-md"
          >
            <Bot className="w-6 h-6 text-[var(--primary-color)]" />
            Bot
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
              <span
                className={`transition-transform duration-200 ${
                  modulesOpen ? "rotate-90" : ""
                }`}
              >
                <Play className="w-6 h-6 text-[var(--primary-color)]" />
              </span>
            </button>

            {modulesOpen && (
              <div className="flex flex-col ml-4 mt-1 space-y-1 text-gray-300">
                {filteredModules.map((module, index: number) => (
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
            href="#"
            className="flex items-center gap-2 hover:text-white px-2 py-1 rounded-md"
          >
            <SquareChevronRight className="w-6 h-6 text-[var(--primary-color)]" />
            Commands
          </Link>

          <Link
            href="/dashboard/logs"
            className="flex items-center gap-2 hover:text-white px-2 py-1 rounded-md"
          >
            <ClipboardClock className="w-6 h-6 text-[var(--primary-color)]" />
            Logs
          </Link>
        </nav>


        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 w-full px-2">
          <div className="w-full">

            <div className="w-full flex justify-center mt-2">
              <div className="px-2 py-1 rounded-md text-sm font-medium">
                {isPremium === null ? (
                  <span className="text-gray-400">Checking...</span>
                ) : isPremium ? (
                  <PremiumLabel />
                ) : (
                  <FreeLabel />
                )}
              </div>
            </div>

          </div>

          <div className="w-full">
            <AddBot />
          </div>

          <span className="text-xs text-gray-500">By HeapReaper</span>
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
