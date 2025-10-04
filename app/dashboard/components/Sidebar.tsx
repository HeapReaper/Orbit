"use client";
import { useState } from "react";

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
        className={`fixed md:static inset-y-0 left-0 w-64 bg-[#14171f] p-4 transform transition-transform duration-200 ease-in-out z-40 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 text-2xl font-bold text-white">
            <img src="/logo.png" alt="Logo" className="h-8 w-8" />
            <span className="px-2 py-1">Orbit</span>
          </div>
          <button className="md:hidden" onClick={() => setOpen(false)}>
            ✖
          </button>
        </div>

        <nav className="flex flex-col space-y-2 text-gray-400">
          <a href="#" className="hover:text-white px-2 py-1 rounded-md">🏠 Dashboard</a>

          <div>
            <button
              onClick={() => setModulesOpen(!modulesOpen)}
              className="flex justify-between items-center w-full px-2 py-1 hover:text-white rounded-md"
            >
              🧩 Modules
              <span className={`transition-transform duration-200 ${modulesOpen ? "rotate-90" : ""}`}>
                <img src="icons/arrow-right.png" className="w-6 text-red" />
              </span>
            </button>
            {modulesOpen && (
              <div className="flex flex-col ml-4 mt-1 space-y-1 text-gray-300">
                <a href="#" className="hover:text-white px-2 py-1 rounded-md">Module 1</a>
                <a href="#" className="hover:text-white px-2 py-1 rounded-md">Module 2</a>
                <a href="#" className="hover:text-white px-2 py-1 rounded-md">Module 3</a>
              </div>
            )}
          </div>

          <a href="#" className="hover:text-white px-2 py-1 rounded-md">💬 Commands</a>
          <a href="#" className="hover:text-white px-2 py-1 rounded-md">📜 Server Listing</a>
          <a href="#" className="hover:text-white px-2 py-1 rounded-md">📘 Logs</a>
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
