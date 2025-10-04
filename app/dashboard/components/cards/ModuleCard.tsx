interface Props {
  name: string;
  description: string;
  type: "Standard" | "Premium";
}

export default function ModuleCard({ name, description, type }: Props) {
  const color = type === "Premium" ? "bg-pink-600" : "bg-blue-700";

  return (
    <div className="bg-[#181b25] p-4 rounded-lg flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white font-semibold">{name}</h3>
        <span className={`text-xs ${color} px-2 py-1 rounded`}>{type}</span>
      </div>
      <p className="text-gray-400 text-sm mb-3 flex-1">{description}</p>
      <button className="bg-red-600 px-3 py-1 rounded text-sm self-start">Settings</button>
    </div>
  );
}
