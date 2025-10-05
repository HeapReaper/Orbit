import IconButton from "@/app/dashboard/components/inputs/IconButton";
import { Settings, Save } from "lucide-react";

interface Props {
  name: string;
  description: string;
  type: "Standard" | "Premium";
}

export default function ModuleCard({ name, description, type }: Props) {
  const color = type === "Premium" ? "bg-red-600" : "bg-green-700";

  return (
    <div className="bg-[#0d0f13] p-4 rounded-lg flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white font-semibold">{name}</h3>
        <span className={`text-xs ${color} px-2 py-1 rounded`}>{type}</span>
      </div>
      <p className="text-gray-400 text-sm mb-3 flex-1">{description}</p>
      <IconButton icon={Settings} label="Settings" size={24} onClick={() => console.log("Settings clicked")} />
    </div>
  );
}
