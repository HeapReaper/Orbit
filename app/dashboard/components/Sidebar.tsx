"use client";

import { useState } from "react";
import guilds from "../data/guilds";
import modules from "../data/modules";
import Image from "next/image";
import { Play, Package, Home, SquareChevronRight, ScrollText, ClipboardClock } from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const [modulesOpen, setModulesOpen] = useState(false);

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
          <Image
            src="https://placehold.co/40x40"
            alt="User Avatar"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full border border-gray-700"
          />

          <button className="md:hidden ml-2" onClick={() => setOpen(false)}>
            ✖
          </button>
        </div>

        <select className="w-full mb-4 bg-[#0d0f13] border border-gray-700 rounded px-3 py-2 text-gray-400">
          {/*<option>Select...</option>*/}
          {guilds.map((guild, index: number) => (
            <option key={index} value={`guild/${guild.url}`}>
              {guild.name}
            </option>
          ))}
        </select>

        <nav className="flex flex-col space-y-2 text-gray-400">
          <a
            href="/dashboard"
            className="flex items-center gap-2 hover:text-white px-2 py-1 rounded-md"
          >
            <Home className="w-6 h-6 text-[var(--primary-color)]" />
            Dashboard
          </a>

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
                  <a key={index} href={`dashboard/modules/${module.url}`} className="hover:text-white px-2 py-1 rounded-md">{module.name}</a>
                ))}
              </div>
            )}
          </div>

          <a
            href="#"
            className="flex items-center gap-2 hover:text-white px-2 py-1 rounded-md"
          >
            <SquareChevronRight className="w-6 h-6 text-[var(--primary-color)]" />
            Commands
          </a>
          <a
            href="#"
            className="flex items-center gap-2 hover:text-white px-2 py-1 rounded-md"
          >
            <ScrollText className="w-6 h-6 text-[var(--primary-color)]" />
            Server Listing
          </a>
          <a
            href="#"
            className="flex items-center gap-2 hover:text-white px-2 py-1 rounded-md"
          >
            <ClipboardClock className="w-6 h-6 text-[var(--primary-color)]" />
            Logs
          </a>
        </nav>

        <div className="absolute bottom-4 text-xs text-gray-500">© Dyno Premium</div>
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
