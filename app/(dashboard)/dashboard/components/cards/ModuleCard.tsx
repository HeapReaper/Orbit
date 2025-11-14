"use client";

import { Settings } from "lucide-react";
import Link from "next/link";
import { moduleType } from "@/app/types/modules";
import FreeLabel from "@/app/(dashboard)/dashboard/components/labels/Free";
import PremiumLabel from "@/app/(dashboard)/dashboard/components/labels/Premium";

export default function ModuleCard({
  name,
  description,
  url,
  free,
  inDevelopment,
 }: moduleType) {
  return (
    <Link
      href={`/dashboard/modules/${url}`}
      className="text-[var(--primary-color)] hover:text-[var(--hover-color)]"
    >
      <div className="bg-[#14171f] p-6 rounded-lg flex flex-col hover:shadow-lg hover:border-blue-600 border border-gray-900 transition">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-white text-xl font-semibold">{name}</h3>
          {free ? (
            <FreeLabel />
          ) : (
            <PremiumLabel />
          )}
        </div>

        <p className="text-gray-400 mb-4">{description}</p>

        <div className="flex justify-between items-center">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              inDevelopment
                ? "bg-gray-700 text-gray-300"
                : "bg-green-500 text-black"
            }`}
          >
            {inDevelopment ? "In development" : "Available"}
          </span>

          <Link
            href={`/dashboard/modules/${url}`}
            className="text-[var(--primary-color)] hover:text-[var(--hover-color)]"
          >
            <Settings />
          </Link>
        </div>
      </div>
    </Link>
  );
}