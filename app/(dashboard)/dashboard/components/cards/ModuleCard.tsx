"use client";

import IconButton from "@/app/(dashboard)/dashboard/components/inputs/IconButton";
import { Settings } from "lucide-react";
import ToggleSwitch from "@/app/(dashboard)/dashboard/components/inputs/Switch";

interface Props {
  name: string;
  description: string;
  type: "Free" | "Premium";
}

export default function ModuleCard({ name, description, type }: Props) {
  const color = type === "Premium" ? "bg-red-600" : "bg-green-700";

  return (
    <div className="bg-[#0d0f13] p-4 rounded-lg flex flex-col hover:border-blue-600 border border-gray-900">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white font-semibold">{name}</h3>
        <span className={`text-xs ${color} px-2 py-1 rounded`}>{type}</span>
      </div>

      <p className="text-gray-400 text-sm mb-3 flex-1">{description}</p>

      <div className="flex items-center gap-4">
        <IconButton
          icon={Settings}
          label="Settings"
          size={24}
          onClick={() => console.log("Settings clicked")}
        />
      </div>
    </div>
  );
}
